"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { convertRestQueryParams, buildQuery } = require("strapi-utils");
const utils = require("../../../config/utils.js");
const { PLUGIN } = require("../../../config/constants");
module.exports = {
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("education")
      .model.query(
        buildQuery({
          model: strapi.models["education"],
          filters
        })
      )
      .fetchPage({
        page: page,
        pageSize:
          pageSize < 0 ? await utils.getTotalRecords("education") : pageSize
      })
      .then(res => {
        return utils.getPaginatedResponse(res);
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("education").findOne({ id });
    return utils.getFindOneResponse(response);
  },

  async delete(ctx) {
    const { id } = ctx.params;

    const education = await ctx.query("education").findOne({ id });
    if (!education) {
      return ctx.response.notFound("Education does not exist");
    }

    const document = await strapi.query("document").findOne({ education: id });

    const documentId = (document && document.id) || null;
    const fileId = (education.file && education.file.id) || null;

    if (fileId && documentId) {
      await strapi.plugins[PLUGIN].services.contact.deleteDocument(
        fileId,
        documentId
      );
    }

    await ctx.query("education").delete({ id });
    return {
      result: "Success"
    };
  }
};
