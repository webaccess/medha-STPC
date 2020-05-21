"use strict";

/**
 * `isValidOrganizationAdmin` policy.
 */
const { PLUGIN } = require("../constants");
module.exports = async (ctx, next) => {
  // Add your own logic here.

  //Add this policy to PUT contact/individual/:id  for college admin to edit profile of student.
  console.log("In isValidOrganizationAdmin policy.");
  let user = ctx.state.user;

  if (user.role.name === "College Admin") {
    user = await strapi.query("contact", PLUGIN).findOne({ id: user.contact });

    const student = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: ctx.params.id });

    if (student.individual.organization !== user.individual.organization)
      return ctx.response.unauthorized("You don't have permission to do this");
  }

  // await next();
};
