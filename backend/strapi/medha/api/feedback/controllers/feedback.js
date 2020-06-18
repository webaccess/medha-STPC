"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { convertRestQueryParams, buildQuery } = require("strapi-utils");
const { sanitizeEntity } = require("strapi-utils");
const bookshelf = require("../../../config/bookshelf.js");
const utils = require("../../../config/utils");

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

module.exports = {
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("feedback")
      .model.query(
        buildQuery({
          model: strapi.models["feedback"],
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
    const response = await strapi.query("feedback").findOne({ id });
    if (response) {
      response.user = sanitizeUser(response.user);
    }
    return utils.getFindOneResponse(response);
  }
};
