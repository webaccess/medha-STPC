"use strict";

/**
 * `isOrganizationAllowed` policy.
 */
const { PLUGIN } = require("../constants");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In isOrganizationAllowed policy.");
  const { role, zone, rpc, contact } = ctx.state.user;
  const { orgId } = ctx.params;

  if (role.name === "Medha Admin" || role.name === "Admin") {
    await next();
  }
  if (role.name === "Zonal Admin") {
    const data = await strapi
      .query("organization", PLUGIN)
      .findOne({ id: orgId });

    if (!data) ctx.response.notFound("Required College does not exist");
    if (data.zone.id == zone) await next();
    else ctx.response.forbidden();
  }

  if (role.name === "RPC Admin") {
    const data = await strapi
      .query("organization", PLUGIN)
      .findOne({ id: orgId });

    if (!data) ctx.response.notFound("Required College does not exist");
    if (data.rpc.id == rpc) await next();
    else ctx.response.forbidden();
  }

  if (role.name === "College Admin") {
    const user = await strapi.query("contact", PLUGIN).findOne({ id: contact });
    if (user.individual.organization == orgId) await next();
    else ctx.response.forbidden();
  }
};
