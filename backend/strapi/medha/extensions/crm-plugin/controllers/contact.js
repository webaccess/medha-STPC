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
const { convertRestQueryParams } = require("strapi-utils");

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
        contactReqBody.contact_type = "College";

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
  }
};
