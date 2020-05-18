"use strict";

const { PLUGIN } = require("../../../config/constants");
const utils = require("../../../config/utils");

const {
  convertRestQueryParams,
  buildQuery,
  sanitizeEntity
} = require("strapi-utils");

module.exports = {
  /**
   * TODO policy to check required fields
   */
  create: async ctx => {
    let { data } = ctx.request.body;
    const files = ctx.request.files;

    data = JSON.parse(data);
    const entry = await strapi.query("activity", PLUGIN).create(data);

    if (files) {
      // automatically uploads the files based on the entry and the model
      await strapi.entityService.uploadFiles(entry, files, {
        model: "activity",
        plugin: PLUGIN
      });
    }

    return entry;
  },

  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("activity", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.query("activity", PLUGIN).model,
          filters
        })
      )
      .fetchAll()
      .then(res => {
        const response = utils.paginate(res, page, pageSize);
        return {
          result: response.result,
          ...response.pagination
        };
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("activity", PLUGIN).findOne({ id });
    return utils.getFindOneResponse(response);
  }
};
