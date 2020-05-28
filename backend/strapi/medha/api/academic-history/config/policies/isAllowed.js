"use strict";

/**
 * `isAllowed` policy.
 */
const { PLUGIN } = require("../../../../config/constants");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In isAllowed policy.");

  let user = ctx.state.user;
  const { contact } = ctx.request.body;
  if (user.role.name === "College Admin") {
    user = await strapi.query("contact", PLUGIN).findOne({ id: user.contact });

    const individual = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: contact });

    if (user.individual.organization !== individual.individual.organization)
      return ctx.response.unauthorized();
    else {
      await next();
    }
  } else if (user.role.name === "Student" || user.role.name === "Medha Admin") {
    await next();
  }
};
