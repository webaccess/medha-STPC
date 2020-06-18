const bookshelf = require("../../config/bookshelf");
const utils = require("../../config/utils");
const { DASHBOARD } = require("./dashboard-data");

(async () => {
  await dashboard();
  console.log("\n");
  process.exit(0);
})();

async function dashboard() {
  console.log("Ading dummy dashboard entries");
  await utils.asyncForEach(DASHBOARD, async c => {
    let monthArray = [];
    if (c.Year === "2020") {
      monthArray = [1, 2, 3, 4, 5, 6];
    } else {
      monthArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }

    const response = await bookshelf
      .model("organization")
      .fetchAll()
      .then(model => model.toJSON());

    if (response) {
      await utils.asyncForEach(response, async college => {
        await utils.asyncForEach(monthArray, async month => {
          const isDataPresent = await bookshelf
            .model("dashboard")
            .where({
              contact: college.contact,
              Year: c.Year,
              Month: month
            })
            .fetch();

          if (isDataPresent) {
            console.log(
              `Skipping Entry for year ${c.Year} month ${month} college ${college.contact}...`
            );
          } else {
            await bookshelf
              .model("dashboard")
              .forge({
                country: c.country,
                state: c.state,
                zone: college.zone,
                rpc: college.rpc,
                contact: college.contact,
                Year: c.Year,
                Workshops: c.Workshops,
                TPOFeedback: c.TPOFeedback,
                StudentFeedback: c.StudentFeedback,
                IndustrialVisits: c.IndustrialVisits,
                Interships: c.Interships,
                Placement: c.Placement,
                FirstYear: c.FirstYear,
                FinalYear: c.FinalYear,
                Entrepreneurship: c.Entrepreneurship,
                FirstYearAttendance: c.FirstYearAttendance,
                SecondYearAttendance: c.SecondYearAttendance,
                FinalYearAttendance: c.FinalYearAttendance,
                PlannedVsAchieved: c.PlannedVsAchieved,
                UniqueStudents: c.UniqueStudents,
                Institutionstouched: c.Institutionstouched,
                IndustrialVisitAttendance: c.IndustrialVisitAttendance,
                IndustrialVisitPlannedVsAchieved:
                  c.IndustrialVisitPlannedVsAchieved,
                IndustrialVisitStudentFeedback:
                  c.IndustrialVisitStudentFeedback,
                IndustrialVisitTPOFeedback: c.IndustrialVisitTPOFeedback,
                PlacementAttended: c.PlacementAttended,
                PlacementSelected: c.PlacementSelected,
                PlacementStudentFeedback: c.PlacementStudentFeedback,
                PlacementTPOFeedback: c.PlacementTPOFeedback,
                PlacementCollegeFeedback: c.PlacementCollegeFeedback,
                Month: month,
                SecondYear: c.SecondYear
              })
              .save()
              .then(() => {
                console.log(
                  `Added Entry for year ${c.Year} month ${month} college ${college.contact}...`
                );
              });
          }
        });
      });
    } else {
      console.log("No college record");
    }
  });
}
