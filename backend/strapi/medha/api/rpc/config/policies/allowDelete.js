"use strict";

/**
 * `allowDelete` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In allowDelete policy.");
  const id = ctx.params.id;

  const college = await strapi.query("college").find({ rpc: id });

  const user_1 = await strapi
    .query("user", "users-permissions")
    .find({ rpc: id });
  console.log(user_1);
  console.log(college);

  if (!college[0] && !user_1[0]) {
    await next();
  } else {
    ctx.response.forbidden();
  }

  // await next();
};
