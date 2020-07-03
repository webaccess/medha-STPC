"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/bookshelf.js");
const {
  PLUGIN,
  ROLE_MEDHA_ADMIN,
  ROLE_DEPARTMENT_ADMIN,
  ROLE_COLLEGE_ADMIN,
  ROLE_ZONAL_ADMIN
} = require("../../../config/constants");
const utils = require("../../../config/utils.js");

const _ = require("lodash");

module.exports = {
  async find(ctx) {
    let { query } = utils.getRequestParams(ctx.request.query);
    const userInfo = ctx.state.user;
    const role = userInfo.role.name;
    let dataToReturn = {
      Workshops: 0,
      TPOFeedback: 0,
      StudentFeedback: 0,
      IndustrialVisits: 0,
      Interships: 0,
      Placement: 0,
      FirstYear: 0,
      FinalYear: 0,
      Entrepreneurship: 0,
      FirstYearAttendance: 0,
      SecondYearAttendance: 0,
      FinalYearAttendance: 0,
      UniqueStudents: 0,
      Institutionstouched: 0,
      IndustrialVisitAttendance: 0,
      IndustrialVisitStudentFeedback: 0,
      IndustrialVisitTPOFeedback: 0,
      PlacementAttended: 0,
      PlacementSelected: 0,
      PlacementStudentFeedback: 0,
      PlacementTPOFeedback: 0,
      PlacementCollegeFeedback: 0,
      SecondYear: 0,
      AchievedIndustrialVisit: 0,
      PlannedIndustrialVisit: 0,
      AchievedWorkshops: 0,
      PlannedWorkshops: 0
    };
    /** getting data for medha admin */
    if (role === ROLE_MEDHA_ADMIN || role === ROLE_DEPARTMENT_ADMIN) {
      // _.assign(query, { state: "1" }, { country: "1" });
      const data = await bookshelf
        .model("dashboard")
        .where(query)
        .fetchAll()
        .then(model => model.toJSON());

      data.forEach(dashboardData => {
        Object.keys(dataToReturn).map(key => {
          dataToReturn[key] =
            parseInt(dataToReturn[key], 10) + parseInt(dashboardData[key], 10);
        });
      });

      return dataToReturn;
    } else if (role === ROLE_COLLEGE_ADMIN) {
      if (query.isRpc) {
        query = _.omit(query, ["isRpc"], ["rpc"]);
        _.assign(
          query,
          { country: "1" },
          { state: userInfo.state },
          { rpc: userInfo.rpc }
        );
      } else {
        const collegeContactId = await strapi.plugins[
          "crm-plugin"
        ].services.contact.getCollegeContactIdUsingCollegeAdminContactId(
          userInfo.contact
        );
        query = _.omit(query, ["isRpc"], ["rpc"], ["zone"], ["contact"]);
        _.assign(
          query,
          { country: "1" },
          { state: userInfo.state },
          { zone: userInfo.zone },
          { rpc: userInfo.rpc },
          { contact: collegeContactId }
        );
      }

      const data = await bookshelf
        .model("dashboard")
        .where(query)
        .fetchAll()
        .then(model => model.toJSON());

      data.forEach(dashboardData => {
        Object.keys(dataToReturn).map(key => {
          dataToReturn[key] =
            parseInt(dataToReturn[key], 10) + parseInt(dashboardData[key], 10);
        });
      });
      return dataToReturn;
    } else if (role === ROLE_ZONAL_ADMIN) {
      query = _.omit(query, ["zone"]);
      _.assign(
        query,
        { country: "1" },
        { state: userInfo.state },
        { zone: userInfo.zone }
      );
    }

    const data = await bookshelf
      .model("dashboard")
      .where(query)
      .fetchAll()
      .then(model => model.toJSON());

    data.forEach(dashboardData => {
      Object.keys(dataToReturn).map(key => {
        dataToReturn[key] =
          parseInt(dataToReturn[key], 10) + parseInt(dashboardData[key], 10);
      });
    });
    return dataToReturn;
  },

  async addDashboardData(ctx) {
    if (!ctx.state.user) {
      return ctx.response.badRequest(
        "You don't have permission to access this information"
      );
    }

    const allColleges = await strapi
      .query("organization", PLUGIN)
      .find({ _limit: -1 });

    return await strapi.services.dashboard.createDashboardData(allColleges);
  }
};
