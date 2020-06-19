"use strict";

/**
 * `validateEducation` policy.
 */
const _ = require("lodash");

module.exports = async (ctx, next) => {
  // Add your own logic here.

  let educations = await strapi
    .query("education")
    .find({ contact: ctx.state.user.contact });

  if (ctx.method == "PUT") {
    const { id } = ctx.params;
    educations = educations.filter(education => {
      if (education.id != id) {
        return education;
      }
    });
  }

  const requestData = ctx.request.body;

  const isAlreadyPursuing = educations.map(education => !!education.pursuing);

  /**
   * Checking is individual has any education as pursuing
   * If yes then check if current education pursuing or not
   * If yes then DO NOT allow
   * else allow education to add new record
   */
  if (isAlreadyPursuing.some(val => val == true) && !!requestData.pursuing) {
    return ctx.response.badRequest(
      "You already pursuing education...you cannot have another"
    );
  }

  /**
   * Individual educations cannot have same year of passing
   * ie you will have different year of passing for different educations
   */

  const yearOfPassingIds = educations.map(
    education => education.year_of_passing.id
  );

  if (
    requestData.year_of_passing &&
    _.includes(yearOfPassingIds, requestData.year_of_passing)
  ) {
    return ctx.response.badRequest(
      "You cannot have same year of passing for different educations"
    );
  }

  await next();
};
