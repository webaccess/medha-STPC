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
  getUsers: async (collegeId) => {
    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Student" });

    const response = await strapi
      .query("user", "users-permissions")
      .find({ college: collegeId, role: studentRole.id });

    const userIds = response.map((user) => user.id);
    return userIds;
  },
};
