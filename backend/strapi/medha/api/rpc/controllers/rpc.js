"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/config.js");
const { convertRestQueryParams, buildQuery } = require("strapi-utils");
module.exports = {
  /**
   * Retrieve RPCs.
   * Depending on user's role appropraite RPCs will be returned
   * medha-admin/ admin will get all available RPCs
   * zonal-admin will get RPCs under their zone
   * rpc-admin will get their repective RPC
   * @return {Object|Array}
   */
  async find(ctx) {
    const { role, rpc, zone } = ctx.state.user;
    let data;
    if (role.name === "Medha Admin" || role.name === "Admin") {
      // const result = await bookshelf
      //   .model("rpc")
      //   .fetchAll({ withRelated: ["zone"] });

      const filters = convertRestQueryParams(ctx.request.query);
      const result = await bookshelf
        .model("rpc")
        .query(
          buildQuery({
            model: strapi.models.rpc,
            filters
          })
        )
        .fetchAll({ withRelated: ["zone"] });
      data = result.toJSON();
    }

    if (role.name === "Zonal Admin") {
      const result = await bookshelf
        .model("rpc")
        .where({ zone: zone })
        .fetchAll({ withRelated: ["zone"] });
      data = result.toJSON();
    }

    if (role.name === "RPC Admin") {
      if (rpc) {
        const result = await bookshelf
          .model("rpc")
          .where({ id: rpc })
          .fetchAll({ withRelated: ["zone"] });
        data = result.toJSON();
      } else data = {};
    }

    ctx.send(data);
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
