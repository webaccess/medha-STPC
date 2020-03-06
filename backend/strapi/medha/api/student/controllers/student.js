"use strict";
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    port: "5432",
    user: "medha",
    password: "medha",
    database: "medha"
  }
});
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/config.js");
const { sanitizeEntity } = require("strapi-utils");
const utils = require("../../../config/utils.js");
const _ = require("lodash");

module.exports = {
  /**
   * Retrieve authenticated student.
   * @return {Object}
   */
  async me(ctx) {
    const user = ctx.state.user;
    return await bookshelf
      .model("student")
      .where({ user: user.id })
      .fetch({
        withRelated: [
          "user.state",
          "user.zone",
          "user.rpc",
          "user.college",
          "stream",
          "educations"
        ]
      })
      .then(u => {
        const response = utils.getResponse(u);
        const data = sanitizeUser(response.result);
        response.result = data;
        return response;
      });
  },
  async register(ctx) {
    const { otp, contact_number } = ctx.request.body;
    let result, college, rpc, state, zone, college_id;
    let today = new Date();
    console.log(ctx.request.body);
    college_id = ctx.request.body.college_id;
    try {
      await bookshelf
        .model("college")
        .where({ id: college_id })
        .fetch()
        .then(data => {
          college = data.toJSON();
          console.log(college);
        });
      await bookshelf
        .model("rpc")
        .where({ id: college.rpc })
        .fetch()
        .then(data => {
          rpc = data.toJSON();
          console.log(rpc);
        });
      await bookshelf
        .model("zone")
        .where({ id: rpc.zone })
        .fetch()
        .then(data => {
          zone = data.toJSON();
          state = zone.state;
          console.log(zone);
        });

      // const data = await bookshelf.model("user").forge({username:username,email:email,password:password,role:7,first_name:first_name,last_name:last_name,contact_number:contact_number,state:state,zone:zone,rpc:rpc,college:college}).save();
    } catch (err) {
      console.log(err);
    }
    const user = Object.assign(
      {
        role: 6,
        state: state,
        zone: zone.id,
        rpc: rpc.id,
        college: college_id
      },
      _.omit(ctx.request.body, [
        "Stream",
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
    console.log(user);

    /*  bookshelf
      .transaction(t => {
        bookshelf
          .model("otp")
          .where({ contact_number: contact_number, otp: otp, isVerified: null })
          .fetch({ transacting: t })
          .then(data => {
            result = data.toJSON();
            let createdAt = new Date(result.created_at);
            const diff = (today.getTime() - createdAt.getTime()) / 60000;

            if (diff > 60.0) {
              ctx.response.requestTimeout("OTP has expired");
            } else {
              data
                .save({ isVerified: true }, { patch: true }, { transacting: t })
                .catch(t.rollback)
                .then(data => {
                  console.log(data.toJSON());

                  bookshelf
                    .model("user")
                    .forge(user)
                    // .forge({
                    //   username: username,
                    //   email: email,
                    //   password: password,
                    //   role: 6,
                    //   first_name: first_name,
                    //   last_name: last_name,
                    //   contact_number: contact_number,
                    //   state: state,
                    //   zone: zone.id,
                    //   rpc: rpc.id,
                    //   college: college_id
                    // })
                    .save(null, { transacting: t })
                    .then(data => {
                      console.log(data.toJSON());
                      const user1 = data.toJSON();
                      console.log(user1.id);
                      const student = Object.assign(
                        { user: user1.id },
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
                      console.log(student);
                      return (
                        bookshelf
                          .model("student")
                          .forge(student)
                          // .forge({
                          //   user: user.id,
                          //   Stream: stream,
                          //   father_first_name: father_first_name,
                          //   father_last_name: father_last_name,
                          //   address: address,
                          //   date_of_birth: date_of_birth,
                          //   gender: gender,
                          //   roll_number: roll_number,
                          //   district: district,
                          //   physicallyHandicapped: physicallyHandicapped
                          //   //document field still needs to be added.
                          // })
                          .save(null, { transacting: t })
                          .catch(t.rollback)
                          .then(t.commit, data => {
                            console.log(data.toJSON());
                          })
                      );
                    });
                });
            }
          });
      })
      .then(response => {
        console.log("success");
      })
      .catch(err => {
        console.log(err);
      });*/
    try {
      await knex.transaction(async trx => {
        const queries = [];
        const otp1 = await knex("otps")
          .where({ otp: otp, contact_number: contact_number })
          .update({ isVerified: true })
          .transacting(trx);
        // queries.push(query);

        const user1 = await knex("users-permissions_user")
          .insert(user)
          .transacting(trx);
        //queries.push(query);

        console.log(user1);

        const usr = await knex("users-permissions_user")
          .where({ contact_number: contact_number })
          .select("id")
          .transacting(trx);
        console.log(usr);

        const student = Object.assign(
          { user: usr[0].id },
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
        console.log(student);

        const stud = await knex("students")
          .insert(student)
          .transacting(trx);

        // Promise.all(queries)
        //   .then(trx.co)
        //   .catch(trx.rollback);
        ctx.body = { status: "ok" };
      });
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  }
};
