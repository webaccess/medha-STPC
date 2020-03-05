"use strict";

/**
 * `isAllowed` policy.
 */
const bookshelf = require("../../../../config/config.js");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  const { role, zone, rpc, college } = ctx.state.user;
  const { id } = ctx.params;

  if (role.name === "Medha Admin" || role.name === "Admin") {
    await next();
  }
  if (role.name === "Zonal Admin") {
    const result = await bookshelf
      .model("college")
      .where({ id: id })
      .fetch({ withRelated: ["rpc", "rpc.zone", "admins"] });
    const data = result.toJSON();
    if (!data) ctx.response.notFound("Required College does not exist");
    if (data.rpc.zone.id == zone) await next();
    else ctx.response.forbidden();
  }

  if (role.name === "RPC Admin") {
    const result = await bookshelf
      .model("college")
      .where({ id: id })
      .fetch({ withRelated: ["rpc", "rpc", "admins"] });
    const data = result.toJSON();
    if (!data) ctx.response.notFound("Required College does not exist");
    if (data.rpc.id == rpc) await next();
    else ctx.response.forbidden();
  }

  if (role.name === "College Admin" && college == id) {
    await next();
  }
};
