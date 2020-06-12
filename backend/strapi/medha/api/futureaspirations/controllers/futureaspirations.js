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

    if (!ctx.state.user) {
      return await strapi
        .query("futureaspirations")
        .model.query(
          buildQuery({
            model: strapi.models.futureaspirations,
            filters
          })
        )
        .fetchAll({
          columns: ["id", "name"]
        })
        .then(res => utils.getPaginatedResponse(res));
    } else {
      return strapi
        .query("futureaspirations")
        .model.query(
          buildQuery({
            model: strapi.models["futureaspirations"],
            filters
          })
        )
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0
              ? await utils.getTotalRecords("futureaspirations")
              : pageSize
        })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }
  }
};
