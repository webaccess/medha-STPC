"use strict";

/**
 * `isAllowed` policy.
 */
module.exports = async (ctx, next) => {
  const { role, zone } = ctx.state.user;
  const { id } = ctx.params;
  if (role.name === "Zonal Admin") {
    const data = await strapi.query("zone").findOne({ id });

    if (!data) {
      return ctx.response.notFound("Requested Zone does not exist");
    }

    if (!(data.id === zone)) {
      return ctx.response.unauthorized(
        "You don't have permission to access this information"
      );
    }
  }
  await next();
};
