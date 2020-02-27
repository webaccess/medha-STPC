"use strict";

/**
 * `validate` policy.
 */
const bookshelf = require("../../../../config/config.js");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log(ctx.request.method);
  if (ctx.request.method === "POST") {
    const {
      name,
      college_code,
      address,
      college_email,
      rpc,
      streams
    } = ctx.request.body;

    if (!name) ctx.response.badRequest(" Name field is missing");

    if (!college_code) ctx.response.badRequest("College code is missing");

    if (!address) ctx.response.badRequest("Address field is missing");

    if (!college_email)
      ctx.response.badRequest("College Email  field is missing");

    if (rpc) {
      const data = await bookshelf
        .model("rpc")
        .where({ id: rpc })
        .fetch();

      if (data) {
        console.log("rpc exits!!");
      } else ctx.response.notFound("rpc doesn't exist");
    }
    if (streams) {
      const data = await bookshelf
        .model("stream")
        .where("id", "in", streams)
        .fetchAll();
      const result = data.toJSON();
      if (result[0]) {
        console.log("streams exists");
      } else ctx.response.notFound("streams doesn't exist");
    }

    await next();
  }

  if (ctx.request.method === "PUT") {
    const { rpc, streams, principal } = ctx.request.body;

    if (rpc) {
      const data = await bookshelf
        .model("rpc")
        .where({ id: rpc })
        .fetch();
      if (data) {
        console.log("rpc exits!!");
        await next();
      } else ctx.response.notFound("rpc doesn't exist");
    }
    if (streams) {
      const data = await bookshelf
        .model("stream")
        .where("id", "in", streams)
        .fetchAll();
      const result = data.toJSON();

      if (result[0]) {
        console.log("streams exists");
        await next();
      } else ctx.response.notFound("streams doesn't exist");
    }
  }
};
