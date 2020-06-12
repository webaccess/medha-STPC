"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  create: async ctx => {
    const files = ctx.request.files;
    let entry;

    if (ctx.request.files && ctx.request.body.data) {
      let { data } = ctx.request.body;
      data = JSON.parse(data);
      entry = await strapi.query("document").create(data);
      // automatically uploads the files based on the entry and the model
      await strapi.plugins.upload.services.upload.uploadToEntity(
        {
          id: entry.id || entry._id,
          model: "document"
        },
        { file: files["files.file"] }
      );
    } else {
      return ctx.response.badRequest("file is missing");
    }

    return entry;
  }
};
