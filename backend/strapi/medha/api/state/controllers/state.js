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
    const filters = convertRestQueryParams(query);
    /**
     * Public route
     */
    if (!ctx.state.user) {
      return strapi
        .query("state")
        .model.query(
          buildQuery({
            model: strapi.models.state,
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
    const { role } = ctx.state.user;
    if (role.name === "Medha Admin" || role.name === "Admin") {
      return strapi
        .query("state")
        .model.query(
          buildQuery({
            model: strapi.models.state,
            filters
          })
        )
        .fetchPage({ page: page, pageSize: pageSize })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("state").findOne({ id });
    return utils.getFindOneResponse(response);
  },

  /**
   * @return {Object}
   */
  async zones(ctx) {
    const { id } = ctx.params;
    const { query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

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

  /**
   * @return {Object}
   */
  async rpcs(ctx) {
    const { id } = ctx.params;
    const { query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

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
