"use strict";

/**
 * `isIndividual` policy.
 */
const { PLUGIN } = require("../constants");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In isIndividual policy.");

  const { role, id } = ctx.state.user;
  const contact = await strapi
    .query("contact", PLUGIN)
    .findOne({ id: ctx.params.id });
  if (
    !(
      role.name === "Medha Admin" ||
      contact.user.id === id ||
      role.name === "College Admin"
    )
  ) {
    return ctx.response.unauthorized("You don't have permission to do this");
  }

  await next();
};
