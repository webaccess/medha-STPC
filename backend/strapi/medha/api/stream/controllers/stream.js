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

    if (!ctx.state.user) {
      return await strapi
        .query("stream")
        .model.query(
          buildQuery({
            model: strapi.models.stream,
            filters
          })
        )
        .fetchAll({
          columns: ["id", "name"]
        })
        .then(res => res.toJSON());
    } else {
      return strapi
        .query("stream")
        .model.query(
          buildQuery({
            model: strapi.models["stream"],
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
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("stream").findOne({ id });
    return utils.getFindOneResponse(response);
  }
};
