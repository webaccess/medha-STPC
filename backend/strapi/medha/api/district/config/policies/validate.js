"use strict";

/**
 * `validate` policy.
 */

module.exports = async (ctx, next) => {
  const { name, state } = ctx.request.body;

  if (!name) return ctx.response.badRequest("Name field is missing");
  if (!state) return ctx.response.badRequest("State is required");

  if (state) {
    const stateId = typeof state === "number" ? state : state.id;
    const isStateValid = await strapi.query("state").findOne({ id: stateId });

    if (!isStateValid) return ctx.response.badRequest("State is invalid");
  }
  await next();
};