"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {
  convertRestQueryParams,
  buildQuery,
  sanitizeEntity
} = require("strapi-utils");
const utils = require("../../../config/utils.js");

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });

const _ = require("lodash");
module.exports = {
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    // TODO add college admins to list
    /**
     * public route for colleges
     */
    if (!ctx.state.user) {
      return strapi
        .query("college")
        .model.query(
          buildQuery({
            model: strapi.models.college,
            filters
          })
        )
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize,
          columns: ["id", "name"]
        })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }

    /**
     * Authenticated user routes
     */
    const states = await strapi.query("state").find();

    const { role, rpc, zone, college } = ctx.state.user;
    if (role.name === "Medha Admin" || role.name === "Admin") {
      const response = await strapi
        .query("college")
        .model.query(
          buildQuery({
            model: strapi.models.college,
            filters
          })
        )
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize
        })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });

      response.result = response.result.map(college => {
        const { rpc, zone } = college;
        const stateId = rpc.state || zone.state;
        const state = states.find(s => s.id === stateId);
        return {
          ...college,
          state
        };
      });
      return response;
    }

    if (role.name === "Zonal Admin") {
      const response = await strapi
        .query("college")
        .model.query(
          buildQuery({
            model: strapi.models.college,
            filters
          })
        )
        .where({ zone: zone })
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize
        })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });

      response.result = response.result.map(college => {
        const { rpc, zone } = college;
        const stateId = rpc.state || zone.state;
        const state = states.find(s => s.id === stateId);
        return {
          ...college,
          state
        };
      });
      return response;
    }

    if (role.name === "RPC Admin") {
      const response = await strapi
        .query("college")
        .model.query(
          buildQuery({
            model: strapi.models.college,
            filters
          })
        )
        .where({ rpc: rpc })
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize
        })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });

      response.result = response.result.map(college => {
        const { rpc, zone } = college;
        const stateId = rpc.state || zone.state;
        const state = states.find(s => s.id === stateId);
        return {
          ...college,
          state
        };
      });
      return response;
    }

    if (role.name === "College Admin") {
      const response = await strapi
        .query("college")
        .model.query(
          buildQuery({
            model: strapi.models.college,
            filters
          })
        )
        .where({ id: college })
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize
        })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });

      response.result = response.result.map(college => {
        const { rpc, zone } = college;
        const stateId = rpc.state || zone.state;
        const state = states.find(s => s.id === stateId);
        return {
          ...college,
          state
        };
      });
      return response;
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const states = await strapi.query("state").find();
    const response = await strapi.query("college").findOne({ id });
    const stateId = response.rpc.state || response.zone.state;
    response.state = states.find(s => s.id === stateId);
    return utils.getFindOneResponse(response);
  },

  async showStudents(ctx) {
    const { id } = ctx.params;
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Student" });

    const response = await strapi
      .query("user", "users-permissions")
      .model.query(
        buildQuery({
          model: strapi.models.student,
          filters
        })
      )
      .where({ college: id, role: studentRole.id })
      .fetchPage({
        page: page,
        pageSize:
          pageSize < 0
            ? await strapi.query("user", "users-permissions").count()
            : pageSize
      })
      .then(res => {
        const data = utils.getPaginatedResponse(res);
        data.result = data.result.map(sanitizeUser);
        return data;
      });

    const userIds = response.result.map(user => user.id);
    const students = await strapi
      .query("student")
      .find({ user_in: userIds }, []);

    response.result = response.result.map(user => {
      const { id } = user;
      const student = students.find(s => s.user === id);
      return {
        ...user,
        studentInfo: student
      };
    });
    return response;
  }
};
