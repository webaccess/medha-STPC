"use strict";

/**
 * `validateIndividual` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In validateIndividual policy.");
  const role_id = ctx.request.body.role;

  const role = await strapi
    .query("role", "users-permissions")
    .findOne({ id: role_id });

  const individual = ctx.request.body;

  if (role.name === "Student") {
    if (!individual.password)
      return ctx.response.badRequest("Password is missing");
    if (!individual.first_name)
      return ctx.response.badRequest("First Name field is missing");
    if (!individual.last_name)
      return ctx.response.badRequest("Last Name field is missing");
    if (!individual.address_1)
      return ctx.response.badRequest("Address field is missing");
    if (!individual.father_first_name)
      return ctx.response.badRequest("Father's First Name field is missing");
    if (!individual.father_last_name)
      return ctx.response.badRequest("Father's Last Name field is missing");
    if (!individual.date_of_birth)
      return ctx.response.badRequest("Date Of Birth field is missing");
    if (!individual.gender)
      return ctx.response.badRequest("Gender field is missing");
    if (!individual.roll_number)
      return ctx.response.badRequest("Roll Number field is missing");
    if (!individual.organization)
      return ctx.response.badRequest("College field is missing");
    if (!individual.username)
      return ctx.response.badRequest("Username field is missing");
    if (!individual.email)
      return ctx.response.badRequest("Email field is missing");
    if (!individual.phone)
      return ctx.response.badRequest("Contact Number field is missing");
    await next();
  } else {
    if (!individual.password)
      return ctx.response.badRequest("Password is missing");
    if (!individual.first_name)
      return ctx.response.badRequest("First Name field is missing");
    if (!individual.last_name)
      return ctx.response.badRequest("Last Name field is missing");
    if (!individual.address_1)
      return ctx.response.badRequest("Address field is missing");
    if (!individual.username)
      return ctx.response.badRequest("Username field is missing");
    if (!individual.email)
      return ctx.response.badRequest("Email field is missing");
    if (!individual.phone)
      return ctx.response.badRequest("Contact Number field is missing");
    if (!individual.date_of_birth)
      return ctx.response.badRequest("Date Of Birth field is missing");
    if (!individual.gender)
      return ctx.response.badRequest("Gender field is missing");
    await next();
  }
};
