const xlsxFile = require("read-excel-file/node");
const { PLUGIN } = require("../../config/constants");
const bookshelf = require("../../config/bookshelf");
const utils = require("../../config/utils");

var XLSX = require("xlsx");

(async () => {
  await collegeData();
  console.log("\n");
  await mapStreamsToCollege();
  process.exit(0);
})();

async function collegeData() {
  console.log("Adding college entries");
  var workbook = XLSX.readFile("collegeMapping.xlsx");
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  await utils.asyncForEach(xlData, async c => {
    console.log("Checking for " + c["College Name"]);
    const isRPCPresent = await bookshelf
      .model("rpc")
      .where({ name: c["RPC"] })
      .fetch();
    const isZonePresent = await bookshelf
      .model("zone")
      .where({ name: c["Zone"] })
      .fetch();
    const isCollegePresent = await bookshelf
      .model("organization")
      .where({ name: c["College Name"] })
      .fetch();

    if (isRPCPresent && isZonePresent && isCollegePresent === null) {
      const organizationReqBody = {
        name: c["College Name"],
        college_code: c["College Code"],
        is_blocked: false,
        zone: isZonePresent.id,
        rpc: isRPCPresent.id,
        principal: c["Principal"] ? c["Principal"] : null
      };
      const contactReqBody = {
        name: c["College Name"],
        phone: c["Phone Number"],
        email: c["Email Address"]
      };

      const addressBody = [
        {
          state: 1,
          country: 1,
          address_line_1: c["Address"],
          district: null,
          address_type: "Permanent"
        }
      ];

      await bookshelf
        .transaction(async t => {
          /**
           * Creating organization
           */
          const orgModel = await bookshelf
            .model("organization")
            .forge(organizationReqBody)
            .save(null, { transacting: t })
            .then(model => model)
            .catch(error => {
              console.log(error);
              return null;
            });

          if (!orgModel) {
            return Promise.reject(
              "Something went wrong while creating College"
            );
          }

          const org = orgModel.toJSON ? orgModel.toJSON() : orgModel;

          contactReqBody.organization = org.id;
          contactReqBody.contact_type = "organization";

          const contact = await bookshelf
            .model("contact")
            .forge(contactReqBody)
            .save(null, { transacting: t })
            .then(model => model.toJSON())
            .catch(error => {
              console.log(error);
              return null;
            });

          if (!contact) {
            return Promise.reject(
              "Something went wrong while creating Contact"
            );
          }

          const addresses = await Promise.all(
            addressBody.map(addr => {
              const body = { ...addr };
              body.contact = contact.id;
              return bookshelf
                .model("address")
                .forge(body)
                .save(null, { transacting: t })
                .then(model => model.toJSON())
                .catch(() => null);
            })
          );

          if (addresses.some(addr => addr == null)) {
            return Promise.reject(
              "Something went wrong while creating address"
            );
          }

          await orgModel.save(
            { contact: contact.id },
            { transacting: t, require: false }
          );
        })
        .then(success => {
          console.log(c["College Name"] + " college added");
        })
        .catch(error => {
          console.log(error);
          console.log("Error adding college " + c["College Name"]);
        });
    } else {
      console.log(c["College Name"] + " college present");
    }
  });
}

async function mapStreamsToCollege() {
  const collegeStreamWorkbook = XLSX.readFile("college-branch.xlsx");
  const collegeStreamSheetName = collegeStreamWorkbook.SheetNames;
  const colleges = XLSX.utils.sheet_to_json(
    collegeStreamWorkbook.Sheets[collegeStreamSheetName[0]]
  );

  const groupByCollege = colleges.reduce((result, college) => {
    const name = college["College Name"];
    const stream = college["Streams"];

    (result[name] || (result[name] = [])).push(stream);
    return result;
  }, {});

  const streams = await bookshelf
    .model("stream")
    .fetchAll()
    .then(model => model.toJSON().map(({ id, name }) => ({ id, name })));

  const organizations = await bookshelf
    .model("organization")
    .fetchAll()
    .then(model => model);

  await bookshelf
    .model("college-stream-strength")
    .fetchAll()
    .then(model => {
      model.forEach(m => m.destroy({ require: false }));
    });

  await bookshelf
    .model("organization-component")
    .fetchAll()
    .then(model => {
      model.forEach(m => m.destroy({ require: false }));
    });

  for await (let orgModel of organizations) {
    // Removing stream and strengths
    await bookshelf
      .transaction(async t => {
        const org = orgModel.toJSON ? orgModel.toJSON() : orgModel;

        const findOrgName = Object.keys(groupByCollege).find(college => {
          if (utils.lowerCase(college) == utils.lowerCase(org.name)) {
            return college;
          }
        });

        if (findOrgName) {
          const collegeAndStrength = groupByCollege[findOrgName];
          const streamsAndStrength = collegeAndStrength.reduce(
            (result, stream) => {
              const s = streams.find(
                ss => utils.lowerCase(ss.name) == utils.lowerCase(stream)
              );
              if (s) {
                const data = {
                  stream: s.id,
                  first_year_strength: 0,
                  second_year_strength: 0,
                  third_year_strength: 0
                };
                result.push(data);
              }
              return result;
            },
            []
          );

          // Adding new streams and strength
          const streamStrengthModel = await Promise.all(
            streamsAndStrength.map(async stream => {
              return await bookshelf
                .model("college-stream-strength")
                .forge(stream)
                .save(null, { transacting: t })
                .then(model => model)
                .catch(error => {
                  console.log(error);
                  return null;
                });
            })
          );

          if (streamStrengthModel.some(s => s === null)) {
            return Promise.reject(
              "Something went wrong while creating Stream & Strength"
            );
          }

          const _orgStreamStrength = await Promise.all(
            streamStrengthModel.map(async (model, index) => {
              return await bookshelf
                .model("organization-component")
                .forge({
                  field: "stream_strength",
                  order: index,
                  component_type: "college_stream_strengths",
                  component_id: model.toJSON().id,
                  organization_id: org.id
                })
                .save(null, { transacting: t })
                .catch(error => {
                  console.log(error);
                  return null;
                });
            })
          );

          if (_orgStreamStrength.some(oss => oss === null)) {
            return Promise.reject(
              "Error while mapping stream strength to Organization"
            );
          }

          return Promise.resolve(org.name);
        } else {
          return Promise.reject(
            "No mapping from college to stream " + org.name
          );
        }
      })
      .then(success => {
        console.log(`Added Streams to College: ${success}`);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
