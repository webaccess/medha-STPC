"use strict";

/**
 * `isValidCollegeAdmin` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In isValidCollegeAdmin policy.");
  const user = ctx.state.user;
  if (user.role.name === "College Admin") {
    const student = await strapi
      .query("student")
      .findOne({ id: ctx.params.id });
    if (student.user.college !== user.college)
      return ctx.response.unauthorized("You don't have permission to do this");
  }
  await next();
};
