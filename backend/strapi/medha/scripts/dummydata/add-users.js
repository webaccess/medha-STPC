const xlsxFile = require("read-excel-file/node");
const { PLUGIN } = require("../../config/constants");
const bookshelf = require("../../config/bookshelf");
const utils = require("../../config/utils");
var noOfUsersPerEntity = 2;

(async () => {
  await addMedhaAdmin();
  console.log("\n");
  await addZonalAdmins();
  console.log("\n");
  await addCollegeAdmins();
  console.log("\n");
  process.exit(0);
})();

async function addZonalAdmins() {
  console.log("Adding Zonal Admin");
  let entity = "Zonal Admin";
  const role = await bookshelf
    .model("role")
    .where({ name: "Zonal Admin" })
    .fetchAll()
    .then(model => model.toJSON());
  let usersNumerArray = Array(noOfUsersPerEntity)
    .join(0)
    .split(0)
    .map((v, i) => i + 1);
  let allZones = await bookshelf
    .model("zone")
    .fetchAll()
    .then(model => model.toJSON());

  let count = 0;
  await utils.asyncForEach(allZones, async zone => {
    let randomPhoneNumber =
      Math.floor(3000000000 + Math.random() * 3000000000) + zone.id;
    console.log(zone.name);
    await utils.asyncForEach(usersNumerArray, async user => {
      let randomPhoneNumberNew = randomPhoneNumber + user;
      let stringPhoneNumber = randomPhoneNumberNew.toString();
      const userBody = {
        username: stringPhoneNumber,
        email: stringPhoneNumber + "@gmail.com",
        password:
          "$2a$10$kj.5SLcsdLxQeUX914SP4.cE.MhaM8hY1Rr7.OD/KLYJUV4CuZ4F6",
        role: role[0].id,
        zone: zone.id,
        state: 1,
        rpc: null,
        blocked: false,
        provider: "local"
      };

      let d = new Date("01/01/2000");
      let n = d.toISOString();

      const individualRequestBody = {
        first_name: "Zonal",
        middle_name: " ",
        last_name: "Admin",
        stream: null,
        father_full_name: "",
        mother_full_name: "",
        date_of_birth: n,
        gender: null,
        roll_number: null,
        organization: null,
        is_physically_challenged: false,
        is_verified: true
      };

      const contactBody = {
        name: "Zonal Admin",
        contact_type: "individual",
        phone: stringPhoneNumber,
        email: stringPhoneNumber + "@gmail.com",
        address_1: "UP",
        state: null,
        district: null
      };

      await fucntionToAddUser(
        userBody,
        individualRequestBody,
        contactBody,
        entity
      )
        .then(res => {
          count += 1;
          console.log(stringPhoneNumber);
        })
        .catch(error => {});
    });
    console.log("---------------------------");
  });
  console.log("Successfully added " + count + " " + "Zonal Admin");
}

async function addCollegeAdmins() {
  console.log("Adding College Admin");
  let entity = "College Admin";
  const role = await bookshelf
    .model("role")
    .where({ name: "College Admin" })
    .fetchAll()
    .then(model => model.toJSON());
  let usersNumerArray = Array(noOfUsersPerEntity)
    .join(0)
    .split(0)
    .map((v, i) => i + 1);
  let allColleges = await bookshelf
    .model("organization")
    .fetchAll()
    .then(model => model.toJSON());

  let count = 0;
  await utils.asyncForEach(allColleges, async college => {
    let randomPhoneNumber =
      Math.floor(3000000000 + Math.random() * 3000000000) + college.id;
    console.log(college.name);

    await utils.asyncForEach(usersNumerArray, async user => {
      let randomPhoneNumberNew = randomPhoneNumber + user;
      let stringPhoneNumber = randomPhoneNumberNew.toString();
      const userBody = {
        username: stringPhoneNumber,
        email: stringPhoneNumber + "@gmail.com",
        password:
          "$2a$10$kj.5SLcsdLxQeUX914SP4.cE.MhaM8hY1Rr7.OD/KLYJUV4CuZ4F6",
        role: role[0].id,
        zone: college.zone,
        rpc: college.rpc,
        state: 1,
        blocked: false,
        provider: "local"
      };

      let d = new Date("01/01/2000");
      let n = d.toISOString();

      const individualRequestBody = {
        first_name: "College",
        middle_name: " ",
        last_name: "Admin",
        stream: null,
        father_full_name: "",
        mother_full_name: "",
        date_of_birth: n,
        gender: null,
        roll_number: null,
        organization: college.id,
        is_physically_challenged: false,
        is_verified: true
      };

      const contactBody = {
        name: "College Admin",
        contact_type: "individual",
        phone: stringPhoneNumber,
        email: stringPhoneNumber + "@gmail.com",
        address_1: "UP",
        state: null,
        district: null
      };

      await fucntionToAddUser(
        userBody,
        individualRequestBody,
        contactBody,
        entity
      )
        .then(res => {
          count += 1;
          console.log(stringPhoneNumber);
        })
        .catch(error => {});
    });
    console.log("---------------------------");
  });
  console.log("Successfully added " + count + " " + "College Admin");
}

async function addMedhaAdmin() {
  console.log("Adding Medha Admin");
  let entity = "Medha Admin";
  const role = await bookshelf
    .model("role")
    .where({ name: "Medha Admin" })
    .fetchAll()
    .then(model => model.toJSON());
  let usersNumerArray = Array(1)
    .join(0)
    .split(0)
    .map((v, i) => i + 1);

  let count = 0;
  await utils.asyncForEach(usersNumerArray, async user => {
    let randomPhoneNumber =
      Math.floor(3000000000 + Math.random() * 3000000000) + user;
    let stringPhoneNumber = "9029161582";
    const userBody = {
      username: stringPhoneNumber,
      email: stringPhoneNumber + "@gmail.com",
      password: "$2a$10$kj.5SLcsdLxQeUX914SP4.cE.MhaM8hY1Rr7.OD/KLYJUV4CuZ4F6",
      role: role[0].id,
      zone: null,
      rpc: null,
      state: null,
      blocked: false,
      provider: "local"
    };

    let d = new Date("01/01/2000");
    let n = d.toISOString();

    const individualRequestBody = {
      first_name: "Medha",
      middle_name: " ",
      last_name: "Admin",
      stream: null,
      father_full_name: "",
      mother_full_name: "",
      date_of_birth: n,
      gender: null,
      roll_number: null,
      organization: null,
      is_physically_challenged: false,
      is_verified: true
    };

    const contactBody = {
      name: "Medha Admin",
      contact_type: "individual",
      phone: stringPhoneNumber,
      email: stringPhoneNumber + "@gmail.com",
      address_1: "UP",
      state: 1,
      district: null
    };

    await fucntionToAddUser(
      userBody,
      individualRequestBody,
      contactBody,
      entity
    )
      .then(res => {
        count += 1;
        console.log(stringPhoneNumber);
      })
      .catch(error => {});

    // console.log(userRequestBody);
  });
  console.log("Successfully added " + count + " " + "Medha Admin");
}

async function fucntionToAddUser(
  userBody,
  individualRequestBody,
  contactBody,
  EntityToAdd
) {
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
        return Promise.reject("Something went wrong while creating User");
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
        return Promise.reject("Something went wrong while creating Individual");
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
        return Promise.reject("Something went wrong while creating Contact");
      }

      // Mapping user and individual relations
      const contactResponse = contact.toJSON ? contact.toJSON() : contact;

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
    .then(success => {})
    .catch(error => {
      console.log(error);
      console.log("Error adding " + EntityToAdd);
    });
}
