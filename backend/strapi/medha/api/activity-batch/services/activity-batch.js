"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const bookshelf = require("../../../config/config.js");
const utils = require("../../../config/utils.js");
module.exports = {
  /**
   * Validate all student for given activity batch and student Ids
   */
  validateStudentForActivityBatch: async ctx => {
    const { students } = ctx.request.body;
    const { id } = ctx.params;

    await strapi
      .query("activity-batch-attendance")
      .model.query(qb => {
        qb.where("activity_batch", id).whereIn("student", students);
      })
      .save({ verified_by_college: true }, { patch: true, require: false });
    return ctx.send(utils.getFindOneResponse("success"));
  },

  addStudentsToActivityBatch: async ctx => {
    const { students } = ctx.request.body;
    const { id } = ctx.params;

    await bookshelf
      .transaction(async t => {
        /**
         * Creating student entries for activity batch
         */

        const createStudentActivityBatchAttendance = students.map(
          async studentId => {
            return await strapi
              .query("activity-batch-attendance")
              .model.forge({
                activity_batch: id,
                student: studentId,
                marked_by_student: false,
                verified_by_college: false
              })
              .save(null, { transacting: t })
              .then(model => model.toJSON())
              .catch(() => null);
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
