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

    return await bookshelf
      .model("academic_year")
      .query(
        buildQuery({
          model: strapi.models["academic-year"],
          filters
        })
      )
      .fetchPage({
        page: page,
        pageSize: pageSize
      })
      .then(res => {
        return utils.getPaginatedResponse(res);
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    return await bookshelf
      .model("academic_year")
      .where({ id: id })
      .fetch({
        require: false
      })
      .then(res => {
        return utils.getResponse(res);
      });
  }
};
