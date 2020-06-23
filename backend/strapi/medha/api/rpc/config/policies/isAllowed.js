"use strict";

/**
 * `isAllowed` policy.
 */
module.exports = async (ctx, next) => {
  const { role, rpc, zone } = ctx.state.user;
  const { id } = ctx.params;

  if (role.name === "Zonal Admin" || role.name === "RPC Admin") {
    const data = await strapi.query("rpc").findOne({ id: id });

    if (!data) {
      return ctx.response.notFound("Requested RPC does not exist");
    }

    if (!(data.id === rpc)) {
      return ctx.response.unauthorized(
        "You don't have permission to access this information"
      );
    }
  }
  await next();
};
