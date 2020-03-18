"use strict";

/**
 * `isOwner` policy.
 */

module.exports = async (ctx, next) => {
  const { role, id } = ctx.state.user;
  const student = await strapi.query("student").findOne({ id: ctx.params.id });
  if (!(role.name === "Medha Admin" || student.user.id === id)) {
    return ctx.response.unauthorized("You don't have permission to do this");
  }

  await next();
};
