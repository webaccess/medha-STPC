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
  ROLE_RPC_ADMIN
} = require("../../../config/constants.js");
module.exports = {
  getRoleWiseRpcs: async (user, filters) => {
    let rpc, role;
    rpc = user ? user.rpc : null;
    role = user ? user.role.name : "Public";
    switch (role) {
      case ROLE_MEDHA_ADMIN:
      case ROLE_ADMIN:
        return await strapi
          .query("rpc")
          .model.query(
            buildQuery({
              model: strapi.models.rpc,
              filters
            })
          )
          .fetchAll()
          .then(res => res.toJSON());
      case ROLE_RPC_ADMIN:
        return await strapi
          .query("rpc")
          .model.query(
            buildQuery({
              model: strapi.models.rpc,
              filters
            })
          )
          .where({
            id: rpc
          })
          .fetchAll()
          .then(res => res.toJSON());
      default:
        return await strapi
          .query("rpc")
          .model.query(
            buildQuery({
              model: strapi.models.rpc,
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
