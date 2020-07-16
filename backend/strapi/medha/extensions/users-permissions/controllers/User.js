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
   * Get all users
   */

  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query, { limit: -1 });
    return strapi
      .query("user", "users-permissions")
      .model.query(
        buildQuery({
          model: strapi.query("user", "users-permissions").model,
          filters
        })
      )
      .fetchAll()
      .then(async res => {
        const data = res.toJSON();

        // await utils.asyncForEach(data, async (user, index) => {
        //   const { id } = user;
        //   user[index].studentInfo = await strapi
        //     .query("student")
        //     .findOne({ user: id });
        //   if (user[index].studentInfo) {
        //     delete response.result[index].studentInfo.user;
        //   }
        // });

        const sanitized = data.map(sanitizeUser);

        const response = utils.paginate(sanitized, page, pageSize);
        return {
          result: response.result,
          ...response.pagination
        };
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
  }
};
