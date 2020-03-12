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

    return strapi
      .query("activity-batch-attendance")
      .model.query(
        buildQuery({
          model: strapi.models["activity-batch-attendance"],
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
    const response = await strapi
      .query("activity-batch-attendance")
      .findOne({ id });

    return utils.getFindOneResponse(response);
  }
};
