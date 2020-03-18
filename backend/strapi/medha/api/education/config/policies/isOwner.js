"use strict";

/**
 * `isOwner` policy.
 * Only Medha admin and owner of education can create/update/delete entries
 */

module.exports = async (ctx, next) => {
  const { role, id } = ctx.state.user;

  if (ctx.request.method === "POST") {
    const {
      student: studentId,
      qualification,
      marks,
      year_of_passing: yearOfPassing
    } = ctx.request.body;

    if (!studentId) {
      return ctx.response.badRequest("Student is compulsory");
    }
    if (!qualification) {
      return ctx.response.badRequest("Qualification is compulsory");
    }
    if (!marks) {
      return ctx.response.badRequest("Marks is compulsory");
    }
    if (!yearOfPassing) {
      return ctx.response.badRequest("Year Of Passing is compulsory");
    }

    const student = await strapi.query("student").findOne({ id: studentId });

    if (!student) {
      return ctx.response.notFound("Student does not exist");
    }

    if (
      !(student.user.id === ctx.state.user.id || role.name === "Medha Admin")
    ) {
      return ctx.response.unauthorized("You don't have permission to do this");
    }
  }

  // TODO: Which all admins can update/delete student education details
  if (ctx.request.method === "PUT" || ctx.request.method === "DELETE") {
    const education = await strapi
      .query("education")
      .findOne({ id: ctx.params.id });

    if (!(role.name === "Medha Admin" || education.student.user === id)) {
      return ctx.response.unauthorized("You don't have permission to do this");
    }
  }

  await next();
};
