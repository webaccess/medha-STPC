"use strict";

/**
 * `isOwner` policy.
 */

const bookshelf = require("../../../../config/config.js");
module.exports = async (ctx, next) => {
  const { role } = ctx.state.user;
  const requestedStudent = await bookshelf
    .model("student")
    .where({ user: ctx.params.id })
    .fetch();
  if (!(role.name === "Medha Admin" || requestedStudent.user === id)) {
    return ctx.response.unauthorized("You don't have permission to do this");
  }

  await next();
};
