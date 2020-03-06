"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/config.js");
const { convertRestQueryParams, buildQuery } = require("strapi-utils");
const utils = require("../../../config/utils.js");
module.exports = {
  /**
   * Retrieve RPCs.
   * Depending on user's role appropraite RPCs will be returned
   * medha-admin/ admin will get all available RPCs
   * zonal-admin will get RPCs under their zone
   * rpc-admin will get their repective RPC
   * @return {Object}
   */
  async find(ctx) {
    const { page, query, pageSize } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);
    /**
     * Public route
     */
    if (!ctx.state.user) {
      return await bookshelf
        .model("rpc")
        .query(
          buildQuery({
            model: strapi.models.rpc,
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
     * For authenticated user
     */
    const { role, rpc, zone } = ctx.state.user;
    if (role.name === "Medha Admin" || role.name === "Admin") {
      return await bookshelf
        .model("rpc")
        .query(
          buildQuery({
            model: strapi.models.rpc,
            filters
          })
        )
        .fetchPage({ page: page, pageSize: pageSize, withRelated: ["zone"] })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }

    if (role.name === "Zonal Admin") {
      return await bookshelf
        .model("rpc")
        .query(
          buildQuery({
            model: strapi.models.rpc,
            filters
          })
        )
        .where({ zone: zone })
        .fetchPage({ page: page, pageSize: pageSize, withRelated: ["zone"] })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }

    if (role.name === "RPC Admin") {
      return await bookshelf
        .model("rpc")
        .query(
          buildQuery({
            model: strapi.models.rpc,
            filters
          })
        )
        .where({ id: rpc })
        .fetchPage({ page: page, pageSize: pageSize, withRelated: ["zone"] })
        .then(res => {
          return utils.getPaginatedResponse(res);
        });
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    return await bookshelf
      .model("rpc")
      .where({ id: id })
      .fetch({
        require: false
      })
      .then(res => {
        return utils.getResponse(res);
      });
  },

  /**
   * Get colleges under RPC.
   * @return {Object|Array}
   */
  async colleges(ctx) {
    const { id } = ctx.params;
    return bookshelf
      .model("rpc")
      .where({ id: id })
      .fetch({ withRelated: ["zone", "colleges"] });
    // return bookshelf
    //   .model("rpc")
    //   .where({ id: id })
    //   .fetch({
    //     withRelated: [
    //       "zone",
    //       "colleges",
    //       {
    //         colleges: query => {
    //           query.where({ id: 1 });
    //         }
    //       }
    //     ]
    //   })
  }
};
