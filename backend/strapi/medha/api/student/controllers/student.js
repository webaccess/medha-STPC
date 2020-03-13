"use strict";
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/config.js");
const { sanitizeEntity } = require("strapi-utils");
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model
  });
const utils = require("../../../config/utils.js");
const _ = require("lodash");

module.exports = {
  /**
   * Retrieve authenticated student.
   * @return {Object}
   */
  // TODO replace with strapi
  async register(ctx) {
    const { otp, contact_number } = ctx.request.body;
    if (!otp) {
      return ctx.response.badRequest("OTP is missing");
    }

    if (!contact_number) {
      return ctx.response.badRequest("Contact no. is missing");
    }

    const collegeId = ctx.request.body.college_id;

    const college = await bookshelf
      .model("college")
      .where({ id: collegeId })
      .fetch({ require: false })
      .then(data => {
        return data ? data.toJSON() : null;
      });

    if (!college) {
      return ctx.response.notFound("College does not exist");
    }
    const rpc = await bookshelf
      .model("rpc")
      .where({ id: college.rpc })
      .fetch({ require: false })
      .then(data => {
        return data ? data.toJSON() : null;
      });

    if (!rpc) {
      return ctx.response.notFound("RPC does not exist");
    }

    const zone = await bookshelf
      .model("zone")
      .where({ id: college.zone })
      .fetch({ require: false })
      .then(data => {
        return data ? data.toJSON() : null;
      });

    if (!zone) {
      return ctx.response.notFound("Zone does not exist");
    }

    // const studentRole = await bookshelf
    //   .model("role")
    //   .where({ name: "Student" })
    //   .fetch({ require: false })
    //   .then(model => (model ? model.toJSON() : null));

    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: "Student" });
    const requestBody = ctx.request.body;
    console.log(ctx.request.body);
    const userRequestBody = Object.assign(
      {
        state: requestBody.state,
        zone: zone.id,
        rpc: rpc.id,
        college: college.id,
        role: studentRole.id,
        provider: "local",
        confirmed: false,
        blocked: false
      },
      _.omit(requestBody, [
        "stream",
        "father_first_name",
        "father_last_name",
        "date_of_birth",
        "gender",
        "roll_number",
        "district",
        "physicallyHandicapped",
        "address",
        "otp",
        "college_id"
      ])
    );

    userRequestBody.password = await strapi.plugins[
      "users-permissions"
    ].services.user.hashPassword(userRequestBody);

    await bookshelf
      .transaction(async t => {
        await bookshelf
          .model("otp")
          .where({
            contact_number: contact_number,
            otp: otp,
            is_verified: null
          })
          .fetch({ lock: "forUpdate", transacting: t, require: false })
          .then(otpModel => {
            if (!otpModel) {
              return Promise.reject({ column: "Please request new OTP" });
            }
            const otpData = otpModel.toJSON();
            const createdAt = new Date(otpData.created_at);
            const currentDate = new Date();
            const diff = (currentDate.getTime() - createdAt.getTime()) / 60000;
            if (diff > 60.0) {
              return Promise.reject({ column: "OTP is invalid or expired" });
            }

            otpModel.save(
              { is_verified: true },
              { patch: true, transacting: t }
            );
          });

        const _user = await bookshelf
          .model("user")
          .forge(userRequestBody)
          .save(null, { transacting: t })
          .then(userModel => userModel.toJSON());

        const studentRequestData = Object.assign(
          { user: _user.id },
          _.omit(ctx.request.body, [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "contact_number",
            "otp",
            "college_id",
            "state"
          ])
        );
        return await bookshelf
          .model("student")
          .forge(studentRequestData)
          .save(null, { transacting: t });
      })
      .then(success => {
        console.log(success);
        return ctx.send(utils.getResponse(success));
      })
      .catch(error => {
        console.log(error);
        return ctx.response.badRequest(`Invalid ${error.column}`);
      });
  }
};
