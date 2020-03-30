"use strict";

/**
 * `isAllowed` policy.
 */
const bookshelf = require("../../../../config/config.js");
module.exports = async (ctx, next) => {
  const { role, rpc, zone } = ctx.state.user;
  const { id } = ctx.params;
  if (role.name === "Zonal Admin" || role.name === "RPC Admin") {
    const data = await bookshelf
      .model("rpc")
      .where({ id: id })
      .fetch();

    if (!data) {
      return ctx.response.notFound("Requested RPC does not exist");
    }

    if (!(data.id === rpc || data.zone === zone)) {
      return ctx.response.unauthorized(
        "You don't have permission to access this information"
      );
    }
  }
  await next();
};
