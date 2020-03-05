"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/config.js");
const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Retrieve authenticated student.
   * @return {Object}
   */
  async me(ctx) {
    const user = ctx.state.user;
    let data;
    await bookshelf
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
        data = sanitizeEntity(u, {
          model: strapi.query("student").model
        });
      });

    ctx.send(data);
  },
  async register(ctx) {
    /* const { otp, contact_number } = ctx.request.body;
    let result, user;
    let today = new Date();
    const {
      username,
      email,
      password,
      college_id,
      first_name,
      last_name,
      stream,
      father_first_name,
      father_last_name,
      district,
      physicallyHandicapped,
      gender,
      address,
      date_of_birth,
      roll_number
    } = ctx.request.body;
    let college, rpc, state, zone;
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
    bookshelf.transaction(t => {
      return bookshelf
        .model("otp")
        .where({ contact_number: contact_number, otp: otp, isVerified: null })
        .fetch()
        .then(data => {
          result = data.toJSON();
          let createdAt = new Date(result.created_at);
          const diff = (today.getTime() - createdAt.getTime()) / 60000;

          if (diff > 60.0) {
            ctx.response.requestTimeout("OTP has expired");
          } else {
            data.save(
              { isVerified: true },
              { patch: true },
              { transacting: t }
            );
            console.log(data.toJSON());
            return bookshelf
              .model("user")
              .forge({
                username: username,
                email: email,
                password: password,
                role: 7,
                first_name: first_name,
                last_name: last_name,
                contact_number: contact_number,
                state: state,
                zone: zone.id,
                rpc: rpc.id,
                college: college_id
              })
              .save(null, { transacting: t })
              .then(data => {
                console.log(data.toJSON());
                user = data.toJSON();
                console.log(user.id);
                return bookshelf
                  .model("student")
                  .forge({
                    user: user.id,
                    Stream: stream,
                    father_first_name: father_first_name,
                    father_last_name: father_last_name,
                    address: address,
                    date_of_birth: date_of_birth,
                    gender: gender,
                    roll_number: roll_number,
                    district: district,
                    physicallyHandicapped: physicallyHandicapped
                    //document field still needs to be added.
                  })
                  .save(null, { transacting: t })
                  .then(data => {
                    console.log(data.toJSON());
                  });
              });
          }
        });
    });
  */
  }
};
