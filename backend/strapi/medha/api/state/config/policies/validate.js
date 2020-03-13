"use strict";

/**
 * `validate` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.

  const { name } = ctx.request.body;
  if (!name) return ctx.response.badRequest("Name field is missing");

  await next();
};
