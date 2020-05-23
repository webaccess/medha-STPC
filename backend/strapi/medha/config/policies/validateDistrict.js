"use strict";

/**
 * `validateDistrict` policy.
 */
const { PLUGIN } = require("../constants");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In validateDistrict policy.");
  const { name, state } = ctx.request.body;

  if (!name) return ctx.response.badRequest("Name field is missing");
  if (!state) return ctx.response.badRequest("State is required");

  if (state) {
    const stateId = typeof state === "number" ? state : state.id;
    const isStateValid = await strapi
      .query("state", PLUGIN)
      .findOne({ id: stateId });

    if (!isStateValid) return ctx.response.badRequest("State is invalid");
  }

  const district = await strapi
    .query("district", PLUGIN)
    .findOne({ name: name, state: state });

  if (district) return ctx.response.badRequest("District already Exist");
  await next();
};
