"use strict";

/**
 * `isAllowedDelete` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In isAllowedDelete policy.");
  const { id } = ctx.params;
  const user = ctx.state.user;
  const body = ctx.request.body;

  if (user.role.name === "Medha Admin") {
    await next();
  }
  if (user.role.name === "College Admin") {
    if (user.college != id) {
      return ctx.response.unauthorized("You don't have permission to do this");
    } else await next();
  }
  if (
    !(user.role.name == "Medha Admin" || user.role.name === "College Admin")
  ) {
    ctx.response.forbidden();
  }
};
