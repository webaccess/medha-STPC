"use strict";

/**
 * `validate` policy.
 */
module.exports = async (ctx, next) => {
  const { name, college_code, address, college_email } = ctx.request.body;

  if (!name) return ctx.response.badRequest(" Name field is missing");

  if (!college_code) return ctx.response.badRequest("College code is missing");

  if (!address) return ctx.response.badRequest("Address field is missing");

  if (!college_email)
    return ctx.response.badRequest("College Email field is missing");

  await next();
};
