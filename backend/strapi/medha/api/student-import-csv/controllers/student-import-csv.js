"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/bookshelf");
const _ = require("lodash");
const { ROLE_STUDENT, PLUGIN } = require("../../../config/constants");

module.exports = {
  preview: async ctx => {
    const { id } = ctx.params;

    const csv = await strapi.query("student-import-csv").findOne({ id });
    if (!csv) {
      return ctx.response.notFound("Requested file does not exist");
    }

    const inputFile = "./public" + csv.imported_file.url;
    return await strapi.services["student-import-csv"].getRecords(
      inputFile,
      true
    );
  },

  import: async ctx => {
    const { id } = ctx.params;

    const csv = await strapi.query("student-import-csv").findOne({ id });
    if (!csv) {
      return ctx.response.notFound("Requested file does not exist");
    }

    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: ROLE_STUDENT });

    const states = await strapi.query("state", PLUGIN).find({});
    const streams = await strapi.query("stream").find({});
    const districts = await strapi.query("district", PLUGIN).find({});
    const organization = await strapi.query("organization", PLUGIN).find({});

    const inputFile = "./public" + csv.imported_file.url;
    const records = await strapi.services["student-import-csv"].getRecords(
      inputFile
    );

    let errorRecords = [];
    for await (const record of records) {
      const userRequestBody = {};

      userRequestBody.username = record["Contact Number"];
      userRequestBody.email = record["Email"];
      userRequestBody.password = record["Contact Number"];
      userRequestBody.role = studentRole.id;

      const state = states.find(state => state.name == record["State"]);
      // user object state will be null for user student
      userRequestBody.state = null;

      userRequestBody.zone = null;
      userRequestBody.rpc = null;
      userRequestBody.blocked = false;

      userRequestBody.provider = "local";
      userRequestBody.password = await strapi.plugins[
        "users-permissions"
      ].services.user.hashPassword(userRequestBody);

      const individualRequestBody = {};

      const name = record["Name"].split(" ");

      individualRequestBody.first_name = (name[0] && name[0].trim()) || "";
      individualRequestBody.last_name = (name[1] && name[1].trim()) || "";

      const stream = streams.find(stream => stream.name == record["Stream"]);
      individualRequestBody.stream = stream ? stream.id : null;

      individualRequestBody.father_first_name =
        record["Father First Name"] || null;
      individualRequestBody.father_last_name =
        record["Father First Name"] || null;
      individualRequestBody.date_of_birth = record["DOB"] || null;
      individualRequestBody.gender = record["Gender"] || null;
      individualRequestBody.roll_number = record["Roll Number"] || null;

      const org = organization.find(org => org.name == record["organization"]);
      individualRequestBody.organization = org ? org.id : null;

      individualRequestBody.future_aspirations = null;
      individualRequestBody.is_physically_challenged = false;

      if (
        individualRequestBody.hasOwnProperty("date_of_birth") &&
        individualRequestBody["date_of_birth"]
      ) {
        var d = new Date(individualRequestBody["date_of_birth"]);
        var n = d.toISOString();
        individualRequestBody["date_of_birth"] = n;
      }

      const contactBody = {};

      contactBody.phone = record["Contact Number"];
      contactBody.email = record["Email"];
      contactBody.address_1 = record["Address"];
      contactBody.state = state ? state.id : null;

      const district = districts.find(
        district => district.name == record["District"]
      );
      contactBody.district = district ? district.id : null;

      contactBody.name = `${individualRequestBody.first_name} ${individualRequestBody.last_name}`;
      contactBody.contact_type = "individual";

      const academicYearId = await strapi.services[
        "academic-year"
      ].getCurrentAcademicYear();

      const academicHistoryBody = {
        academic_year: academicYearId,
        percentage: null,
        education_year: record["Year"]
      };

      await bookshelf
        .transaction(async t => {
          // Step 1 creating user
          const { user, userStatus } = await strapi
            .query("user", "users-permissions")
            .model.forge(userRequestBody)
            .save(null, { transacting: t })
            .then(model => {
              return { user: model };
            })
            .catch(err => {
              console.log(err);
              return { user: null, userStatus: err.detail };
            });

          if (!user) {
            return Promise.reject(userStatus);
          }

          // Step 2 creating individual
          const { individual, individualStatus } = await strapi
            .query("individual", PLUGIN)
            .model.forge(individualRequestBody)
            .save(null, { transacting: t })
            .then(model => {
              return { individual: model };
            })
            .catch(error => {
              console.log(error.message);
              return { individual: null, individualStatus: error.detail };
            });

          if (!individual) {
            return Promise.reject(individualStatus);
          }

          const userResponse = user.toJSON ? user.toJSON() : user;
          const individualResponse = individual.toJSON
            ? individual.toJSON()
            : individual;

          contactBody.individual = individualResponse.id;
          contactBody.user = userResponse.id;

          // Step 3 creating contact details
          const { contact, contactStatus } = await strapi
            .query("contact", PLUGIN)
            .model.forge(contactBody)
            .save(null, { transacting: t })
            .then(model => {
              return { contact: model };
            })
            .catch(error => {
              console.log(error.message);
              return { contact: null, contactStatus: error.detail };
            });

          if (!contact) {
            return Promise.reject(contactStatus);
          }

          // Mapping user and individual relations
          const contactResponse = contact.toJSON ? contact.toJSON() : contact;

          // Step 4 Adding academic details
          academicHistoryBody.contact = contactResponse.id;

          const { academicHistory, academicHistoryStatus } = await strapi
            .query("academic-history")
            .model.forge(academicHistoryBody)
            .save(null, { transacting: t })
            .then(model => {
              return { academicHistory: model };
            })
            .catch(error => {
              console.log(error);
              return { academicHistory: null, academicHistoryStatus: null };
            });

          if (!academicHistory) {
            return Promise.reject(academicHistoryStatus);
          }

          await user.save(
            { contact: contactResponse.id },
            { transacting: t, require: false }
          );
          await individual.save(
            { contact: contactResponse.id },
            { transacting: t, require: false }
          );

          return new Promise(resolve => resolve("Success"));
        })
        .then(success => {
          console.log(success);
        })
        .catch(error => {
          errorRecords.push({
            ...record,
            Error: error
          });
        });
    }

    if (errorRecords.length) {
      return errorRecords;
    }

    return { status: "Success" };
  }
};
