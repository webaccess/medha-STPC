"use strict";

/**
 * `isCollegeEventOwner` policy.
 */

module.exports = async (ctx, next) => {
  const { id, collegeId } = ctx.params;
  if (!id) {
    return ctx.response.badRequest("Event Id is missing");
  }

  if (!collegeId) {
    return ctx.response.badRequest("College id is missing");
  }

  const { college, role } = ctx.state.user;
  if (role.name == "College Admin" && (!college || college != collegeId)) {
    console.log("1");
    return ctx.response.unauthorized(
      "You don't have permission to view this information"
    );
  }

  await next();
};
