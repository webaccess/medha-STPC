"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
var crypto = require("crypto");
const bookshelf = require("../../../config/config.js");
module.exports = {
  async requestotp(ctx, next) {
    const num = ctx.request.body.contact_number;
    const buffer = crypto.randomBytes(2);
    const OTP = parseInt(buffer.toString("hex"), 16);
    try {
      const result = await bookshelf
        .model("otp")
        .forge({ contact_number: num, otp: OTP })
        .save();
      if (result) ctx.body = { status: "OK" };
    } catch (err) {
      console.log(err);
    }
  },
  async validateotp(ctx, next) {
    const { otp, contact_number } = ctx.request.body;
    let today = new Date();

    try {
      const data = await bookshelf
        .model("otp")
        .where({ contact_number: contact_number, otp: otp, isVerified: null })
        .fetch();

      const result = data.toJSON();
      let createdAt = new Date(result.created_at);

      const diff = (today.getTime() - createdAt.getTime()) / 60000;
      if (diff > 60.0) {
        ctx.response.requestTimeout("OTP has expired");
      } else {
        data.save({ isVerified: true }, { patch: true });

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

        ctx.body = { resetPasswordToken };
      }
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  },
  async requestotpforstudent(ctx, next) {
    const { contact_number } = ctx.request.body;
    let OTP, buffer;
    try {
      const data = await bookshelf
        .model("user")
        .where({ contact_number: contact_number })
        .fetch();
      if (!!data) {
        ctx.response.forbidden("user already exist");
      } else {
        buffer = crypto.randomBytes(2);
        OTP = parseInt(buffer.toString("hex"), 16);
        console.log(OTP);
        await bookshelf
          .model("otp")
          .forge({ contact_number: contact_number, otp: OTP })
          .save();
        ctx.body = "ok";
      }
    } catch (err) {
      console.log(err);
    }
  }
};
