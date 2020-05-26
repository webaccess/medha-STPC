"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const _ = require("lodash");

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
          "Stream"
        ])
      );
      return result;
    }, []);

    return preview ? result.slice(0, 3) : result;
  }
};
