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
      return await bookshelf
        .model("zone")
        .query(
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
      return await bookshelf
        .model("zone")
        .query(
          buildQuery({
            model: strapi.models.zone,
            filters
          })
        )
        .fetchPage({ page: page, pageSize: pageSize, withRelated: ["state"] })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }

    if (role.name === "Zonal Admin") {
      return await bookshelf
        .model("zone")
        .query(
          buildQuery({
            model: strapi.models.zone,
            filters
          })
        )
        .where({
          id: zone
        })
        .fetchPage({ page: page, pageSize: pageSize, withRelated: ["state"] })
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
    return bookshelf
      .model("zone")
      .where({
        id: id
      })
      .fetch({ withRelated: ["rpcs"] });
  },

  /**
   * Retrieve all colleges under zone
   * @return {Object}
   */
  async colleges(ctx) {
    const { id } = ctx.params;
    return bookshelf
      .model("zone")
      .where({
        id: id
      })
      .fetch({ withRelated: ["rpcs.colleges", "rpcs.colleges.rpc"] })
      .then(res => {
        const data = res.toJSON();
        let colleges = data.rpcs.reduce((acc, rpc) => {
          acc.push(...rpc.colleges);
          return acc;
        }, []);
        delete data.rpcs;
        data.colleges = colleges;
        return data;
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    return await bookshelf
      .model("zone")
      .where({ id: id })
      .fetch({
        require: false
      })
      .then(res => {
        return utils.getResponse(res);
      });
  }
};
