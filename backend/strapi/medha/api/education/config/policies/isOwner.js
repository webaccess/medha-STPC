"use strict";

/**
 * `isOwner` policy.
 * Only Medha admin and owner of education can create/update/delete entries
 */
const { PLUGIN } = require("../../../../config/constants");
module.exports = async (ctx, next) => {
  const { role, id } = ctx.state.user;

  if (ctx.request.method === "POST") {
    const { year_of_passing, qualification, contact, board } = ctx.request.body;

    if (!contact) {
      return ctx.response.badRequest("Student is compulsory");
    }
    if (!qualification) {
      return ctx.response.badRequest("Qualification is compulsory");
    }

    if (!year_of_passing) {
      return ctx.response.badRequest("Year Of Passing is compulsory");
    }

    if (
      qualification == "secondary" &&
      qualification == "senior_secondary" &&
      !board
    ) {
      return ctx.response.badRequest(
        "Board is compulsory for qualification 10th and 12th"
      );
    }

    const _board = await strapi.query("board").findOne({ id: board });
    if (!_board) {
      return ctx.response.notFound("Board does not exist");
    }

    const _yearOfPassing = await strapi
      .query("academic-year")
      .findOne({ id: year_of_passing });
    if (!_yearOfPassing) {
      return ctx.response.notFound("Year of passing does not exist");
    }

    const contact_1 = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: contact });

    if (!contact_1) {
      return ctx.response.notFound("Individual does not exist");
    }

    if (role.name === "College Admin") {
      let user = ctx.state.user;
      user = await strapi
        .query("contact", PLUGIN)
        .findOne({ id: user.contact });

      if (user.individual.organization !== contact_1.individual.organization)
        return ctx.response.unauthorized();
      else {
        await next();
      }
    } else if (
      role.name === "Medha Admin" ||
      contact_1.user.id === ctx.state.user.id
    ) {
      await next();
    } else {
      return ctx.response.unauthorized("You don't have permission to do this");
    }
  }

  // TODO: Which all admins can update/delete student education details
  if (ctx.request.method === "PUT") {
    const { contact } = ctx.request.body;
    const education = await strapi
      .query("education")
      .findOne({ id: ctx.params.id });
    console.log(education);
    if (role.name === "College Admin") {
      let user = ctx.state.user;
      user = await strapi
        .query("contact", PLUGIN)
        .findOne({ id: user.contact });

      const individual = await strapi
        .query("contact", PLUGIN)
        .findOne({ id: contact });

      if (user.individual.organization !== individual.individual.organization)
        return ctx.response.unauthorized();
      else {
        await next();
      }
    } else if (role.name === "Medha Admin" || education.contact.user === id) {
      await next();
    } else {
      return ctx.response.unauthorized("You don't have permission to do this");
    }
  }

  if (ctx.request.method === "DELETE") {
    const { contact } = ctx.request.body;
    const education = await strapi
      .query("education")
      .findOne({ id: ctx.params.id });
    console.log(education);
    if (role.name === "College Admin") {
      let user = ctx.state.user;
      user = await strapi
        .query("contact", PLUGIN)
        .findOne({ id: user.contact });

      const individual = await strapi
        .query("contact", PLUGIN)
        .findOne({ id: education.contact.id });

      if (user.individual.organization !== individual.individual.organization)
        return ctx.response.unauthorized();
      else {
        await next();
      }
    } else if (role.name === "Medha Admin" || education.contact.user === id) {
      await next();
    } else {
      return ctx.response.unauthorized("You don't have permission to do this");
    }
  }

  // await next();
};
