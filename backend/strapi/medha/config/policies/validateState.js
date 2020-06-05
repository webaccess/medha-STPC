"use strict";

/**
 * `validateState` policy.
 */
const { PLUGIN } = require("../constants");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In validateState policy.");

  const { name } = ctx.request.body;
  if (ctx.request.method === "POST") {
    if (!name) return ctx.response.badRequest("Name field is missing");

    const state = await strapi.query("state", PLUGIN).findOne({ name: name });
    if (state)
      return ctx.response.badRequest("State already exist with name " + name);
    await next();
  }

  if (ctx.request.method === "PUT") {
    const { id } = ctx.params;
    if (!name) return ctx.response.badRequest("Name field is missing");

    const state = await strapi
      .query("state", PLUGIN)
      .find({ id_nin: [id], name: name });
    if (state)
      return ctx.response.badRequest("State already exist with name " + name);
    await next();
  }
};
