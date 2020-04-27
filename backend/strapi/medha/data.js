const roles = {
  Admin: {
    controllers: [
      {
        name: "academic-history",
        action: ["find", "findone"],
      },
      {
        name: "academic-year",
        action: ["find", "findone"],
      },
      {
        name: "activity",
        action: ["find", "findone"],
      },
      {
        name: "activity-batch",
        action: ["find", "findone"],
      },
      {
        name: "activity-batch-attendance",
        action: ["find", "findone"],
      },
      {
        name: "college",
        action: ["find", "findone", "showStudents"],
      },
      {
        name: "education",
        action: ["find", "findone"],
      },
      {
        name: "event",
        action: ["find", "findone"],
      },
      {
        name: "event-registration",
        action: ["find", "findone"],
      },
      {
        name: "feedback",
        action: ["find", "findone"],
      },
      {
        name: "question",
        action: ["find", "findone"],
      },
      {
        name: "question-set",
        action: ["find", "findone"],
      },
      {
        name: "response",
        action: ["find", "findone"],
      },
      {
        name: "rpc",
        action: ["find", "findone", "colleges"],
      },
      {
        name: "state",
        action: ["find", "findone", "zones", "rpcs"],
      },
      {
        name: "stream",
        action: ["find", "findone"],
      },
      {
        name: "student",
        action: ["find", "findone"],
      },
      {
        name: "user",
        action: ["find", "findone", "me"],
      },
      {
        name: "zone",
        action: ["find", "findone", "colleges"],
      },
      {
        name: "district",
        action: ["find", "findone"],
      },
    ],
    grantAllPermissions: false,
  },
  "Zonal Admin": {
    controllers: [
      {
        name: "academic-history",
        action: [],
      },
      {
        name: "academic-year",
        action: [],
      },
      {
        name: "activity",
        action: [],
      },
      {
        name: "activity-batch",
        action: [],
      },
      {
        name: "activity-batch-attendance",
        action: [],
      },
      {
        name: "college",
        action: ["find", "findone", "showStudents"],
      },
      {
        name: "education",
        action: [],
      },
      {
        name: "event",
        action: [],
      },
      {
        name: "event-registration",
        action: [],
      },
      {
        name: "feedback",
        action: [],
      },
      {
        name: "question",
        action: [],
      },
      {
        name: "question-set",
        action: [],
      },
      {
        name: "response",
        action: [],
      },
      {
        name: "rpc",
        action: ["find", "findone"],
      },
      {
        name: "state",
        action: [],
      },
      {
        name: "stream",
        action: [],
      },
      {
        name: "student",
        action: [],
      },
      {
        name: "user",
        action: ["me", "findOne"],
      },
      {
        name: "zone",
        action: ["find", "findone", "colleges"],
      },
      {
        name: "district",
        action: ["find", "findone"],
      },
    ],
    grantAllPermissions: false,
  },
  "RPC Admin": {
    controllers: [
      {
        name: "academic-history",
        action: [],
      },
      {
        name: "academic-year",
        action: [],
      },
      {
        name: "activity",
        action: [],
      },
      {
        name: "activity-batch",
        action: [],
      },
      {
        name: "activity-batch-attendance",
        action: [],
      },
      {
        name: "college",
        action: ["find", "findone", "showStudents"],
      },
      {
        name: "education",
        action: [],
      },
      {
        name: "event",
        action: [],
      },
      {
        name: "event-registration",
        action: [],
      },
      {
        name: "feedback",
        action: [],
      },
      {
        name: "question",
        action: [],
      },
      {
        name: "question-set",
        action: [],
      },
      {
        name: "response",
        action: [],
      },
      {
        name: "rpc",
        action: ["find", "findone", "colleges"],
      },
      {
        name: "state",
        action: [],
      },
      {
        name: "stream",
        action: [],
      },
      {
        name: "student",
        action: [],
      },
      {
        name: "user",
        action: ["me", "findOne"],
      },
      {
        name: "zone",
        action: [],
      },
      {
        name: "district",
        action: ["find", "findone"],
      },
    ],
    grantAllPermissions: false,
  },
  "College Admin": {
    controllers: [
      {
        name: "academic-history",
        action: [],
      },
      {
        name: "academic-year",
        action: [],
      },
      {
        name: "activity",
        action: ["findOne", "activitybatch", "download", "student"],
      },
      {
        name: "activity-batch",
        action: ["student", "delete"],
      },
      {
        name: "activity-batch-attendance",
        action: [],
      },
      {
        name: "college",
        action: [
          "find",
          "findone",
          "showStudents",
          "count",
          "event",
          "create",
          "delete",
          "update",
          "activity",
          "event",
          "admins",
          "studentregister",
        ],
      },
      {
        name: "education",
        action: [],
      },
      {
        name: "event",
        action: [
          "findone",
          "students",
          "eligibleCollegeStudents",
          "update",
          "delete",
        ],
      },
      {
        name: "event-registration",
        action: ["find", "create", "update"],
      },
      {
        name: "feedback",
        action: [],
      },
      {
        name: "question",
        action: [],
      },
      {
        name: "question-set",
        action: [],
      },
      {
        name: "response",
        action: [],
      },
      {
        name: "rpc",
        action: ["find", "findone"],
      },
      {
        name: "state",
        action: ["find", "findone"],
      },
      {
        name: "stream",
        action: ["find", "findone"],
      },
      {
        name: "student",
        action: [
          "find",
          "findone",
          "update",
          "count",
          "create",
          "delete",
          "edit",
          "approve",
          "unapprove",
          "registeredevents",
        ],
      },
      {
        name: "user",
        action: ["me", "findOne", "destroy"],
      },
      {
        name: "zone",
        action: ["find", "findone"],
      },
      {
        name: "district",
        action: ["find", "findone"],
      },
    ],
    grantAllPermissions: false,
  },
  Student: {
    controllers: [
      {
        name: "academic-history",
        action: ["create", "update", "delete"],
      },
      {
        name: "academic-year",
        action: ["find", "findOne"],
      },
      {
        name: "activity",
        action: ["findone"],
      },
      {
        name: "activity-batch",
        action: [],
      },
      {
        name: "activity-batch-attendance",
        action: [],
      },
      {
        name: "college",
        action: ["event", "activity"],
      },
      {
        name: "education",
        action: ["create", "update", "delete"],
      },
      {
        name: "event",
        action: ["findone"],
      },
      {
        name: "event-registration",
        action: ["create"],
      },
      {
        name: "feedback",
        action: [],
      },
      {
        name: "question",
        action: [],
      },
      {
        name: "question-set",
        action: [],
      },
      {
        name: "response",
        action: [],
      },
      {
        name: "rpc",
        action: [],
      },
      {
        name: "state",
        action: [],
      },
      {
        name: "stream",
        action: [],
      },
      {
        name: "student",
        action: [
          "findone",
          "update",
          "education",
          "create",
          "edit",
          "document",
          "deletedocument",
          "academicHistory",
          "events",
          "registeredevents",
          "activity",
          "pastevents",
        ],
      },
      {
        name: "user",
        action: ["me", "findOne"],
      },
      {
        name: "zone",
        action: [],
      },
      {
        name: "district",
        action: [],
      },
    ],
    grantAllPermissions: false,
  },
  "Medha Admin": {
    controllers: [
      {
        name: "academic-history",
        action: [],
      },
      {
        name: "academic-year",
        action: [],
      },
      {
        name: "activity",
        action: [],
      },
      {
        name: "activity-batch",
        action: [],
      },
      {
        name: "activity-batch-attendance",
        action: [],
      },
      {
        name: "college",
        action: [],
      },
      {
        name: "education",
        action: [],
      },
      {
        name: "event",
        action: [],
      },
      {
        name: "event-registration",
        action: [],
      },
      {
        name: "feedback",
        action: [],
      },
      {
        name: "question",
        action: [],
      },
      {
        name: "question-set",
        action: [],
      },
      {
        name: "response",
        action: [],
      },
      {
        name: "rpc",
        action: [],
      },
      {
        name: "state",
        action: [],
      },
      {
        name: "stream",
        action: [],
      },
      {
        name: "student",
        action: [],
      },
      {
        name: "user",
        action: [],
      },
      {
        name: "zone",
        action: [],
      },
      {
        name: "district",
        action: [],
      },
    ],
    grantAllPermissions: true,
  },
};

