"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  find: async () => {
    const result = await strapi.query("board").find({});
    return {
      result
    };
  }
};
