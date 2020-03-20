"use strict";

/**
 * `validate` policy.
 */

module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In validate policy.");
  const student = ctx.request.body;

  console.log(student);

  if (!student.first_name)
    return ctx.response.badRequest("First Name field is missing");
  if (!student.last_name)
    return ctx.response.badRequest("Last Name field is missing");
  if (!student.address)
    return ctx.response.badRequest("Address field is missing");
  if (!student.father_first_name)
    return ctx.response.badRequest("Father's First Name field is missing");
  if (!student.father_last_name)
    return ctx.response.badRequest("Father's Last Name field is missing");
  if (!student.date_of_birth)
    return ctx.response.badRequest("Date Of Birth field is missing");
  if (!student.gender)
    return ctx.response.badRequest("Gender field is missing");
  if (!student.roll_number)
    return ctx.response.badRequest("Roll Number field is missing");

  if (!student.username)
    return ctx.response.badRequest("Username field is missing");
  if (!student.email) return ctx.response.badRequest("Email field is missing");
  if (!student.contact_number)
    return ctx.response.badRequest("Contact Number field is missing");
  await next();
};
