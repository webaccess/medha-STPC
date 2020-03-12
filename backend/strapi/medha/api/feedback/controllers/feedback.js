"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { convertRestQueryParams, buildQuery } = require("strapi-utils");
const utils = require("../../../config/utils.js");
const { sanitizeEntity } = require("strapi-utils");

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
      .fetchPage({
        page: page,
        pageSize: pageSize
      })
      .then(res => {
        const data = utils.getPaginatedResponse(res);
        if (data.result) {
          data.result = data.result.reduce((result, feedback) => {
            feedback.user = sanitizeUser(feedback.user);
            result.push(feedback);
            return result;
          }, []);
        }
        return data;
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
