"use strict";

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require("lodash");
const { sanitizeEntity } = require("strapi-utils");

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] }
];

const { validate } = require("../validate.js");
const bookshelf = require("../../../config/config.js");
const utils = require("../../../config/utils.js");
const { convertRestQueryParams, buildQuery } = require("strapi-utils");

module.exports = {
  /**
   * Retrieve authenticated user.
   * @return {Object|Array}
   */
  async me(ctx) {
    const request = ctx.state.user;

    if (!request) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] }
      ]);
    }

    const user = await strapi
      .query("user", "users-permissions")
      .findOne({ id: request.id });

    const roles = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "RPC Admin" }, []);
    user.rpcAdminRole = roles;

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
    return utils.getFindOneResponse(sanitizeUser(user));
  },

  /**
   * Create a/an user record.
   * @return {Object}
   */
  async create(ctx) {
    const advanced = await strapi
      .store({
        environment: "",
        type: "plugin",
        name: "users-permissions",
        key: "advanced"
      })
      .get();

    const {
      email,
      username,
      password,
      contact_number,
      first_name,
      last_name
    } = ctx.request.body;

    if (!email) return ctx.badRequest("missing.email");
    if (!username) return ctx.badRequest("missing.username");
    if (!password) return ctx.badRequest("missing.password");
    // if (!first_name) return ctx.badRequest("missing.first_name");
    // if (!last_name) return ctx.badRequest("missing.last_name");
    // if (!contact_number) return ctx.badRequest("missing.contact_number");

    const userWithSameUsername = await strapi
      .query("user", "users-permissions")
      .findOne({ username });

    if (userWithSameUsername) {
      return ctx.badRequest(
        null,
        formatError({
          id: "Auth.form.error.username.taken",
          message: "Username already taken.",
          field: ["username"]
        })
      );
    }

    if (advanced.unique_email) {
      const userWithSameEmail = await strapi
        .query("user", "users-permissions")
        .findOne({ email });

      if (userWithSameEmail) {
        return ctx.badRequest(
          null,

          formatError({
            id: "Auth.form.error.email.taken",
            message: "Email already taken.",
            field: ["email"]
          })
        );
      }
    }

    const params = {
      ...ctx.request.body,
      provider: "local"
    };

    const { isError, error } = await validate(params);
    if (isError) {
      return ctx.response.badRequest(error);
    }

    try {
      params.password = await strapi.plugins[
        "users-permissions"
      ].services.user.hashPassword(params);

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

  /**
   * Get all users
   */

  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);
    return strapi
      .query("user", "users-permissions")
      .model.query(
        buildQuery({
          model: strapi.query("user", "users-permissions").model,
          filters
        })
      )
      .fetchPage({
        page: page,
        pageSize:
          pageSize < 0
            ? await strapi.query("user", "users-permissions").count()
            : pageSize
      })
      .then(async u => {
        const response = utils.getPaginatedResponse(u);
        await utils.asyncForEach(response.result, async (user, index) => {
          const { id } = user;
          response.result[index].studentInfo = await strapi
            .query("student")
            .findOne({ user: id });
          if (response.result[index].studentInfo) {
            delete response.result[index].studentInfo.user;
          }
        });
        const data = response.result.map(sanitizeUser);
        response.result = data;
        return response;
      });
  },

  /**
   * Get specific user
   */

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi
      .query("user", "users-permissions")
      .findOne({ id });

    /**
     * If role is student add student object to user info
     */
    const studentInfo = await strapi.query("student").findOne({ user: id });

    // Removing users details from student object
    if (studentInfo) {
      delete studentInfo.user;
    }

    response.studentInfo = studentInfo;
    return utils.getFindOneResponse(sanitizeUser(response));
  },

  /**
   * Update user
   * @return {Object}
   * Overriding response with our response structure
   */
  async update(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: "",
        type: "plugin",
        name: "users-permissions",
        key: "advanced"
      })
      .get();

    const { id } = ctx.params;
    const { email, username, password } = ctx.request.body;
    const usr = ctx.state.user;
    const user = await strapi.plugins["users-permissions"].services.user.fetch({
      id
    });

    if (_.has(ctx.request.body, "email") && !email) {
      return ctx.badRequest("email.notNull");
    }

    if (_.has(ctx.request.body, "username") && !username) {
      return ctx.badRequest("username.notNull");
    }

    if (
      _.has(ctx.request.body, "password") &&
      !password &&
      user.provider === "local"
    ) {
      return ctx.badRequest("password.notNull");
    }

    if (_.has(ctx.request.body, "username")) {
      const userWithSameUsername = await strapi
        .query("user", "users-permissions")
        .findOne({ username });

      if (userWithSameUsername && userWithSameUsername.id != id) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.username.taken",
            message: "username.alreadyTaken.",
            field: ["username"]
          })
        );
      }
    }

    if (_.has(ctx.request.body, "email") && advancedConfigs.unique_email) {
      const userWithSameEmail = await strapi
        .query("user", "users-permissions")
        .findOne({ email });

      if (userWithSameEmail && userWithSameEmail.id != id) {
        return ctx.badRequest(
          null,
          formatError({
            id: "Auth.form.error.email.taken",
            message: "Email already taken",
            field: ["email"]
          })
        );
      }
    }

    let updateData = {
      ...ctx.request.body
    };

    // let validPassword;
    // if (_.has(ctx.request.body, "password")) {
    //   validPassword = strapi.plugins[
    //     "users-permissions"
    //   ].services.user.validatePassword(password, user.password);
    // }
    // if (
    //   _.has(ctx.request.body, "password") &&
    //   !validPassword &&
    //   usr.role.name === "Medha Admin"
    // ) {
    //   updateData.password = await strapi.plugins[
    //     "users-permissions"
    //   ].services.user.hashPassword(updateData);
    // }
    // if (_.has(ctx.request.body, "password") && validPassword) {
    //   delete updateData.password;
    // }

    const data = await strapi
      .query("user", "users-permissions")
      .update({ id: id }, updateData);

    return utils.getFindOneResponse(sanitizeUser(data));
  }
};
