"use strict";

/**
 * `addAcademicYear` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In addAcademicYear policy.");
  let currentDate = new Date();

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

  if (ctx.request.files && ctx.request.body.data) {
    let { data } = ctx.request.body;
    data = JSON.parse(data);
    ctx.request.body.data = JSON.stringify(
      Object.assign(data, {
        academic_year: academicYearId
      })
    );
  } else {
    ctx.request.body.academic_year = academicYearId;
  }

  await next();
};
