"use strict";

/**
 * `uploadAllowed` policy.
 */
const { PLUGIN } = require("../constants");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In uploadAllowed policy.");
  const data = ctx.request.body;
  let user = ctx.state.user;
  if (data.ref === "individual") {
    if (user.role.name === "Student") {
      console.log("in cstudent role");
      const student = await strapi
        .query("individual", PLUGIN)
        .findOne({ id: data.refId });
      if (!student) {
        return ctx.response.badRequest("user doesn't exist");
      } else {
        await next();
      }
    } else if (user.role.name === "College Admin") {
      console.log("in college admin");
      user = await strapi
        .query("contact", PLUGIN)
        .findOne({ id: user.contact });

      const student = await strapi
        .query("individual", PLUGIN)
        .findOne({ id: data.refId });

      if (student.organization.id === user.individual.organization) {
        console.log("in college admin");
        await next();
      } else {
        return ctx.response.unauthorized(
          "You don't have permission to do this."
        );
      }
    } else {
      return ctx.response.unauthorized("You don't have permission to do this.");
    }
  } else {
    await next();
  }
  // await next();
};
