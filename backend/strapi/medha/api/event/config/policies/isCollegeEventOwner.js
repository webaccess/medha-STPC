"use strict";

/**
 * `isCollegeEventOwner` policy.
 */
const { PLUGIN } = require("../../../../config/constants");
module.exports = async (ctx, next) => {
  const { id, organizationId } = ctx.params;
  if (!id) {
    return ctx.response.badRequest("Event Id is missing");
  }

  if (!organizationId) {
    return ctx.response.badRequest("College id is missing");
  }

  let user = ctx.state.user;
  const { role } = ctx.state.user;

  user = await strapi.query("contact", PLUGIN).findOne({ id: user.contact });

  if (
    role.name == "College Admin" &&
    (!user.individual.organization ||
      user.individual.organization != organizationId)
  ) {
    console.log("1");
    return ctx.response.unauthorized(
      "You don't have permission to view this information"
    );
  }

  await next();
};
