const xlsxFile = require("read-excel-file/node");
const { PLUGIN } = require("../../config/constants");
const bookshelf = require("../../config/bookshelf");
const utils = require("../../config/utils");

var XLSX = require("xlsx");

(async () => {
  await collegeData();
  console.log("\n");
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
        email: c["Email Address"],
        state: 1,
        country: 1,
        address_1: c["Address"],
        district: null
      };

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
          // await orgModel
          //   .related("stream_strength")
          //   .create(ctx.request.body.stream_strength);

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
