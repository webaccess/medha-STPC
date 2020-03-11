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

    return bookshelf
      .model("event_registration")
      .query(
        buildQuery({
          model: strapi.models["event-registration"],
          filters
        })
      )
      .fetchPage({
        page: page,
        pageSize: pageSize,
        withRelated: ["student", "event"]
      })
      .then(res => {
        return utils.getPaginatedResponse(res);
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("event-registration").findOne({ id });
    return utils.getFindOneResponse(response);
  }
};
