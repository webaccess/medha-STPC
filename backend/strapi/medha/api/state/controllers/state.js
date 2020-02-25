"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/config.js");
module.exports = {
  /**
   * @return {Array}
   */
  async zones(ctx) {
    const { id } = ctx.params;
    const data = await bookshelf
      .model("state")
      .where({ id: id })
      .fetchAll({ withRelated: ["zones"] });
    return ctx.send(data);
  }
};
