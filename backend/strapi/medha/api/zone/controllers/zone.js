"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const bookshelf = require("../../../config/config.js");
const utils = require("../../../config/utils.js");
const { convertRestQueryParams, buildQuery } = require("strapi-utils");
module.exports = {
  /**
   * Retrieve Zones.
   * Depending on user's role appropriate Zones will be returned
   * medha-admin/ admin will get all available Zones
   * zonal-admin will get his zone
   * @return {Array}
   */
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    /**
     * Public role for zones
     */
    if (!ctx.state.user) {
      return strapi
        .query("zone")
        .model.query(
          buildQuery({
            model: strapi.models.zone,
            filters
          })
        )
        .fetchPage({
          page: page,
          pageSize: pageSize,
          columns: ["id", "name"]
        })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }

    /**
     * Authenticated Role
     */

    const { role, zone } = ctx.state.user;
    if (role.name === "Medha Admin" || role.name === "Admin") {
      return strapi
        .query("zone")
        .model.query(
          buildQuery({
            model: strapi.models.zone,
            filters
          })
        )
        .fetchPage({ page: page, pageSize: pageSize })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }

    if (role.name === "Zonal Admin") {
      return strapi
        .query("zone")
        .model.query(
          buildQuery({
            model: strapi.models.zone,
            filters
          })
        )
        .where({
          id: zone
        })
        .fetchPage({ page: page, pageSize: pageSize })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }
  },

  /**
   * Retrieve all rpcs under zone
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
      .where({
        zone: id
      })
      .fetchAll()
      .then(res => {
        return utils.getResponse(res);
      });
  },

  /**
   * Retrieve all colleges under zone
   * @return {Object}
   */
  async colleges(ctx) {
    // TODO remove bookshelf
    const { id } = ctx.params;
    const { query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return bookshelf
      .model("college")
      .query(
        buildQuery({
          model: strapi.models.college,
          filters
        })
      )
      .fetchAll({
        withRelated: [
          "rpc.zone",
          {
            rpc: qb => {
              qb.where({ zone: id });
            }
          }
        ]
      })
      .then(res => {
        const response = utils.getResponse(res);
        response.result = response.result
          .map(college => {
            if (Object.keys(college.rpc).length) {
              return college;
            }
          })
          .filter(a => a);
        return response;
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("zone").findOne({ id });
    return utils.getFindOneResponse(response);
  }
};
