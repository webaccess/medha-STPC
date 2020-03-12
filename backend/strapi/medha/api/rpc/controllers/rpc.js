"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { convertRestQueryParams, buildQuery } = require("strapi-utils");
const utils = require("../../../config/utils.js");
module.exports = {
  /**
   * Retrieve RPCs.
   * Depending on user's role appropraite RPCs will be returned
   * medha-admin/ admin will get all available RPCs
   * zonal-admin will get RPCs under their zone
   * rpc-admin will get their repective RPC
   * @return {Object}
   */
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);
    /**
     * Public route
     */
    if (!ctx.state.user) {
      return strapi
        .query("rpc")
        .model.query(
          buildQuery({
            model: strapi.models.rpc,
            filters
          })
        )
        .fetchPage({
          page: page,
          pageSize: pageSize,
          columns: ["id", "name"]
        })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }
    /**
     * For authenticated user
     */
    const { role, rpc, zone } = ctx.state.user;
    if (role.name === "Medha Admin" || role.name === "Admin") {
      return strapi
        .query("rpc")
        .model.query(
          buildQuery({
            model: strapi.models.rpc,
            filters
          })
        )
        .fetchPage({ page: page, pageSize: pageSize })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }

    if (role.name === "Zonal Admin") {
      return strapi
        .query("rpc")
        .model.query(
          buildQuery({
            model: strapi.models.rpc,
            filters
          })
        )
        .where({ zone: zone })
        .fetchPage({ page: page, pageSize: pageSize })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }

    if (role.name === "RPC Admin") {
      return strapi
        .query("rpc")
        .model.query(
          buildQuery({
            model: strapi.models.rpc,
            filters
          })
        )
        .where({ id: rpc })
        .fetchPage({ page: page, pageSize: pageSize })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("rpc").findOne({ id });
    return utils.getFindOneResponse(response);
  },

  /**
   * Get colleges under RPC.
   * @return {Object|Array}
   */
  async colleges(ctx) {
    const { id } = ctx.params;
    const { query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("college")
      .model.query(
        buildQuery({
          model: strapi.models.college,
          filters
        })
      )
      .where({ rpc: id })
      .fetchAll()
      .then(model => {
        return utils.getResponse(model);
      });
  }
};
