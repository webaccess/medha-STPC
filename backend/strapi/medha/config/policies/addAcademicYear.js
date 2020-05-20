"use strict";

/**
 * `addAcademicYear` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In addAcademicYear policy.");
  let { data } = ctx.request.body;
  let currentDate = new Date();
  if (data) {
    // logic to get academic year id
    let academicYear = await strapi.query("academic-year").find();

    currentDate = currentDate.getTime();

    academicYear = academicYear.filter(academicYear => {
      const startDate = new Date(academicYear.start_date).getTime();
      const endDate = new Date(academicYear.end_date).getTime();
      if (startDate < currentDate && currentDate < endDate) {
        return academicYear;
      }
    });
    const academicYearId = academicYear[0].id;
    data = JSON.parse(data);
    ctx.request.body.data = JSON.stringify(
      Object.assign(data, {
        academic_year: academicYearId
      })
    );
  }

  await next();
};
