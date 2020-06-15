const bookshelf = require("./config/bookshelf");
const utils = require("./config/utils");
const { COUNTRIES } = require("./data");

(async () => {
  await countries();
  console.log("\n");
  await states();
  console.log("\n");
  await districts();
  process.exit(0);
})();

async function countries() {
  console.log("Countries");
  await utils.asyncForEach(COUNTRIES, async c => {
    const isCountryPresent = await bookshelf
      .model("country")
      .where({ name: c.name })
      .fetch();

    if (isCountryPresent) {
      console.log(`Skipping Country ${c.name}...`);
    } else {
      await bookshelf
        .model("country")
        .forge({
          name: c.name,
          abbreviation: c.abbreviation,
          identifier: c.identifier,
          is_active: c.isActive
        })
        .save()
        .then(() => {
          console.log(`Added Country ${c.name}`);
        });
    }
  });
}

async function states() {
  console.log("States");
  await utils.asyncForEach(COUNTRIES, async c => {
    const { states } = c;
    const isCountryPresent = await bookshelf
      .model("country")
      .where({ name: c.name })
      .fetch();

    if (isCountryPresent) {
      await utils.asyncForEach(states, async state => {
        const isStatePresent = await bookshelf
          .model("state")
          .where({ name: state.name })
          .fetch();

        if (isStatePresent) {
          console.log(`Skipping State ${state.name}...`);
        } else {
          const country = isCountryPresent.toJSON
            ? isCountryPresent.toJSON()
            : isCountryPresent;

          await bookshelf
            .model("state")
            .forge({
              name: state.name,
              abbreviation: state.abbreviation,
              identifier: state.identifier,
              is_active: state.isActive,
              country: country.id
            })
            .save()
            .then(() => {
              console.log(`Added State ${state.name} to ${country.name}`);
            });
        }
      });
    }
  });
}

async function districts() {
  console.log("Districts");
  await utils.asyncForEach(COUNTRIES, async c => {
    const { states } = c;
    const isCountryPresent = await bookshelf
      .model("country")
      .where({ name: c.name })
      .fetch();

    if (isCountryPresent) {
      await utils.asyncForEach(states, async s => {
        const { districts } = s;
        const isStatePresent = await bookshelf
          .model("state")
          .where({ name: s.name })
          .fetch();

        if (isStatePresent) {
          const state = isStatePresent.toJSON
            ? isStatePresent.toJSON()
            : isStatePresent;

          // Districts
          try {
            await utils.asyncForEach(districts, async district => {
              const isDistrictPresent = await bookshelf
                .model("district")
                .where({ name: district.name, state: state.id })
                .fetch();

              if (isDistrictPresent) {
                console.log(`Skipping District ${district.name}...`);
              } else {
                await bookshelf
                  .model("district")
                  .forge({
                    name: district.name,
                    state: state.id,
                    abbreviation: district.abbreviation,
                    identifier: district.identifier,
                    is_active: district.is_active
                  })
                  .save()
                  .then(() => {
                    console.log(
                      `Added District ${district.name} to ${state.name}`
                    );
                  });
              }
            });
          } catch (error) {
            console.log(error);
          }
        }
      });
    }
  });
}
