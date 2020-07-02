"use strict";

/**
 * `validate` policy.
 */

module.exports = async (ctx, next) => {
  /**
   * When creating zone name and state is compulsory
   * When updating zone check if state is valid
   */
  const { name, state } = ctx.request.body;
  if (ctx.request.method === "POST") {
    if (!name) return ctx.response.badRequest("Name field is missing");
    if (!state) return ctx.response.badRequest("State is required");

    if (state) {
      const stateId = typeof state === "number" ? state : state.id;
      const isStateValid = await strapi
        .query("state", "crm-plugin")
        .findOne({ id: stateId });

      if (!isStateValid) return ctx.response.badRequest("State is invalid");
    }

    const zone = await strapi
      .query("zone")
      .findOne({ name: name, state: state });

    if (zone)
      return ctx.response.badRequest("Zone can't be created with same name");

    await next();
  }
  if (ctx.request.method === "PUT") {
    const { id } = ctx.params;
    if (!name) return ctx.response.badRequest("Name field is missing");
    if (!state) return ctx.response.badRequest("State is required");

    if (state) {
      const stateId = typeof state === "number" ? state : state.id;
      const isStateValid = await strapi
        .query("state", "crm-plugin")
        .findOne({ id: stateId });

      if (!isStateValid) return ctx.response.badRequest("State is invalid");
    }

    const zone = await strapi
      .query("zone")
      .findOne({ id_nin: [id], name: name, state: state });

    if (zone)
      return ctx.response.badRequest("Zone can't be created with same name");

    await next();
  }
};
