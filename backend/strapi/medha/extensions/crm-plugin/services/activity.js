const { PLUGIN } = require("../../../config/constants");
const bookshelf = require("../../../config/bookshelf");
const utils = require("../../../config/utils");
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
            name,
            start_date_time,
            end_date_time
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
              .query("activityassignee", PLUGIN)
              .model.forge({
                activity_batch: activityBatchId,
                contact: studentId,
                is_verified_by_college: false,
                activity: activityId
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

        return new Promise(resolve => resolve(activityBatch));
      })
      .then(success => {
        return ctx.send(utils.getFindOneResponse(success));
      })
      .catch(error => {
        console.log(error);
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
        .query("activityassignee", PLUGIN)
        .find({ activity_batch: id }, [
          "contact",
          "activity_batch",
          "activity"
        ]);

      const studentIds = activityBatchAttendance.map(abt => abt.contact.id);
      const students = await strapi
        .query("contact", PLUGIN)
        .find({ id_in: studentIds }, [
          "individual",
          "individual.organization",
          "individual.stream",
          "user"
        ]);

      let studentData = students.map(student => {
        const { individual } = student;
        const {
          first_name,
          last_name,
          roll_number,
          stream,
          organization
        } = individual;
        const batch = activityBatchAttendance.find(
          abt => abt.contact.id == student.id
        );
        return {
          "Contact Number": student.phone,
          "Roll Number": roll_number,
          Name: `${first_name} ${last_name}`,
          College: organization.name,
          Stream: stream.name,
          "Attended?": !!batch.is_verified_by_college ? "Yes" : "No",
          Trainer: batch.activity.trainer_name,
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
