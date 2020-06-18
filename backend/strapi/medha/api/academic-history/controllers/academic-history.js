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
      .query("academic-history")
      .model.query(
        buildQuery({
          model: strapi.models["academic-history"],
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
    const response = await strapi.query("academic-history").findOne({ id: id });
    return utils.getFindOneResponse(response);
  }
};
