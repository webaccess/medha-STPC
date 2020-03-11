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
      .model("activity")
      .query(
        buildQuery({
          model: strapi.models["activity"],
          filters
        })
      )
      .fetchPage({
        page: page,
        pageSize: pageSize,
        withRelated: [
          "academic_year",
          "college.stream_strength.streams.stream",
          "streams",
          "question_set"
        ]
      })
      .then(res => {
        const response = utils.getPaginatedResponse(res);
        const data = response.result.reduce((result, activity) => {
          if (activity.college) {
            const streams = activity.college.stream_strength.map(
              s => s.streams
            );
            activity.college.stream_strength = streams;
          }
          result.push(activity);
          return result;
        }, []);
        response.result = data;
        return response;
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("activity").findOne({ id });
    return utils.getFindOneResponse(response);
  }
};
