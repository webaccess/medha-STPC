"use strict";

/**
 * `validateIndividual` policy.
 */
const { PLUGIN } = require("../constants");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In validateIndividual policy.");
  if (ctx.request.method === "POST") {
    let data;
    if (ctx.request.files && ctx.request.body.data) {
      data = ctx.request.body.data;
      data = JSON.parse(data);
    } else {
      data = ctx.request.body;
    }

    const role_id = data.role;

    const role = await strapi
      .query("role", "users-permissions")
      .findOne({ id: role_id });

    const individual = data;

    if (role.name === "Student") {
      if (!individual.password)
        return ctx.response.badRequest("Password is missing");
      if (!individual.first_name)
        return ctx.response.badRequest("First Name field is missing");
      if (!individual.last_name)
        return ctx.response.badRequest("Last Name field is missing");
      if (!individual.address_1)
        return ctx.response.badRequest("Address field is missing");
      if (!individual.father_full_name)
        return ctx.response.badRequest("Father's Full Name field is missing");
      if (!individual.mother_full_name)
        return ctx.response.badRequest("Mother's Full Name field is missing");
      if (!individual.date_of_birth)
        return ctx.response.badRequest("Date Of Birth field is missing");
      if (!individual.gender)
        return ctx.response.badRequest("Gender field is missing");

      if (!individual.organization)
        return ctx.response.badRequest("College field is missing");
      if (!individual.roll_number)
        return ctx.response.badRequest("Roll Number field is missing");
      else {
        const user = await strapi.query("individual", PLUGIN).findOne({
          organization: individual.organization,
          roll_number: individual.roll_number
        });
        if (user) return ctx.response.badRequest("Roll number already taken");
      }

      // if (!individual.username)
      //   return ctx.response.badRequest("Username field is missing");
      // else {
      //   const contact = await strapi
      //     .query("user", "users-permissions")
      //     .findOne({ username: individual.username });
      //   if (contact) return ctx.response.badRequest("Username already taken");
      // }

      if (!individual.email)
        return ctx.response.badRequest("Email field is missing");
      else {
        const contact = await strapi
          .query("user", "users-permissions")
          .findOne({ email: individual.email });
        if (contact) return ctx.response.badRequest("Email already taken");
      }
      if (!individual.phone)
        return ctx.response.badRequest("Contact Number field is missing");
      else {
        const isUsernamePresent = await strapi
          .query("user", "users-permissions")
          .findOne({ username: individual.phone });
        if (isUsernamePresent)
          return ctx.response.badRequest("Username already taken");

        const isContactPresent = await strapi
          .query("contact", PLUGIN)
          .findOne({ phone: individual.phone });
        if (isContactPresent)
          return ctx.response.badRequest("Contact number already taken");
      }

      await next();
    } else {
      if (!individual.password)
        return ctx.response.badRequest("Password is missing");
      if (!individual.first_name)
        return ctx.response.badRequest("First Name field is missing");
      if (!individual.last_name)
        return ctx.response.badRequest("Last Name field is missing");
      // if (!individual.address_1)
      //   return ctx.response.badRequest("Address field is missing");
      if (!individual.username)
        return ctx.response.badRequest("Username field is missing");
      else {
        const contact = await strapi
          .query("user", "users-permissions")
          .findOne({ username: individual.username });
        if (contact) return ctx.response.badRequest("Username already taken");
      }
      if (!individual.email)
        return ctx.response.badRequest("Email field is missing");
      else {
        const contact = await strapi
          .query("user", "users-permissions")
          .findOne({ email: individual.email });
        if (contact) return ctx.response.badRequest("Email already taken");
      }
      if (!individual.phone)
        return ctx.response.badRequest("Contact Number field is missing");
      else {
        const contact = await strapi
          .query("contact", PLUGIN)
          .findOne({ phone: individual.phone });
        if (contact)
          return ctx.response.badRequest("Contact number already taken");
      }
      // if (!individual.date_of_birth)
      //   return ctx.response.badRequest("Date Of Birth field is missing");
      // if (!individual.gender)
      //   return ctx.response.badRequest("Gender field is missing");
      await next();
    }
  }
  if (ctx.request.method === "PUT") {
    let data;
    if (ctx.request.files && ctx.request.body.data) {
      data = ctx.request.body.data;
      data = JSON.parse(data);
    } else {
      data = ctx.request.body;
    }

    const role_id = data.role;

    const { id } = ctx.params;
    const { fromuser } = ctx.query;
    const contact = await strapi.query("contact", PLUGIN).findOne({ id });

    const role = await strapi
      .query("role", "users-permissions")
      .findOne({ id: contact.user.role });

    const individual = data;

    if (role.name === "Student") {
      if (!individual.email)
        return ctx.response.badRequest("Email field is missing");
      else {
        const user = await strapi
          .query("user", "users-permissions")
          .findOne({ id_nin: [contact.user.id], email: individual.email });
        if (user) return ctx.response.badRequest("Email already taken");
      }
      if (!individual.phone)
        return ctx.response.badRequest("Contact Number field is missing");
      else {
        const isUsernamePresent = await strapi
          .query("user", "users-permissions")
          .findOne({ id_nin: [contact.user.id], username: individual.phone });
        if (isUsernamePresent)
          return ctx.response.badRequest("Username already taken");

        const isContactPresent = await strapi
          .query("contact", PLUGIN)
          .findOne({ id_nin: [id], phone: individual.phone });
        if (isContactPresent)
          return ctx.response.badRequest("Contact number already taken");
      }

      if (!fromuser) {
        if (!individual.roll_number)
          return ctx.response.badRequest("Roll Number field is missing");
        else {
          const user = await strapi.query("individual", PLUGIN).findOne({
            id_nin: [contact.individual.id],
            organization: individual.organization,
            roll_number: individual.roll_number
          });
          if (user) return ctx.response.badRequest("Roll number already taken");
        }
      }
      await next();
    } else {
      if (!individual.email)
        return ctx.response.badRequest("Email field is missing");
      else {
        const validateEmail = await strapi
          .query("user", "users-permissions")
          .findOne({ id_nin: [contact.user.id], email: individual.email });
        if (validateEmail)
          return ctx.response.badRequest("Email already taken");
      }
      if (!individual.phone)
        return ctx.response.badRequest("Contact Number field is missing");
      else {
        const isUsernamePresent = await strapi
          .query("user", "users-permissions")
          .findOne({ id_nin: [contact.user.id], username: individual.phone });
        if (isUsernamePresent)
          return ctx.response.badRequest("Username already taken");

        const isContactPresent = await strapi
          .query("contact", PLUGIN)
          .findOne({ id_nin: [id], phone: individual.phone });
        if (isContactPresent)
          return ctx.response.badRequest("Contact number already taken");
      }
      await next();
    }
  }
};
