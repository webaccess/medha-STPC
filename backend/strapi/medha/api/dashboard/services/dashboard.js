"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const utils = require("../../../config/utils");
const {
  PLUGIN,
  DASHBOARD_START_DATE,
  ROLE_STUDENT,
  ROLE_COLLEGE_ADMIN
} = require("../../../config/constants");
const _ = require("lodash");
const moment = require("moment");

module.exports = {
  getOverallWorkshops: async orgId => {
    let overallWorkshops = await strapi.services.dashboard.getWorkShopByYear(
      orgId
    );
    return overallWorkshops;
  },

  getFirstYearWorkshop: async orgId => {
    let firstYearWorkshop = await strapi.services.dashboard.getWorkShopByYear(
      orgId,
      "First"
    );
    return firstYearWorkshop;
  },

  getSecondYearWorkshop: async orgId => {
    let secondYearWorkshop = await strapi.services.dashboard.getWorkShopByYear(
      orgId,
      "Second"
    );
    return secondYearWorkshop;
  },

  getFinalYearWorkshop: async orgId => {
    let thirdYearWorkshop = await strapi.services.dashboard.getWorkShopByYear(
      orgId,
      "Third"
    );
    return thirdYearWorkshop;
  },

  getWorkshopFirstYearAttendenceCount: async orgId => {
    return await strapi.services.dashboard.getWorkShopAttendenceCount(
      orgId,
      "First",
      "is_verified_by_college"
    );
  },

  getWorkshopSecondYearAttendenceCount: async orgId => {
    return await strapi.services.dashboard.getWorkShopAttendenceCount(
      orgId,
      "Second",
      "is_verified_by_college"
    );
  },
  getWorkshopThirdYearAttendenceCount: async orgId => {
    return await strapi.services.dashboard.getWorkShopAttendenceCount(
      orgId,
      "Third",
      "is_verified_by_college"
    );
  },

  getPlacementAttendedCount: async orgId => {
    return await strapi.services.dashboard.getPlacementCountByStatus(
      orgId,
      "is_attendance_verified"
    );
  },

  getPlacementSelectedCount: async orgId => {
    return await strapi.services.dashboard.getPlacementCountByStatus(
      orgId,
      "is_hired_at_event"
    );
  },

  getPlacementStudentFeedbackCount: async orgId => {
    return await strapi.services.dashboard.getPlacementFeedbackCountByRole(
      orgId,
      ROLE_STUDENT,
      "PlacementStudentFeedback"
    );
  },

  getPlacementTPOFeedbackCount: async orgId => {
    return await strapi.services.dashboard.getPlacementFeedbackCountByRole(
      orgId,
      ROLE_COLLEGE_ADMIN,
      "PlacementTPOFeedback"
    );
  },

  getPlacementCollegeFeedbackCount: async orgId => {
    return await strapi.services.dashboard.getPlacementFeedbackCountByRole(
      orgId,
      ROLE_COLLEGE_ADMIN,
      "PlacementCollegeFeedback"
    );
  },

  getWorkShopByYear: async (orgId, year = "") => {
    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    let yearToAdd = "";
    if (year === "First") yearToAdd = "FirstYear";
    else if (year === "Second") yearToAdd = "SecondYear";
    else if (year === "Third") yearToAdd = "FinalYear";
    else if (year === "") yearToAdd = "Workshops";
    let overallWorkshops;

    if (yearToAdd === "Workshops") {
      overallWorkshops = await strapi.query("activity", PLUGIN).find({
        "contact.organization": orgId,
        "activitytype.name": "Workshop"
      });
    } else {
      overallWorkshops = await strapi.query("activity", PLUGIN).find({
        "contact.organization": orgId,
        "activitytype.name": "Workshop",
        education_year: year
      });
    }

    // Getting months between dates
    const months = utils.getMonthsBetweenDates(DASHBOARD_START_DATE);

    // Grouping placements monthwise
    const groupByMonth = _.groupBy(overallWorkshops, workshops => {
      const { start_date_time } = workshops;
      return moment(start_date_time).format("M yyyy");
    });

    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        Month: parseInt(month),
        Year: parseInt(year),
        [yearToAdd]: data ? data.length : 0,
        rpc:
          (org.organization &&
            org.organization.rpc &&
            org.organization.rpc.id) ||
          "",
        zone:
          (org.organization &&
            org.organization.zone &&
            org.organization.zone.id) ||
          "",
        state: (org.state && org.state.id) || "",
        country: (org.state && org.state.country) || "",
        contact: org.id
      };
      return result;
    }, {});
    return response;
  },

  getWorkShopAttendenceCount: async (orgId, year, key) => {
    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    let yearToAdd = "";
    if (year === "First") yearToAdd = "FirstYearAttendance";
    else if (year === "Second") yearToAdd = "SecondYearAttendance";
    else if (year === "Third") yearToAdd = "FinalYearAttendance";
    let overallWorkshops;

    overallWorkshops = await strapi.query("activity", PLUGIN).find({
      "contact.organization": orgId,
      "activitytype.name": "Workshop",
      education_year: year
    });

    let firstYearStudents = [];
    overallWorkshops.map(workshop => {
      const { start_date_time } = workshop;
      workshop.activityassignees.map(students => {
        if (students[key] === true) {
          _.assign(students, { start_date_time: start_date_time });
          firstYearStudents.push(students);
        }
      });
    });

    // Getting months between dates
    const months = utils.getMonthsBetweenDates(DASHBOARD_START_DATE);

    // Grouping placements monthwise
    const groupByMonth = _.groupBy(firstYearStudents, student => {
      const { start_date_time } = student;
      return moment(start_date_time).format("M yyyy");
    });

    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        Month: parseInt(month),
        Year: parseInt(year),
        [yearToAdd]: data ? data.length : 0,
        rpc:
          (org.organization &&
            org.organization.rpc &&
            org.organization.rpc.id) ||
          "",
        zone:
          (org.organization &&
            org.organization.zone &&
            org.organization.zone.id) ||
          "",
        state: (org.state && org.state.id) || "",
        country: (org.state && org.state.country) || "",
        contact: org.id
      };
      return result;
    }, {});
    return response;
  },

  getFutureAspirations: async (orgId, value) => {
    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    const future_aspiration_data = await strapi
      .query("futureaspirations")
      .findOne({ name: value });
    let overallWorkshops;

    overallWorkshops = await strapi.query("activity", PLUGIN).find(
      {
        "contact.organization": orgId,
        "activitytype.name": "Workshop"
      },
      ["activityassignees", "activityassignees.contact"]
    );
    var finalList = [];
    await utils.asyncForEach(overallWorkshops, async workshop => {
      const { start_date_time } = workshop;
      await utils.asyncForEach(workshop.activityassignees, async student => {
        const individual = await strapi
          .query("individual", PLUGIN)
          .findOne({ id: student.contact.individual });

        const { future_aspirations } = individual;
        let isPresent = false;
        for (let i in future_aspirations) {
          if (future_aspirations[i]["name"] == value) {
            isPresent = true;
            break;
          }
        }
        if (isPresent) {
          _.assign(student, { start_date_time: start_date_time });
          finalList.push(student);
        }
      });
    });

    // Getting months between dates
    const months = utils.getMonthsBetweenDates(DASHBOARD_START_DATE);

    // Grouping placements monthwise
    const groupByMonth = _.groupBy(finalList, student => {
      const { start_date_time } = student;
      return moment(start_date_time).format("M yyyy");
    });

    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        Month: parseInt(month),
        Year: parseInt(year),
        [value]: data ? data.length : 0,
        rpc:
          (org.organization &&
            org.organization.rpc &&
            org.organization.rpc.id) ||
          "",
        zone:
          (org.organization &&
            org.organization.zone &&
            org.organization.zone.id) ||
          "",
        state: (org.state && org.state.id) || "",
        country: (org.state && org.state.country) || "",
        contact: org.id
      };
      return result;
    }, {});
    return response;
  },

  getOverallIndustrialVisits: async orgId => {
    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    const overallIndustrialVisits = await strapi
      .query("activity", PLUGIN)
      .find({
        "contact.organization": orgId,
        "activitytype.name": "Industrial Visit"
      });

    // Getting months between dates
    const months = utils.getMonthsBetweenDates(DASHBOARD_START_DATE);

    // Grouping placements monthwise
    const groupByMonth = _.groupBy(overallIndustrialVisits, visits => {
      const { start_date_time } = visits;
      return moment(start_date_time).format("M yyyy");
    });

    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        Month: parseInt(month),
        Year: parseInt(year),
        IndustrialVisits: data ? data.length : 0,
        rpc:
          (org.organization &&
            org.organization.rpc &&
            org.organization.rpc.id) ||
          "",
        zone:
          (org.organization &&
            org.organization.zone &&
            org.organization.zone.id) ||
          "",
        state: (org.state && org.state.id) || "",
        country: (org.state && org.state.country) || "",
        contact: org.id
      };
      return result;
    }, {});
    return response;
  },

  getPlacementCount: async orgId => {
    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    // Getting all placements
    const placements = await strapi
      .query("event")
      .model.query({})
      .fetchAll()
      .then(model => {
        const data = model.toJSON();
        return data.filter(event => {
          const { contacts } = event;
          const contactIds = contacts.map(c => c.id);
          if (_.includes(contactIds, orgId) || contactIds.length == 0) {
            return event;
          }
        });
      });

    // Getting months between dates
    const months = utils.getMonthsBetweenDates(DASHBOARD_START_DATE);

    // Grouping placements monthwise
    const groupByMonth = _.groupBy(placements, placement => {
      const { start_date_time } = placement;
      return moment(start_date_time).format("M yyyy");
    });

    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        Month: parseInt(month),
        Year: parseInt(year),
        Placement: data ? data.length : 0,
        rpc:
          (org.organization &&
            org.organization.rpc &&
            org.organization.rpc.id) ||
          "",
        zone:
          (org.organization &&
            org.organization.zone &&
            org.organization.zone.id) ||
          "",
        state: (org.state && org.state.id) || "",
        country: (org.state && org.state.country) || "",
        contact: org.id
      };
      return result;
    }, {});

    return response;
  },

  /**
   * Getting placement count depending on status for given college
   */
  getPlacementCountByStatus: async (orgId, status) => {
    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    const placements = await strapi
      .query("event")
      .model.query({})
      .fetchAll()
      .then(model => {
        const data = model.toJSON();
        return data.filter(event => {
          const { contacts } = event;
          const contactIds = contacts.map(c => c.id);
          if (_.includes(contactIds, orgId) || contactIds.length == 0) {
            return event;
          }
        });
      });

    // Getting placement attendance for given list of events
    const placementIds = placements.map(placement => placement.id);

    /**
     * Getting placement status depending on status value
     * status can be is_attendance_verified or is_hired_at_event
     */
    const query = {};
    query["event_in"] = placementIds;
    query[status] = true;

    const attendance = await strapi.query("event-registration").find(query);

    // Getting months between dates
    const months = utils.getMonthsBetweenDates(DASHBOARD_START_DATE);

    // Grouping attendance by month
    const groupByMonth = _.groupBy(attendance, atd => {
      const { event } = atd;
      return moment(event.start_date_time).format("M yyyy");
    });

    const key =
      status == "is_attendance_verified"
        ? "PlacementAttended"
        : "PlacementSelected";

    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        Month: parseInt(month),
        Year: parseInt(year),
        [key]: data ? data.length : 0,
        rpc:
          (org.organization &&
            org.organization.rpc &&
            org.organization.rpc.id) ||
          "",
        zone:
          (org.organization &&
            org.organization.zone &&
            org.organization.zone.id) ||
          "",
        state: (org.state && org.state.id) || ""
      };
      return result;
    }, {});

    return response;
  },

  /**
   * Getting placement feedback from student, college admin and TPO
   * roleName could be college admin and student
   * key is dashboard column name
   */
  getPlacementFeedbackCountByRole: async (orgId, roleName, key) => {
    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });

    const role = await strapi
      .query("role", "users-permissions")
      .findOne({ name: roleName });

    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    // Getting all placements
    const placements = await strapi
      .query("event")
      .model.query({})
      .fetchAll()
      .then(model => {
        const data = model.toJSON();
        return data.filter(event => {
          const { contacts } = event;
          const contactIds = contacts.map(c => c.id);
          if (_.includes(contactIds, orgId) || contactIds.length == 0) {
            return event;
          }
        });
      });

    // Getting placement attendance for given list of events
    const placementIds = placements.map(placement => placement.id);
    const query = {};
    query.event_in = placementIds;
    query.role = role.id;

    const feedback = await strapi.query("feedback-set").find(query);
    // Getting months between dates
    const months = utils.getMonthsBetweenDates(DASHBOARD_START_DATE);

    // Grouping feedback by month
    const groupByMonth = _.groupBy(feedback, fb => {
      const { event } = fb;
      return moment(event.start_date_time).format("M yyyy");
    });

    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        contact: orgId,
        Month: parseInt(month),
        Year: parseInt(year),
        [key]: data ? data.length : 0,
        rpc:
          (org.organization &&
            org.organization.rpc &&
            org.organization.rpc.id) ||
          "",
        zone:
          (org.organization &&
            org.organization.zone &&
            org.organization.zone.id) ||
          "",
        state: (org.state && org.state.id) || "",
        country: country.id
      };
      return result;
    }, {});

    return response;
  }
};
