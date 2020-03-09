"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
var crypto = require("crypto");
const bookshelf = require("../../../config/config.js");
const utils = require("../../../config/utils.js");

module.exports = {
  async requestOTP(ctx) {
    const num = ctx.request.body.contact_number;
    const buffer = crypto.randomBytes(2);
    const OTP = parseInt(buffer.toString("hex"), 16);
    return bookshelf
      .model("otp")
      .forge({ contact_number: num, otp: OTP })
      .save()
      .then(model => {
        const response = utils.getResponse(model);
        response.result = { status: "Ok" };
        return response;
      });
  },
  async validateOTP(ctx) {
    const { otp, contact_number } = ctx.request.body;
    let today = new Date();

    try {
      const data = await bookshelf
        .model("otp")
        .where({ contact_number: contact_number, otp: otp, is_verified: null })
        .fetch();

      const result = data.toJSON();
      let createdAt = new Date(result.created_at);

      const diff = (today.getTime() - createdAt.getTime()) / 60000;
      if (diff > 60.0) {
        ctx.response.badRequest("OTP has expired");
      } else {
        data.save({ is_verified: true }, { patch: true });

        const resetPasswordToken = crypto.randomBytes(64).toString("hex");

        await bookshelf
          .model("user")
          .where({ contact_number: contact_number })
          .fetch()
          .then(usr => {
            usr.save(
              { resetPasswordToken: resetPasswordToken },
              { pach: true }
            );
          });

        const response = utils.getResponse(null);
        response.result = { resetPasswordToken };
        ctx.body = response;
      }
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  },
  async requestOTPForStudent(ctx) {
    const { contact_number } = ctx.request.body;
    let OTP, buffer;
    try {
      const data = await bookshelf
        .model("user")
        .where({ contact_number: contact_number })
        .fetch();
      if (!!data) {
        ctx.response.forbidden("Student already exist...");
      } else {
        buffer = crypto.randomBytes(2);
        OTP = parseInt(buffer.toString("hex"), 16);
        await bookshelf
          .model("otp")
          .forge({ contact_number: contact_number, otp: OTP })
          .save();
        const response = utils.getResponse(null);
        response.result = { status: "Ok " };
        ctx.body = response;
      }
    } catch (err) {
      console.log(err);
    }
  },
  async checkOtp(ctx) {
    const { contact_number, otp } = ctx.request.body;

    try {
      await bookshelf
        .model("otp")
        .where({ contact_number: contact_number, otp: otp, is_verified: null })
        .fetch();
      const response = utils.getResponse(null);
      response.result = { status: "Ok" };
      ctx.body = response;
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  }
};
