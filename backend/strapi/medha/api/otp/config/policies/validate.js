"use strict";

/**
 * `validate` policy.
 */
const { PLUGIN } = require("../../../../config/constants");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In validate policy.");
  const { old_contact_number, new_contact_number } = ctx.request.body;

  const contact = await strapi
    .query("contact", PLUGIN)
    .findOne({ phone: old_contact_number });
  if (!contact)
    return ctx.badRequest("Contact doesn't exist with phone number");

  const stud = await strapi
    .query("contact", PLUGIN)
    .findOne({ id_nin: [contact.id], phone: new_contact_number });

  if (stud)
    return ctx.badRequest("Contact number already used by another user");

  await next();
};
