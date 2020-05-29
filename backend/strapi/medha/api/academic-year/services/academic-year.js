"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  getCurrentAcademicYear: async () => {
    let currentDate = new Date();

    // logic to get academic year id
    let academicYear = await strapi.query("academic-year").find();

    currentDate = currentDate.getTime();

    const currentAcademicYear = academicYear.filter(academicYear => {
      const startDate = new Date(academicYear.start_date).getTime();
      const endDate = new Date(academicYear.end_date).getTime();
      if (startDate < currentDate && currentDate < endDate) {
        return academicYear;
      }
    });

    return currentAcademicYear.length > 0 ? currentAcademicYear[0].id : null;
  }
};
