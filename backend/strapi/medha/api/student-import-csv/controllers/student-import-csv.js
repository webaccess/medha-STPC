"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const _ = require("lodash");
const { PLUGIN } = require("../../../config/constants");

module.exports = {
  create: async ctx => {
    const files = ctx.request.files;
    let entry;

    if (ctx.request.files && ctx.request.body.data) {
      let { data } = ctx.request.body;
      data = JSON.parse(data);
      entry = await strapi.query("student-import-csv").create(data);
      // automatically uploads the files based on the entry and the model
      const uploaded = await strapi.plugins.upload.services.upload.upload({
        data: {
          fileInfo: {},
          refId: entry.id,
          ref: "student-import-csv",
          source: null,
          field: "imported_file"
        },
        files: files["files.imported_file"]
      });

      const uploadFile = _.head(_.head(uploaded));
      return await strapi.services["student-import-csv"].createRecords(
        entry.id,
        uploaded[0].url
      );
    } else {
      return ctx.response.badRequest("Files attribute is missing");
    }
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
  },

  delete: async ctx => {
    const { id } = ctx.params;

    const record = await strapi.query("student-import-csv").findOne({ id });
    if (!record) {
      return ctx.response.notFound("Record does not exist");
    }

    const importFileId = record.imported_file && record.imported_file.id;
    if (importFileId) {
      await strapi.plugins[PLUGIN].services.contact.deleteDocument(
        importFileId
      );
      await strapi.query("imported-records").delete({ student_import_csv: id });
      await strapi.query("student-import-csv").delete({ id });
      return {
        result: "Success"
      };
    } else {
      return ctx.response.badRequest("Something went wrong");
    }
  }
};
