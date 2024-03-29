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
    console.log("in create organization");
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
      "email"
      // "state",
      // "address_1",
      // "district"
    ]);

    const addressBody = ctx.request.body.addresses || [];

    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });

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
          .then(model => model)
          .catch(error => {
            console.log(error);
            return null;
          });

        if (!contact) {
          return Promise.reject("Something went wrong while creating Contact");
        }

        const contactJSON = contact.toJSON ? contact.toJSON() : contact;
        if (addressBody.length > 0) {
          // Add addresses
          const addresses = await Promise.all(
            addressBody.map(addr => {
              const body = { ...addr, country: country.id };
              body.contact = contactJSON.id;

              return strapi
                .query("address", PLUGIN)
                .model.forge(body)
                .save(null, { transacting: t })
                .then(model => model.toJSON())
                .catch(error => null);
            })
          );

          if (addresses.some(addr => addr == null)) {
            return Promise.reject(
              "Something went wrong while creating Address"
            );
          }
        }

        await orgModel.save(
          { contact: contactJSON.id },
          { transacting: t, require: false }
        );

        return new Promise(resolve => resolve(contactJSON));
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
    let filters = convertRestQueryParams(query, { limit: -1 });

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
    const filters = convertRestQueryParams(query, { limit: -1 });

    console.log(filters);
    return strapi
      .query("education")
      .model.query(
        buildQuery({
          model: strapi.models["education"],
          filters
        })
      )
      .where({ contact: id })
      .fetchAll()
      .then(res => {
        const data = res.toJSON();
        // .filter(education => education.contact.id == id);
        const response = utils.paginate(data, page, pageSize);
        return {
          result: response.result,
          ...response.pagination
        };
      });
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
    const files = ctx.request.files;
    let data;
    if (ctx.request.files && ctx.request.body.data) {
      data = ctx.request.body.data;
      data = JSON.parse(data);
    } else {
      data = ctx.request.body;
    }
    const userRequestBody = _.pick(data, [
      "username",
      "email",
      "password",
      "role",
      "zone",
      "rpc",
      "blocked"
    ]);

    const { isStudent } = data;
    if (!isStudent) {
      userRequestBody.state = data.state;
    }

    userRequestBody.username = data.phone;
    userRequestBody.provider = "local";
    userRequestBody.password = await strapi.plugins[
      "users-permissions"
    ].services.user.hashPassword(userRequestBody);

    const individualRequestBody = _.pick(data, [
      "first_name",
      "middle_name",
      "last_name",
      "stream",
      "father_full_name",
      "mother_full_name",
      "date_of_birth",
      "gender",
      "roll_number",
      "organization",
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

    if (ctx.state.user && ctx.state.user.role.name === ROLE_COLLEGE_ADMIN) {
      individualRequestBody.is_verified = true;
    } else {
      individualRequestBody.is_verified = false;
    }

    const contactBody = _.pick(data, [
      "phone",
      "email"
      // "address_1",
      // "state",
      // "district"
    ]);

    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });

    contactBody.name = `${individualRequestBody.first_name} ${individualRequestBody.last_name}`;
    contactBody.contact_type = "individual";

    const addressesBody = data["addresses"] || [];

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
        if (ctx.request.files) {
          await strapi.plugins.upload.services.upload.upload({
            data: {
              fileInfo: {},
              refId: individual.id,
              ref: "individual",
              source: PLUGIN,
              field: "profile_photo"
            },
            files: files["files.profile_photo"]
          });
        }
        if (data.future_aspirations) {
          const future_aspirations = await Promise.all(
            data.future_aspirations.map(async futureaspiration => {
              return await strapi
                .query("futureaspirations")
                .findOne({ id: futureaspiration });
            })
          );

          if (
            future_aspirations.some(
              futureaspiration => futureaspiration === null
            )
          ) {
            return Promise.reject("Future Aspirations does not exist");
          }

          await individual.future_aspirations().attach(data.future_aspirations);
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

        // Step 4 creating address details
        if (addressesBody.length > 0) {
          const addresses = await Promise.all(
            addressesBody.map(addr => {
              const body = { ...addr };
              body.country = country.id;
              body.contact = contactResponse.id;
              return strapi
                .query("address", PLUGIN)
                .model.forge(body)
                .save(null, { transacting: t })
                .then(model => model.toJSON())
                .catch(() => null);
            })
          );

          if (addresses.some(addr => addr == null)) {
            return Promise.reject(
              "Something went wrong while creating Address"
            );
          }
        }

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
    let filters = convertRestQueryParams(query, { limit: -1 });

    return await strapi.plugins[
      "crm-plugin"
    ].services.individual.fetchAllIndividuals(filters, page, pageSize);
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
        "contact.addresses",
        "zone",
        "rpc",
        "principal.contact",
        "tpos.contact",
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
        "contact.addresses",
        "contact.state",
        "stream",
        "profile_photo",
        "future_aspirations"
      ]);

    if (!response) {
      return ctx.response.badRequest("User does not exist");
    }

    if (response.contact) {
      response.contact.user = sanitizeUser(response.contact.user);
      const education = await strapi
        .query("education")
        .findOne({ pursuing: true, contact: response.contact.id }, [
          "year_of_passing"
        ]);
      response.education = education;
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
    let filters = convertRestQueryParams(query, { limit: -1 });

    return await strapi.plugins[
      "crm-plugin"
    ].services.individual.fetchCollegeStudents(orgId, filters, page, pageSize);
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
    let filters = convertRestQueryParams(query, { limit: -1 });

    // let sort;
    // if (filters.sort) {
    //   sort = filters.sort;
    //   filters = _.omit(filters, ["sort"]);
    // }

    return await strapi.plugins[
      "crm-plugin"
    ].services.individual.fetchCollegeAdmins(orgId, filters, page, pageSize);

    // Sorting ascending or descending on one or multiple fields
    // if (sort && sort.length) {
    //   individuals = utils.sort(individuals, sort);
    // }

    // const response = utils.paginate(individuals, page, pageSize);
    // return {
    //   result: response.result,
    //   ...response.pagination
    // };
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
   * @return {Array}
   * This will fetch all events related to college
   */
  async organizationEvents(ctx) {
    const { id } = ctx.params;
    let { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query, { limit: -1 });

    /** This checks college using contact id */
    const college = await strapi.query("contact", PLUGIN).findOne({ id });
    if (!college) {
      return ctx.response.notFound("College does not exist");
    }

    /** This gets contact id of the logged in user */
    const { contact } = ctx.state.user;

    /** This gets contact ids of all the college admins */
    const collegeUserIds = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getCollegeAdmin(id);

    let collegeAdminContact = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: collegeUserIds });

    const collegeAdminContactIds = collegeAdminContact.map(user => {
      return user.id;
    });

    /** Get student contact ids of a college */
    const userIds = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getUsers(id);

    let students = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: userIds });

    const students_contact_id = students.map(student => {
      return student.id;
    });

    /** This gets college admin role */
    const collegeAdminRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "College Admin" }, []);

    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Student" }, []);

    /** Get actual event data */
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

    await utils.asyncForEach(filtered, async event => {
      if (event.question_set) {
        const checkFeedbackForTheEventPresent = await strapi
          .query("feedback-set")
          .find({
            event: event.id,
            contact_in: students_contact_id,
            question_set: event.question_set.id,
            role: studentRole.id
          });

        const checkCollegeFeedbackAvailable = await strapi
          .query("feedback-set")
          .find({
            event: event.id,
            contact: collegeAdminContactIds,
            question_set: event.question_set.id,
            role: collegeAdminRole.id
          });

        if (checkCollegeFeedbackAvailable.length) {
          event.isFeedbackProvidedbyCollege = true;
          event.feedbackSetId = checkCollegeFeedbackAvailable[0].id;
        } else {
          event.isFeedbackProvidedbyCollege = false;
          event.feedbackSetId = null;
        }

        event.isFeedbackProvidedbyStudents = checkFeedbackForTheEventPresent.length
          ? true
          : false;
      } else {
        event.isFeedbackProvidedbyCollege = false;
        event.feedbackSetId = null;
        event.isFeedbackProvidedbyStudents = false;
      }
    });

    const { result, pagination } = utils.paginate(filtered, page, pageSize);
    return { result, ...pagination };
  },

  /**
   * Get Activities for given Organization
   * TODO policy only medha admin and college admin can view activites under give colleges
   */
  getOrganizationActivities: async ctx => {
    const { id } = ctx.params;
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query, { limit: -1 });

    const contact = await strapi.query("contact", PLUGIN).findOne({ id });
    if (!contact) {
      return ctx.response.notFound("College does not exist");
    }

    /** This gets contact ids of all the college admins */
    const collegeUserIds = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getCollegeAdmin(id);

    let collegeAdminContact = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: collegeUserIds });

    const collegeAdminContactIds = collegeAdminContact.map(user => {
      return user.id;
    });

    /** Get student contact ids of a college */
    const userIds = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getUsers(id);

    let students = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: userIds });

    const students_contact_id = students.map(student => {
      return student.id;
    });

    /** This gets college admin role */
    const collegeAdminRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "College Admin" }, []);

    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Student" }, []);

    return strapi
      .query("activity", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.query("activity", PLUGIN).model,
          filters
        })
      )
      .fetchAll()
      .then(async res => {
        const data = res.toJSON().filter(activty => activty.contact.id == id);

        await utils.asyncForEach(data, async activity => {
          if (activity.question_set) {
            const checkFeedbackForTheEventPresent = await strapi
              .query("feedback-set")
              .find({
                activity: activity.id,
                contact_in: students_contact_id,
                question_set: activity.question_set.id,
                role: studentRole.id
              });

            const checkCollegeFeedbackAvailable = await strapi
              .query("feedback-set")
              .find({
                activity: activity.id,
                contact: collegeAdminContactIds,
                question_set: activity.question_set.id,
                role: collegeAdminRole.id
              });

            if (checkCollegeFeedbackAvailable.length) {
              activity.isFeedbackProvidedbyCollege = true;
              activity.feedbackSetId = checkCollegeFeedbackAvailable[0].id;
            } else {
              activity.isFeedbackProvidedbyCollege = false;
              activity.feedbackSetId = null;
            }

            activity.isFeedbackProvidedbyStudents = checkFeedbackForTheEventPresent.length
              ? true
              : false;
          } else {
            activity.isFeedbackProvidedbyCollege = false;
            activity.feedbackSetId = null;
            activity.isFeedbackProvidedbyStudents = false;
          }
        });

        const response = utils.paginate(data, page, pageSize);
        return {
          result: response.result,
          ...response.pagination
        };
      });
  },

  /**
   * Get Activities for given Organization
   * TODO policy only medha admin and college admin can view activites under give colleges
   */

  getActivitiesForZonesRpcs: async ctx => {
    const { id, forRole } = ctx.params;
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    let filters = convertRestQueryParams(query, { limit: -1 });

    let sort;
    if (filters.sort) {
      sort = filters.sort;
      filters = _.omit(filters, ["sort"]);
    }

    /** This gets college admin role */
    const collegeAdminRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "College Admin" }, []);

    const rpcAdminRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "RPC Admin" }, []);

    const zoneAdminRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Zonal Admin" }, []);

    return strapi
      .query("activity", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.query("activity", PLUGIN).model,
          filters
        })
      )
      .fetchAll({
        withRelated: [
          "activitytype",
          "academic_year",
          "contact",
          "contact.organization",
          "question_set",
          "activityassignees",
          "streams"
        ]
      })
      .then(async res => {
        let data = res.toJSON().filter(activty => {
          if (forRole === "rpc") {
            if (activty.contact.organization.rpc == id) {
              return activty;
            }
          } else if (forRole === "zone") {
            if (activty.contact.organization.zone == id) {
              return activty;
            }
          }
        });

        /** For RPC */
        if (forRole === "rpc") {
          /** This gets contact ids of all college admins */
          const collegeAdmins = await strapi.plugins[
            "crm-plugin"
          ].services.contact.getCollegeAdminsFromRPC(id);

          let collegeAdminContacts = await strapi
            .query("contact", PLUGIN)
            .find({ user_in: collegeAdmins });

          const collegeAdminContactIds = collegeAdminContacts.map(user => {
            return user.id;
          });

          await utils.asyncForEach(data, async activity => {
            if (activity.question_set) {
              const checkFeedbackForTheActivityPresent = await strapi
                .query("feedback-set")
                .find({
                  activity: activity.id,
                  contact_in: collegeAdminContactIds,
                  question_set: activity.question_set.id,
                  role: rpcAdminRole.id
                });

              const checkFeedbackFromCollegePresent = await strapi
                .query("feedback-set")
                .find({
                  activity: activity.id,
                  contact_in: collegeAdminContactIds,
                  question_set: activity.question_set.id,
                  role: collegeAdminRole.id
                });

              activity.isFeedbackFromCollegePresent = checkFeedbackFromCollegePresent.length
                ? true
                : false;

              if (checkFeedbackForTheActivityPresent.length) {
                activity.isFeedbackProvidedbyRPC = true;
                activity.feedbackSetId =
                  checkFeedbackForTheActivityPresent[0].id;
              } else {
                activity.isFeedbackProvidedbyRPC = false;
                activity.feedbackSetId = null;
              }
            } else {
              activity.isFeedbackProvidedbyRPC = false;
              activity.feedbackSetId = null;
              activity.isFeedbackFromCollegePresent = false;
            }
          });

          /** For Zone */
        } else {
          /** This gets contact ids of all zonal admins */
          const zonalAdmins = await strapi.plugins[
            "crm-plugin"
          ].services.contact.getZoneAdmins(id);

          await utils.asyncForEach(data, async activity => {
            if (activity.question_set) {
              /** Check data for zonal admins */
              const checkFeedbackForTheEventPresent = await strapi
                .query("feedback-set")
                .find({
                  activity: activity.id,
                  contact_in: zonalAdmins,
                  question_set: activity.question_set.id,
                  role: zoneAdminRole.id
                });

              if (checkFeedbackForTheEventPresent.length) {
                activity.isFeedbackProvidedbyZone = true;
                activity.feedbackSetId = checkFeedbackForTheEventPresent[0].id;
              } else {
                activity.isFeedbackProvidedbyZone = false;
                activity.feedbackSetId = null;
              }
            } else {
              activity.isFeedbackProvidedbyZone = false;
              activity.feedbackSetId = null;
              activity.isFeedbackFromCollegePresent = false;
              activity.isFeedbackFromRPCPresent = false;
            }
          });
        }

        // Sorting ascending or descending on one or multiple fields
        if (sort && sort.length) {
          data = utils.sort(data, sort);
        }

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
    const filters = convertRestQueryParams(query, { limit: -1 });

    const contact = await strapi.query("contact", PLUGIN).findOne({ id });

    if (!contact) return ctx.response.notFound("Student does not exist");

    let activityBatch = await strapi
      .query("activityassignee", PLUGIN)
      .find({ contact: id });

    if (!activityBatch.length) return utils.getFindOneResponse([]);

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

    const filters = convertRestQueryParams(query, { limit: -1 });

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

    result = result.filter(event => {
      const { educations } = event;

      let isEligible = true;

      educations.forEach(edu => {
        const isEducationPresent = studentEducations.find(
          ah =>
            _.toLower(ah.education_year) == _.toLower(edu.education_year) &&
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

  /** Past Activities */
  eligiblePastActivities: async ctx => {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);

    // Removing custom query params since strapi won't allow filtering using that
    let status;
    if (query.status) {
      status = query.status;
      delete query.status;
    }

    let filters = convertRestQueryParams(query, { limit: -1 });

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
      qb.is_verified_by_college = status == "attended" ? true : false;
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

      let activity = await strapi
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

      await utils.asyncForEach(activity, async activity => {
        let flag = 0;
        // for (let i = 0; i < activityBatch.length; i++) {
        activityBatches.forEach(activityBatch => {
          if (activity.id === activityBatch.activity_batch.activity) {
            activity["activity_batch"] = activityBatch.activity_batch;
            flag = 1;
          }
        });

        if (flag) {
          let hasAttended = false;
          for (let i in activity.activityassignees) {
            if (
              activity.activityassignees[i]["contact"] == id &&
              activity.activityassignees[i].is_verified_by_college
            ) {
              hasAttended = true;
              break;
            }
          }
          if (activity.question_set) {
            const checkFeedbackForActivityPresent = await strapi
              .query("feedback-set")
              .find({
                activity: activity.id,
                contact: id,
                question_set: activity.question_set.id
              });
            if (checkFeedbackForActivityPresent.length) {
              activity.isFeedbackProvided = true;
              activity.feedbackSetId = checkFeedbackForActivityPresent[0].id;
            } else {
              activity.isFeedbackProvided = false;
              activity.feedbackSetId = null;
            }
          } else {
            activity.isFeedbackProvided = false;
            activity.feedbackSetId = null;
          }
          activity["hasAttended"] = hasAttended;
          return activity;
        }
      });

      // Sorting ascending or descending on one or multiple fields
      if (sort && sort.length) {
        activity = utils.sort(activity, sort);
      }

      const response = utils.paginate(activity, page, pageSize);
      return {
        result: response.result,
        ...response.pagination
      };
    }
  },

  /** Past Events */
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

    const filters = convertRestQueryParams(query, { limit: -1 });
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

    result = result.filter(event => {
      const { educations } = event;

      let isEligible = true;

      educations.forEach(edu => {
        const isEducationPresent = studentEducations.find(
          ah =>
            _.toLower(ah.education_year) == _.toLower(edu.education_year) &&
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
      if (event.question_set) {
        const checkFeedbackForTheEventPresent = await strapi
          .query("feedback-set")
          .find({
            event: event.id,
            contact: id,
            question_set: event.question_set.id
          });

        if (checkFeedbackForTheEventPresent.length) {
          event.isFeedbackProvided = true;
          event.feedbackSetId = checkFeedbackForTheEventPresent[0].id;
        } else {
          event.isFeedbackProvided = false;
          event.feedbackSetId = null;
        }
      } else {
        event.isFeedbackProvided = false;
        event.feedbackSetId = null;
      }

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

  async rpcEvents(ctx) {
    const { id } = ctx.params;
    let { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query, { limit: -1 });

    /** This checks college using contact id */
    const rpc = await strapi.query("rpc").findOne({ id }, []);
    if (!rpc) {
      return ctx.response.notFound("RPC does not exist");
    }

    /** This gets college admin role */
    const collegeAdminRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "College Admin" }, []);

    const rpcAdminRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "RPC Admin" }, []);

    /** This gets contact ids of all college admins */
    const collegeAdmins = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getCollegeAdminsFromRPC(id);

    let collegeAdminContacts = await strapi
      .query("contact", PLUGIN)
      .find({ user_in: collegeAdmins });

    const collegeAdminContactIds = collegeAdminContacts.map(user => {
      return user.id;
    });

    /** Get actual event data */
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
    ].services.contact.getEventsForRpc(rpc, events);

    await utils.asyncForEach(filtered, async event => {
      if (event.question_set) {
        const checkFeedbackForTheEventPresent = await strapi
          .query("feedback-set")
          .find({
            event: event.id,
            contact_in: collegeAdminContactIds,
            question_set: event.question_set.id,
            role: rpcAdminRole.id
          });

        const checkFeedbackFromCollegePresent = await strapi
          .query("feedback-set")
          .find({
            event: event.id,
            contact_in: collegeAdminContactIds,
            question_set: event.question_set.id,
            role: collegeAdminRole.id
          });

        event.isFeedbackFromCollegePresent = checkFeedbackFromCollegePresent.length
          ? true
          : false;

        if (checkFeedbackForTheEventPresent.length) {
          event.isFeedbackProvidedbyRPC = true;
          event.feedbackSetId = checkFeedbackForTheEventPresent[0].id;
        } else {
          event.isFeedbackProvidedbyRPC = false;
          event.feedbackSetId = null;
        }
      } else {
        event.isFeedbackProvidedbyRPC = false;
        event.feedbackSetId = null;
        event.isFeedbackFromCollegePresent = false;
      }
    });

    const { result, pagination } = utils.paginate(filtered, page, pageSize);
    return { result, ...pagination };
  },

  /**
   * @return {Array}
   * This will fetch all events related to college
   */
  async zoneEvents(ctx) {
    const { id } = ctx.params;
    let { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query, { limit: -1 });

    /** This checks college using contact id */
    const zone = await strapi.query("zone").findOne({ id }, []);
    if (!zone) {
      return ctx.response.notFound("Zone does not exist");
    }

    const zoneAdminRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Zonal Admin" }, []);

    /** This gets contact id of the logged in user */
    const { contact } = ctx.state.user;

    /** This gets contact ids of all zonal admins */
    const zonalAdmins = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getZoneAdmins(id);

    /** Get actual event data */
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
     * Get all events
     */
    const filtered = await strapi.plugins[
      "crm-plugin"
    ].services.contact.getEventsForZone(zone, events);

    await utils.asyncForEach(filtered, async event => {
      if (event.question_set) {
        /** Check data for zonal admins */
        const checkFeedbackForTheEventPresent = await strapi
          .query("feedback-set")
          .find({
            event: event.id,
            contact_in: zonalAdmins,
            question_set: event.question_set.id,
            role: zoneAdminRole.id
          });

        if (checkFeedbackForTheEventPresent.length) {
          event.isFeedbackProvidedbyZone = true;
          event.feedbackSetId = checkFeedbackForTheEventPresent[0].id;
        } else {
          event.isFeedbackProvidedbyZone = false;
          event.feedbackSetId = null;
        }
      } else {
        event.isFeedbackProvidedbyZone = false;
        event.feedbackSetId = null;
        event.isFeedbackFromCollegePresent = false;
        event.isFeedbackFromRPCPresent = false;
      }
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
      "email"
      // "state",
      // "address_1",
      // "district"
    ]);

    const addressBody = ctx.request.body.addresses || [];

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
          .then(model => model)
          .catch(error => {
            console.log(error);
            return null;
          });

        if (!contact) {
          return Promise.reject("Something went wrong while creating Contact");
        }

        const contactJSON = contact.toJSON ? contact.toJSON() : contact;
        if (addressBody.length > 0) {
          if (contactJSON.addresses && contactJSON.addresses.length > 0) {
            const addresses = await Promise.all(
              addressBody.map(addr => {
                return strapi
                  .query("address", PLUGIN)
                  .model.where({ id: addr.id })
                  .save({ ...addr }, { transacting: t, patch: true })
                  .then(model => model.toJSON())
                  .catch(() => null);
              })
            );

            if (addresses.some(addr => addr == null)) {
              return Promise.reject(
                "Something went wrong while updating address"
              );
            }
          } else {
            const addresses = await Promise.all(
              addressBody.map(addr => {
                addr.contact = contactJSON.id;
                return strapi
                  .query("address", PLUGIN)
                  .model.forge(addr)
                  .save(null, { transacting: t })
                  .then(model => model.toJSON())
                  .catch(() => null);
              })
            );

            if (addresses.some(addr => addr == null)) {
              return Promise.reject(
                "Something went wrong while creating address"
              );
            }
          }
        }

        return new Promise(resolve => resolve(contactJSON));
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

    const files = ctx.request.files;

    let data;
    if (ctx.request.files && ctx.request.body.data) {
      data = ctx.request.body.data;
      data = JSON.parse(data);
    } else {
      data = ctx.request.body;
    }
    const userRequestBody = _.pick(data, [
      "email",
      "password",
      "role",
      "zone",
      "rpc",
      "blocked"
    ]);

    userRequestBody.username = data.phone;

    if (
      (role.name == ROLE_COLLEGE_ADMIN || role.name == ROLE_MEDHA_ADMIN) &&
      data.hasOwnProperty("password") &&
      data.password
    ) {
      userRequestBody.password = await strapi.plugins[
        "users-permissions"
      ].services.user.hashPassword(userRequestBody);
    }

    /**
     * Add state in user object only for user other than student
     */
    const { isStudent } = data;
    if (!isStudent) {
      userRequestBody.state = data.state;
    }

    const individualRequestBody = _.pick(data, [
      "first_name",
      "middle_name",
      "last_name",
      "stream",
      "father_full_name",
      "mother_full_name",
      "date_of_birth",
      "gender",
      "is_physically_challenged",
      "roll_number",
      "organization"
    ]);

    if (
      individualRequestBody.hasOwnProperty("date_of_birth") &&
      individualRequestBody["date_of_birth"]
    ) {
      var d = new Date(individualRequestBody["date_of_birth"]);
      var n = d.toISOString();
      individualRequestBody["date_of_birth"] = n;
    }

    const contactBody = _.pick(data, [
      "phone",
      "email"
      // "address_1",
      // "state",
      // "district"
    ]);

    contactBody.name = `${individualRequestBody.first_name} ${individualRequestBody.last_name}`;
    contactBody.contact_type = "individual";

    const addressBody = data["addresses"] || [];

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

        if (data.future_aspirations && data.future_aspirations.length) {
          const future_aspirations = await Promise.all(
            data.future_aspirations.map(async futureaspiration => {
              return await strapi
                .query("futureaspirations")
                .findOne({ id: futureaspiration });
            })
          );

          if (
            future_aspirations.some(
              futureaspiration => futureaspiration === null
            )
          ) {
            return Promise.reject("Future Aspiration does not exist");
          }
        }

        // Step 2 updating individual
        const individual = await strapi
          .query("individual", PLUGIN)
          .model.where({ id: individualId })
          .save(individualRequestBody, { transacting: t, patch: true })
          .then(async model => {
            if (ctx.request.files) {
              console.log("in files");
              await strapi.plugins.upload.services.upload.upload({
                data: {
                  fileInfo: {},
                  refId: individualId,
                  ref: "individual",
                  source: PLUGIN,
                  field: "profile_photo"
                },
                files: files["files.profile_photo"]
              });
            }
            if (data.hasOwnProperty("future_aspirations")) {
              await model.future_aspirations().detach();
              await model.future_aspirations().attach(data.future_aspirations);
            }

            return model;
          })
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
          .model.where({ id: id })
          .save(contactBody, { transacting: t, patch: true })
          .then(model => model)
          .catch(error => {
            console.log(error);
            return null;
          });

        if (!contact) {
          return Promise.reject("Something went wrong while updating Contact");
        }

        const contactJSON = contact.toJSON ? contact.toJSON() : contact;

        if (addressBody.length > 0) {
          if (contactJSON.addresses && contactJSON.addresses.length > 0) {
            const addresses = await Promise.all(
              addressBody.map(addr => {
                return strapi
                  .query("address", PLUGIN)
                  .model.where({ id: addr.id })
                  .save({ ...addr }, { transacting: t, patch: true })
                  .then(model => model.toJSON())
                  .catch(() => null);
              })
            );

            if (addresses.some(addr => addr == null)) {
              return Promise.reject(
                "Something went wrong while updating address"
              );
            }
          } else {
            const addresses = await Promise.all(
              addressBody.map(addr => {
                addr.contact = contactJSON.id;
                return strapi
                  .query("address", PLUGIN)
                  .model.forge(addr)
                  .save(null, { transacting: t })
                  .then(model => model.toJSON())
                  .catch(() => null);
              })
            );

            if (addresses.some(addr => addr == null)) {
              return Promise.reject(
                "Something went wrong while creating address"
              );
            }
          }
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

  deleteDocument: async ctx => {
    const { fileId } = ctx.params;
    const { document } = ctx.query;

    if (!fileId) {
      return ctx.response.badRequest("File Id is absent");
    }

    const file = await strapi.plugins[PLUGIN].services.contact.deleteDocument(
      fileId,
      document
    );
    ctx.send(file);
  },

  deleteIndividual: async ctx => {
    console.log("in delete individual");
    let { id } = ctx.request.body;
    console.log(id);
    let user = [];
    let notStudent = await Promise.all(
      id.map(async id => {
        const student = await strapi
          .query("contact", PLUGIN)
          .findOne({ id: id });
        if (student === null) {
          return null;
        } else {
          const data = {
            studentId: id,
            userId: student.user.id
          };
          user.push(data);
          return id;
        }
      })
    );
    console.log(notStudent);
    notStudent = _.xor(id, notStudent).filter(c => c);

    id = _.pullAll(id, notStudent);

    let list = await Promise.all(
      id.map(async id => {
        const stud = await strapi.query("contact", PLUGIN).findOne({ id: id });

        const role = await strapi
          .query("role", "users-permissions")
          .findOne({ id: stud.user.role }, []);
        if (role.name === "College Admin") {
          const organization = await strapi
            .query("organization", PLUGIN)
            .findOne({ id: stud.individual.organization });
          if (organization !== null) {
            if (
              organization.principal !== null &&
              organization.principal.contact === id
            )
              return id;

            const tpo = organization.tpos
              .map(tpo => tpo.contact)
              .filter(c => c);
            if (_.includes(tpo, id)) return id;
          }
        }
        const documents = await strapi
          .query("document")
          .findOne({ contact: id });
        if (documents !== null) return id;

        const education = await strapi
          .query("education")
          .findOne({ contact: id });
        if (education !== null) return id;

        const activity_batch_attendance = await strapi
          .query("activityassignee", PLUGIN)
          .findOne({ contact: id });
        if (activity_batch_attendance !== null) return id;

        const event_registration = await strapi
          .query("event-registration")
          .findOne({ contact: id });
        if (event_registration !== null) return id;
      })
    );
    list = _.xor(id, list).filter(c => c);
    id = _.pullAll(id, list);

    const userId = user.filter(user => {
      if (_.includes(list, user.studentId)) return user.userId;
    });

    const result = await Promise.all(
      userId.map(async user => {
        const student = await strapi
          .query("contact", PLUGIN)
          .delete({ id: user.studentId });
        // console.log(student);
        const userData = await strapi
          .query("user", "users-permissions")
          .delete({ id: user.userId });

        const individual = await strapi
          .query("individual", PLUGIN)
          .delete({ id: student.individual.id });
        //console.log(userData);

        return { student: student };
      })
    );

    if (notStudent.length > 0)
      return ctx.response.notFound(
        "Students with Id " + `${notStudent}` + " not found"
      );
    else if (id.length === 1) {
      const stud = await strapi.query("contact", PLUGIN).findOne({ id: id[0] });
      return ctx.response.forbidden(
        "Cannot delete User with contact:" + stud.phone
      );
    } else if (id.length > 1) {
      return ctx.response.forbidden(id.length + " users cannot be deleted");
    } else return utils.getFindOneResponse("success");
  },

  deleteOrganization: async ctx => {
    const { ids } = ctx.request.body;

    if (!ids) {
      return ctx.response.badRequest("College ids are missing");
    }

    /**
     * Checking if references exist in following tables:
     *  - Activity
     *  - Event
     *
     * Checking if given ids exist in db or not
     *
     * If no reference found do the following:
     *  - Delete organization
     *  - Delete contact
     */

    let idsToDelete = [];
    /**
     * Step 1 checking if references present in Activity
     * if id has reference return null
     * otherwise return id to be deleted
     */

    const activityIdsWithoutReference = await Promise.all(
      ids.map(id => {
        return strapi
          .query("activity", PLUGIN)
          .count({ contact: id })
          .then(val => (val == 0 ? id : null));
      })
    );

    // Update idsToBeDeleted with non reference ids
    idsToDelete = _.compact(activityIdsWithoutReference);

    /**
     * Step 2 checking if references present in Event
     * Get all unique ids of contact for all events
     * Get ids to be deleted
     * return ids which are not in all unique id array.
     */

    // const allEvents = await strapi.query("event").find({});
    // const allEventContactIds = _.union(
    //   allEvents.reduce((result, event) => {
    //     const { contacts } = event;
    //     result.push(...contacts.map(contact => contact.id));
    //     return result;
    //   }, [])
    // );

    // idsToDelete = _.xor(idsToDelete, allEventContactIds);
    // console.log(idsToDelete);

    await strapi
      .query("organization", PLUGIN)
      .delete({ contact_in: idsToDelete });

    await strapi.query("contact", PLUGIN).delete({ id_in: idsToDelete });

    return {
      result: "Success"
    };
  },

  documents: async ctx => {
    const { id } = ctx.params;
    const contact = await strapi.query("contact", PLUGIN).findOne({ id });
    if (!contact) {
      return ctx.response.notFound("Contact does not exist");
    }

    /**
     * 1. Get all educations
     * 2. If no educations details found return []
     * 3. Else get education list and check if documents are uploaded for it or not
     * 4. If documents are uploaded return upload details with education
     * 5. Else return list of education
     * 6. Check if resume is uploaded for that contact in documents table
     * 7. If yes return upload details otherwise send dummy entry for resume
     */

    const educations = await strapi.query("education").find({ contact: id });
    const result = [];
    for await (let education of educations) {
      const document = await strapi
        .query("document")
        .findOne({ education: education.id }, ["file"]);
      result.push({ ...education, document: document, isResume: false });
    }

    const resume = await strapi
      .query("document")
      .findOne({ contact: id, name: "resume" });
    result.push({ document: resume, isResume: true });
    return utils.getFindOneResponse(result);
  }
};
