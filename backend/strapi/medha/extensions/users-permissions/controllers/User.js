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
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] }
      ]);
    }

    return await bookshelf
      .model("user")
      .where({ id: user.id })
      .fetch({ withRelated: ["state", "zone", "rpc", "college"] })
      .then(u => {
        const response = utils.getResponse(u);
        const data = sanitizeUser(response.result);
        response.result = data;
        return response;
      });
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
    if (!first_name) return ctx.badRequest("missing.first_name");
    if (!last_name) return ctx.badRequest("missing.last_name");
    if (!contact_number) return ctx.badRequest("missing.contact_number");

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
    return await bookshelf
      .model("user")
      .query(
        buildQuery({
          model: strapi.query("user", "users-permissions").model,
          filters
        })
      )
      .fetchPage({
        page: page,
        pageSize: pageSize
      })
      .then(u => {
        const response = utils.getPaginatedResponse(u);
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
    return await bookshelf
      .model("user")
      .where({ id: id })
      .fetch({
        require: false
      })
      .then(u => {
        const response = utils.getResponse(u);
        const data = sanitizeUser(response.result);
        response.result = data;
        return response;
      });
  }
};
