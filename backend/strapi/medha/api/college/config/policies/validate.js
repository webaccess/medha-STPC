"use strict";

/**
 * `validate` policy.
 */
const bookshelf = require("../../../../config/config.js");
module.exports = async (ctx, next) => {
  // Add your own logic here.
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

    if (!rpc) ctx.response.badRequest("RPC field is missing");
    else {
      const data = await bookshelf
        .model("rpc")
        .where({ id: rpc })
        .fetch();

      if (data) {
      } else ctx.response.notFound("rpc doesn't exist");
    }
    console.log(streams);
    if (!streams || (streams && !streams.length)) await next();
    else {
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

  if (ctx.request.method === "PUT") {
    const { rpc, streams, principal } = ctx.request.body;

    let rpcData, streamData;
    if (rpc) {
      const rpcData = await bookshelf
        .model("rpc")
        .where({ id: rpc })
        .fetch();
      if (!rpcData) {
        ctx.response.notFound("rpc doesn't exist");
      }
    }
    if (streams) {
      const data = await bookshelf
        .model("stream")
        .where("id", "in", streams)
        .fetchAll();

      streamData = data.toJSON();
      console.log(streamData);
      if (!streamData.length) {
        ctx.response.notFound("streams doesn't exist");
      }
    }
    if (streamData.length || rpcData) await next();
  }
};
