"use strict";

const utils = require("../../../config/utils");
const { PLUGIN } = require("../../../config/constants");
module.exports = {
  getEvents: async (contact, events) => {
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
        if (
          rpc.id == contact.organization.rpc &&
          zone.id == contact.organization.zone
        )
          return event;
      } else if (isRPCExist && !isCollegesExist) {
        if (rpc.id == contact.organization.rpc) return event;
      } else if (isZoneExist && !isCollegesExist) {
        if (zone.id == contact.organization.zone) return event;
      } else if (isCollegesExist) {
        const isExist = contacts.filter(c => c.id == contact.id);
        if (isExist && isExist.length > 0) return event;
      } else {
        return event;
      }
    });

    return filtered;
  },

  /**
   * @return {Array}
   * @param {CollegeId}
   *
   * Get all student for given college id
   */
  getUsers: async collegeId => {
    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Student" });

    const response = await strapi
      .query("user", "users-permissions")
      .find({ role: studentRole.id }, [
        "contact",
        "contact.individual",
        "contact.individual.organization"
      ]);

    const userIds = response
      .filter(
        user =>
          user.contact.individual &&
          user.contact.individual.organization &&
          user.contact.individual.organization.contact == collegeId
      )
      .map(user => user.id);
    return userIds;
  },

  /**
   * @param {ids, block}
   * ids => which ids to block or unblock
   * block => flag to block or unblock user
   */
  blockUnblockUsers: async (ctx, block) => {
    const { ids } = ctx.request.body;

    if (!ids) {
      return ctx.response.badRequest("Missing ids field");
    }

    let idsToBlock;
    if (typeof ids === "number") {
      idsToBlock = [ids];
    }

    if (typeof ids === "object") {
      idsToBlock = ids;
    }

    if (!idsToBlock.length) {
      return ctx.response.badRequest("Individual Ids are empty");
    }

    const contacts = await Promise.all(
      idsToBlock.map(async id => {
        return strapi.query("contact", PLUGIN).findOne({ id });
      })
    );

    if (contacts.some(contact => contact == null)) {
      return ctx.response.badRequest("Invalid Contact Ids");
    }

    const userIds = contacts.map(
      contact => (contact.user && contact.user.id) || null
    );

    if (userIds.some(id => id == null)) {
      return ctx.response.badRequest("Invalid User Ids or User does not exist");
    }

    await strapi
      .query("user", "users-permissions")
      .model.query(qb => {
        qb.whereIn("id", userIds);
      })
      .save({ blocked: block }, { patch: true, require: false });

    return utils.getFindOneResponse({});
  }
};
