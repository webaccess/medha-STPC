const PLUGIN_NAME = "crm-plugin";

const ACADEMIC_YEARS = [
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
  { name: "AY 24-25", start_date: "2024-06-01", end_date: "2025-05-31" }
];

const FUTURE_ASPIRATIONS = [
  "Private Jobs",
  "Higher Studies",
  "Marriage",
  "Entrepreneurship",
  "Government Job",
  "Apprenticeship",
  "Others"
];

const COUNTRIES = [
  {
    name: "India",
    abbreviation: "IN",
    identifier: "IN",
    isActive: true,
    states: [
      {
        name: "Uttar Pradesh",
        abbreviation: "UP",
        identifier: "",
        isActive: true,
        zones: [
          { name: "West Zone - Daurala (Meerut)" },
          { name: "Bundelkhand Zone - Jhansi" },
          { name: "Central Zone - Lucknow" },
          { name: "East Zone - Varanasi" }
        ],
        districts: [
          { name: "Agra", abbreviation: "AG", identfier: "", is_active: true },
          {
            name: "Aligarh",
            abbreviation: "AL",
            identfier: "",
            is_active: true
          },
          {
            name: "Prayagraj",
            abbreviation: "PY",
            identfier: "",
            is_active: true
          },
          {
            name: "Ambedkar Nagar",
            abbreviation: "AN",
            identfier: "",
            is_active: true
          },
          {
            name: "Amroha",
            abbreviation: "JP",
            identfier: "",
            is_active: true
          },
          {
            name: "Auraiya",
            abbreviation: "AU",
            identfier: "",
            is_active: true
          },
          {
            name: "Azamgarh",
            abbreviation: "AZ",
            identfier: "",
            is_active: true
          },
          {
            name: "Budaun",
            abbreviation: "BD",
            identfier: "",
            is_active: true
          },
          {
            name: "Baharaich",
            abbreviation: "BH",
            identfier: "",
            is_active: true
          },
          {
            name: "Ballia",
            abbreviation: "BL",
            identfier: "",
            is_active: true
          },
          {
            name: "Balrampur",
            abbreviation: "BP",
            identfier: "",
            is_active: true
          },
          { name: "Banda", abbreviation: "BN", identfier: "", is_active: true },
          {
            name: "Barabanki",
            abbreviation: "BB",
            identfier: "",
            is_active: true
          },
          {
            name: "Bareilly",
            abbreviation: "BR",
            identfier: "",
            is_active: true
          },
          { name: "Basti", abbreviation: "BS", identfier: "", is_active: true },
          {
            name: "Bijnore",
            abbreviation: "BI",
            identfier: "",
            is_active: true
          },
          {
            name: "Bulandshahr",
            abbreviation: "BU",
            identfier: "",
            is_active: true
          },
          {
            name: "Chandauli",
            abbreviation: "CD",
            identfier: "",
            is_active: true
          },
          {
            name: "Chitrakoot",
            abbreviation: "CT",
            identfier: "",
            is_active: true
          },
          {
            name: "Deoria",
            abbreviation: "DE",
            identfier: "",
            is_active: true
          },
          { name: "Etah", abbreviation: "ET", identfier: "", is_active: true },
          {
            name: "Etawah",
            abbreviation: "EW",
            identfier: "",
            is_active: true
          },
          {
            name: "Faizabad",
            abbreviation: "FZ",
            identfier: "",
            is_active: true
          },
          {
            name: "Farrukhabad",
            abbreviation: "FR",
            identfier: "",
            is_active: true
          },
          {
            name: "Fatehpur",
            abbreviation: "FT",
            identfier: "",
            is_active: true
          },
          {
            name: "Firozabad",
            abbreviation: "FI",
            identfier: "",
            is_active: true
          },
          {
            name: "Gautam Buddha Nagar",
            abbreviation: "GB",
            identfier: "",
            is_active: true
          },
          {
            name: "Ghaziabad",
            abbreviation: "GZ",
            identfier: "",
            is_active: true
          },
          {
            name: "Ghazipur",
            abbreviation: "GP",
            identfier: "",
            is_active: true
          },
          { name: "Gonda", abbreviation: "GN", identfier: "", is_active: true },
          {
            name: "Gorakhpur",
            abbreviation: "GR",
            identfier: "",
            is_active: true
          },
          {
            name: "Hamirpur",
            abbreviation: "HM",
            identfier: "",
            is_active: true
          },
          { name: "Hapur", abbreviation: "HA", identfier: "", is_active: true },
          {
            name: "Hardoi",
            abbreviation: "HR",
            identfier: "",
            is_active: true
          },
          {
            name: "Hathras",
            abbreviation: "HT",
            identfier: "",
            is_active: true
          },
          {
            name: "Jaunpur",
            abbreviation: "JU",
            identfier: "",
            is_active: true
          },
          {
            name: "Jhansi",
            abbreviation: "JH",
            identfier: "",
            is_active: true
          },
          {
            name: "Kannauj",
            abbreviation: "KJ",
            identfier: "",
            is_active: true
          },
          {
            name: "Kanpur Dehat",
            abbreviation: "KD",
            identfier: "",
            is_active: true
          },
          {
            name: "Kanpur Nagar",
            abbreviation: "KN",
            identfier: "",
            is_active: true
          },
          {
            name: "Ksganj",
            abbreviation: "KG",
            identfier: "",
            is_active: true
          },
          {
            name: "Kaushambi",
            abbreviation: "KS",
            identfier: "",
            is_active: true
          },
          {
            name: "Kushinagar",
            abbreviation: "KU",
            identfier: "",
            is_active: true
          },
          {
            name: "Lakhimpur Kheri",
            abbreviation: "LK",
            identfier: "",
            is_active: true
          },
          {
            name: "Lalitpur",
            abbreviation: "LA",
            identfier: "",
            is_active: true
          },
          {
            name: "Lucknow",
            abbreviation: "LU",
            identfier: "",
            is_active: true
          },
          {
            name: "Maharajganj",
            abbreviation: "MG",
            identfier: "",
            is_active: true
          },
          {
            name: "Mahoba",
            abbreviation: "MH",
            identfier: "",
            is_active: true
          },
          {
            name: "Mainpuri",
            abbreviation: "MP",
            identfier: "",
            is_active: true
          },
          {
            name: "Mathura",
            abbreviation: "MT",
            identfier: "",
            is_active: true
          },
          { name: "Mau", abbreviation: "MB", identfier: "", is_active: true },
          {
            name: "Meerut",
            abbreviation: "ME",
            identfier: "",
            is_active: true
          },
          {
            name: "Mirzapur",
            abbreviation: "MI",
            identfier: "",
            is_active: true
          },
          {
            name: "Moradabad",
            abbreviation: "MO",
            identfier: "",
            is_active: true
          },
          {
            name: "Muzaffarnagar",
            abbreviation: "MU",
            identfier: "",
            is_active: true
          },
          {
            name: "Pilibhit",
            abbreviation: "PI",
            identfier: "",
            is_active: true
          },
          {
            name: "Pratapgarh",
            abbreviation: "PR",
            identfier: "",
            is_active: true
          },
          {
            name: "Rae Bareily",
            abbreviation: "RB",
            identfier: "",
            is_active: true
          },
          {
            name: "Rampur",
            abbreviation: "RA",
            identfier: "",
            is_active: true
          },
          {
            name: "Saharanpur",
            abbreviation: "SA",
            identfier: "",
            is_active: true
          },
          {
            name: "Sant Kabir Nagar",
            abbreviation: "SK",
            identfier: "",
            is_active: true
          },
          {
            name: "Sant Ravidas Nagar",
            abbreviation: "SR",
            identfier: "",
            is_active: true
          },
          {
            name: "Sambhal",
            abbreviation: "SM",
            identfier: "",
            is_active: true
          },
          {
            name: "Shahjahanpur",
            abbreviation: "SJ",
            identfier: "",
            is_active: true
          },
          {
            name: "Shamli",
            abbreviation: "SH",
            identfier: "",
            is_active: true
          },
          {
            name: "Shravasti",
            abbreviation: "SV",
            identfier: "",
            is_active: true
          },
          {
            name: "Siddhartnagar",
            abbreviation: "SN",
            identfier: "",
            is_active: true
          },
          {
            name: "Sitapur",
            abbreviation: "SI",
            identfier: "",
            is_active: true
          },
          {
            name: "Sonbhadra",
            abbreviation: "SO",
            identfier: "",
            is_active: true
          },
          {
            name: "Sultanpur",
            abbreviation: "SU",
            identfier: "",
            is_active: true
          },
          { name: "Unnao", abbreviation: "UN", identfier: "", is_active: true },
          {
            name: "Varanasi",
            abbreviation: "VA",
            identfier: "",
            is_active: true
          },
          {
            name: "Amethi",
            abbreviation: "AM",
            identfier: "",
            is_active: true
          },
          {
            name: "Baghpat",
            abbreviation: "BT",
            identfier: "",
            is_active: true
          },
          {
            name: "Allahabad",
            abbreviation: "AH",
            identfier: "",
            is_active: true
          }
        ],
        rpcs: [
          { name: "Agra" },
          { name: "Bareilly" },
          { name: "Ghaziabad" },
          { name: "Gorakhpur" },
          { name: "Jhansi" },
          { name: "Kanpur" },
          { name: "Lucknow" },
          { name: "Moradabad" },
          { name: "Prayagraj" },
          { name: "Varanasi" }
        ]
      }
    ]
  }
];

