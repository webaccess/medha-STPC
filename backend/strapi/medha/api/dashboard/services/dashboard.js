"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */
const {
  PLUGIN,
  ROLE_MEDHA_ADMIN,
  ROLE_COLLEGE_ADMIN,
  ROLE_ZONAL_ADMIN
} = require("../../../config/constants");

module.exports = {
  getOverallWorkshops: async orgId => {
    const data = await strapi
      .query("activity", PLUGIN)
      .find({ "contact.organization": orgId });
    console.log(data);
  },

  getPlacementCount: async orgId => {},

  getPlacementAttendedCount: async orgId => {},

  getPlacementPlacedCount: async orgId => {},

  getPlacementSelectedCount: async orgId => {},

  getPlacementStudentFeedbackCount: async orgId => {},

  getPlacementTPOFeedbackCount: async orgId => {},

  getPlacementCollegeFeedbackCount: async orgId => {}
};

