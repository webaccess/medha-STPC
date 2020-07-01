"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const utils = require("../../../config/utils");
const {
  PLUGIN,
  ROLE_STUDENT,
  ROLE_COLLEGE_ADMIN,
  DASHBOARDKEYS
} = require("../../../config/constants");
const _ = require("lodash");
const moment = require("moment");
const bookshelf = require("../../../config/bookshelf");

module.exports = {
  getTotalStudentFeedback: async orgId => {
    return await strapi.services.dashboard.getTotalFeedback(
      orgId,
      ROLE_STUDENT,
      "TotalStudentFeedback"
    );
  },

  getTotalTpoFeedback: async orgId => {
    return await strapi.services.dashboard.getTotalFeedback(
      orgId,
      ROLE_COLLEGE_ADMIN,
      "TotalTPOFeedback"
    );
  },

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

  getStudentsFeedbackForWorkshops: async orgId => {
    return await strapi.services.dashboard.getActivitiesFeedbackCountByRoleandType(
      orgId,
      ROLE_STUDENT,
      "StudentFeedback",
      "Workshop"
    );
  },

  getCollegeFeedbackForWorkshops: async orgId => {
    return await strapi.services.dashboard.getActivitiesFeedbackCountByRoleandType(
      orgId,
      ROLE_COLLEGE_ADMIN,
      "TPOFeedback",
      "Workshop"
    );
  },

  getStudentsFeedbackForIndustrialVisit: async orgId => {
    return await strapi.services.dashboard.getActivitiesFeedbackCountByRoleandType(
      orgId,
      ROLE_STUDENT,
      "IndustrialVisitStudentFeedback",
      "Industrial Visit"
    );
  },

  getCollegeFeedbackForIndustrialVisit: async orgId => {
    return await strapi.services.dashboard.getActivitiesFeedbackCountByRoleandType(
      orgId,
      ROLE_COLLEGE_ADMIN,
      "IndustrialVisitTPOFeedback",
      "Industrial Visit"
    );
  },

  // getPLannedVsAchievedWorkshops: async orgId => {
  //   return await strapi.services.dashboard.getPlannedVsAchieved(
  //     orgId,
  //     "PlannedVsAchieved",
  //     "Workshop"
  //   );
  // },

  // getPLannedVsAchievedIndustrialVisits: async orgId => {
  //   return await strapi.services.dashboard.getPlannedVsAchieved(
  //     orgId,
  //     "IndustrialVisitPlannedVsAchieved",
  //     "Industrial Visit"
  //   );
  // },

  // getPlannedVsAchieved: async (
  //   orgId,
  //   key,
  //   type
  // ) => {
  //   const country = await strapi
  //     .query("country", PLUGIN)
  //     .findOne({ name: "India" });

  //   const org = await strapi
  //     .query("contact", PLUGIN)
  //     .findOne({ id: orgId }, [
  //       "organization.rpc",
  //       "organization.zone",
  //       "state"
  //     ]);

  //   /** Get overall workshops */
  //   let overallActivities;
  //   overallActivities = await strapi.query("activity", PLUGIN).find({
  //     contact: orgId,
  //     "activitytype.name": type,

  //   });

  //   /** This gets activity ids */
  //   const activityIds = overallActivities.map(activity => activity.id);

  //   // Getting placement attendance for given list of events
  //   const query = {};
  //   query.activity_in = activityIds;
  //   query.role = role.id;

  //   const feedback = await strapi.query("feedback-set").find(query);

  //   // Getting months between dates
  //   const months = utils.getMonthsBetweenDates();

  //   // Grouping feedback by month
  //   const groupByMonth = _.groupBy(feedback, fb => {
  //     const { activity } = fb;
  //     return moment(activity.start_date_time).format("M yyyy");
  //   });

  //   const response = months.reduce((result, m) => {
  //     const [month, year] = m.split(" ");
  //     const data = groupByMonth[m];
  //     result[m] = {
  //       contact: orgId,
  //       Month: parseInt(month),
  //       Year: parseInt(year),
  //       [key]: data ? data.length : 0,
  //       rpc:
  //         (org.organization &&
  //           org.organization.rpc &&
  //           org.organization.rpc.id) ||
  //         "",
  //       zone:
  //         (org.organization &&
  //           org.organization.zone &&
  //           org.organization.zone.id) ||
  //         "",
  //       state: (org.state && org.state.id) || "",
  //       country: country.id,
  //       contact: org.id
  //     };
  //     return result;
  //   }, {});

  //   return response;
  // },

  getUniqueStudents: async orgId => {
    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });

    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    let overallWorkshops;

    overallWorkshops = await strapi.query("activity", PLUGIN).find(
      {
        contact: orgId,
        "activitytype.name": "Workshop"
      },
      ["activityassignees", "activityassignees.contact"]
    );
    var finalList = [];
    await utils.asyncForEach(overallWorkshops, async workshop => {
      const { start_date_time } = workshop;
      await utils.asyncForEach(workshop.activityassignees, async student => {
        if (student.is_verified_by_college) {
          student.start_date_time = start_date_time;
          finalList.push(student);
        }
      });
    });

    // // Getting months between dates
    const months = utils.getMonthsBetweenDates();

    // Grouping placements monthwise
    const groupByMonth = _.groupBy(finalList, student => {
      const { start_date_time } = student;
      return moment(start_date_time).format("M yyyy");
    });

    months.map(m => {
      if (groupByMonth.hasOwnProperty(m)) {
        let finalArray = [];
        groupByMonth[m].map(studentInfo => {
          let noOfInstancesPresent = 0;
          groupByMonth[m].map(s => {
            if (studentInfo.contact.id === s.contact.id) {
              noOfInstancesPresent += 1;
            }
          });
          if (noOfInstancesPresent === 1) {
            finalArray.push(studentInfo);
          }
        });
        groupByMonth[m] = finalArray;
      }
    });

    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        Month: parseInt(month),
        Year: parseInt(year),
        UniqueStudents: data ? data.length : 0,
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
        country: country.id,
        contact: org.id
      };
      return result;
    }, {});
    return response;
  },

  getTotalFeedback: async (orgId, roleName, key) => {
    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });

    const role = await strapi
      .query("role", "users-permissions")
      .findOne({ name: roleName }, []);

    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);
    let ids = [];
    if (roleName === ROLE_COLLEGE_ADMIN) {
      ids = await strapi.plugins[
        "crm-plugin"
      ].services.contact.getCollegeAdminsFromCollege(orgId);
    } else if (roleName === ROLE_STUDENT) {
      ids = await strapi.plugins[
        "crm-plugin"
      ].services.contact.getStudentsOfCollege(orgId);
    }

    const query = {};
    query.contact_in = ids;
    query.role = role.id;

    const feedback = await strapi.query("feedback-set").find(query);

    // Getting months between dates
    const months = utils.getMonthsBetweenDates();

    // Grouping feedback by month
    const groupByMonth = _.groupBy(feedback, fb => {
      let start_date_time;
      if (fb.activity) {
        start_date_time = fb.activity.start_date_time;
      } else if (fb.event) {
        start_date_time = fb.event.start_date_time;
      }
      return moment(start_date_time).format("M yyyy");
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
        country: country.id,
        contact: org.id
      };
      return result;
    }, {});

    return response;
  },

  getWorkShopByYear: async (orgId, year = "") => {
    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });

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
        contact: orgId,
        "activitytype.name": "Workshop"
      });
    } else {
      overallWorkshops = await strapi.query("activity", PLUGIN).find({
        contact: orgId,
        "activitytype.name": "Workshop",
        education_year: year
      });
    }

    // Getting months between dates
    const months = utils.getMonthsBetweenDates();

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
        country: country.id,
        contact: org.id
      };
      return result;
    }, {});
    return response;
  },

  /**
   * Getting activities feedback from student, college admin and TPO
   * roleName could be college admin and student
   * key is dashboard column name
   */
  getActivitiesFeedbackCountByRoleandType: async (
    orgId,
    roleName,
    key,
    type
  ) => {
    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });

    const role = await strapi
      .query("role", "users-permissions")
      .findOne({ name: roleName }, []);

    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    /** Get overall workshops */
    let overallActivities;
    overallActivities = await strapi.query("activity", PLUGIN).find({
      contact: orgId,
      "activitytype.name": type
    });

    /** This gets activity ids */
    const activityIds = overallActivities.map(activity => activity.id);

    // Getting placement attendance for given list of events
    const query = {};
    query.activity_in = activityIds;
    query.role = role.id;

    const feedback = await strapi.query("feedback-set").find(query);

    // Getting months between dates
    const months = utils.getMonthsBetweenDates();

    // Grouping feedback by month
    const groupByMonth = _.groupBy(feedback, fb => {
      const { activity } = fb;
      return moment(activity.start_date_time).format("M yyyy");
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
        country: country.id,
        contact: org.id
      };
      return result;
    }, {});

    return response;
  },

  getInsititutionsTouched: async orgId => {
    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });

    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    let overallWorkshops;

    overallWorkshops = await strapi.query("activity", PLUGIN).find({
      contact: orgId,
      "activitytype.name": "Workshop"
    });

    // Getting months between dates
    const months = utils.getMonthsBetweenDates();

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
        Institutionstouched: data ? 1 : 0,
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
        country: country.id,
        contact: org.id
      };
      return result;
    }, {});
    return response;
  },

  getWorkShopAttendenceCount: async (orgId, year, key) => {
    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });

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
      contact: orgId,
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
    const months = utils.getMonthsBetweenDates();

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
        country: country.id,
        contact: org.id
      };
      return result;
    }, {});
    return response;
  },

  getFutureAspirations: async (orgId, value) => {
    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });

    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    let overallWorkshops;

    overallWorkshops = await strapi.query("activity", PLUGIN).find(
      {
        contact: orgId,
        "activitytype.name": "Workshop"
      },
      ["activityassignees", "activityassignees.contact"]
    );
    var finalList = [];
    await utils.asyncForEach(overallWorkshops, async workshop => {
      const { start_date_time } = workshop;
      await utils.asyncForEach(workshop.activityassignees, async student => {
        if (student.is_verified_by_college) {
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
        }
      });
    });

    // Getting months between dates
    const months = utils.getMonthsBetweenDates();

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
        country: country.id,
        contact: org.id
      };
      return result;
    }, {});
    return response;
  },

  getOverallIndustrialVisits: async orgId => {
    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });

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
        contact: orgId,
        "activitytype.name": "Industrial Visit"
      });

    // Getting months between dates
    const months = utils.getMonthsBetweenDates();

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
        country: country.id,
        contact: org.id
      };
      return result;
    }, {});
    return response;
  },

  getPlacementCount: async orgId => {
    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });

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
    const months = utils.getMonthsBetweenDates();

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
        country: country.id,
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
    const country = await strapi
      .query("country", PLUGIN)
      .findOne({ name: "India" });
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
    const months = utils.getMonthsBetweenDates();

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
        state: (org.state && org.state.id) || "",
        country: country.id,
        contact: org.id
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
      .findOne({ name: roleName }, []);

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
    const months = utils.getMonthsBetweenDates();

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
        country: country.id,
        contact: org.id
      };
      return result;
    }, {});

    return response;
  },

  getIndustrialVisitAttendanceCount: async orgId => {
    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    const activityType = await strapi
      .query("activitytype", PLUGIN)
      .findOne({ name: "Industrial Visit" });

    const attendance = await strapi.query("activityassignee", PLUGIN).find({
      "activity.activitytype": activityType.id,
      is_verified_by_college: true,
      "activity.contact": orgId
    });

    // Getting months between dates
    const months = utils.getMonthsBetweenDates();

    // Grouping placements monthwise
    const groupByMonth = _.groupBy(attendance, attendance => {
      const { created_at } = attendance;
      return moment(created_at).format("M yyyy");
    });
    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        contact: orgId,
        Month: parseInt(month),
        Year: parseInt(year),
        IndustrialVisitAttendance: data ? data.length : 0,

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
  getPlannedWorkshops: async orgId => {
    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    const activityType = await strapi
      .query("activitytype", PLUGIN)
      .findOne({ name: "Workshop" });

    const activity = await strapi.query("activity", PLUGIN).find({
      activitytype: activityType.id,
      contact: orgId
    });

    const months = utils.getMonthsBetweenDates();

    // Grouping placements monthwise
    const groupByMonth = _.groupBy(activity, activity => {
      const { created_at } = activity;
      return moment(created_at).format("M yyyy");
    });
    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        contact: orgId,
        Month: parseInt(month),
        Year: parseInt(year),
        PlannedWorkshops: data ? data.length : 0,

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

  getAchievedWorkshops: async orgId => {
    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    const activityType = await strapi
      .query("activitytype", PLUGIN)
      .findOne({ name: "Workshop" });

    const activity = await strapi.query("activity", PLUGIN).find({
      activitytype: activityType.id,
      activity_status: "completed",
      contact: orgId
    });

    const months = utils.getMonthsBetweenDates();

    // Grouping placements monthwise
    const groupByMonth = _.groupBy(activity, activity => {
      const { created_at } = activity;
      return moment(created_at).format("M yyyy");
    });
    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        contact: orgId,
        Month: parseInt(month),
        Year: parseInt(year),
        AchievedWorkshops: data ? data.length : 0,

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

  getPlannedIndustrialVisit: async orgId => {
    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    const activityType = await strapi
      .query("activitytype", PLUGIN)
      .findOne({ name: "Industrial Visit" });

    const activity = await strapi.query("activity", PLUGIN).find({
      activitytype: activityType.id,
      contact: orgId
    });

    const months = utils.getMonthsBetweenDates();

    // Grouping placements monthwise
    const groupByMonth = _.groupBy(activity, activity => {
      const { created_at } = activity;
      return moment(created_at).format("M yyyy");
    });
    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        contact: orgId,
        Month: parseInt(month),
        Year: parseInt(year),
        PlannedIndustrialVisit: data ? data.length : 0,

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

  getAchievedIndustrialVisit: async orgId => {
    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    const activityType = await strapi
      .query("activitytype", PLUGIN)
      .findOne({ name: "Industrial Visit" });

    const activity = await strapi.query("activity", PLUGIN).find({
      activitytype: activityType.id,
      activity_status: "completed",
      contact: orgId
    });

    const months = utils.getMonthsBetweenDates();

    // Grouping placements monthwise
    const groupByMonth = _.groupBy(activity, activity => {
      const { created_at } = activity;
      return moment(created_at).format("M yyyy");
    });
    const response = months.reduce((result, m) => {
      const [month, year] = m.split(" ");
      const data = groupByMonth[m];
      result[m] = {
        contact: orgId,
        Month: parseInt(month),
        Year: parseInt(year),
        AchievedIndustrialVisit: data ? data.length : 0,

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
  createDashboardData: async colleges => {
    let finalData = [];
    let dataToReturn = [];
    /** Colleges loop */
    /**
     * Making dashboard entry in dashboard history with status pending
     * Deleting data for current month
     * Updating data for current month
     */
    await bookshelf.knex("dashboard_histories").truncate();
    const dashboardHistory = await strapi
      .query("dashboard-history")
      .create({ status: "pending" });

    await strapi.services.dashboard.clearDashboardRecordsByMonth();

    await utils.asyncForEach(colleges, async college => {
      let finalJson = {};
      /** Overalll workshops */
      let overallWorkshops = await strapi.services.dashboard.getOverallWorkshops(
        college.contact.id
      );

      /** First Workshops */
      let firstYearWorkshop = await strapi.services.dashboard.getFirstYearWorkshop(
        college.contact.id
      );
      /** Second Workshops */
      let secondYearWorkshop = await strapi.services.dashboard.getSecondYearWorkshop(
        college.contact.id
      );
      /** Final Workshops */
      let finalYearWorkshop = await strapi.services.dashboard.getFinalYearWorkshop(
        college.contact.id
      );
      /** Entrepreneurship */
      let entrepreneurship = await strapi.services.dashboard.getFutureAspirations(
        college.contact.id,
        "Entrepreneurship"
      );
      /** First Year Attendence */
      let firstYearAttendence = await strapi.services.dashboard.getWorkshopFirstYearAttendenceCount(
        college.contact.id
      );
      /** Second Year Attendence */
      let secondYearAttendence = await strapi.services.dashboard.getWorkshopSecondYearAttendenceCount(
        college.contact.id
      );
      /** Third Year Attendence */
      let thirdYearAttendence = await strapi.services.dashboard.getWorkshopThirdYearAttendenceCount(
        college.contact.id
      );

      /** Planned Workshops*/
      let plannedWorkshops = await strapi.services.dashboard.getPlannedWorkshops(
        college.contact.id
      );

      /** Acheived Workshops*/
      let achievedWorkshops = await strapi.services.dashboard.getAchievedWorkshops(
        college.contact.id
      );

      /** Planned Industrial visits*/
      let plannedIndustrialVisit = await strapi.services.dashboard.getPlannedIndustrialVisit(
        college.contact.id
      );

      /** Achieved Industrial visits*/
      let achievedIndustrialVisit = await strapi.services.dashboard.getAchievedIndustrialVisit(
        college.contact.id
      );

      // /** PlannedVsAttended Workshops*/
      // let plannedVsAchievedWorkshops = await strapi.services.dashboard.getPLannedVsAchievedWorkshops(
      //   college.contact.id
      // );

      // /** PlannedVsAttended Industrial visits*/
      // let plannedVsAchievedIndustrial = await strapi.services.dashboard.getPLannedVsAchievedIndustrialVisits(
      //   college.contact.id
      // );

      /** Unique Students */
      let uniqueStudents = await strapi.services.dashboard.getUniqueStudents(
        college.contact.id
      );
      /** Instittions touched */
      let insititutionsTouched = await strapi.services.dashboard.getInsititutionsTouched(
        college.contact.id
      );
      /** student feedback for workshop */
      let workshopsStudentsFeedback = await strapi.services.dashboard.getStudentsFeedbackForWorkshops(
        college.contact.id
      );
      /** college feedback for workshop */
      let workshopsCollegeFeedback = await strapi.services.dashboard.getCollegeFeedbackForWorkshops(
        college.contact.id
      );

      /** student feedback for industrial visit */
      let industrialStudentsFeedback = await strapi.services.dashboard.getStudentsFeedbackForIndustrialVisit(
        college.contact.id
      );

      /** college feedback for industrial visit */
      let industrialCollegeFeedback = await strapi.services.dashboard.getCollegeFeedbackForIndustrialVisit(
        college.contact.id
      );

      let getOverallIndustrialVisits = await strapi.services.dashboard.getOverallIndustrialVisits(
        college.contact.id
      );

      let getPlacementCount = await strapi.services.dashboard.getPlacementCount(
        college.contact.id
      );

      let getPlacementAttendedCount = await strapi.services.dashboard.getPlacementAttendedCount(
        college.contact.id
      );

      let getPlacementSelectedCount = await strapi.services.dashboard.getPlacementSelectedCount(
        college.contact.id
      );

      let getPlacementStudentFeedbackCount = await strapi.services.dashboard.getPlacementStudentFeedbackCount(
        college.contact.id
      );

      let getPlacementTPOFeedbackCount = await strapi.services.dashboard.getPlacementTPOFeedbackCount(
        college.contact.id
      );

      let getPlacementCollegeFeedbackCount = await strapi.services.dashboard.getPlacementCollegeFeedbackCount(
        college.contact.id
      );

      let getIndustrialVisitAttendanceCount = await strapi.services.dashboard.getIndustrialVisitAttendanceCount(
        college.contact.id
      );

      finalJson = _.merge(
        {},
        overallWorkshops,
        firstYearWorkshop,
        secondYearWorkshop,
        finalYearWorkshop,
        entrepreneurship,
        firstYearAttendence,
        secondYearAttendence,
        thirdYearAttendence,
        uniqueStudents,
        insititutionsTouched,
        workshopsStudentsFeedback,
        workshopsCollegeFeedback,
        getOverallIndustrialVisits,
        industrialStudentsFeedback,
        industrialCollegeFeedback,
        getPlacementCount,
        getPlacementAttendedCount,
        getPlacementSelectedCount,
        getPlacementStudentFeedbackCount,
        getPlacementTPOFeedbackCount,
        getPlacementCollegeFeedbackCount,
        getIndustrialVisitAttendanceCount,
        plannedWorkshops,
        achievedWorkshops,
        plannedIndustrialVisit,
        achievedIndustrialVisit
      );
      finalData = [...finalData, ...Object.values(finalJson)];
    });

    let dashboardData = finalData
      .map(data => {
        let count = 0;
        DASHBOARDKEYS.map(key => {
          if (data.hasOwnProperty(key)) {
            if (data[key] !== 0) {
              count += 1;
            }
          }
        });
        if (count !== 0) {
          dataToReturn.push(data);
          return strapi
            .query("dashboard")
            .create(data)
            .then(() => "success")
            .catch(() => null);
        } else {
          return null;
        }
      })
      .filter(a => a);

    const response = await Promise.all(dashboardData);

    if (response.some(r => r == null)) {
      await strapi
        .query("dashboard-history")
        .update({ id: dashboardHistory.id }, { status: "error" });
    } else {
      await strapi
        .query("dashboard-history")
        .update({ id: dashboardHistory.id }, { status: "completed" });
    }

    if (!colleges.length) {
      const dashboardHistory = await strapi
        .query("dashboard-history")
        .create({ status: "completed" });
    }

    return {
      result: "Success"
    };
  },

  clearDashboardRecordsByMonth: async () => {
    const month = moment().month() + 1;
    console.log("Clearing data for month ", month);
    return await strapi.query("dashboard").delete({ Month: month, _limit: -1 });
  }
};
