"use strict";

/**
 * `validateOrganization` policy.
 */
const { PLUGIN } = require("../constants");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In validateOrganization policy.");
  const {
    name,
    college_code,
    address_1,
    email,
    rpc,
    zone,
    district,
    principal,
    stream_strength
  } = ctx.request.body;

  /**
   * Required fields
   * Name, college_code, address_1 and email
   */
  if (!name) return ctx.response.badRequest(" Name field is missing");

  if (!college_code) return ctx.response.badRequest("College code is missing");

  if (!address_1) return ctx.response.badRequest("Address field is missing");
  if (!zone) return ctx.response.badRequest("Zone field is missing");
  if (!rpc) return ctx.response.badRequest("RPC field is missing");

  if (!email) return ctx.response.badRequest("College Email field is missing");

  /**
   * Foreign key fields which need to check, if they exist
   * Since strapi default behavior does not check if they are present
   * If object is not present in DB, It simple attach empty object
   */

  if (name) {
    const college = await strapi
      .query("organization", PLUGIN)
      .findOne({ name: name, rpc: rpc, zone: zone });
    if (college)
      return ctx.response.badRequest(
        "College cna't be created with the given name"
      );
  }

  if (college_code) {
    const college = await strapi
      .query("organization", PLUGIN)
      .findOne({ college_code: college_code });
    if (college)
      return ctx.response.badRequest("College already exist with college code");
  }

  if (rpc) {
    const rpcId = typeof rpc === "number" ? rpc : rpc.id;
    const isValid = await strapi.query("rpc").findOne({ id: rpcId });
    if (!isValid) return ctx.response.badRequest("RPC is invalid");
  }

  if (zone) {
    const zoneId = typeof zone === "number" ? zone : zone.id;
    const isValid = await strapi.query("zone").findOne({ id: zoneId });
    if (!isValid) return ctx.response.badRequest("Zone is invalid");
  }

  if (district) {
    const districtId = typeof district === "number" ? district : district.id;
    const isValid = await strapi
      .query("district", PLUGIN)
      .findOne({ id: districtId });
    if (!isValid) return ctx.response.badRequest("District is invalid");
  }

  if (principal) {
    const userId = typeof principal === "number" ? principal : principal.id;
    const isValid = await strapi
      .query("user", "users-permissions")
      .findOne({ id: userId });
    if (!isValid) return ctx.response.badRequest("Principal is invalid");
  }

  if (stream_strength.length) {
    const streamIds = stream_strength.map(s =>
      typeof s.stream === "number" ? s.stream : s.stream.id
    );
    const result = await Promise.all(
      streamIds.map(async id => {
        return await strapi.query("stream").findOne({ id });
      })
    );

    if (result.some(s => s === null))
      return ctx.response.badRequest("Streams are invalid");
  }

  await next();
};
