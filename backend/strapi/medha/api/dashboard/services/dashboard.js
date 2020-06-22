"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */
const utils = require("../../../config/utils");
const {
  PLUGIN,
  DASHBOARD_START_DATE,
  ROLE_STUDENT
} = require("../../../config/constants");
const _ = require("lodash");
const moment = require("moment");

module.exports = {
  getOverallWorkshops: async orgId => {
    const data = await strapi
      .query("activity", PLUGIN)
      .find({ "contact.organization": orgId });
    console.log(data);
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
        state: (org.state && org.state.id) || ""
      };
      return result;
    }, {});

    return response;
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

  getPlacementStudentFeedbackCount: async orgId => {},

  getPlacementTPOFeedbackCount: async orgId => {},

  getPlacementCollegeFeedbackCount: async orgId => {},

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
  }
};
