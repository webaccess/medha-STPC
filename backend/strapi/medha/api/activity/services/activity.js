"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const bookshelf = require("../../../config/config.js");
const utils = require("../../../config/utils.js");
const moment = require("moment");

module.exports = {
  /**
   * Create Activity batch for students
   */
  createBatchForStudents: async (activityId, ctx) => {
    const { students, name, start_date_time, end_date_time } = ctx.request.body;
    await bookshelf
      .transaction(async t => {
        /**
         * Creating Activity batch for given activity
         */

        const activityBatch = await strapi
          .query("activity-batch")
          .model.forge({
            activity: activityId,
            name: name,
            start_date_time: start_date_time,
            end_date_time: end_date_time
          })
          .save(null, { transacting: t })
          .then(model => model.toJSON());

        if (!activityBatch) {
          return Promise.reject({
            detail: "Something went wrong while creating Activity Batch"
          });
        }

        const activityBatchId = activityBatch.id;
        /**
         * Creating student entries for activity batch
         */

        const createStudentActivityBatchAttendance = students.map(
          async studentId => {
            return await strapi
              .query("activity-batch-attendance")
              .model.forge({
                activity_batch: activityBatchId,
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
          return Promise.reject({
            detail:
              "Something went wrong while creating Student Activity Batch Attendance"
          });
        }

        return new Promise(resolve => resolve("Success"));
      })
      .then(success => {
        return ctx.send(utils.getFindOneResponse(success));
      })
      .catch(error => {
        return ctx.response.badRequest(`Invalid ${error.detail}`);
      });
  },

  /**
   * Create batch wise students list
   */
  createBatchWiseStudentList: async activityBatches => {
    let result = [];
    await utils.asyncForEach(activityBatches, async activityBatch => {
      const { id, name } = activityBatch;
      const activityBatchAttendance = await strapi
        .query("activity-batch-attendance")
        .find({ activity_batch: id }, [
          "student",
          "activity_batch",
          "activity_batch.activity"
        ]);

      const studentIds = activityBatchAttendance.map(abt => abt.student.id);
      const students = await strapi
        .query("student")
        .find({ id_in: studentIds }, ["stream", "user", "user.college"]);

      let studentData = students.map(student => {
        const { user, roll_number, stream } = student;
        const batch = activityBatchAttendance.find(
          abt => abt.student.id == student.id
        );
        return {
          "Roll Number": roll_number,
          Name: `${user.first_name} ${user.last_name}`,
          College: user.college.name,
          Stream: stream.name,
          "Attended?": !!batch.verified_by_college ? "Yes" : "No",
          Trainer: batch.activity_batch.activity.trainer_name,
          "Activity Date": moment(batch.activity_batch.start_date_time).format(
            "DD MMM YYYY hh:mm"
          )
        };
      });

      result.push({
        workSheetName: name,
        workSheetData: studentData
      });
    });

    return result;
  }
};
