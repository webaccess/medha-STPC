"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const { buildQuery } = require("strapi-utils");
const utils = require("../../../config/utils.js");
const {
  ROLE_MEDHA_ADMIN,
  ROLE_ADMIN,
  ROLE_ZONAL_ADMIN
} = require("../../../config/constants.js");

module.exports = {
  getRoleWiseZones: async (role, filters) => {
    switch (role) {
      case ROLE_MEDHA_ADMIN:
      case ROLE_ADMIN:
        return await strapi
          .query("zone")
          .model.query(
            buildQuery({
              model: strapi.models.zone,
              filters
            })
          )
          .fetchAll()
          .then(res => res.toJSON());
      case ROLE_ZONAL_ADMIN:
        return await strapi
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
          .fetchAll()
          .then(res => res.toJSON());
      default:
        return await strapi
          .query("zone")
          .model.query(
            buildQuery({
              model: strapi.models.zone,
              filters
            })
          )
          .fetchAll({
            columns: ["id", "name"]
          })
          .then(res => res.toJSON());
    }
  }
};
