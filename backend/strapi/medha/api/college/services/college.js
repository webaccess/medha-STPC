"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
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
      .find({ college: collegeId, role: studentRole.id });

    const userIds = response.map(user => user.id);
    return userIds;
  },

  getEvents: async (college, events) => {
    const filtered = events.filter(event => {
      const { colleges, rpc, zone } = event;

      /**
       * Since colleges might be empty array
       * If Event has particular colleges then filter by colleges
       * If Event has RPC and Zone then get student college's RPC and Zone
       * If Event has either RPC or Zone then get student college's RPC or Zone
       */

      const isCollegesExist = colleges.length > 0 ? true : false;
      const isRPCExist = rpc && Object.keys(rpc).length > 0 ? true : false;
      const isZoneExist = zone && Object.keys(zone).length > 0 ? true : false;

      if (isRPCExist && isZoneExist && !isCollegesExist) {
        if (rpc.id == college.rpc && zone.id == college.zone) return event;
      } else if (isRPCExist && !isCollegesExist) {
        if (rpc.id == college.rpc) return event;
      } else if (isZoneExist && !isCollegesExist) {
        if (zone.id == college.zone) return event;
      } else {
        const isExist = colleges.filter(c => c.id == college.id);
        if (isExist && isExist.length > 0) return event;
      }
    });

    return filtered;
  }
};