/**
 * This is test data, please change states zones and rpcs accordingly
 * state-> multiple zones -> zones with multiple rpcs
 */
const states = {
  "Uttar Pradesh": {
    zones: [
      "West Zone - Daurala (Meerut)",
      "Bundelkhand Zone - Jhansi",
      "Central Zone - Lucknow",
      "East Zone - Varanasi",
    ],
    districts: [
      "Agra",
      "Aligarh",
      "Prayagraj",
      "Ambedkar Nagar",
      "Amroha",
      "Auraiya",
      "Azamgarh",
      "Budaun",
      "Baharaich",
      "Ballia",
      "Balrampur",
      "Banda",
      "Barabanki",
      "Bareilly",
      "Basti",
      "Bijnore",
      "Bulandshahr",
      "Chandauli",
      "Chitrakoot",
      "Deoria",
      "Etah",
      "Etawah",
      "Faizabad",
      "Farrukhabad",
      "Fatehpur",
      "Firozabad",
      "Gautam Buddha Nagar",
      "Ghaziabad",
      "Ghazipur",
      "Gonda",
      "Gorakhpur",
      "Hamirpur",
      "Hapur",
      "Hardoi",
      "Hathras",
      "Jaunpur",
      "Jhansi",
      "Kannauj",
      "Kanpur Dehat",
      "Kanpur Nagar",
      "Ksganj",
      "Kaushambi",
      "Kushinagar",
      "Lakhimpur Kheri",
      "Lalitpur",
      "Lucknow",
      "Maharajganj",
      "Mahoba",
      "Mainpuri",
      "Mathura",
      "Mau",
      "Meerut",
      "Mirzapur",
      "Moradabad",
      "Muzaffarnagar",
      "Pilibhit",
      "Pratapgarh",
      "Rae Bareily",
      "Rampur",
      "Saharanpur",
      "Sant Kabir Nagar",
      "Sant Ravidas Nagar",
      "Sambhal",
      "Shahjahanpur",
      "Shamli",
      "Shravasti",
      "Siddhartnagar",
      "Sitapur",
      "Sonbhadra",
      "Sultanpur",
      "Unnao",
      "Varanasi",
      "Amethi",
      "Baghpat",
      "Allahabad",
    ],
    rpcs: [
      "Agra",
      "Bareilly",
      "Ghaziabad",
      "Gorakhpur",
      "Jhansi",
      "Kanpur",
      "Lucknow",
      "Moradabad",
      "Prayagraj",
      "Varanasi",
    ],
  },
};

