"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {
  convertRestQueryParams,
  buildQuery,
  sanitizeEntity,
} = require("strapi-utils");
const utils = require("../../../config/utils.js");

const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model,
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
            filters,
          })
        )
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize,
          columns: ["id", "name"],
        })
        .then((res) => {
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
            filters,
          })
        )
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize,
        })
        .then((res) => {
          return utils.getPaginatedResponse(res);
        });

      response.result = response.result.map((college) => {
        const { rpc, zone } = college;
        const stateId = rpc.state || zone.state;
        const state = states.find((s) => s.id === stateId);
        return {
          ...college,
          state,
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
            filters,
          })
        )
        .where({ zone: zone })
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize,
        })
        .then((res) => {
          return utils.getPaginatedResponse(res);
        });

      response.result = response.result.map((college) => {
        const { rpc, zone } = college;
        const stateId = rpc.state || zone.state;
        const state = states.find((s) => s.id === stateId);
        return {
          ...college,
          state,
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
            filters,
          })
        )
        .where({ rpc: rpc })
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize,
        })
        .then((res) => {
          return utils.getPaginatedResponse(res);
        });

      response.result = response.result.map((college) => {
        const { rpc, zone } = college;
        const stateId = rpc.state || zone.state;
        const state = states.find((s) => s.id === stateId);
        return {
          ...college,
          state,
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
            filters,
          })
        )
        .where({ id: college })
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("college") : pageSize,
        })
        .then((res) => {
          return utils.getPaginatedResponse(res);
        });

      response.result = response.result.map((college) => {
        const { rpc, zone } = college;
        const stateId = rpc.state || zone.state;
        const state = states.find((s) => s.id === stateId);
        return {
          ...college,
          state,
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
    response.state = states.find((s) => s.id === stateId);
    return utils.getFindOneResponse(response);
  },

  async showStudents(ctx) {
    const { id } = ctx.params;
    const { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    const college = await strapi.query("college").findOne({ id });
    if (!college) {
      return ctx.response.notFound("College does not exist");
    }

    // Get all users Ids belongs to college
    const userIds = await strapi.services.college.getUsers(id);

    let students = await strapi
      .query("student")
      .model.query(
        buildQuery({
          model: strapi.models.student,
          filters,
        })
      )
      .fetchAll()
      .then((model) => model.toJSON());

    const filtered = students.reduce((acc, student) => {
      const user = student.user;
      if (_.includes(userIds, student.user.id)) {
        student.user = sanitizeUser(user);
        acc.push(student);
      }
      return acc;
    }, []);

    const response = utils.paginate(filtered, page, pageSize);

    return { result: response.result, ...response.pagination };
  },

  /**
   *
   * @param {ids} ctx
   * This will block single or multiple colleges from array
   */
  async block(ctx) {
    const { ids } = ctx.request.body;
    let idsToBlock;
    if (!ids) {
      return ctx.response.badRequest("Missing ids field");
    }

    if (typeof ids === "number") {
      idsToBlock = [ids];
    }

    if (typeof ids === "object") {
      idsToBlock = ids;
    }

    if (!idsToBlock.length) {
      return ctx.response.badRequest("College Ids are empty");
    }

    await strapi
      .query("college")
      .model.query((qb) => {
        qb.whereIn("id", idsToBlock);
      })
      .save({ blocked: true }, { patch: true, require: false });

    return utils.getFindOneResponse({});
  },

  /**
   *
   * @param {ids} ctx
   * This will unblock single or multiple colleges from array
   */
  async unblock(ctx) {
    const { ids } = ctx.request.body;
    let idsToBlock;
    if (!ids) {
      return ctx.response.badRequest("Missing ids field");
    }

    if (typeof ids === "number") {
      idsToBlock = [ids];
    }

    if (typeof ids === "object") {
      idsToBlock = ids;
    }

    if (!idsToBlock.length) {
      return ctx.response.badRequest("College Ids are empty");
    }

    await strapi
      .query("college")
      .model.query((qb) => {
        qb.whereIn("id", idsToBlock);
      })
      .save({ blocked: false }, { patch: true, require: false });

    return utils.getFindOneResponse({});
  },

  /**
   * @return {Array}
   * This will fetch all events related to college
   */
  async event(ctx) {
    const { id } = ctx.params;
    let { page, pageSize, query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    const college = await strapi.query("college").findOne({ id }, []);
    if (!college) {
      return ctx.response.notFound("College does not exist");
    }

    const events = await strapi
      .query("event")
      .model.query(
        buildQuery({
          model: strapi.models["event"],
          filters,
        })
      )
      .fetchAll()
      .then((model) => model.toJSON());

    /**
     * Get all events for specific college
     */
    const filtered = await strapi.services.college.getEvents(college, events);
    const { result, pagination } = utils.paginate(filtered, page, pageSize);
    return { result, ...pagination };
  },

  /**
   * @return {Array}
   * This will fetch all training related to college
   */
  async activity(ctx) {
    const { id } = ctx.params;
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("activity")
      .model.query(
        buildQuery({
          model: strapi.models.activity,
          filters,
        })
      )
      .where({ college: id })
      .fetchPage({
        page: page,
        pageSize:
          pageSize < 0 ? await utils.getTotalRecords("activity") : pageSize,
      })
      .then((res) => {
        return utils.getPaginatedResponse(res);
      });

    // let { stream_id } = query;
    // let stream = [];
    // console.log(stream_id);
    // if (stream_id) {
    //   for (let i = 0; i < stream_id.length; i++) {
    //     stream[i] = parseInt(stream_id[i]);
    //   }
    // }

    // const college = await strapi.query("college").findOne({ id: id });

    // if (!college) {
    //   return ctx.response.notFound("College does not exist");
    // }
    // let activity = await strapi.query("activity").find({ college: id });

    // if (stream) {
    //   activity = activity.filter((activity) => {
    //     const { streams } = activity;

    //     const streamIds = streams.map((s) => s.id);

    //     if (stream.every((val) => streamIds.includes(val))) {
    //       return activity;
    //     }
    //   });
    // }
    // return utils.paginate(activity, page, pageSize);
  },
};
