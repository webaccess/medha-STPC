"use strict";

/**
 * `isDeleteAllowed` policy.
 */

module.exports = async (ctx, next) => {
  const { id } = ctx.params;
  const zone = await strapi.query("zone").findOne({ id });
  if (!zone) {
    return ctx.response.notFound("Zone does not exist");
  }

  const college = await strapi.query("college").findOne({ zone: id });
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