const STREAMS = ["Civil", "Computer", "Mechanical", "ENTC", "Instrumental"];

const ROLES = {
  Admin: {
    controllers: [
      {
        name: "academic-history",
        action: ["find", "findone"]
      },
      {
        name: "academic-year",
        action: ["find", "findone"]
      },
      {
        name: "activity-batch",
        action: ["find", "findone"]
      },
      {
        name: "education",
        action: ["find", "findone"]
      },
      {
        name: "event",
        action: ["find", "findone"]
      },
      {
        name: "event-registration",
        action: ["find", "findone"]
      },
      {
        name: "feedback",
        action: ["find", "findone"]
      },
      {
        name: "question",
        action: ["find", "findone"]
      },
      {
        name: "question-set",
        action: ["find", "findone"]
      },
      {
        name: "feedback-set",
        action: ["find", "findone"]
      },
      {
        name: "rpc",
        action: ["find", "findone", "colleges"]
      },
      {
        name: "stream",
        action: ["find", "findone"]
      },
      {
        name: "user",
        action: ["find", "findone", "me"]
      },
      {
        name: "zone",
        action: ["find", "findone", "colleges"]
      },
      {
        name: "activity",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "activityassignee",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "activitytype",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "contact",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "contacttag",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "country",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "tag",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "village",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "state",
        action: ["find", "findone", "zones", "rpcs"],
        type: PLUGIN_NAME
      },
      {
        name: "district",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      }
      // {
      //   name: "individual",
      //   action: ["find", "findone"],
      //   type: PLUGIN_NAME
      // },
      // {
      //   name: "organization",
      //   action: ["find", "findone", "showStudents"],
      //   type: PLUGIN_NAME
      // }
    ],
    grantAllPermissions: false
  },
  "Zonal Admin": {
    controllers: [
      {
        name: "academic-history",
        action: []
      },
      {
        name: "academic-year",
        action: []
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "education",
        action: []
      },
      {
        name: "event",
        action: [
          "getfeedbackforzone",
          "getquestionset",
          "findone",
          "getfeedbacksforeventforrpc",
          "getfeedbackscommentsforeventforrpc"
        ]
      },
      {
        name: "event-registration",
        action: []
      },
      {
        name: "feedback",
        action: []
      },
      {
        name: "question",
        action: []
      },
      {
        name: "question-set",
        action: ["find", "findone"]
      },
      {
        name: "feedback-set",
        action: ["create", "findone", "update", "findonewithrole"]
      },
      {
        name: "rpc",
        action: ["find", "findone"]
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "zone",
        action: ["find", "findone", "colleges"]
      },
      {
        name: "user",
        action: ["me", "findOne"]
      },
      {
        name: "activity",
        action: ["getquestionset", "getfeedbacksforactivityforzone"],
        type: PLUGIN_NAME
      },
      {
        name: "activityassignee",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activitytype",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "contact",
        action: ["zoneevents", "getactivitiesforzonesrpcs"],
        type: PLUGIN_NAME
      },
      {
        name: "contacttag",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "country",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "tag",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "village",
        action: [],
        type: PLUGIN_NAME
      },

      {
        name: "state",
        action: [],
        type: PLUGIN_NAME
      },
      // {
      //   name: "individual",
      //   action: [],
      //   type: PLUGIN_NAME
      // },
      // {
      //   name: "organization",
      //   action: ["find", "findone", "showStudents"],
      //   type: PLUGIN_NAME
      // },
      {
        name: "district",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      }
    ],
    grantAllPermissions: false
  },
  "RPC Admin": {
    controllers: [
      {
        name: "academic-history",
        action: []
      },
      {
        name: "academic-year",
        action: []
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "education",
        action: []
      },
      {
        name: "event",
        action: [
          "getquestionset",
          "findone",
          "getfeedbacksforeventforrpc",
          "getfeedbackscommentsforeventforrpc"
        ]
      },
      {
        name: "event-registration",
        action: []
      },
      {
        name: "feedback",
        action: []
      },
      {
        name: "question",
        action: []
      },
      {
        name: "question-set",
        action: ["find", "findone"]
      },
      {
        name: "feedback-set",
        action: ["create", "findone", "update", "findonewithrole"]
      },
      {
        name: "rpc",
        action: ["find", "findone", "colleges"]
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "user",
        action: ["me", "findOne"]
      },
      {
        name: "zone",
        action: []
      },
      {
        name: "activity",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activityassignee",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activitytype",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "contact",
        action: ["rpcevents", "getactivitiesforzonesrpcs"],
        type: PLUGIN_NAME
      },
      {
        name: "contacttag",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "country",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "district",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "village",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "state",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "tag",
        action: [],
        type: PLUGIN_NAME
      },
      // {
      //   name: "individual",
      //   action: [],
      //   type: PLUGIN_NAME
      // },
      // {
      //   name: "organization",
      //   action: ["find", "findone", "showStudents"],
      //   type: PLUGIN_NAME
      // },
      {
        name: "district",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      }
    ],
    grantAllPermissions: false
  },
  "College Admin": {
    controllers: [
      {
        name: "academic-history",
        action: ["create", "update", "delete"]
      },
      {
        name: "academic-year",
        action: ["find", "create", "update", "findone"]
      },
      {
        name: "activity-batch",
        action: ["student", "delete", "update", "create"]
      },
      {
        name: "education",
        action: ["create", "update", "delete"]
      },
      {
        name: "event",
        action: [
          "create",
          "deleteimage",
          "findone",
          "individual",
          "eligibleOrganizationIndividual",
          "update",
          "delete",
          "getquestionset",
          "getfeedbacksforeventfromcollege",
          "getstudentcommentsforeventfromcollege",
          "getfeedbacksforeventforrpc",
          "getfeedbackscommentsforeventforrpc"
        ]
      },
      {
        name: "event-registration",
        action: ["find", "create", "update", "getfeedbacksforeventfromcollege"]
      },
      {
        name: "feedback",
        action: []
      },
      {
        name: "question",
        action: []
      },
      {
        name: "question-set",
        action: ["find", "findone"]
      },
      {
        name: "feedback-set",
        action: ["create", "findone", "update", "findonewithrole"]
      },
      {
        name: "rpc",
        action: ["find", "findone"]
      },
      {
        name: "stream",
        action: ["find", "findone"]
      },
      {
        name: "futureaspirations",
        action: ["find"]
      },
      {
        name: "user",
        action: ["me", "findOne", "destroy"]
      },
      {
        name: "zone",
        action: ["find", "findone"]
      },
      {
        name: "student-import-csv",
        action: [
          "find",
          "findone",
          "create",
          "delete",
          "update",
          "import",
          "getFileImportDetails",
          "getRecords",
          "getImportedFileStatus"
        ]
      },
      {
        name: "activity",
        action: [
          "create",
          "findOne",
          "activitybatch",
          "download",
          "student",
          "getquestionset",
          "update",
          "getfeedbacksforeventfromcollege",
          "getfeedbacksforactivityforrpc"
        ],
        type: PLUGIN_NAME
      },
      {
        name: "activityassignee",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activitytype",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "contact",
        action: [
          "academichistory",
          "documents",
          "education",
          "deletedocument",
          "eligiblepastactivities",
          "organizationstudents",
          "organizationadmins",
          "findone",
          "createindividual",
          "individualdetails",
          "editorganization",
          "organizationdetails",
          "approve",
          "unapprove",
          "individuals",
          "organizationevents",
          "eligiblepastevents",
          "eligibleEvents",
          "editindividual",
          "getOrganizationActivities",
          "rpcevents",
          "getactivitiesforzonesrpcs"
        ],
        type: PLUGIN_NAME
      },
      {
        name: "contacttag",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "country",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "village",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "tag",
        action: [],
        type: PLUGIN_NAME
      },
      // {
      //   name: "organization",
      //   action: [
      //     "find",
      //     "findone",
      //     "showStudents",
      //     "count",
      //     "event",
      //     "create",
      //     "delete",
      //     "update",
      //     "activity",
      //     "event",
      //     "admins",
      //     "studentregister",
      //     "deletestudents"
      //   ],
      //   type: PLUGIN_NAME
      // },
      // {
      //   name: "individual",
      //   action: [
      //     "find",
      //     "findone",
      //     "update",
      //     "count",
      //     "create",
      //     "delete",
      //     "edit",
      //     "approve",
      //     "unapprove",
      //     "registeredevents"
      //   ],
      //   type: PLUGIN_NAME
      // },
      {
        name: "district",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      },
      {
        name: "state",
        action: ["find", "findone"],
        type: PLUGIN_NAME
      }
    ],
    grantAllPermissions: false
  },
  Student: {
    controllers: [
      {
        name: "academic-history",
        action: ["create", "update", "delete"]
      },
      {
        name: "academic-year",
        action: ["find", "findOne"]
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "education",
        action: ["create", "update", "delete"]
      },
      {
        name: "event",
        action: ["findone", "getquestionset"]
      },
      {
        name: "event-registration",
        action: ["create"]
      },
      {
        name: "feedback",
        action: []
      },
      {
        name: "question",
        action: []
      },
      {
        name: "question-set",
        action: []
      },
      {
        name: "feedback-set",
        action: ["create", "findone", "update", "findonewithrole"]
      },
      {
        name: "rpc",
        action: []
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "futureaspirations",
        action: ["find"]
      },
      {
        name: "user",
        action: ["me", "findOne"]
      },
      {
        name: "zone",
        action: []
      },
      {
        name: "activity",
        action: ["findone", "getquestionset"],
        type: PLUGIN_NAME
      },
      {
        name: "activityassignee",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activitytype",
        action: ["findone"],
        type: PLUGIN_NAME
      },
      {
        name: "contact",
        action: [
          "findone",
          "education",
          "academichistory",
          "eligiblepastactivities",
          "deletedocument",
          "eligibleEvents",
          "eligibleActivity",
          "individualregisteredevents",
          "individualdetails",
          "eligiblepastevents",
          "documents",
          "deletedocuments",
          "editindividual"
        ],
        type: PLUGIN_NAME
      },
      {
        name: "contacttag",
        action: ["findone"],
        type: PLUGIN_NAME
      },
      {
        name: "country",
        action: ["findone"],
        type: PLUGIN_NAME
      },
      {
        name: "tag",
        action: ["findone"],
        type: PLUGIN_NAME
      },
      {
        name: "village",
        action: ["findone"],
        type: PLUGIN_NAME
      },
      {
        name: "state",
        action: [],
        type: PLUGIN_NAME
      },
      // {
      //   name: "individual",
      //   action: [
      //     "findone",
      //     "update",
      //     "education",
      //     "create",
      //     "edit",
      //     "document",
      //     "deletedocument",
      //     "academicHistory",
      //     "events",
      //     "registeredevents",
      //     "activity",
      //     "pastevents",
      //     "pastActivity"
      //   ],
      //   type: PLUGIN_NAME
      // },
      // {
      //   name: "organization",
      //   action: ["event", "activity"],
      //   type: PLUGIN_NAME
      // },
      {
        name: "district",
        action: [],
        type: PLUGIN_NAME
      }
    ],
    grantAllPermissions: false
  },
  "Medha Admin": {
    controllers: [
      {
        name: "academic-history",
        action: []
      },
      {
        name: "academic-year",
        action: []
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "education",
        action: []
      },
      {
        name: "event",
        action: []
      },
      {
        name: "event-registration",
        action: []
      },
      {
        name: "feedback",
        action: []
      },
      {
        name: "question",
        action: []
      },
      {
        name: "question-set",
        action: []
      },
      {
        name: "feedback-set",
        action: []
      },
      {
        name: "rpc",
        action: []
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "futureaspirations",
        action: []
      },
      {
        name: "user",
        action: []
      },
      {
        name: "zone",
        action: []
      },
      {
        name: "student-import-csv",
        action: []
      },
      {
        name: "activity",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activityassignee",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "activitytype",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "contact",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "contacttag",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "country",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "tag",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "village",
        action: [],
        type: PLUGIN_NAME
      },
      {
        name: "state",
        action: [],
        type: PLUGIN_NAME
      },
      // {
      //   name: "individual",
      //   action: [],
      //   type: PLUGIN_NAME
      // },
      // {
      //   name: "organization",
      //   action: [],
      //   type: PLUGIN_NAME
      // },
      {
        name: "district",
        action: [],
        type: PLUGIN_NAME
      }
    ],
    grantAllPermissions: true
  }
};

