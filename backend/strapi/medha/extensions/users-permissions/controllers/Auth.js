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
  },

  async callback(ctx) {
    const provider = ctx.params.provider || "local";
    const params = ctx.request.body;

    const store = await strapi.store({
      environment: "",
      type: "plugin",
      name: "users-permissions"
    });

    if (provider === "local") {
      if (!_.get(await store.get({ key: "grant" }), "email.enabled")) {
        return ctx.badRequest(null, "This provider is disabled.");
      }

      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.email.provide",
            message: "Please provide your username or your e-mail."
          })
        );
      }

      // The password is required.
      if (!params.password) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.password.provide",
            message: "Please provide your password."
          })
        );
      }

      const query = {};

      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier);

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase();
      } else {
        query.username = params.identifier;
      }

      // Check if the user exists.
      const user = await strapi
        .query("user", "users-permissions")
        .findOne(query);

      if (!user) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.invalid",
            message: "Identifier or password invalid."
          })
        );
      }

      if (
        _.get(await store.get({ key: "advanced" }), "email_confirmation") &&
        user.confirmed !== true
      ) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.confirmed",
            message: "Your account email is not confirmed"
          })
        );
      }

      if (user.blocked === true) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.blocked",
            message: "Your account has been blocked by an administrator"
          })
        );
      }

      // The user never authenticated with the `local` provider.
      if (!user.password) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.password.local",
            message:
              "This user never set a local password, please login with the provider used during account creation."
          })
        );
      }

      const validPassword = strapi.plugins[
        "users-permissions"
      ].services.user.validatePassword(params.password, user.password);

      if (!validPassword) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.invalid",
            message: "Identifier or password invalid."
          })
        );
      } else {
        /**
         * Adding Individual Information to login
         */

        if (user.contact) {
          const individualInfo = await strapi
            .query("individual", "crm-plugin")
            .findOne({ contact: user.contact.id });
          user.studentInfo = individualInfo;
          if (individualInfo) {
            user.first_name = individualInfo.first_name;
            user.last_name = individualInfo.last_name;
          }
        }

        if (
          user.hasOwnProperty("studentInfo") &&
          user.studentInfo.hasOwnProperty("organization") &&
          user.studentInfo.organization !== null &&
          user.studentInfo.organization.id
        ) {
          const orgInfo = await strapi
            .query("organization", "crm-plugin")
            .findOne({ id: user.studentInfo.organization.id }, [
              "contact",
              "contact.state",
              "contact.district",
              "zone",
              "rpc",
              "principal",
              "tpos",
              "stream_strength",
              "stream_strength.stream"
            ]);
          user.studentInfo.organization = orgInfo;
        }
        ctx.send({
          jwt: strapi.plugins["users-permissions"].services.jwt.issue({
            id: user.id
          }),
          user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
            model: strapi.query("user", "users-permissions").model
          })
        });
      }
    } else {
      if (!_.get(await store.get({ key: "grant" }), [provider, "enabled"])) {
        return ctx.badRequest(
          null,
          formatError({
            id: "provider.disabled",
            message: "This provider is disabled."
          })
        );
      }

      // Connect the user with the third-party provider.
      let user, error;
      try {
        [user, error] = await strapi.plugins[
          "users-permissions"
        ].services.providers.connect(provider, ctx.query);
      } catch ([user, error]) {
        return ctx.badRequest(null, error === "array" ? error[0] : error);
      }

      if (!user) {
        return ctx.badRequest(null, error === "array" ? error[0] : error);
      }

      ctx.send({
        jwt: strapi.plugins["users-permissions"].services.jwt.issue({
          id: user.id
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query("user", "users-permissions").model
        })
      });
    }
  },

  async changePassword(ctx) {
    const params = _.assign({}, ctx.request.body, ctx.params);

    if (
      params.username &&
      params.oldPassword &&
      params.password &&
      params.passwordConfirmation &&
      params.password === params.passwordConfirmation
    ) {
      // Get user details using username

      const user = await strapi
        .query("user", "users-permissions")
        .findOne({ username: params.username });

      if (!user) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.username.provide",
            message: "Incorrect username provided."
          })
        );
      }

      const validPassword = strapi.plugins[
        "users-permissions"
      ].services.user.validatePassword(params.oldPassword, user.password);

      if (!validPassword) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.invalid",
            message: "Identifier or password invalid."
          })
        );
      }

      user.password = await strapi.plugins[
        "users-permissions"
      ].services.user.hashPassword(params);

      // Update the user.
      await strapi
        .query("user", "users-permissions")
        .update({ id: user.id }, user);

      ctx.send({
        result: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query("user", "users-permissions").model
        })
      });
    } else if (
      params.password &&
      params.passwordConfirmation &&
      params.password === params.passwordConfirmation &&
      params.code
    ) {
      const user = await strapi
        .query("user", "users-permissions")
        .findOne({ resetPasswordToken: `${params.code}` });

      if (!user) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.code.provide",
            message: "Incorrect code provided."
          })
        );
      }

      // Delete the current code
      user.resetPasswordToken = null;

      user.password = await strapi.plugins[
        "users-permissions"
      ].services.user.hashPassword(params);

      // Update the user.
      await strapi
        .query("user", "users-permissions")
        .update({ id: user.id }, user);

      ctx.send({
        jwt: strapi.plugins["users-permissions"].services.jwt.issue({
          id: user.id
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query("user", "users-permissions").model
        })
      });
    } else if (
      params.password &&
      params.passwordConfirmation &&
      params.password !== params.passwordConfirmation
    ) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.password.matching",
          message: "Passwords do not match."
        })
      );
    } else {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.params.provide",
          message: "Incorrect params provided."
        })
      );
    }
  }
};
