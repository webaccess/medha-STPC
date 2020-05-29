"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const _ = require("lodash");
const bookshelf = require("../../../config/bookshelf");

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
  }

  // createRecords: async model => {
  //   const inputFile = "./public" + csv.imported_file.url;
  //   const records = await strapi.services["student-import-csv"].getRecords(
  //     inputFile
  //   );

  //   for await (record of records) {
  //     strapi
  //       .query("imported-records")
  //       .model.forge({
  //         fields: record
  //       })
  //       .save(null)
  //       .then(model => {
  //         console.log(model.id);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //   }
  // }
};
