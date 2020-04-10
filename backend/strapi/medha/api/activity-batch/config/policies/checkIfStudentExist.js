"use strict";

/**
 * `checkIfStudentExist` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  const { id } = ctx.params;
  const activityBatch = await strapi.query("activity-batch").findOne({ id });

  if (!activityBatch) {
    return ctx.response.notFound("Activity Batch does not exist");
  }

  const activityBatchAttendance = await strapi
    .query("activity-batch-attendance")
    .find({ activity_batch: id });

  if (activityBatchAttendance.length > 0) {
    return ctx.response.badRequest(
      "Activity Batch cannot be deleted...Please remove student from batch and try again"
    );
  }

  await next();
};
