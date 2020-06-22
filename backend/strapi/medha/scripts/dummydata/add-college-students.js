const { PLUGIN } = require("../../config/constants");
const bookshelf = require("../../config/bookshelf");
const utils = require("../../config/utils");
const _ = require("lodash");

let finalData = [
  [
    "College Name",
    "Zone",
    "RPC",
    "Stream",
    "Year",
    "Phone/Username",
    "Password"
  ]
];

(async () => {
  await addStudentsOfAllColleges();
  console.log("\n");
  var xlsx = require("node-xlsx").default;
  const fs = require("fs");
  var buffer = xlsx.build([{ name: "mySheetName", data: finalData }]);
  fs.writeFile("students.xlsx", buffer, err => {
    if (err) throw err;
    console.log("Done...");
    process.exit(0);
  });
})();

async function addStudentsOfAllColleges() {
  console.log("Adding college students");
  var noOfStudentsPerCollege = 3;
  var pursuingYearArray = ["First", "Second", "Third"];
  var pursuingBoard = "UPBOARD";
  const STREAMS = [
    "Mechanical Engineering (Production)",
    "Computer Science And Engineering",
    "Electronics Engineering",
    "Information Technology",
    "Civil Engineering",
    "Electrical Engineering"
  ];
  let allColleges = await bookshelf
    .model("organization")
    .fetchAll()
    .then(model => model.toJSON());

  const role = await bookshelf
    .model("role")
    .where({ name: "Student" })
    .fetchAll()
    .then(model => model.toJSON());

  const boardDetails = await bookshelf
    .model("board")
    .where({ name: pursuingBoard })
    .fetchAll()
    .then(model => model.toJSON());

  var studentsArray = Array(noOfStudentsPerCollege)
    .join(0)
    .split(0)
    .map((v, i) => i + 1);

  await utils.asyncForEach(allColleges, async college => {
    const rpc = await bookshelf
      .model("rpc")
      .where({ id: college.rpc })
      .fetchAll()
      .then(model => model.toJSON());
    const zone = await bookshelf
      .model("zone")
      .where({ id: college.zone })
      .fetchAll()
      .then(model => model.toJSON());
    let noOfStudentsAdded = 0;

    await utils.asyncForEach(STREAMS, async stream => {
      const streamData = await bookshelf
        .model("stream")
        .where({ name: stream })
        .fetchAll()
        .then(model => model.toJSON());

      await utils.asyncForEach(pursuingYearArray, async pursuingYear => {
        await utils.asyncForEach(studentsArray, async student => {
          let randomPhoneNumber =
            Math.floor(1000000000 + Math.random() * 1000000000) +
            college.id +
            streamData[0].id;
          let randomPhoneNumberNew = randomPhoneNumber + student;
          let stringPhoneNumber = randomPhoneNumberNew.toString();
          const userBody = {
            username: stringPhoneNumber,
            email: stringPhoneNumber + "@gmail.com",
            password:
              "$2a$10$kj.5SLcsdLxQeUX914SP4.cE.MhaM8hY1Rr7.OD/KLYJUV4CuZ4F6",
            role: role[0].id,
            zone: null,
            rpc: null,
            blocked: false,
            provider: "local"
          };

          var d = new Date("01/01/2000");
          var n = d.toISOString();

          const individualRequestBody = {
            first_name: "First",
            middle_name: "Middle",
            last_name: "Last",
            stream: streamData[0].id,
            father_full_name: "",
            mother_full_name: "",
            date_of_birth: n,
            gender: "male",
            roll_number: stringPhoneNumber,
            organization: college.id,
            is_physically_challenged: false,
            is_verified: true
          };

          const contactBody = {
            name: "First Middle Last",
            contact_type: "individual",
            phone: stringPhoneNumber,
            email: stringPhoneNumber + "@gmail.com",
            address_1: "UP",
            state: null,
            district: null
          };
          const academicYearId = await getCurrentAcademicYear();
          const educationBody = {
            year_of_passing: academicYearId,
            percentage: null,
            pursuing: true,
            education_year: _.toLower(pursuingYear),
            qualification: "undergraduate",
            board: boardDetails[0].id
          };

          await bookshelf
            .transaction(async t => {
              // Step 1 creating user object
              const user = await bookshelf
                .model("user")
                .forge(userBody)
                .save(null, { transacting: t })
                .then(model => model)
                .catch(err => {
                  console.log(err);
                  return null;
                });

              if (!user) {
                return Promise.reject(
                  "Something went wrong while creating User"
                );
              }

              // Step 2 creating individual
              const individual = await bookshelf
                .model("individual")
                .forge(individualRequestBody)
                .save(null, { transacting: t })
                .then(model => model)
                .catch(error => {
                  console.log(error);
                  return null;
                });

              if (!individual) {
                return Promise.reject(
                  "Something went wrong while creating Individual"
                );
              }

              const userResponse = user.toJSON ? user.toJSON() : user;
              const individualResponse = individual.toJSON
                ? individual.toJSON()
                : individual;

              contactBody.individual = individualResponse.id;
              contactBody.user = userResponse.id;

              // Step 3 creating contact details
              const contact = await bookshelf
                .model("contact")
                .forge(contactBody)
                .save(null, { transacting: t })
                .then(model => model)
                .catch(error => {
                  console.log(error);
                  return null;
                });

              if (!contact) {
                return Promise.reject(
                  "Something went wrong while creating Contact"
                );
              }

              // Mapping user and individual relations
              const contactResponse = contact.toJSON
                ? contact.toJSON()
                : contact;
              // // Step 4 Adding academic details
              educationBody.contact = contactResponse.id;

              const { education, educationStatus } = await bookshelf
                .model("education")
                .forge(educationBody)
                .save(null, { transacting: t })
                .then(model => {
                  return { education: model };
                })
                .catch(error => {
                  console.log("Education ", err.detail);
                  return { education: null, educationStatus: err.detail };
                });

              if (!education) {
                return new Promise((resolve, reject) =>
                  reject(educationStatus)
                );
              }

              await user.save(
                { contact: contactResponse.id },
                { transacting: t, require: false }
              );
              await individual.save(
                { contact: contactResponse.id },
                { transacting: t, require: false }
              );

              // Add user object
              return new Promise(resolve => resolve(user));
            })
            .then(success => {
              noOfStudentsAdded += 1;
              finalData.push([
                college.name,
                zone[0].name,
                rpc[0].name,
                stream,
                pursuingYear,
                stringPhoneNumber,
                "admin1234"
              ]);
            })
            .catch(error => {
              console.log(error);
              console.log("Error adding Student");
            });
        });
      });
    });
    console.log(noOfStudentsAdded + " added for college " + college.name);
  });
  console.log("Making excel with details");
}

async function getCurrentAcademicYear() {
  let currentDate = new Date();

  // logic to get academic year id
  let academicYear = await bookshelf
    .model("academic_year")
    .fetchAll()
    .then(model => model.toJSON());

  currentDate = currentDate.getTime();

  const currentAcademicYear = academicYear.filter(academicYear => {
    const startDate = new Date(academicYear.start_date).getTime();
    const endDate = new Date(academicYear.end_date).getTime();
    if (startDate < currentDate && currentDate < endDate) {
      return academicYear;
    }
  });

  return currentAcademicYear.length > 0 ? currentAcademicYear[0].id : null;
}
