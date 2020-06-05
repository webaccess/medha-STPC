"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const bookshelf = require("../../../config/bookshelf");
const utils = require("../../../config/utils.js");
const { PLUGIN } = require("../../../config/constants");
module.exports = {
  /**
   * Validate all student for given activity batch and student Ids
   */
  validateStudentForActivityBatch: async ctx => {
    const { students } = ctx.request.body;
    const { id } = ctx.params;

    await strapi
      .query("activityassignee", PLUGIN)
      .model.query(qb => {
        qb.where("activity_batch", id).whereIn("contact", students);
      })
      .save({ is_verified_by_college: true }, { patch: true, require: false });
    return ctx.send(utils.getFindOneResponse("success"));
  },

  inValidateStudentForActivityBatch: async ctx => {
    const { students } = ctx.request.body;
    const { id } = ctx.params;

    await strapi
      .query("activityassignee", PLUGIN)
      .model.query(qb => {
        qb.where("activity_batch", id).whereIn("contact", students);
      })
      .save({ is_verified_by_college: false }, { patch: true, require: false });
    return ctx.send(utils.getFindOneResponse("success"));
  },

  addStudentsToActivityBatch: async ctx => {
    const { students } = ctx.request.body;
    const { id } = ctx.params;

    const activityBatch = await strapi.query("activity-batch").findOne({ id });
    const activityId = activityBatch.activity.id;
    await bookshelf
      .transaction(async t => {
        /**
         * Creating student entries for activity batch
         */

        const createStudentActivityBatchAttendance = students.map(
          async studentId => {
            return await strapi
              .query("activityassignee", PLUGIN)
              .model.forge({
                activity_batch: id,
                contact: studentId,
                activity: activityId,
                is_verified_by_college: false
              })
              .save(null, { transacting: t })
              .then(model => model.toJSON())
              .catch(err => null);
          }
        );

        const response = await Promise.all(
          createStudentActivityBatchAttendance
        );

        if (response.some(r => r === null)) {
          console.log(1);
          return Promise.reject(
            "Something went wrong while creating Student Activity Batch Attendance"
          );
        }

        return new Promise(resolve => resolve("Success"));
      })
      .then(success => {
        return ctx.send(utils.getFindOneResponse(success));
      })
      .catch(error => {
        return ctx.response.badRequest(error);
      });
  }
};
