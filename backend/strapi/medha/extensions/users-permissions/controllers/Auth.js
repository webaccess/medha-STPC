"use strict";

/**
 * Auth.js controller
 *
 * @description: A set of functions called "actions" for managing `Auth`.
 */

/* eslint-disable no-useless-escape */
const crypto = require("crypto");
const _ = require("lodash");
const grant = require("grant-koa");
const { sanitizeEntity } = require("strapi-utils");

const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] }
];

const { validate } = require("../validate.js");

module.exports = {
  /**
   *
   * @param {email, username, password, first_name, last_name, contact_number} ctx
   * Added custom check for first_name, last_name and contact_number when creating new user
   */
  async register(ctx) {
    const pluginStore = await strapi.store({
      environment: "",
      type: "plugin",
      name: "users-permissions"
    });

    const settings = await pluginStore.get({
      key: "advanced"
    });

    if (!settings.allow_register) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.advanced.allow_register",
          message: "Register action is currently disabled."
        })
      );
    }

    const params = _.assign(ctx.request.body, {
      provider: "local"
    });

    // Password is required.
    if (!params.password) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.password.provide",
          message: "Please provide your password."
        })
      );
    }

    // Email is required.
    if (!params.email) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.email.provide",
          message: "Please provide your email."
        })
      );
    }

    // First name is required.
    if (!params.first_name) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.first_name.provide",
          message: "Please provide your first name."
        })
      );
    }
    // Last Name is required.
    if (!params.last_name) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.last_name.provide",
          message: "Please provide your last name."
        })
      );
    }
    // Contact number is required.
    if (!params.contact_number) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.contact_number.provide",
          message: "Please provide your contact_number."
        })
      );
    }

    const { isError, error } = await validate(params);
    if (isError) {
      return ctx.response.badRequest(error);
    }
    // Throw an error if the password selected by the user
    // contains more than two times the symbol '$'.
    if (
      strapi.plugins["users-permissions"].services.user.isHashed(
        params.password
      )
    ) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.password.format",
          message:
            "Your password cannot contain more than three times the symbol `$`."
        })
      );
    }

    // const role = await strapi
    //   .query("role", "users-permissions")
    //   .findOne({ type: settings.default_role }, []);

    // if (!role) {
    //   return ctx.badRequest(
    //     null,
    //     formatError({
    //       id: "Auth.form.error.role.notFound",
    //       message: "Impossible to find the default role."
    //     })
    //   );
    // }

    // Check if the provided email is valid or not.
    const isEmail = emailRegExp.test(params.email);

    if (isEmail) {
      params.email = params.email.toLowerCase();
    } else {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.email.format",
          message: "Please provide valid email address."
        })
      );
    }

    params.password = await strapi.plugins[
      "users-permissions"
    ].services.user.hashPassword(params);

    const user = await strapi.query("user", "users-permissions").findOne({
      email: params.email
    });

    if (user && user.provider === params.provider) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.email.taken",
          message: "Email is already taken."
        })
      );
    }

    if (user && user.provider !== params.provider && settings.unique_email) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.email.taken",
          message: "Email is already taken."
        })
      );
    }

    try {
      const user = await strapi
        .query("user", "users-permissions")
        .create(params);

      const jwt = strapi.plugins["users-permissions"].services.jwt.issue(
        _.pick(user.toJSON ? user.toJSON() : user, ["id"])
      );

      ctx.send({
        jwt,
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query("user", "users-permissions").model
        })
      });
    } catch (err) {
      ctx.response.badRequest("Something went wrong...");
    }
  }
};
