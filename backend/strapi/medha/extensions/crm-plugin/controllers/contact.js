"use strict";
/**
 * crm-plugin.js contact controller
 *
 * @description: Extending set of actions for contact controller of CRM-plugin
 */

const _ = require("lodash");
const bookshelf = require("../../../config/bookshelf");
const utils = require("../../../config/utils");
const {
  PLUGIN,
  ROLE_COLLEGE_ADMIN,
  ROLE_MEDHA_ADMIN
} = require("../../../config/constants");
const { convertRestQueryParams, buildQuery } = require("strapi-utils");
const { sanitizeEntity } = require("strapi-utils");
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

module.exports = {
  /**
   * Creating organization ie college
   * Steps:
   * Create Organization
   * Create Contact
   * Map contact with organization
   */
  createOrganization: async ctx => {
    const organizationReqBody = _.pick(ctx.request.body, [
      "name",
      "college_code",
      "is_blocked",
      "zone",
      "rpc",
      "principal"
    ]);

    const contactReqBody = _.pick(ctx.request.body, [
      "name",
      "phone",
      "email",
      "state",
      "address_1",
      "district"
    ]);

    await bookshelf
      .transaction(async t => {
        /**
         * Creating organization
         */
        const orgModel = await strapi
          .query("organization", PLUGIN)
          .model.forge(organizationReqBody)
          .save(null, { transacting: t })
          .then(model => model)
          .catch(error => {
            console.log(error);
            return null;
          });

        if (!orgModel) {
          return Promise.reject("Something went wrong while creating College");
        }

        const org = orgModel.toJSON ? orgModel.toJSON() : orgModel;

        /**
         * Add this to policy
         */

        const tpos = await Promise.all(
          ctx.request.body.tpos.map(async tpo => {
            return await strapi
              .query("user", "users-permissions")
              .findOne({ id: tpo });
          })
        );

        if (tpos.some(tpo => tpo === null)) {
          return Promise.reject("TPO does not exist");
        }

        await orgModel.tpos().attach(ctx.request.body.tpos);

        if (ctx.request.body.stream_strength) {
          const streamStrengthModel = await Promise.all(
            ctx.request.body.stream_strength.map(async stream => {
              return await bookshelf
                .model("college-stream-strength")
                .forge(stream)
                .save(null, { transacting: t })
                .then(model => model)
                .catch(error => {
                  console.log(error);
                  return null;
                });
            })
          );

          if (streamStrengthModel.some(s => s === null)) {
            return Promise.reject(
              "Something went wrong while creating Stream & Strength"
            );
          }

          const _orgStreamStrength = await Promise.all(
            streamStrengthModel.map(async (model, index) => {
              return await bookshelf
                .model("organization-component")
                .forge({
                  field: "stream_strength",
                  order: index,
                  component_type: "college_stream_strengths",
                  component_id: model.toJSON().id,
                  organization_id: org.id
                })
                .save(null, { transacting: t })
                .catch(error => {
                  console.log(error);
                  return null;
                });
            })
          );

          if (_orgStreamStrength.some(oss => oss === null)) {
            return Promise.reject(
              "Error while mapping stream strength to Organization"
            );
          }
        }

        // await orgModel
        //   .related("stream_strength")
        //   .create(ctx.request.body.stream_strength);

        contactReqBody.organization = org.id;
        contactReqBody.contact_type = "organization";

        const contact = await strapi
          .query("contact", PLUGIN)
          .model.forge(contactReqBody)
          .save(null, { transacting: t })
          .then(model => model.toJSON())
          .catch(error => {
            console.log(error);
            return null;
          });

        if (!contact) {
          return Promise.reject("Something went wrong while creating Contact");
        }

        await orgModel.save(
          { contact: contact.id },
          { transacting: t, require: false }
        );

        return new Promise(resolve => resolve(contact));
      })
      .then(success => {
        return ctx.send(utils.getFindOneResponse(success));
      })
      .catch(error => {
        return ctx.response.badRequest(error);
      });
  },

  organizations: async ctx => {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    let filters = convertRestQueryParams(query);

    // TODO add college admins to list
    /**
     * public route for colleges
     */
    if (!ctx.state.user) {
      let orgs = await strapi.plugins[
        "crm-plugin"
      ].services.organization.fetchAllOrgs(filters);

      orgs = orgs.map(res => {
        return {
          id: res.id,
          name: res.name,
          stream_strength: res.stream_strength,
          tpos: res.tpos
        };
      });

      let new_pageSize =
        pageSize < 0
          ? await utils.getTotalPLuginRecord("organization", "crm-plugin")
          : pageSize;
      const response = utils.paginate(orgs, page, new_pageSize);
      return {
        result: response.result,
        ...response.pagination
      };
    } else {
      let sort;
      if (filters.sort) {
        sort = filters.sort;
        filters = _.omit(filters, ["sort"]);
      }

      let orgs = await strapi.plugins[
        "crm-plugin"
      ].services.organization.fetchAllOrgs(filters);

      // Sorting ascending or descending on one or multiple fields
      if (sort && sort.length) {
        orgs = utils.sort(orgs, sort);
      }

      const response = utils.paginate(orgs, page, pageSize);
      return {
        result: response.result,
        ...response.pagination
      };
    }
  },

  education: async ctx => {
    const { id } = ctx.params;
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("education")
      .model.query(
        buildQuery({
          model: strapi.models["education"],
          filters
        })
      )
      .where({ contact: id })
      .fetchPage({
        page: page,
        pageSize:
          pageSize < 0 ? await utils.getTotalRecords("education") : pageSize
      })
      .then(res => {
        return utils.getPaginatedResponse(res);
      });
  },

  academicHistory: async ctx => {
    const { id } = ctx.params;
    const academicHistoryId = ctx.query ? ctx.query.id : null;
    let response = await strapi
      .query("academic-history")
      .find({ contact: id }, ["academic_year"]);

    if (academicHistoryId && response && response.length > 0) {
      response = response.filter(ah => ah.id === parseInt(academicHistoryId));
    }
    return utils.getFindOneResponse(response);
  },

  /**
   * Student self registration and medha admin can create indivisuals
   */
  createIndividual: async ctx => {
    /**
     * TODO
     * Add policy to check foreign keys
     * 1. Use same api for student registration and admin creation
     * 2. If using for student registartion send isNewRegistration and check for OTP details
     *    Otherwise normal individual will be created
     * 3. First User will be created
     *    then individual
     *    then contact
     */

    //  const { isNewRegistration } = ctx.request.body;
    //  if(isNewRegistration){
    //   const { otp, contact_number } = ctx.request.body;
    //   if (!otp) {
    //     return ctx.response.badRequest("OTP is missing");
    //   }

    //   if (!contact_number) {
    //     return ctx.response.badRequest("Contact no. is missing");
    //   }
    //  }

    const userRequestBody = _.pick(ctx.request.body, [
      "username",
      "email",
      "password",
      "role",
      "state",
      "zone",
      "rpc",
      "blocked"
    ]);

    userRequestBody.provider = "local";
    userRequestBody.password = await strapi.plugins[
      "users-permissions"
    ].services.user.hashPassword(userRequestBody);

    const individualRequestBody = _.pick(ctx.request.body, [
      "first_name",
      "last_name",
      "stream",
      "father_first_name",
      "father_last_name",
      "date_of_birth",
      "gender",
      "roll_number",
      "organization",
      "future_aspirations",
      "is_physically_challenged"
    ]);

    if (
      individualRequestBody.hasOwnProperty("date_of_birth") &&
      individualRequestBody["date_of_birth"]
    ) {
      var d = new Date(individualRequestBody["date_of_birth"]);
      var n = d.toISOString();
      individualRequestBody["date_of_birth"] = n;
    }

    const contactBody = _.pick(ctx.request.body, [
      "phone",
      "email",
      "address_1",
      "state",
      "district"
    ]);

    contactBody.name = `${individualRequestBody.first_name} ${individualRequestBody.last_name}`;
    contactBody.contact_type = "individual";

    await bookshelf
      .transaction(async t => {
        // Step 1 creating user object
        const user = await strapi
          .query("user", "users-permissions")
          .model.forge(userRequestBody)
          .save(null, { transacting: t })
          .then(model => model)
          .catch(err => {
            console.log(err);
            return null;
          });

        if (!user) {
          return Promise.reject("Something went wrong while creating User");
        }

        // Step 2 creating individual
        const individual = await strapi
          .query("individual", PLUGIN)
          .model.forge(individualRequestBody)
          .save(null, { transacting: t })
          .then(model => model)
          .catch(error => {
            console.log(error);
            return null;
          });

        if (!individual) {
          return Promise.reject(
            "Something went wrong while creating Individual"
          );
        }

        const userResponse = user.toJSON ? user.toJSON() : user;
        const individualResponse = individual.toJSON
          ? individual.toJSON()
          : individual;

        contactBody.individual = individualResponse.id;
        contactBody.user = userResponse.id;

        // Step 3 creating contact details
        const contact = await strapi
          .query("contact", PLUGIN)
          .model.forge(contactBody)
          .save(null, { transacting: t })
          .then(model => model)
          .catch(error => {
            console.log(error);
            return null;
          });

        if (!contact) {
          return Promise.reject("Something went wrong while creating Contact");
        }

        // Mapping user and individual relations
        const contactResponse = contact.toJSON ? contact.toJSON() : contact;

        await user.save(
          { contact: contactResponse.id },
          { transacting: t, require: false }
        );
        await individual.save(
          { contact: contactResponse.id },
          { transacting: t, require: false }
        );

        // Add user object
        return new Promise(resolve => resolve(user));
      })
      .then(success => {
        return ctx.send(utils.getFindOneResponse(success));
      })
      .catch(error => {
        return ctx.response.badRequest(error);
      });
  },

  /**
   * Get all individuals
   * TODO policy Only medha admin can get all individual details
   */
  individuals: async ctx => {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    let filters = convertRestQueryParams(query);

    let sort;
    if (filters.sort) {
      sort = filters.sort;
      filters = _.omit(filters, ["sort"]);
    }

    let orgs = await strapi.plugins[
      "crm-plugin"
    ].services.individual.fetchAllIndividuals(filters);

    // Sorting ascending or descending on one or multiple fields
    if (sort && sort.length) {
      orgs = utils.sort(orgs, sort);
    }

    const response = utils.paginate(orgs, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  /**
   * Get organization details
   * TODO only medha admin and college admin can get his details
   * also only college admin of his college can get this details not the college admin of other college
   */
  organizationDetails: async ctx => {
    const { orgId } = ctx.params;
    const response = await strapi
      .query("organization", PLUGIN)
      .findOne({ id: orgId }, [
        "contact",
        "contact.state",
        "contact.district",
        "zone",
        "rpc",
        "principal",
        "tpos",
        "stream_strength",
        "stream_strength.stream"
      ]);
    if (!response) {
      return ctx.response.badRequest("College does not exist");
    }

    return utils.getFindOneResponse(response);
  },

  /**
   * Get individual details
   * TODO only medha admin and individual can get his details
   */
  individualDetails: async ctx => {
    const { individualId } = ctx.params;

    const response = await strapi
      .query("individual", PLUGIN)
      .findOne({ id: individualId }, [
        "contact.user",
        "organization",
        "contact.user.role",
        "contact.user.state",
        "contact.user.zone",
        "contact.user.rpc",
        "contact.district",
        "stream"
      ]);

    if (!response) {
      return ctx.response.badRequest("User does not exist");
    }

    if (response.contact) {
      response.contact.user = sanitizeUser(response.contact.user);
    }

    return utils.getFindOneResponse(response);
  },

  /**
   * College students
   * TODO policy to check college admin only requestion students for his college
   */
  organizationStudents: async ctx => {
    const { orgId } = ctx.params;
    const org = await strapi
      .query("organization", PLUGIN)
      .findOne({ id: orgId });

    if (!org) {
      return ctx.response.badRequest("Organization does not exist");
    }

    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    let filters = convertRestQueryParams(query);

    let sort;
    if (filters.sort) {
      sort = filters.sort;
      filters = _.omit(filters, ["sort"]);
    }

    let individuals = await strapi.plugins[
      "crm-plugin"
    ].services.individual.fetchCollegeStudents(orgId, filters);

    // Sorting ascending or descending on one or multiple fields
    if (sort && sort.length) {
      individuals = utils.sort(individuals, sort);
    }

    const response = utils.paginate(individuals, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  /**
   * College admins
   * TODO policy to check college admin only requesting admins for his college
   */
  organizationAdmins: async ctx => {
    const { orgId } = ctx.params;
    const org = await strapi
      .query("organization", PLUGIN)
      .findOne({ id: orgId });

    if (!org) {
      return ctx.response.badRequest("Organization does not exist");
    }

    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    let filters = convertRestQueryParams(query);

    let sort;
    if (filters.sort) {
      sort = filters.sort;
      filters = _.omit(filters, ["sort"]);
    }

    let individuals = await strapi.plugins[
      "crm-plugin"
    ].services.individual.fetchCollegeAdmins(orgId, filters);

    // Sorting ascending or descending on one or multiple fields
    if (sort && sort.length) {
      individuals = utils.sort(individuals, sort);
    }

    const response = utils.paginate(individuals, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  /**
   * Block organization
   * TODO policy:Only medha admin can block
   */
  blockOrganizations: async ctx => {
    const { ids } = ctx.request.body;
    let idsToBlock;
    if (!ids) {
      return ctx.response.badRequest("Missing ids field");
    }

    if (typeof ids === "number") {
      idsToBlock = [ids];
    }

    if (typeof ids === "object") {
      idsToBlock = ids;
    }

    if (!idsToBlock.length) {
      return ctx.response.badRequest("College Ids are empty");
    }

    await strapi
      .query("organization", PLUGIN)
      .model.query(qb => {
        qb.whereIn("id", idsToBlock);
      })
      .save({ is_blocked: true }, { patch: true, require: false });

    return utils.getFindOneResponse({});
  },

  /**
   * UnBlock organization
   * TODO policy only medha admin can unblock
   */
  unblockOrganizations: async ctx => {
    const { ids } = ctx.request.body;
    let idsToBlock;
    if (!ids) {
      return ctx.response.badRequest("Missing ids field");
    }

    if (typeof ids === "number") {
      idsToBlock = [ids];
    }

    if (typeof ids === "object") {
      idsToBlock = ids;
    }

    if (!idsToBlock.length) {
      return ctx.response.badRequest("College Ids are empty");
    }

    await strapi
      .query("organization", PLUGIN)
      .model.query(qb => {
        qb.whereIn("id", idsToBlock);
      })
      .save({ is_blocked: false }, { patch: true, require: false });

    return utils.getFindOneResponse({});
  },

  /**
   * Get Activities for given Organization
   * TODO policy only medha admin and college admin can view activites under give colleges
   */
  getOrganizationActivities: async ctx => {
    const { id } = ctx.params;
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    const contact = await strapi.query("contact", PLUGIN).findOne({ id });
    if (!contact) {
      return ctx.response.notFound("College does not exist");
    }

    return strapi
      .query("activity", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.query("activity", PLUGIN).model,
          filters
        })
      )
      .fetchAll()
      .then(res => {
        const data = res.toJSON().filter(activty => activty.contact.id == id);
        const response = utils.paginate(data, page, pageSize);
        return {
          result: response.result,
          ...response.pagination
        };
      });
  },

  /**
   *
   * @param {ids} ctx
   * This will unapprove single or multiple students
   */
  async unapprove(ctx) {
    const { ids } = ctx.request.body;
    let idsToUnApprove;
    if (!ids) {
      return ctx.response.badRequest("Missing ids field");
    }

    if (typeof ids === "number") {
      idsToUnApprove = [ids];
    }

    if (typeof ids === "object") {
      idsToUnApprove = ids;
    }

    if (!idsToUnApprove.length) {
      return ctx.response.badRequest("Student Ids are empty");
    }

    await strapi
      .query("individual", PLUGIN)
      .model.query(qb => {
        qb.whereIn("id", idsToUnApprove);
      })
      .save({ is_verified: false }, { patch: true, require: false });

    return utils.getFindOneResponse({});
  },

  /**
   *
   * @param {ids} ctx
   * This will approve single or multiple students
   */
  async approve(ctx) {
    const { ids } = ctx.request.body;
    let idsToApprove;
    if (!ids) {
      return ctx.response.badRequest("Missing ids field");
    }

    if (typeof ids === "number") {
      idsToApprove = [ids];
    }

    if (typeof ids === "object") {
      idsToApprove = ids;
    }

    if (!idsToApprove.length) {
      return ctx.response.badRequest("Student Ids are empty");
    }

    await strapi
      .query("individual", PLUGIN)
      .model.query(qb => {
        qb.whereIn("id", idsToApprove);
      })
      .save({ is_verified: true }, { patch: true, require: false });

    return utils.getFindOneResponse({});
  },

  async eligibleActivity(ctx) {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    const contact = await strapi.query("contact", PLUGIN).findOne({ id });

    if (!contact) return ctx.response.notFound("Student does not exist");

    let activityBatch = await strapi
      .query("activityassignee", PLUGIN)
      .find({ contact: id });

    if (!activityBatch.length)
      return ctx.response.notFound("Student not Enrolled in any event");

    const currentDate = new Date();

    activityBatch = activityBatch.filter(activityBatch => {
      const endTime = new Date(activityBatch.activity_batch.end_date_time);

      if (endTime.getTime() > currentDate.getTime()) return activityBatch;
    });

    if (activityBatch) {
      const activityIds = activityBatch.map(
        activityBatch => activityBatch.activity_batch.activity
      );

      const activity = await strapi
        .query("activity", PLUGIN)
        .model.query(
          buildQuery({
            model: strapi.plugins["crm-plugin"].models["activity"],
            filters
          })
        )
        .where("id", "in", activityIds)
        .fetchAll()
        .then(model => model.toJSON());
      // console.log(activity);

      const result = activity
        .map(activity => {
          let flag = 0;
          // for (let i = 0; i < activityBatch.length; i++) {
          activityBatch.forEach(activityBatch => {
            if (activity.id === activityBatch.activity_batch.activity) {
              activity["activity_batch"] = activityBatch.activity_batch;
              flag = 1;
            }
          });

          if (flag) return activity;
        })
        .filter(activity => activity);

      const response = utils.paginate(result, page, pageSize);
      return {
        result: response.result,
        ...response.pagination
      };
    }
  },

  async eligibleEvents(ctx) {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);

    // Extrating the details for query params
    let isRegistered, hasAttended, isHired;

    /**
     * Removing isRegistered,hasAttended, isHired since those
     * are custom fields added and strapi won't allow custom fields if present
     * in query params
     */

    if (_.has(query, "isRegistered")) {
      isRegistered = query.isRegistered;
      delete query.isRegistered;
    }

    if (_.has(query, "hasAttended")) {
      hasAttended = query.hasAttended;
      delete query.hasAttended;
    }

    if (_.has(query, "isHired")) {
      isHired = query.isHired;
      delete query.isHired;
    }

    const filters = convertRestQueryParams(query);

    const student = await strapi.query("contact", PLUGIN).findOne({ id });

    if (!student) {
      return ctx.response.notFound("Student does not exist");
    }
    const { stream } = student;

    const organization = await strapi
      .query("organization", PLUGIN)
      .findOne({ id: student.individual.organization });

    const events = await strapi
      .query("event")
      .model.query(
        buildQuery({
          model: strapi.models["event"],
          filters
        })
      )
      .fetchAll()
      .then(model => model.toJSON());

    let result;
    /**Filtering organization */
    if (organization) {
      // Get student organization events
      result = await strapi.services.event.getEvents(organization, events);
    } else {
      result = events;
    }
    /**Filtering stream */

    if (stream) {
      result = result.filter(event => {
        const { streams } = event;
        const streamIds = streams.map(s => s.id);
        if (streamIds.length == 0 || _.includes(streamIds, stream)) {
          return event;
        }
      });
    }

    /** Filtering qualifications */
    const studentEducations = await strapi
      .query("education")
      .find({ contact: id });
    result = result.filter(event => {
      const { qualifications } = event;
      let isEligible = true;
      qualifications.forEach(q => {
        const isQualificationPresent = studentEducations.find(
          e =>
            e.qualification == q.qualification && e.percentage >= q.percentage
        );

        if (!isQualificationPresent) {
          isEligible = false;
        }
      });
      if (isEligible) {
        return event;
      }
    });

    /**Filtering educations */
    const academicHistory = await strapi
      .query("academic-history")
      .find({ contact: id });

    result = result.filter(event => {
      const { educations } = event;

      let isEligible = true;

      educations.forEach(edu => {
        const isEducationPresent = academicHistory.find(
          ah =>
            ah.education_year == edu.education_year &&
            ah.percentage >= edu.percentage
        );

        if (!isEducationPresent) {
          isEligible = false;
        }
      });

      if (isEligible) {
        return event;
      }
    });

    /**
     * Since event object don't have information regarding
     * student has registered or attended we are getting
     * that information from event registration and then adding that details to
     * original event object
     */
    await utils.asyncForEach(result, async event => {
      const eventRegistrationInfo = await strapi
        .query("event-registration")
        .findOne({ contact: id, event: event.id });
      event.isRegistered = eventRegistrationInfo ? true : false;
      event.isHired =
        eventRegistrationInfo && eventRegistrationInfo.is_hired_at_event
          ? true
          : false;
      event.hasAttended =
        eventRegistrationInfo && eventRegistrationInfo.is_attendance_verified
          ? true
          : false;
    });

    /**
     * Filtering for custom filters hasAttended, isHired and isRegistered
     */
    if (isRegistered) {
      const _val = isRegistered == "true";
      result = result.filter(event => {
        if (event.isRegistered == _val) return event;
      });
    }

    if (isHired) {
      const _val = isHired == "true";
      result = result.filter(event => {
        if (event.isHired == _val) return event;
      });
    }

    if (hasAttended) {
      const _val = hasAttended == "true";
      result = result.filter(event => {
        if (event.hasAttended == _val) return event;
      });
    }

    const currentDate = new Date();
    result = result.filter(event => {
      const endDate = new Date(event.end_date_time);

      if (endDate.getTime() >= currentDate.getTime()) return event;
    });

    const response = utils.paginate(result, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  async eligiblePastEvents(ctx) {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);

    // Extrating the details for query params
    let isRegistered, hasAttended, isHired;

    /**
     * Removing isRegistered,hasAttended, isHired since those
     * are custom fields added and strapi won't allow custom fields if present
     * in query params
     */

    if (_.has(query, "isRegistered")) {
      isRegistered = query.isRegistered;
      delete query.isRegistered;
    }

    if (_.has(query, "hasAttended")) {
      hasAttended = query.hasAttended;
      delete query.hasAttended;
    }

    if (_.has(query, "isHired")) {
      isHired = query.isHired;
      delete query.isHired;
    }

    const filters = convertRestQueryParams(query);
    const student = await strapi.query("contact", PLUGIN).findOne({ id });

    if (!student) {
      return ctx.response.notFound("Student does not exist");
    }
    const { stream } = student;

    const organization = await strapi
      .query("organization", PLUGIN)
      .findOne({ id: student.individual.organization });

    const events = await strapi
      .query("event")
      .model.query(
        buildQuery({
          model: strapi.models["event"],
          filters
        })
      )
      .fetchAll()
      .then(model => model.toJSON());

    let result;
    /**Filtering organization */
    if (organization) {
      // Get student organization events
      result = await strapi.services.event.getEvents(organization, events);
    } else {
      result = events;
    }
    /**Filtering stream */

    if (stream) {
      result = result.filter(event => {
        const { streams } = event;
        const streamIds = streams.map(s => s.id);
        if (streamIds.length == 0 || _.includes(streamIds, stream)) {
          return event;
        }
      });
    }

    /** Filtering qualifications */
    const studentEducations = await strapi
      .query("education")
      .find({ contact: id });
    result = result.filter(event => {
      const { qualifications } = event;
      let isEligible = true;
      qualifications.forEach(q => {
        const isQualificationPresent = studentEducations.find(
          e =>
            e.qualification == q.qualification && e.percentage >= q.percentage
        );

        if (!isQualificationPresent) {
          isEligible = false;
        }
      });
      if (isEligible) {
        return event;
      }
    });

    /**Filtering educations */
    const academicHistory = await strapi
      .query("academic-history")
      .find({ contact: id });

    result = result.filter(event => {
      const { educations } = event;

      let isEligible = true;

      educations.forEach(edu => {
        const isEducationPresent = academicHistory.find(
          ah =>
            ah.education_year == edu.education_year &&
            ah.percentage >= edu.percentage
        );

        if (!isEducationPresent) {
          isEligible = false;
        }
      });

      if (isEligible) {
        return event;
      }
    });

    /**
     * Since event object don't have information regarding
     * student has registered or attended we are getting
     * that information from event registration and then adding that details to
     * original event object
     */
    await utils.asyncForEach(result, async event => {
      const eventRegistrationInfo = await strapi
        .query("event-registration")
        .findOne({ contact: id, event: event.id });
      const checkFeedbackForTheEventPresent = await strapi
        .query("feedback-set")
        .find({ event: event.id, contact: id });
      event.isFeedbackProvided = checkFeedbackForTheEventPresent.length
        ? true
        : false;
      event.isRegistered = eventRegistrationInfo ? true : false;
      event.isHired =
        eventRegistrationInfo && eventRegistrationInfo.is_hired_at_event
          ? true
          : false;
      event.hasAttended =
        eventRegistrationInfo && eventRegistrationInfo.is_attendance_verified
          ? true
          : false;
    });

    /**
     * Filtering for custom filters hasAttended, isHired and isRegistered
     */
    if (isRegistered) {
      const _val = isRegistered == "true";
      result = result.filter(event => {
        if (event.isRegistered == _val) return event;
      });
    }

    if (isHired) {
      const _val = isHired == "true";
      result = result.filter(event => {
        if (event.isHired == _val) return event;
      });
    }

    if (hasAttended) {
      const _val = hasAttended == "true";
      result = result.filter(event => {
        if (event.hasAttended == _val) return event;
      });
    }

    const currentDate = new Date();
    result = result.filter(event => {
      const endDate = new Date(event.end_date_time);

      if (endDate < currentDate) {
        return (event["currentDate"] = currentDate);
      }
    });

    const response = utils.paginate(result, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  /**
   * @return {Array}
   * This will fetch all events related to college
   */
  async organizationEvents(ctx) {
    const { id } = ctx.params;
    let { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    const college = await strapi.query("contact", PLUGIN).findOne({ id }, []);
    if (!college) {
      return ctx.response.notFound("College does not exist");
    }

    const events = await strapi
      .query("event")
      .model.query(
        buildQuery({
          model: strapi.models["event"],
          filters
        })
      )
      .fetchAll()
      .then(model => model.toJSON());

    /**
     * Get all events for specific college
     */
    const filtered = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getEvents(college, events);

    const userIds = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getUsers(id);

    let students = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: userIds });

    const students_contact_id = students.map(student => {
      return student.id;
    });

    await utils.asyncForEach(filtered, async event => {
      const checkFeedbackForTheEventPresent = await strapi
        .query("feedback-set")
        .find({ event: event.id, contact_in: students_contact_id });
      event.isFeedbackProvided = checkFeedbackForTheEventPresent.length
        ? true
        : false;
    });

    const { result, pagination } = utils.paginate(filtered, page, pageSize);
    return { result, ...pagination };
  },

  /**
   * Registered events info
   *
   */
  async individualRegisteredEvents(ctx) {
    const { id } = ctx.params;

    const contact = await strapi.query("contact", PLUGIN).findOne({ id });
    if (!contact) {
      return ctx.response.notFound("Contact does not exist");
    }

    const response = await strapi
      .query("event-registration")
      .find({ contact: id });

    return utils.getFindOneResponse(response);
  },

  /**
   * Blocking user will block individual from login
   * user.blocked = true
   * @param {Object} ctx
   */
  async blockIndividuals(ctx) {
    return await strapi.plugins[PLUGIN].services.contact.blockUnblockUsers(
      ctx,
      true
    );
  },

  /**
   * Unblocking user will unblock individual from login
   * user.blocked = false
   * @param {Object} ctx
   */
  async unblockIndividuals(ctx) {
    return await strapi.plugins[PLUGIN].services.contact.blockUnblockUsers(
      ctx,
      false
    );
  },

  /**
   * Creating organization ie college
   * Steps:
   * Update Organization
   * Update TPOs if necessary
   * Update Stream if necessary
   * Update Contact
   *
   */
  editOrganization: async ctx => {
    const { id } = ctx.params;

    const contact = await strapi.query("contact", PLUGIN).findOne({ id });
    if (!contact) {
      return ctx.response.notFound("Contact does not exist");
    }

    const orgId = (contact.organization && contact.organization.id) || null;
    if (!orgId) {
      return ctx.response.notFound("Organization does not exist");
    }

    const organizationReqBody = _.pick(ctx.request.body, [
      "name",
      "college_code",
      "is_blocked",
      "zone",
      "rpc",
      "principal"
    ]);

    const contactReqBody = _.pick(ctx.request.body, [
      "name",
      "phone",
      "email",
      "state",
      "address_1",
      "district"
    ]);

    await bookshelf
      .transaction(async t => {
        /**
         * Creating organization
         */
        const orgModel = await strapi
          .query("organization", PLUGIN)
          .model.where({ id: orgId })
          .save(organizationReqBody, { transacting: t, patch: true })
          .then(model => model)
          .catch(error => {
            console.log(error);
            return null;
          });

        if (!orgModel) {
          return Promise.reject("Something went wrong while updating College");
        }

        const org = orgModel.toJSON ? orgModel.toJSON() : orgModel;

        /**
         * Add this to policy
         */

        const tpos = await Promise.all(
          ctx.request.body.tpos.map(async tpo => {
            return await strapi
              .query("user", "users-permissions")
              .findOne({ id: tpo });
          })
        );

        if (tpos.some(tpo => tpo === null)) {
          return Promise.reject("TPO does not exist");
        }

        // Removing old tpos and adding new tpos

        if (ctx.request.body.hasOwnProperty("tpos")) {
          await orgModel.tpos().detach();
          await orgModel.tpos().attach(ctx.request.body.tpos);
        }

        if (ctx.request.body.hasOwnProperty("stream_strength")) {
          // Removing stream and strengths
          await orgModel
            .related("stream_strength")
            .fetch()
            .then(model => {
              model.forEach(a => {
                a.destroy();
              });
            });

          // Adding new streams and strength
          const streamStrengthModel = await Promise.all(
            ctx.request.body.stream_strength.map(async stream => {
              return await bookshelf
                .model("college-stream-strength")
                .forge(stream)
                .save(null, { transacting: t })
                .then(model => model)
                .catch(error => {
                  console.log(error);
                  return null;
                });
            })
          );

          if (streamStrengthModel.some(s => s === null)) {
            return Promise.reject(
              "Something went wrong while creating Stream & Strength"
            );
          }

          const _orgStreamStrength = await Promise.all(
            streamStrengthModel.map(async (model, index) => {
              return await bookshelf
                .model("organization-component")
                .forge({
                  field: "stream_strength",
                  order: index,
                  component_type: "college_stream_strengths",
                  component_id: model.toJSON().id,
                  organization_id: org.id
                })
                .save(null, { transacting: t })
                .catch(error => {
                  console.log(error);
                  return null;
                });
            })
          );

          if (_orgStreamStrength.some(oss => oss === null)) {
            return Promise.reject(
              "Error while mapping stream strength to Organization"
            );
          }
        }

        contactReqBody.organization = org.id;
        contactReqBody.contact_type = "organization";

        const contact = await strapi
          .query("contact", PLUGIN)
          .model.where({ id: id })
          .save(contactReqBody, { transacting: t, patch: true })
          .then(model => model.toJSON())
          .catch(error => {
            console.log(error);
            return null;
          });

        if (!contact) {
          return Promise.reject("Something went wrong while creating Contact");
        }

        return new Promise(resolve => resolve(contact));
      })
      .then(success => {
        return ctx.send(utils.getFindOneResponse(success));
      })
      .catch(error => {
        return ctx.response.badRequest(error);
      });
  },

  /**
   * Student self registration and medha admin can create indivisuals
   */
  editIndividual: async ctx => {
    const role = await strapi.plugins[PLUGIN].services.contact.getUserRole(ctx);
    if (!role) {
      return ctx.response.badRequest(
        "You don't have permission to perform this action"
      );
    }

    const { id } = ctx.params;

    const contact = await strapi.query("contact", PLUGIN).findOne({ id });
    if (!contact) {
      return ctx.response.notFound("Contact does not exist");
    }

    const userId = (contact.user && contact.user.id) || null;
    if (!userId) {
      return ctx.response.notFound("User does not exist");
    }

    const individualId = (contact.individual && contact.individual.id) || null;
    if (!individualId) {
      return ctx.response.notFound("Individual does not exist");
    }

    const userRequestBody = _.pick(ctx.request.body, [
      "username",
      "email",
      "password",
      "role",
      "state",
      "zone",
      "rpc",
      "blocked"
    ]);

    if (
      (role.name == ROLE_COLLEGE_ADMIN || role.name == ROLE_MEDHA_ADMIN) &&
      ctx.request.body.hasOwnProperty("password") &&
      ctx.request.body.password
    ) {
      userRequestBody.password = await strapi.plugins[
        "users-permissions"
      ].services.user.hashPassword(userRequestBody);
    }

    const individualRequestBody = _.pick(ctx.request.body, [
      "first_name",
      "last_name",
      "stream",
      "father_first_name",
      "father_last_name",
      "date_of_birth",
      "gender",
      "is_physically_challenged",
      "roll_number",
      "organization",
      "future_aspirations"
    ]);

    if (
      individualRequestBody.hasOwnProperty("date_of_birth") &&
      individualRequestBody["date_of_birth"]
    ) {
      var d = new Date(individualRequestBody["date_of_birth"]);
      var n = d.toISOString();
      individualRequestBody["date_of_birth"] = n;
    }

    const contactBody = _.pick(ctx.request.body, [
      "phone",
      "email",
      "address_1",
      "state",
      "district"
    ]);

    contactBody.name = `${individualRequestBody.first_name} ${individualRequestBody.last_name}`;
    contactBody.contact_type = "individual";

    await bookshelf
      .transaction(async t => {
        // Step 1 updating user object
        const user = await strapi
          .query("user", "users-permissions")
          .model.where({ id: userId })
          .save(userRequestBody, { transacting: t, patch: true })
          .then(model => model)
          .catch(err => {
            console.log(err);
            return null;
          });

        if (!user) {
          return Promise.reject("Something went wrong while updating User");
        }

        // Step 2 updating individual
        const individual = await strapi
          .query("individual", PLUGIN)
          .model.where({ id: individualId })
          .save(individualRequestBody, { transacting: t, patch: true })
          .then(model => model)
          .catch(error => {
            console.log(error);
            return null;
          });

        if (!individual) {
          return Promise.reject(
            "Something went wrong while updating Individual"
          );
        }

        // Step 3 updating contact details
        const contact = await strapi
          .query("contact", PLUGIN)
          .model.where({ id })
          .save(contactBody, { transacting: t, patch: true })
          .then(model => model)
          .catch(error => {
            console.log(error);
            return null;
          });

        if (!contact) {
          return Promise.reject("Something went wrong while updating Contact");
        }

        // Add user object
        return new Promise(resolve => resolve(user));
      })
      .then(success => {
        return ctx.send(utils.getFindOneResponse(success));
      })
      .catch(error => {
        return ctx.response.badRequest(error);
      });
  },

  documents: async ctx => {
    const { id } = ctx.params;
    const documentId = ctx.query ? ctx.query.id : null;

    const response = await strapi.query("contact", PLUGIN).findOne({ id });

    if (
      documentId &&
      response.individual.documents &&
      response.individual.documents.length > 0
    ) {
      response.individual.documents = response.individual.documents.filter(
        doc => doc.id === parseInt(documentId)
      );
    }

    return utils.getFindOneResponse(
      response ? response.individual.documents : null
    );
  },

  deleteDocument: async ctx => {
    const { fileId } = ctx.params;
    if (!fileId) {
      return ctx.response.badRequest("File Id is absent");
    }

    const config = await strapi
      .store({
        environment: strapi.config.environment,
        type: "plugin",
        name: "upload"
      })
      .get({ key: "provider" });

    const file = await strapi.plugins["upload"].services.upload.fetch({
      id: fileId
    });

    if (!file) {
      return ctx.notFound("file.notFound");
    }

    const related = await bookshelf
      .model("uploadMorph")
      .where({ upload_file_id: fileId })
      .fetch();

    if (related) {
      console.log("1");
      await related.destroy();
    }

    await strapi.plugins["upload"].services.upload.remove(file, config);

    ctx.send(file);
  },
  eligiblePastActivities: async ctx => {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);

    // Removing custom query params since strapi won't allow filtering using that
    let status;
    if (query.status) {
      status = query.status;
      delete query.status;
    }

    let filters = convertRestQueryParams(query);

    let sort;
    if (filters.sort) {
      sort = filters.sort;
      filters = _.omit(filters, ["sort"]);
    }

    const student = await strapi.query("contact", PLUGIN).findOne({ id });
    if (!student) return ctx.response.notFound("Student does not exist");

    // Building query depending on query params sent
    let qb = {};
    qb.contact = id;
    if (status) {
      qb.verified_by_college = status == "attended" ? true : false;
    }

    let activityBatches = await strapi
      .query("activityassignee", PLUGIN)
      .find(qb);

    if (!activityBatches.length)
      return ctx.response.notFound("Student not Enrolled in any event");

    const currentDate = new Date();

    activityBatches = activityBatches.filter(activityBatch => {
      const endTime = new Date(activityBatch.activity_batch.end_date_time);
      if (currentDate.getTime() > endTime.getTime()) return activityBatch;
    });

    if (activityBatches) {
      const activityIds = activityBatches.map(
        activityBatch => activityBatch.activity_batch.activity
      );

      const activity = await strapi
        .query("activity", PLUGIN)
        .model.query(
          buildQuery({
            model: strapi.plugins["crm-plugin"].models["activity"],
            filters
          })
        )
        .where("id", "in", activityIds)
        .fetchAll()
        .then(model => model.toJSON());
      // console.log(activity);

      let result = activity
        .map(activity => {
          let flag = 0;
          // for (let i = 0; i < activityBatch.length; i++) {
          activityBatches.forEach(activityBatch => {
            if (activity.id === activityBatch.activity_batch.activity) {
              activity["activity_batch"] = activityBatch.activity_batch;
              flag = 1;
            }
          });

          if (flag) return activity;
        })
        .filter(activity => activity);

      // Sorting ascending or descending on one or multiple fields
      if (sort && sort.length) {
        result = utils.sort(result, sort);
      }

      const response = utils.paginate(result, page, pageSize);
      return {
        result: response.result,
        ...response.pagination
      };
    }
  }
};
