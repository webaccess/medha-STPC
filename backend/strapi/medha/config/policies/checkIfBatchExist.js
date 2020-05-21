"use strict";

/**
 * `checkIfBatchExist` policy.
 */
const { PLUGIN } = require("../constants");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In checkIfBatchExist policy.");
  const { id } = ctx.params;
  const activity = await strapi.query("activity", PLUGIN).findOne({ id });

  if (!activity) {
    return ctx.response.notFound("Activity does not exist");
  }

  const activityBatch = await strapi
    .query("activity-batch")
    .find({ activity: id });

  if (activityBatch.length > 0) {
    return ctx.response.badRequest(
      "Activity cannot be deleted...Please remove activity batch from activity and try again"
    );
  }
  await next();
};
