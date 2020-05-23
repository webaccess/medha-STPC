"use strict";

/**
 * `isIndividualDeleteAllowed` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In isIndividualDeleteAllowed policy.");

  const { id } = ctx.params;
  const user = ctx.state.user;
  const body = ctx.request.body;

  if (user.role.name === "Medha Admin") {
    await next();
  }
  if (user.role.name === "College Admin") {
    const contact = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: user.contact });
    if (contact.individual.organization != id) {
      return ctx.response.unauthorized("You don't have permission to do this");
    } else await next();
  }
  if (
    !(user.role.name == "Medha Admin" || user.role.name === "College Admin")
  ) {
    ctx.response.forbidden();
  }

  await next();
};
