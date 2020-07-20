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
    addresses,
    email,
    rpc,
    zone,
    district,
    principal,
    stream_strength,
    phone
  } = ctx.request.body;

  /**
   * Required fields
   * Name, college_code, address_1 and email
   */

  if (ctx.request.method === "POST") {
    if (!name) return ctx.response.badRequest(" Name field is missing");

    if (!college_code)
      return ctx.response.badRequest("College code is missing");

    if (!addresses)
      return ctx.response.badRequest("Addresses field is missing");
    if (!zone) return ctx.response.badRequest("Zone field is missing");
    if (!rpc) return ctx.response.badRequest("RPC field is missing");

    if (!email)
      return ctx.response.badRequest("College Email field is missing");
    if (!phone)
      return ctx.response.badRequest("Contact Number Feild is missing");
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
          "College can't be created with the given name"
        );
    }

    if (phone) {
      const isContactPresent = await strapi
        .query("contact", PLUGIN)
        .findOne({ phone: phone });
      if (isContactPresent)
        return ctx.response.badRequest("Contact number already taken");
    }

    if (college_code) {
      const college = await strapi
        .query("organization", PLUGIN)
        .findOne({ college_code: college_code });
      if (college)
        return ctx.response.badRequest(
          "College already exist with college code"
        );
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
  }

  if (ctx.request.method === "PUT") {
    const { id } = ctx.params;

    const contact = await strapi.query("contact", PLUGIN).findOne({ id: id });

    if (!email) return ctx.response.badRequest("Email field is missing");
    else {
      const college = await strapi
        .query("contact", PLUGIN)
        .findOne({ id_nin: [id], email: email });
      if (college) return ctx.response.badRequest("Email already taken");
    }
    if (!phone)
      return ctx.response.badRequest("Contact Number field is missing");
    else {
      const isContactPresent = await strapi
        .query("contact", PLUGIN)
        .findOne({ id_nin: [id], phone: phone });
      if (isContactPresent)
        return ctx.response.badRequest("Contact number already taken");
    }

    await next();
  }
};
