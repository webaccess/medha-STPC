"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { convertRestQueryParams, buildQuery } = require("strapi-utils");
const utils = require("../../../config/utils.js");
module.exports = {
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);
    /**
     * Public route
     */
    if (!ctx.state.user) {
      return strapi
        .query("state")
        .model.query(
          buildQuery({
            model: strapi.models.state,
            filters
          })
        )
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("state") : pageSize,
          columns: ["id", "name"]
        })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }
    /**
     * For authenticated user
     */
    const { role } = ctx.state.user;
    if (role.name === "Medha Admin" || role.name === "Admin") {
      return strapi
        .query("state")
        .model.query(
          buildQuery({
            model: strapi.models.state,
            filters
          })
        )
        .fetchPage({
          page: page,
          pageSize:
            pageSize < 0 ? await utils.getTotalRecords("state") : pageSize
        })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("state").findOne({ id });
    return utils.getFindOneResponse(response);
  },

  /**
   * @return {Object}
   */
  async zones(ctx) {
    const { id } = ctx.params;
    const { query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("zone")
      .model.query(
        buildQuery({
          model: strapi.models.zone,
          filters
        })
      )
      .where({ state: id })
      .fetchAll()
      .then(res => {
        return utils.getResponse(res);
      });
  },

  /**
   * @return {Object}
   */
  async rpcs(ctx) {
    const { id } = ctx.params;
    const { query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("rpc")
      .model.query(
        buildQuery({
          model: strapi.models.rpc,
          filters
        })
      )
      .where({ state: id })
      .fetchAll()
      .then(res => {
        return utils.getResponse(res);
      });
  },

  /**
   * @return {Object}
   */
  async colleges(ctx) {
    const { id } = ctx.params;

    const state = await strapi.query("state").findOne({ id });
    if (!state) {
      return ctx.response.notFound("State does not exist");
    }

    /**
     * Since we don't have direct relation from state and college
     * we'll get zones and rpc under that state and query them
     */

    const zones = await strapi.query("zone").find({ state: id });
    const rpcs = await strapi.query("rpc").find({ state: id });

    const zoneIds = zones.map(z => z.id);
    const rpcIds = rpcs.map(r => r.id);

    const colleges = await strapi
      .query("college")
      .model.query(qb => {
        qb.where("zone", "in", zoneIds).orWhere("rpc", "in", rpcIds);
      })
      .fetchAll()
      .then(model => model.toJSON());

    const response = colleges.map(c => {
      return {
        id: c.id,
        name: c.name
      };
    });

    return utils.getFindOneResponse(response);
  }
};
