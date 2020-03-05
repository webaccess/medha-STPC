"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/config.js");
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
      return await bookshelf
        .model("state")
        .query(
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
      return await bookshelf
        .model("state")
        .query(
          buildQuery({
            model: strapi.models.state,
            filters
          })
        )
        .fetchPage({ page: page, pageSize: pageSize, withRelated: ["zones"] })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }
  },

  /**
   * @return {Object}
   */
  async zones(ctx) {
    const { id } = ctx.params;
    return await bookshelf
      .model("state")
      .where({ id: id })
      .fetch({ withRelated: ["zones"] });
  }
};
