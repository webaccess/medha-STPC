"use strict";

/**
 * `isDeleteAllowed` policy.
 * When deleting state information first we need to check if
 * If state association with RPC, Zone, District and User still exist
 * If association is present then return error message
 * Othewise delete the zone
 */

module.exports = async (ctx, next) => {
  const { id } = ctx.params;

  const state = await strapi.query("state").findOne({ id });
  if (!state) return strapi.response.notFound("State does not exist");

  const rpc = await strapi.query("rpc").findOne({ state: id });
  const zone = await strapi.query("zone").findOne({ state: id });
  const district = await strapi.query("zone").findOne({ state: id });
  const user = await strapi
    .query("user", "users-permissions")
    .findOne({ state: id });

  if (rpc || zone || district || user) {
    return ctx.response.badRequest(
      "State cannot be deleted. Since state is mapped to RPC, Zone, District and User"
    );
  }

  await next();
};
