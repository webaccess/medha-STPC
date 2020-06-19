"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { convertRestQueryParams, buildQuery } = require("strapi-utils");
const utils = require("../../../config/utils.js");

module.exports = {
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query, { limit: -1 });

    return strapi
      .query("state", "crm-plugin")
      .model.query(
        buildQuery({
          model: strapi.plugins["crm-plugin"].models["state"],
          filters
        })
      )
      .fetchAll()
      .then(res => {
        const data = res.toJSON();
        const response = utils.paginate(data, page, pageSize);
        return {
          result: response.result,
          ...response.pagination
        };
      });
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("state", "crm-plugin").findOne({ id });
    return utils.getFindOneResponse(response);
  },

  async zones(ctx) {
    const { id } = ctx.params;
    const { query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query, { limit: -1 });

    return strapi
      .query("zone")
      .model.query(
        buildQuery({
          model: strapi.models.zone,
          filters
        })
      )
      .where({ state: id })
      .fetchAll()
      .then(res => {
        return utils.getResponse(res);
      });
  },

  async districts(ctx) {
    const { id } = ctx.params;

    const response = await strapi
      .query("district", "crm-plugin")
      .find({ state: id }, ["state", "state.country"]);

    return response;
  },

  async organizations(ctx) {
    const { id } = ctx.params;
    const { rpcId } = ctx.params;

    const response = await strapi
      .query("contact", "crm-plugin")
      .find({ contact_type: "organization", state: id });

    const data = response
      .map(res => {
        if (res.organization.rpc == rpcId) {
          return {
            id: res.id,
            name: res.name
          };
        }
      })
      .filter(res => {
        if (res !== undefined) {
          return true;
        }
      });

    return data;
  },

  /**
   * @return {Object}
   */
  async rpcs(ctx) {
    const { id } = ctx.params;
    const { query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query, { limit: -1 });

    return strapi
      .query("rpc")
      .model.query(
        buildQuery({
          model: strapi.models.rpc,
          filters
        })
      )
      .where({ state: id })
      .fetchAll()
      .then(res => {
        return utils.getResponse(res);
      });
  }
};
