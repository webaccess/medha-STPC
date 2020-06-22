"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const _ = require("lodash");
const bookshelf = require("../../../config/bookshelf");
const { ROLE_STUDENT, PLUGIN } = require("../../../config/constants");
const { STREAMS } = require("../../../scripts/init_data/data");

module.exports = {
  getRecords: async (inputFile, preview) => {
    const file = fs.readFileSync(inputFile);
    const records = parse(file, {
      columns: true,
      skip_empty_lines: true
    });

    const result = records.reduce((result, record) => {
      result.push(
        _.pick(record, [
          "Name",
          "Gender",
          "DOB",
          "Contact Number",
          "Alternate Contact",
          "State",
          "District",
          "Email",
          "Qualification",
          "Stream",
          "Year"
        ])
      );
      return result;
    }, []);

    return preview ? result.slice(0, 3) : result;
  },

  createRecords: async (id, url) => {
    const inputFile = "./public" + url;
    const records = await strapi.services["student-import-csv"].getRecords(
      inputFile
    );

    for await (let record of records) {
      strapi
        .query("imported-records")
        .model.forge({
          fields: record,
          student_import_csv: id,
          message: null
        })
        .save(null)
        .then(model => {})
        .catch(error => {
          console.log("inside createRecords Service");
          console.log(error);
        });
    }

    return {
      id: id,
      tableData: records.slice(0, 5)
    };
  },

  getReportSummary: async (importFileId, records) => {
    const totalRecords = await strapi
      .query("imported-records")
      .find({ student_import_csv: importFileId });

    const importedRecords = totalRecords.filter(tr => tr.status == "completed");
    const pendingRecords = totalRecords.filter(tr => tr.status == "pending");
    const errorRecords = totalRecords.filter(tr => tr.status == "error");

    return {
      total: totalRecords.length,
      success: importedRecords.length,
      pending: pendingRecords.length,
      error: errorRecords.length,
      records
    };
  },

  getRecordWithStatus: async (importFileId, status) => {
    const records = await strapi
      .query("imported-records")
      .find({ student_import_csv: importFileId, status, _limit: 9999 });

    return records.map(record => {
      return { ...record.fields, Error: record.message };
    });
  },

  importRecords: async (ctx, records) => {
    const { id } = ctx.params;

    const states = await strapi.query("state", PLUGIN).find({});
    const streams = await strapi.query("stream").find({});
    const districts = await strapi.query("district", PLUGIN).find({});
    const studentRole = await strapi
      .query("role", "users-permissions")
      .findOne({ name: ROLE_STUDENT });

    const contactDetails = await strapi
      .query("contact", PLUGIN)
      .findOne({ id: ctx.state.user.contact });

    let errorRecords = [];
    let successIds = [];
    let failedIds = [];

    for (let index = 0; index < records.length; index++) {
      await new Promise(async next => {
        const data = records[index];
        const record = data.fields;
        await bookshelf
          .transaction(async t => {
            const userRequestBody = {};

            const { isError, message } = await strapi.services[
              "student-import-csv"
            ].validateRecord(record);

            if (isError) {
              return new Promise((resolve, reject) => reject(message));
            }

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

            individualRequestBody.first_name =
              (name[0] && name[0].trim()) || "";
            individualRequestBody.last_name = (name[1] && name[1].trim()) || "";

            const stream = streams.find(
              stream => stream.name == record["Stream"]
            );
            individualRequestBody.stream = stream ? stream.id : null;

            individualRequestBody.father_full_name =
              record["Father full name"] || null;
            individualRequestBody.mother_full_name =
              record["Mother full name"] || null;
            individualRequestBody.date_of_birth = record["DOB"] || null;
            individualRequestBody.gender = _.toLower(record["Gender"]) || null;
            individualRequestBody.roll_number = record["Roll Number"] || null;

            const org = contactDetails.individual
              ? contactDetails.individual.organization
              : null;
            individualRequestBody.organization = org;
            individualRequestBody.is_verified = true;
            individualRequestBody.is_physically_challenged = false;

            if (
              individualRequestBody.hasOwnProperty("date_of_birth") &&
              individualRequestBody["date_of_birth"]
            ) {
              var d = new Date(
                individualRequestBody["date_of_birth"].replace(
                  /(\d{2})-(\d{2})-(\d{4})/,
                  "$2/$1/$3"
                )
              );
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

            const educationBody = {
              year_of_passing: academicYearId,
              percentage: null,
              pursuing: true,
              education_year: _.toLower(record["Year"]),
              qualification: record["Qualification"]
            };

            // Step 1 creating user
            const { user, userStatus } = await strapi
              .query("user", "users-permissions")
              .model.forge(userRequestBody)
              .save(null, { transacting: t })
              .then(model => {
                const details = model.toJSON();
                console.log(`${details.username} inserted successfully`);
                return { user: model };
              })
              .catch(err => {
                console.log("shreesh ", err.detail);
                return { user: null, userStatus: err.detail };
              });

            if (!user) {
              return new Promise((resolve, reject) => reject(userStatus));
            }

            // // Step 2 creating individual
            const { individual, individualStatus } = await strapi
              .query("individual", PLUGIN)
              .model.forge(individualRequestBody)
              .save(null, { transacting: t })
              .then(model => {
                return { individual: model };
              })
              .catch(error => {
                console.log(error);
                return { individual: null, individualStatus: error.detail };
              });

            if (!individual) {
              return new Promise((resolve, reject) => reject(individualStatus));
            }

            const userResponse = user.toJSON ? user.toJSON() : user;
            const individualResponse = individual.toJSON
              ? individual.toJSON()
              : individual;

            contactBody.individual = individualResponse.id;
            contactBody.user = userResponse.id;

            // // Step 3 creating contact details
            const { contact, contactStatus } = await strapi
              .query("contact", PLUGIN)
              .model.forge(contactBody)
              .save(null, { transacting: t })
              .then(model => {
                return { contact: model };
              })
              .catch(error => {
                console.log("contact ", err.detail);
                return { contact: null, contactStatus: error.detail };
              });

            if (!contact) {
              return new Promise((resolve, reject) => reject(contactStatus));
            }

            // // Mapping user and individual relations
            const contactResponse = contact.toJSON ? contact.toJSON() : contact;

            // // Step 4 Adding academic details
            educationBody.contact = contactResponse.id;

            const { education, educationStatus } = await strapi
              .query("education")
              .model.forge(educationBody)
              .save(null, { transacting: t })
              .then(model => {
                return { education: model };
              })
              .catch(error => {
                console.log("Education ", err.detail);
                return { education: null, educationStatus: err.detail };
              });

            if (!education) {
              return new Promise((resolve, reject) => reject(educationStatus));
            }

            await user.save(
              { contact: contactResponse.id },
              { transacting: t, patch: true, method: "update" }
            );

            await individual.save(
              { contact: contactResponse.id },
              { transacting: t, patch: true, method: "update" }
            );

            await strapi
              .query("imported-records")
              .update({ id: data.id }, { status: "completed" });

            return new Promise(resolve => resolve("Success"));
          })
          .then(success => {
            // successIds.push(data.id);
            next();
          })
          .catch(async error => {
            // failedIds.push(data.id);
            await strapi
              .query("imported-records")
              .update({ id: data.id }, { status: "error", message: error });

            console.log({ error });

            errorRecords.push({
              ...record,
              Error: error
            });
            next();
          });
      });
    }

    // await strapi.services[
    //   "student-import-csv"
    // ].updateSuccessfulImportRecordEntries(successIds);

    // await strapi.services["student-import-csv"].updateErrorImportRecordEntries(
    //   failedIds
    // );

    if (errorRecords.length) {
      return strapi.services["student-import-csv"].getReportSummary(
        id,
        errorRecords
      );
    } else {
      return strapi.services["student-import-csv"].getReportSummary(id, []);
    }
  },

  // updateSuccessfulImportRecordEntries: async ids => {
  //   console.log("Updating successful imported records...");
  //   await strapi
  //     .query("imported-records")
  //     .model.query(qb => {
  //       qb.whereIn("id", ids);
  //     })
  //     .save({ status: "completed" }, { patch: true, require: false });
  // },

  // updateErrorImportRecordEntries: async ids => {
  //   console.log("Updating error imported records...");
  //   await strapi
  //     .query("imported-records")
  //     .model.query(qb => {
  //       qb.whereIn("id", ids);
  //     })
  //     .save({ status: "error" }, { patch: true, require: false });
  // }

  validateRecord: async record => {
    if (!record["Name"]) {
      return {
        isError: true,
        message: "Name is missing"
      };
    }

    if (!record["Gender"]) {
      return {
        isError: true,
        message: "Gender is missing"
      };
    } else {
      const allowed = ["male", "female", "other"];
      const gender = _.toLower(record["Gender"]);
      if (!allowed.includes(gender)) {
        return {
          isError: true,
          message: `Allowed values should be ${allowed}`
        };
      }
    }

    if (!record["DOB"]) {
      return {
        isError: true,
        message: "DOB is missing"
      };
    } else {
      let isValidDate = Date.parse(record["DOB"]);

      if (isNaN(isValidDate)) {
        return {
          isError: true,
          message: "DOB is invalid"
        };
      }
    }

    if (!record["Contact Number"]) {
      return {
        isError: true,
        message: "Contact number is missing"
      };
    }

    if (!record["State"]) {
      return {
        isError: true,
        message: "State is missing"
      };
    }

    if (!record["District"]) {
      return {
        isError: true,
        message: "District is missing"
      };
    }

    if (!record["Email"]) {
      return {
        isError: true,
        message: "Email is missing"
      };
    }

    if (!record["Qualification"]) {
      return {
        isError: true,
        message: "Qualification is missing"
      };
    } else {
      const allowed = [
        "secondary",
        "senior_secondary",
        "undergraduate",
        "postgraduate",
        "other"
      ];
      const qualification = _.toLower(record["Qualification"]);
      if (!allowed.includes(qualification)) {
        return {
          isError: true,
          message: `Qualification should be of ${allowed}`
        };
      }
    }

    if (!record["Stream"]) {
      return {
        isError: true,
        message: "Stream is missing"
      };
    } else {
      const stream = record["Stream"];
      if (!STREAMS.includes(stream)) {
        return {
          isError: true,
          message: `Invalid Stream value`
        };
      }
    }

    if (!record["Year"]) {
      return {
        isError: true,
        message: "Year is missing"
      };
    } else {
      const allowed = ["first", "second", "third"];
      const year = _.toLower(record["Year"]);
      if (!allowed.includes(year)) {
        return {
          isError: true,
          message: `Year should one be of ${allowed}`
        };
      }
    }

    return {
      isError: false,
      message: ""
    };
  }
};
