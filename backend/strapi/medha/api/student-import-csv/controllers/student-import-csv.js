"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const bookshelf = require("../../../config/bookshelf");
const _ = require("lodash");
const { ROLE_STUDENT, PLUGIN } = require("../../../config/constants");

module.exports = {
  create: async ctx => {
    const files = ctx.request.files;
    let entry;

    if (ctx.request.files && ctx.request.body.data) {
      let { data } = ctx.request.body;
      data = JSON.parse(data);
      entry = await strapi.query("student-import-csv").create(data);
      // automatically uploads the files based on the entry and the model
      const uploaded = await strapi.plugins.upload.services.upload.uploadToEntity(
        {
          id: entry.id,
          model: "student-import-csv"
        },
        { imported_file: files["files.imported_file"] }
      );

      const uploadFile = _.head(_.head(uploaded));
      return await strapi.services["student-import-csv"].createRecords(
        entry.id,
        uploadFile.url
      );
    } else {
      return ctx.response.badRequest("Files attribute is missing");
    }
  },

  // import: async ctx => {
  //   const { id } = ctx.params;
  //   const { retry } = ctx.query;
  //   const csv = await strapi.query("student-import-csv").findOne({ id });
  //   if (!csv) {
  //     return ctx.response.notFound("Requested file does not exist");
  //   }

  //   const studentRole = await strapi
  //     .query("role", "users-permissions")
  //     .findOne({ name: ROLE_STUDENT });

  //   const states = await strapi.query("state", PLUGIN).find({});
  //   const streams = await strapi.query("stream").find({});
  //   const districts = await strapi.query("district", PLUGIN).find({});
  //   const contactDetails = await strapi
  //     .query("contact", PLUGIN)
  //     .findOne({ id: ctx.state.user.contact });

  //   const records = await strapi
  //     .query("imported-records")
  //     .model.query(qb => {
  //       if (!!retry) {
  //         qb.where({ student_import_csv: id, status: "pending" }).orWhere({
  //           student_import_csv: id,
  //           status: "error"
  //         });
  //       } else {
  //         qb.where({ student_import_csv: id, status: "pending" });
  //       }
  //     })
  //     .fetchAll()
  //     .then(model => model);

  //   let errorRecords = [];
  //   for await (const r of records) {
  //     const data = r.toJSON ? r.toJSON() : r;
  //     const record = data.fields;
  //     const userRequestBody = {};

  //     userRequestBody.username = record["Contact Number"];
  //     userRequestBody.email = record["Email"];
  //     userRequestBody.password = record["Contact Number"];
  //     userRequestBody.role = studentRole.id;

  //     const state = states.find(state => state.name == record["State"]);
  //     // user object state will be null for user student
  //     userRequestBody.state = null;

  //     userRequestBody.zone = null;
  //     userRequestBody.rpc = null;
  //     userRequestBody.blocked = false;

  //     userRequestBody.provider = "local";
  //     userRequestBody.password = await strapi.plugins[
  //       "users-permissions"
  //     ].services.user.hashPassword(userRequestBody);

  //     const individualRequestBody = {};

  //     const name = record["Name"].split(" ");

  //     individualRequestBody.first_name = (name[0] && name[0].trim()) || "";
  //     individualRequestBody.last_name = (name[1] && name[1].trim()) || "";

  //     const stream = streams.find(stream => stream.name == record["Stream"]);
  //     individualRequestBody.stream = stream ? stream.id : null;

  //     individualRequestBody.father_first_name =
  //       record["Father First Name"] || null;
  //     individualRequestBody.father_last_name =
  //       record["Father First Name"] || null;
  //     individualRequestBody.date_of_birth = record["DOB"] || null;
  //     individualRequestBody.gender = record["Gender"] || null;
  //     individualRequestBody.roll_number = record["Roll Number"] || null;

  //     const org = contactDetails.individual
  //       ? contactDetails.individual.organization
  //       : null;
  //     individualRequestBody.organization = org;

  //     individualRequestBody.future_aspirations = null;
  //     individualRequestBody.is_physically_challenged = false;

  //     if (
  //       individualRequestBody.hasOwnProperty("date_of_birth") &&
  //       individualRequestBody["date_of_birth"]
  //     ) {
  //       var d = new Date(individualRequestBody["date_of_birth"]);
  //       var n = d.toISOString();
  //       individualRequestBody["date_of_birth"] = n;
  //     }

  //     const contactBody = {};

  //     contactBody.phone = record["Contact Number"];
  //     contactBody.email = record["Email"];
  //     contactBody.address_1 = record["Address"];
  //     contactBody.state = state ? state.id : null;

  //     const district = districts.find(
  //       district => district.name == record["District"]
  //     );
  //     contactBody.district = district ? district.id : null;

  //     contactBody.name = `${individualRequestBody.first_name} ${individualRequestBody.last_name}`;
  //     contactBody.contact_type = "individual";

  //     const academicYearId = await strapi.services[
  //       "academic-year"
  //     ].getCurrentAcademicYear();

  //     const academicHistoryBody = {
  //       academic_year: academicYearId,
  //       percentage: null,
  //       education_year: record["Year"]
  //     };

  //     await bookshelf
  //       .transaction(async t => {
  //         // Step 1 creating user
  //         const { user, userStatus } = await strapi
  //           .query("user", "users-permissions")
  //           .model.forge(userRequestBody)
  //           .save(null, { transacting: t })
  //           .then(model => {
  //             return { user: model };
  //           })
  //           .catch(err => {
  //             console.log("shreesh ", err.detail);
  //             return { user: null, userStatus: err.detail };
  //           });

  //         if (!user) {
  //           return Promise.reject(userStatus);
  //         }

  //         // Step 2 creating individual
  //         const { individual, individualStatus } = await strapi
  //           .query("individual", PLUGIN)
  //           .model.forge(individualRequestBody)
  //           .save(null, { transacting: t })
  //           .then(model => {
  //             return { individual: model };
  //           })
  //           .catch(error => {
  //             console.log("individual ", err.detail);
  //             return { individual: null, individualStatus: error.detail };
  //           });

  //         if (!individual) {
  //           return Promise.reject(individualStatus);
  //         }

  //         const userResponse = user.toJSON ? user.toJSON() : user;
  //         const individualResponse = individual.toJSON
  //           ? individual.toJSON()
  //           : individual;

  //         contactBody.individual = individualResponse.id;
  //         contactBody.user = userResponse.id;

  //         // Step 3 creating contact details
  //         const { contact, contactStatus } = await strapi
  //           .query("contact", PLUGIN)
  //           .model.forge(contactBody)
  //           .save(null, { transacting: t })
  //           .then(model => {
  //             return { contact: model };
  //           })
  //           .catch(error => {
  //             console.log("contact ", err.detail);
  //             return { contact: null, contactStatus: error.detail };
  //           });

  //         if (!contact) {
  //           return Promise.reject(contactStatus);
  //         }

  //         // Mapping user and individual relations
  //         const contactResponse = contact.toJSON ? contact.toJSON() : contact;

  //         // Step 4 Adding academic details
  //         academicHistoryBody.contact = contactResponse.id;

  //         const { academicHistory, academicHistoryStatus } = await strapi
  //           .query("academic-history")
  //           .model.forge(academicHistoryBody)
  //           .save(null, { transacting: t })
  //           .then(model => {
  //             return { academicHistory: model };
  //           })
  //           .catch(error => {
  //             console.log("academic history ", err.detail);
  //             return { academicHistory: null, academicHistoryStatus: null };
  //           });

  //         if (!academicHistory) {
  //           return Promise.reject(academicHistoryStatus);
  //         }

  //         await user.save(
  //           { contact: contactResponse.id },
  //           { transacting: t, patch: true, method: "update" }
  //         );
  //         await individual.save(
  //           { contact: contactResponse.id },
  //           { transacting: t, patch: true, method: "update" }
  //         );

  //         // Changing status from pending to complete
  //         await r.save(
  //           { status: "completed" },
  //           { transacting: t, patch: true, method: "update" }
  //         );

  //         return new Promise(resolve => resolve("Success"));
  //       })
  //       .then(success => {
  //         console.log(success);
  //       })
  //       .catch(async error => {
  //         // Changing status from pending to complete
  //         await r.save(
  //           { status: "error", message: error },
  //           { patch: true, method: "update" }
  //         );

  //         errorRecords.push({
  //           ...record,
  //           Error: error
  //         });
  //       });
  //   }

  //   if (errorRecords.length) {
  //     return strapi.services["student-import-csv"].getReportSummary(
  //       id,
  //       errorRecords
  //     );
  //   }

  //   return strapi.services["student-import-csv"].getReportSummary(id, []);
  // },

  getFileImportDetails: async ctx => {
    const { contact } = ctx.state.user;

    const importedFiles = await strapi
      .query("student-import-csv")
      .find({ contact }, ["imported_file"]);

    let result = [];

    for await (let record of importedFiles) {
      const importedRecords = await strapi
        .query("imported-records")
        .count({ student_import_csv: record.id });

      const successRecords = await strapi
        .query("imported-records")
        .count({ student_import_csv: record.id, status: "completed" });

      const pendingRecords = await strapi
        .query("imported-records")
        .count({ student_import_csv: record.id, status: "pending" });

      const errorRecords = await strapi
        .query("imported-records")
        .count({ student_import_csv: record.id, status: "error" });

      result.push({
        ...record,
        success: successRecords,
        pending: pendingRecords,
        error: errorRecords,
        total: importedRecords
      });
    }

    return {
      result: result
    };
  },

  getRecords: async ctx => {
    const { id } = ctx.params;
    const { status } = ctx.query;
    const csv = await strapi.query("student-import-csv").findOne({ id });

    if (!csv) {
      return ctx.response.notFound("CSV file does not exist");
    }

    console.log(ctx.query);
    const records = await strapi.services[
      "student-import-csv"
    ].getRecordWithStatus(id, status);

    return {
      result: records
    };
  },

  getFileImportDetails: async ctx => {
    const { contact } = ctx.state.user;

    const importedFiles = await strapi
      .query("student-import-csv")
      .find({ contact }, ["imported_file"]);

    let result = [];

    for await (let record of importedFiles) {
      const importedRecords = await strapi
        .query("imported-records")
        .count({ student_import_csv: record.id });

      const successRecords = await strapi
        .query("imported-records")
        .count({ student_import_csv: record.id, status: "completed" });

      const pendingRecords = await strapi
        .query("imported-records")
        .count({ student_import_csv: record.id, status: "pending" });

      const errorRecords = await strapi
        .query("imported-records")
        .count({ student_import_csv: record.id, status: "error" });

      result.push({
        ...record,
        success: successRecords,
        pending: pendingRecords,
        error: errorRecords,
        total: importedRecords
      });
    }

    return {
      result: result
    };
  },

  import: async ctx => {
    const { id } = ctx.params;
    const { retry } = ctx.query;
    const csv = await strapi.query("student-import-csv").findOne({ id });
    if (!csv) {
      return ctx.response.notFound("Requested file does not exist");
    }

    const records = await strapi
      .query("imported-records")
      .model.query(qb => {
        if (!!retry) {
          qb.where({ student_import_csv: id, status: "pending" }).orWhere({
            student_import_csv: id,
            status: "error"
          });
        } else {
          qb.where({ student_import_csv: id, status: "pending" });
        }
      })
      .fetchAll()
      .then(model => model.toJSON());

    const response = await strapi.services["student-import-csv"].importRecords(
      ctx,
      records
    );

    return response;
  },

  getImportedFileStatus: async ctx => {
    const { id } = ctx.params;
    const total = await strapi
      .query("imported-records")
      .count({ student_import_csv: id });
    const completed = await strapi.services[
      "student-import-csv"
    ].getRecordWithStatus(id, "completed");
    const pending = await strapi.services[
      "student-import-csv"
    ].getRecordWithStatus(id, "pending");

    return {
      pending: pending.length,
      completed: completed.length,
      total
    };
  }
};
