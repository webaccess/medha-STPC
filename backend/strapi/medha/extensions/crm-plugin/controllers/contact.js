"use strict";
/**
 * crm-plugin.js contact controller
 *
 * @description: Extending set of actions for contact controller of CRM-plugin
 */

const _ = require("lodash");
const bookshelf = require("../../../config/bookshelf");
const utils = require("../../../config/utils");
const { PLUGIN } = require("../../../config/constants");
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
    console.log("In academic history");
    const { id } = ctx.params;
    const academicHistoryId = ctx.query ? ctx.query.id : null;
    console.log(academicHistoryId);
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
      "organization"
    ]);

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
        "stream_strength"
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
        "contact.user.rpc"
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
    console.log(ctx.request.body);
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
  }
};
