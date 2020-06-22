"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/bookshelf.js");
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: "5432",
    user: "postgres",
    password: "root",
    database: "medha"
  }
});
const {
  convertRestQueryParams,
  buildQuery,
  sanitizeEntity
} = require("strapi-utils");
const {
  PLUGIN,
  ROLE_MEDHA_ADMIN,
  ROLE_COLLEGE_ADMIN,
  ROLE_ZONAL_ADMIN,
  DASHBOARD_START_DATE,
  DASHBOARDKEYS
} = require("../../../config/constants");
const utils = require("../../../config/utils.js");

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

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
      PlannedVsAchieved: 0,
      UniqueStudents: 0,
      Institutionstouched: 0,
      IndustrialVisitAttendance: 0,
      IndustrialVisitPlannedVsAchieved: 0,
      IndustrialVisitStudentFeedback: 0,
      IndustrialVisitTPOFeedback: 0,
      PlacementAttended: 0,
      PlacementSelected: 0,
      PlacementStudentFeedback: 0,
      PlacementTPOFeedback: 0,
      PlacementCollegeFeedback: 0,
      SecondYear: 0
    };

    /** getting data for medha admin */
    if (role === ROLE_MEDHA_ADMIN) {
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
    var finalData = [];
    var allColleges = [];

    if (ctx.state.user !== undefined) {
      const userInfo = ctx.state.user;
      const role = userInfo.role.name;
      /** Truncate entire table */

      if (role === ROLE_MEDHA_ADMIN) {
        /** If from medha admin truncate entire table */
        await knex("dashboards").truncate();
        allColleges = await bookshelf
          .model("organization")
          .fetchAll()
          .then(model => model.toJSON());
        allColleges = [allColleges[0], allColleges[1]];
      }
    } else {
      let { fromScript } = ctx.request.query;
      if (fromScript) {
        await knex("dashboards").truncate();
        /**  */
        allColleges = await bookshelf
          .model("organization")
          .fetchAll()
          .then(model => model.toJSON());
      }
    }
    const months = utils.getMonthsBetweenDates(DASHBOARD_START_DATE);

    /** Colleges loop */
    await utils.asyncForEach(allColleges, async college => {
      let finalJson = {};
      /** Overall Workshops */
      let overallWorkshops = await strapi.services.dashboard.getOverallWorkshops(
        college.id
      );
      /** First Workshops */
      let firstYearWorkshop = await strapi.services.dashboard.getFirstYearWorkshop(
        college.id
      );
      /** Second Workshops */
      let secondYearWorkshop = await strapi.services.dashboard.getSecondYearWorkshop(
        college.id
      );
      /** Final Workshops */
      let finalYearWorkshop = await strapi.services.dashboard.getFinalYearWorkshop(
        college.id
      );
      /** Entrepreneurship */
      let entrepreneurship = await strapi.services.dashboard.getFutureAspirations(
        college.id,
        "Entrepreneurship"
      );
      /** First Year Attendence */
      let firstYearAttendence = await strapi.services.dashboard.getWorkshopFirstYearAttendenceCount(
        college.id
      );
      /** Second Year Attendence */
      let secondYearAttendence = await strapi.services.dashboard.getWorkshopSecondYearAttendenceCount(
        college.id
      );
      /** Third Year Attendence */
      let thirdYearAttendence = await strapi.services.dashboard.getWorkshopThirdYearAttendenceCount(
        college.id
      );
      /** Overall Industrial Visits */
      let getOverallIndustrialVisits = await strapi.services.dashboard.getOverallIndustrialVisits(
        college.id
      );
      let getPlacementCount = await strapi.services.dashboard.getPlacementCount(
        college.id
      );
      finalJson = _.merge(
        {},
        overallWorkshops,
        getOverallIndustrialVisits,
        firstYearWorkshop,
        secondYearWorkshop,
        finalYearWorkshop,
        entrepreneurship,
        getPlacementCount,
        firstYearAttendence,
        secondYearAttendence,
        thirdYearAttendence
      );
      months.map(m => {
        finalData.push(finalJson[m]);
      });
    });
    let dashboardData = [];
    finalData.map(data => {
      let count = 0;
      DASHBOARDKEYS.map(key => {
        if (data.hasOwnProperty(key)) {
          if (data[key] !== 0) {
            count += 1;
          }
        }
      });
      if (count !== 0) {
        dashboardData.push(data);
      }
    });
    return { dashboardData };
  }
};
