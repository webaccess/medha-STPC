"use strict";
// const knex = require("knex")({
//   client: "pg",
//   connection: {
//     host: "localhost",
//     port: "5432",
//     user: "medha",
//     password: "medha",
//     database: "medha"
//   }
// });
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
      .where({ id: rpc.zone })
      .fetch({ require: false })
      .then(data => {
        return data ? data.toJSON() : null;
      });

    if (!zone) {
      return ctx.response.notFound("Zone does not exist");
    }

    const studentRole = await bookshelf
      .model("role")
      .where({ name: "Authenticated" })
      .fetch({ require: false })
      .then(model => (model ? model.toJSON() : null));

    const requestBody = ctx.request.body;
    const userRequestBody = Object.assign(
      {
        state: requestBody.state,
        zone: zone.id,
        rpc: rpc.id,
        college: college.id,
        role: studentRole.id
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
            "college_id"
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

    // try {
    //   await knex.transaction(async trx => {
    //     const queries = [];
    //     const otp1 = await knex("otps")
    //       .where({ otp: otp, contact_number: contact_number })
    //       .update({ is_verified: true })
    //       .transacting(trx);
    //     // queries.push(query);

    //     const user1 = await knex("users-permissions_user")
    //       .insert(user)
    //       .transacting(trx);
    //     //queries.push(query);

    //     console.log(user1);

    //     const usr = await knex("users-permissions_user")
    //       .where({ contact_number: contact_number })
    //       .select("id")
    //       .transacting(trx);
    //     console.log(usr);

    //     const student = Object.assign(
    //       { user: usr[0].id },
    //       _.omit(ctx.request.body, [
    //         "username",
    //         "email",
    //         "password",
    //         "first_name",
    //         "last_name",
    //         "contact_number",
    //         "otp",
    //         "college_id"
    //       ])
    //     );
    //     console.log(student);

    //     const stud = await knex("students")
    //       .insert(student)
    //       .transacting(trx);

    //     // Promise.all(queries)
    //     //   .then(trx.co)
    //     //   .catch(trx.rollback);
    //     ctx.body = { status: "ok" };
    //   });
    // } catch (err) {
    //   console.log(err);
    //   ctx.body = err;
    // }
  }
};
