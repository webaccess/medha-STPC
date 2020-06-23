"use strict";

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/3.0.0-beta.x/concepts/configurations.html#cron-tasks
 */

module.exports = {
  "0 */3 * * *": async function () {
    strapi.log.info("Cron running");
    const allColleges = await strapi
      .query("organization", "crm-plugin")
      .find({ _limit: -1 });

    await strapi.services.dashboard.createDashboardData(allColleges);
  }
};