const ALLOWED_MEDHA_ADMIN_ROUTES = ["getroles", "getrole"];

const uploadPermissions = ["upload"];

const PUBLIC_ROUTES = {
  controllers: [
    {
      name: "otp",
      action: ["requestotp", "validateotp", "requestotpforstudent", "checkotp"]
    },
    {
      name: "state",
      action: ["find"],
      type: PLUGIN_NAME
    },
    {
      name: "zone",
      action: ["find"]
    },
    {
      name: "rpc",
      action: ["find"]
    },
    // {
    //   name: "college",
    //   action: ["find"],
    // },
    // {
    //   name: "student",
    //   action: ["register"],
    // },
    {
      name: "contact",
      action: ["organizations", "createindividual"],
      type: PLUGIN_NAME
    },
    {
      name: "district",
      action: ["find"],
      type: PLUGIN_NAME
    },
    {
      name: "stream",
      action: ["find"]
    },
    {
      name: "futureaspirations",
      action: ["find"]
    },
    {
      name: "board",
      action: ["find"]
    },
    {
      name: "academic-year",
      action: ["find"]
    }
  ]
};

const ACTIVITY_TYPES = ["Training", "Workshop", "Industrial Visit"];

const BOARDS = [
  "CBSE",
  "CISCE",
  "NIOS",
  "UPBOARD",
  "JKBOSE",
  "RBSE",
  "HPBOSE",
  "MPBSE",
  "CGBSE",
  "PSEB",
  "BSEH",
  "ICSE",
  "BSEB",
  "GSEB",
  "MSBSHSE",
  "BIEAP",
  "BSEAP",
  "WBBSE",
  "WBCSHE"
];

module.exports = {
  ACADEMIC_YEARS,
  COUNTRIES,
  STREAMS,
  uploadPermissions,
  ROLES,
  ALLOWED_MEDHA_ADMIN_ROUTES,
  PUBLIC_ROUTES,
  ACTIVITY_TYPES,
  FUTURE_ASPIRATIONS,
  BOARDS
};
