const xlsxFile = require("read-excel-file/node");
const { PLUGIN } = require("../../config/constants");
const bookshelf = require("../../config/bookshelf");
const utils = require("../../config/utils");

var XLSX = require("xlsx");

(async () => {
  await addStudentsOfAllColleges();
  console.log("\n");
  process.exit(0);
})();

async function addStudentsOfAllColleges() {
  console.log("Adding college students");
  var noOfStudentsPerCollege = 1000;
  const allColleges = await bookshelf
    .model("organization")
    .fetchAll()
    .then(model => model.toJSON());

  const allStreams = await bookshelf
    .model("stream")
    .fetchAll()
    .then(model => model.toJSON());

  await utils.asyncForEach(allColleges, async college => {
    let stream_strength = [];

    const organizationComponent = await bookshelf
      .model("organization-component")
      .where({ organization_id: college.id })
      .fetchAll()
      .then(model => model.toJSON());

    if (organizationComponent.length) {
      let stream_list_avoid = [];
      await utils.asyncForEach(organizationComponent, async res => {
        const stream = await bookshelf
          .model("college-stream-strength")
          .where({ id: res.component_id })
          .fetchAll()
          .then(model => model.toJSON());
        stream_list_avoid.push(stream[0].stream);
      });
      await utils.asyncForEach(allStreams, async stream => {
        let json = {};
        if (stream_list_avoid.indexOf(stream.id) !== -1) {
        } else {
          json.stream = stream.id;
          json.strength = 120;
          stream_strength.push(json);
        }
      });
    } else {
      await utils.asyncForEach(allStreams, async stream => {
        let json = {};
        json.stream = stream.id;
        json.strength = 120;
        stream_strength.push(json);
      });
    }

    await bookshelf
      .transaction(async t => {
        if (stream_strength) {
          const streamStrengthModel = await Promise.all(
            stream_strength.map(async stream => {
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
                  organization_id: college.id
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
        }
      })
      .then(success => {
        console.log("streams added for " + college.name);
      })
      .catch(error => {
        console.log("streams not added for " + college.name);
      });
  });
}
