"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */
const _ = require("lodash");
const { PLUGIN } = require("../../../config/constants");
const { sanitizeEntity, buildQuery } = require("strapi-utils");
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

module.exports = {
  getIndividuals: async (eventId, collegeId, filters) => {
    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Student" });

    const registeredStudentsForEvent = await strapi
      .query("event-registration")
      .find({
        event: eventId
      });

    const registeredStudentContactIds = registeredStudentsForEvent.map(
      rsfe => rsfe.contact.id
    );

    let response = await strapi
      .query("contact", PLUGIN)
      .model.query(
        buildQuery({
          model: strapi.query("contact", PLUGIN).model,
          filters
        })
      )
      .fetchAll()
      .then(model => model.toJSON());

    /**
     * Filtering student with user role
     * then with organization Id
     * then with is_verified to true
     */
    const filtered = response.reduce((result, contact) => {
      const { user, individual } = contact;
      if (
        user &&
        individual &&
        user.role == studentRole.id &&
        individual.organization == collegeId &&
        individual.is_verified &&
        !_.includes(registeredStudentContactIds, contact.id)
      ) {
        contact.user = sanitizeUser(user);
        delete contact.activityassignees;
        result.push(contact);
      }
      return result;
    }, []);

    return filtered;
  },

  getEvents: async (college, events) => {
    const filtered = events.filter(event => {
      const { contacts, rpc, zone, state } = event;

      /**
       * Since colleges might be empty array
       * If Event has particular colleges then filter by colleges
       * If Event has RPC and Zone then get student college's RPC and Zone
       * If Event has either RPC or Zone then get student college's RPC or Zone
       *
       *
       * TODO:
       * Since college don't have state attribute in their schema we need to filter state either
       * from RPC or Zone
       * Currently we only have one state so we are returning event directly
       * since it won't affect response
       * But when we have case where we have more than 1 state then in that case we'll filter
       * state either from rpc or zone from college
       */

      const isCollegesExist = contacts.length > 0 ? true : false;
      const isRPCExist = rpc && Object.keys(rpc).length > 0 ? true : false;
      const isZoneExist = zone && Object.keys(zone).length > 0 ? true : false;
      const isStateExist =
        state && Object.keys(state).length > 0 ? true : false;

      if (isRPCExist && isZoneExist && !isCollegesExist) {
        if (rpc.id == college.rpc.id && zone.id == college.zone.id)
          return event;
      } else if (isRPCExist && !isCollegesExist) {
        if (rpc.id == college.rpc.id) return event;
      } else if (isZoneExist && !isCollegesExist) {
        if (zone.id == college.zone.id) return event;
      } else if (isCollegesExist) {
        const isExist = contacts.filter(c => c.organization == college.id);
        if (isExist && isExist.length > 0) return event;
      } else {
        return event;
      }
    });

    return filtered;
  }
};
