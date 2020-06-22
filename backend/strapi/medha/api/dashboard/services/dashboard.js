"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */
const utils = require("../../../config/utils");
const { PLUGIN, DASHBOARD_START_DATE } = require("../../../config/constants");
const _ = require("lodash");
const moment = require("moment");

module.exports = {
  getOverallWorkshops: async orgId => {
    const org = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: orgId }, [
        "organization.rpc",
        "organization.zone",
        "state"
      ]);

    const overallWorkshops = await strapi
      .query("activity", PLUGIN)
      .find({ "contact.organization": orgId, "activitytype.name": "Workshop" });

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
        Workshops: data ? data.length : 0,
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

  getPlacementAttendedCount: async orgId => {},

  getPlacementPlacedCount: async orgId => {},

  getPlacementSelectedCount: async orgId => {},

  getPlacementStudentFeedbackCount: async orgId => {},

  getPlacementTPOFeedbackCount: async orgId => {},

  getPlacementCollegeFeedbackCount: async orgId => {}
};
