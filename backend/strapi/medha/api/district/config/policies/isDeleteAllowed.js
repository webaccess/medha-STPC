"use strict";

/**
 * `isDeleteAllowed` policy.
 */

module.exports = async (ctx, next) => {
  const { id } = ctx.params;

  const district = await strapi.query("district").findOne({ id });
  if (!district) {
    return ctx.response.notFound("District does not exist");
  }

  const student = await strapi.query("student").findOne({ district: id });
  const college = await strapi.query("college").findOne({ district: id });

  if (student || college) {
    return ctx.response.badRequest(
      "District cannot be deleted, Since District is mapped to Student and College"
    );
  }

  await next();
};
