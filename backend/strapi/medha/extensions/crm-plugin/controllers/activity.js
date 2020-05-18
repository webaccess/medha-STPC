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
  },

  /**
   *
   * @param {Object} ctx
   * @returns {Object}
   *
   * Get all activity Batches
   */
  async activityBatch(ctx) {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    const { activity_batch_id } = query;

    const activity = await strapi.query("activity", PLUGIN).findOne({ id });

    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    let activityBatches = await strapi
      .query("activity-batch")
      .find({ activity: id });

    if (activity_batch_id) {
      activityBatches = activityBatches.filter(
        ab => ab.id == activity_batch_id
      );
    }
    const response = utils.paginate(activityBatches, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  /**
   * @param {Object} ctx
   * @returns {Object}
   *
   * Check if activity exist
   * Create activity batch
   * Create activity batch attedances for all students
   */
  async createActivityBatch(ctx) {
    const { id } = ctx.params;
    const activity = await strapi.query("activity", PLUGIN).findOne({ id });

    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    const { students, name } = ctx.request.body;

    if (!students) {
      return ctx.response.badRequest("Students field is missing");
    }

    if (!name) {
      return ctx.response.badRequest("Name field is missing");
    }
    /**
     * Check whether students exists
     */

    const studentsResponse = await Promise.all(
      students.map(studentId =>
        strapi.query("contact", PLUGIN).findOne({ id: studentId })
      )
    );

    if (studentsResponse.some(s => s === null)) {
      return ctx.response.badRequest("Invalid student Ids");
    }

    return strapi.plugins[
      "crm-plugin"
    ].services.activity.createBatchForStudents(id, ctx);
  },

  /**
   * Download student list attending activity
   */
  async download(ctx) {
    const { id } = ctx.params;

    const activity = await strapi.query("activity", PLUGIN).findOne({ id });
    if (!activity) {
      return ctx.response.notFound("Activity does not exist");
    }

    const activityBatches = await strapi
      .query("activity-batch")
      .find({ activity: id });

    if (!activityBatches.length) {
      return ctx.response.badRequest("No student data found for Activity");
    }

    const batchWiseStudentList = await strapi.plugins[
      "crm-plugin"
    ].services.activity.createBatchWiseStudentList(activityBatches);
    return utils.getFindOneResponse(batchWiseStudentList);
  }
};