const allowedMedhaAdminRoutes = ["getroles", "getrole"];

const streams = ["Civil", "Computer", "Mechanical", "ENTC", "Instrumental"];

const academicYears = [
  { name: "AY 11-12", start_date: "2011-06-01", end_date: "2012-05-31" },
  { name: "AY 12-13", start_date: "2012-06-01", end_date: "2013-05-31" },
  { name: "AY 13-14", start_date: "2013-06-01", end_date: "2014-05-31" },
  { name: "AY 14-15", start_date: "2014-06-01", end_date: "2015-05-31" },
  { name: "AY 15-16", start_date: "2015-06-01", end_date: "2016-05-31" },
  { name: "AY 16-17", start_date: "2016-06-01", end_date: "2017-05-31" },
  { name: "AY 17-18", start_date: "2017-06-01", end_date: "2018-05-31" },
  { name: "AY 18-19", start_date: "2018-06-01", end_date: "2019-05-31" },
  { name: "AY 19-20", start_date: "2019-06-01", end_date: "2020-05-31" },
  { name: "AY 20-21", start_date: "2020-06-01", end_date: "2021-05-31" },
  { name: "AY 21-22", start_date: "2021-06-01", end_date: "2022-05-31" },
  { name: "AY 22-23", start_date: "2022-06-01", end_date: "2023-05-31" },
  { name: "AY 23-24", start_date: "2023-06-01", end_date: "2024-05-31" },
  { name: "AY 24-25", start_date: "2024-06-01", end_date: "2025-05-31" },
];

const publicRoutes = {
  controllers: [
    {
      name: "otp",
      action: ["requestotp", "validateotp", "requestotpforstudent", "checkotp"],
    },
    {
      name: "state",
      action: ["find"],
    },
    {
      name: "zone",
      action: ["find"],
    },
    {
      name: "rpc",
      action: ["find"],
    },
    {
      name: "college",
      action: ["find"],
    },
    {
      name: "student",
      action: ["register"],
    },
    {
      name: "district",
      action: ["find"],
    },
    {
      name: "stream",
      action: ["find"],
    },
  ],
};

const uploadPermissions = ["upload"];

module.exports = Object.freeze({
  roles,
  states,
  allowedMedhaAdminRoutes,
  streams,
  publicRoutes,
  uploadPermissions,
  academicYears,
});
