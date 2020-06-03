"use strict";

/**
 * `validate` policy.
 */

module.exports = async (ctx, next) => {
  /**
   * When creating rpc name and state is compulsory
   * When updating rpc check if state is valid
   */
  const { name, state } = ctx.request.body;

  if (!name) return ctx.response.badRequest("Name field is missing");
  if (!state) return ctx.response.badRequest("State is required");

  if (state) {
    const stateId = typeof state === "number" ? state : state.id;
    const isStateValid = await strapi
      .query("state", "crm-plugin")
      .findOne({ id: stateId });

    if (!isStateValid) return ctx.response.badRequest("State is invalid");
  }

  const rpc = await strapi.query("rpc").findOne({ name: name, state: state });

  if (rpc)
    return ctx.response.badRequest("Rpc can't be created with same name");

  await next();
};
