const bookshelf = require("./config/config.js");
const _data = require("./data.js");
const utils = require("./config/utils.js");

(async () => {
  await utils.asyncForEach(_data.academicYears, async ay => {
    const isAYPresent = await bookshelf
      .model("academic_year")
      .where({ name: ay.name })
      .fetch();

    if (isAYPresent) {
      console.log(`Skipping Academic Year ${ay.name}...`);
    } else {
      await bookshelf
        .model("academic_year")
        .forge({
          name: ay.name,
          start_date: ay.start_date,
          end_date: ay.end_date
        })
        .save()
        .then(() => {
          console.log(`Added Academic Year ${ay.name}`);
        });
    }
  });
})();
