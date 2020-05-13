"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

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

    let sort;
    if (filters.sort) {
      sort = filters.sort;
      filters = _.omit(filters, ["sort"]);
    }

    /**
     * For authenticated user
     */
    let rpc = await strapi.services.rpc.getRoleWiseRpcs(
      ctx.state.user,
      filters
    );

    // Sorting ascending or descending on one or multiple fields
    if (sort && sort.length) {
      rpc = utils.sort(rpc, sort);
    }

    const response = utils.paginate(rpc, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
    // if (role.name === "Zonal Admin") {
    //   return strapi
    //     .query("rpc")
    //     .model.query(
    //       buildQuery({
    //         model: strapi.models.rpc,
    //         filters
    //       })
    //     )
    //     .where({ zone: zone })
    //     .fetchPage({
    //       page: page,
    //       pageSize: pageSize < 0 ? await utils.getTotalRecords("rpc") : pageSize
    //     })
    //     .then(res => {
    //       return utils.getPaginatedResponse(res);
    //     });
    // }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("rpc").findOne({ id });
    return utils.getFindOneResponse(response);
  },

  /**
   * Get colleges under RPC.
   * @return {Object|Array}
   */
  async colleges(ctx) {
    const { id } = ctx.params;
    const { query } = utils.getRequestParams(ctx.request.query);
    const filters = convertRestQueryParams(query);

    return strapi
      .query("college")
      .model.query(
        buildQuery({
          model: strapi.models.college,
          filters
        })
      )
      .where({ rpc: id })
      .fetchAll()
      .then(model => {
        return utils.getResponse(model);
      });
  }
};
