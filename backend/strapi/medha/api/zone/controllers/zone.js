"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { convertRestQueryParams, buildQuery } = require("strapi-utils");
const _ = require("lodash");
const utils = require("../../../config/utils");

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
    let filters = convertRestQueryParams(query);

    let sort;
    if (filters.sort) {
      sort = filters.sort;
      filters = _.omit(filters, ["sort"]);
    }

    let zones = await strapi.services.zone.getRoleWiseZones(
      ctx.state.user,
      filters
    );

    // Sorting ascending or descending on one or multiple fields
    if (sort && sort.length) {
      zones = utils.sort(zones, sort);
    }

    const response = utils.paginate(zones, page, pageSize);
    return {
      result: response.result,
      ...response.pagination
    };
  },

  /**
   * Retrieve all colleges under zone
   * @return {Object}
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
      .where({ zone: id })
      .fetchAll()
      .then(res => {
        return utils.getResponse(res);
      });
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const response = await strapi.query("zone").findOne({ id });
    return utils.getFindOneResponse(response);
  }
};
