"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {
  convertRestQueryParams,
  buildQuery,
  sanitizeEntity
} = require("strapi-utils");
const utils = require("../../../config/utils.js");

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

module.exports = {
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("event")
      .model.query(
        buildQuery({
          model: strapi.models["event"],
          filters
        })
      )
      .fetchPage({
        page: page,
        pageSize: pageSize < 0 ? await utils.getTotalRecords("event") : pageSize
      })
      .then(res => {
        return utils.getPaginatedResponse(res);
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("event").findOne({ id });
    return utils.getFindOneResponse(response);
  },

  async students(ctx) {
    const { id } = ctx.params;
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);
    const getPageSize = await strapi
      .query("event-registration")
      .model.query(
        buildQuery({
          model: strapi.models["event-registration"],
          filters
        })
      )
      .where({ event: id })
      .fetchAll()
      .then(res => {
        return utils.getResponse(res);
      });

    const response = await strapi
      .query("event-registration")
      .model.query(
        buildQuery({
          model: strapi.models["event-registration"],
          filters
        })
      )
      .where({ event: id })
      .fetchPage({
        page: page,
        pageSize: pageSize < 0 ? await getPageSize.result.length : pageSize
      })
      .then(res => {
        return utils.getPaginatedResponse(res);
      });

    await utils.asyncForEach(response.result, async (event, index) => {
      const { student } = event;
      const userData = await strapi
        .query("user", "users-permissions")
        .findOne({ id: student.user });
      event.student.user = sanitizeUser(userData);
    });
    return response;
  }
};
