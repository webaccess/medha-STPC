"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
var crypto = require("crypto");
const utils = require("../../../config/utils.js");
const { PLUGIN } = require("../../../config/constants");
const bookshelf = require("../../../config/bookshelf");

module.exports = {
  async requestOTP(ctx) {
    const num = ctx.request.body.contact_number;
    const OTP = Math.floor(100000 + Math.random() * 900000);
    await strapi.services.otp.sendOTP(num, OTP);
    return await strapi
      .query("otp")
      .model.forge({ contact_number: num, otp: OTP })
      .save()
      .then(() => {
        return {
          result: { status: "Ok" }
        };
      });
  },

  async updateContact(ctx) {
    const { old_contact_number, new_contact_number, otp } = ctx.request.body;
    let today = new Date();
    const otpModel = await strapi
      .query("otp")
      .model.query(qb => {
        qb.where({
          contact_number: new_contact_number,
          otp: otp,
          is_verified: null
        });
        qb.orWhere({
          contact_number: new_contact_number,
          otp: otp,
          is_verified: false
        });
      })
      .fetch()
      .then(model => model);
    if (!otpModel) {
      return ctx.response.badRequest("OTP is invalid");
    }
    const result = otpModel.toJSON ? otpModel.toJSON() : otpModel;
    let createdAt = new Date(result.created_at);

    const diff = (today.getTime() - createdAt.getTime()) / 60000;
    if (diff > 60.0) {
      return ctx.response.badRequest("OTP has expired");
    } else {
      await bookshelf
        .transaction(async t => {
          await otpModel.save(
            { is_verified: true },
            { patch: true, transacting: t }
          );

          const contact = await strapi
            .query("contact", PLUGIN)
            .model.where({ phone: old_contact_number })
            .fetch()
            .then(model => model);

          const stud = contact.toJSON ? contact.toJSON() : contact;
          if (!stud) {
            return Promise.reject("Contact does not exist");
          }

          await contact.save(
            { phone: new_contact_number },
            { patch: true, transacting: t }
          );

          await strapi
            .query("user", "users-permissions")
            .model.where({ id: stud.user.id })
            .save(
              { username: new_contact_number },
              { patch: true, transacting: t }
            );

          return new Promise(resolve => resolve(contact));
        })
        .then(success => {
          return ctx.send(utils.getFindOneResponse(success));
        })
        .catch(error => {
          return ctx.response.badRequest(error);
        });
    }
  },

  async validateOTP(ctx) {
    const { otp, contact_number } = ctx.request.body;
    let today = new Date();

    const otpModel = await strapi
      .query("otp")
      .model.query(qb => {
        qb.where({
          contact_number: contact_number,
          otp: otp,
          is_verified: null
        });
        qb.orWhere({
          contact_number: contact_number,
          otp: otp,
          is_verified: false
        });
      })
      .fetch()
      .then(model => model);

    const result = otpModel.toJSON ? otpModel.toJSON() : otpModel;
    let createdAt = new Date(result.created_at);

    const diff = (today.getTime() - createdAt.getTime()) / 60000;
    if (diff > 60.0) {
      return ctx.response.badRequest("OTP has expired");
    } else {
      await bookshelf
        .transaction(async t => {
          await otpModel.save(
            { is_verified: true },
            { patch: true, transacting: t }
          );

          const resetPasswordToken = crypto.randomBytes(64).toString("hex");

          const contact = await strapi
            .query("contact", PLUGIN)
            .findOne({ phone: contact_number });

          if (!contact) {
            return Promise.reject("Contact does not exist");
          }

          await strapi
            .query("user", "users-permissions")
            .model.where({ id: contact.user.id })
            .save(
              { resetPasswordToken: resetPasswordToken },
              { patch: true, transacting: t }
            );

          return new Promise(resolve => resolve(resetPasswordToken));
        })
        .then(success => {
          return ctx.send(utils.getFindOneResponse(success));
        })
        .catch(error => {
          return ctx.response.badRequest(error);
        });
    }
  },

  async requestOTPForStudent(ctx) {
    const { contact_number } = ctx.request.body;
    const OTP = Math.floor(100000 + Math.random() * 900000);
    await strapi.services.otp.sendOTP(contact_number, OTP);
    await strapi
      .query("otp")
      .model.forge({ contact_number: contact_number, otp: OTP })
      .save();
    return {
      result: { status: "Ok" }
    };
  },

  async checkOtp(ctx) {
    const { contact_number, otp } = ctx.request.body;

    const contact = await strapi
      .query("contact", PLUGIN)
      .findOne({ phone: contact_number });

    console.log(contact_number, contact);
    if (contact) {
      return ctx.response.badRequest("User already registered");
    } else {
      const verifyOTP = await strapi
        .query("otp")
        .model.query(qb => {
          qb.where({
            contact_number: contact_number,
            otp: otp,
            is_verified: null
          });
          qb.orWhere({
            contact_number: contact_number,
            otp: otp,
            is_verified: false
          });
        })
        .fetch()
        .then(model => model);

      if (!verifyOTP) {
        return ctx.response.badRequest("OTP is invalid");
      }

      return {
        result: { status: "Ok" }
      };
    }
  }
};
