"use strict";

/**
 * `validateState` policy.
 */
const { PLUGIN } = require("../constants");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In validateState policy.");

  const { name } = ctx.request.body;
  if (!name) return ctx.response.badRequest("Name field is missing");

  const state = await strapi.query("state", PLUGIN).findOne({ name: name });
  if (state)
    return ctx.response.badRequest("State already exist with name " + name);
  await next();
};
