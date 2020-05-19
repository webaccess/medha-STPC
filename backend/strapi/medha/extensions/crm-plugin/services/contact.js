"use strict";

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
  }
};
