"use strict";

/**
 * `isIndividualDeleteAllowed` policy.
 */
const { PLUGIN } = require("../constants");
const _ = require("lodash");
module.exports = async (ctx, next) => {
  // Add your own logic here.
  console.log("In isIndividualDeleteAllowed policy.");

  let user = ctx.state.user;
  let { id } = ctx.request.body;

  if (user.role.name === "Medha Admin") {
    await next();
  } else if (user.role.name === "College Admin") {
    const user_1 = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: user.contact });
    const college = user_1.individual.organization;
    let student = await Promise.all(
      id.map(async id => {
        const contact = await strapi
          .query("contact", PLUGIN)
          .findOne({ id: id });

        if (contact && contact.individual.organization === college) {
          return id;
        }
      })
    );
    student = student.filter(c => c);

    const notStudent = _.pullAll(id, student);

    ctx.request.body["id"] = student;
    await next();
  } else if (user.role.name === "RPC Admin") {
    console.log("rpc admin");
    let student = await Promise.all(
      id.map(async id => {
        const contact = await strapi
          .query("contact", PLUGIN)
          .findOne({ id: id });
        if (contact && contact.user.rpc === user.rpc) {
          return id;
        }
      })
    );
    student = student.filter(c => c);

    const notStudent = _.pullAll(id, student);
    ctx.request.body["id"] = student;
    await next();
  } else return ctx.response.forbidden();
  // await next();
};
