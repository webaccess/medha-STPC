"use strict";

/**
 * `isDeleteAllowed` policy.
 */
const { PLUGIN } = require("../../../../config/constants");
module.exports = async (ctx, next) => {
  const { id } = ctx.params;
  const zone = await strapi.query("zone").findOne({ id });
  if (!zone) {
    return ctx.response.notFound("Zone does not exist");
  }

  const college = await strapi
    .query("organization", PLUGIN)
    .findOne({ zone: id });
  const user = await strapi
    .query("user", "users-permissions")
    .findOne({ zone: id });

  if (college || user) {
    return ctx.response.badRequest(
      "Zone cannot be deleted. Since Zone is mapped to College and User"
    );
  }
  await next();
};
