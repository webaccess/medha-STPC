"use strict";

/**
 * `addAcademicYear` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.

  const academicYearId = await strapi.services[
    "academic-year"
  ].getCurrentAcademicYear();

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
