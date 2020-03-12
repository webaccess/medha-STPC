const roles = {
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
        name: "activity",
        action: ["find", "findone"]
      },
      {
        name: "activity-batch",
        action: ["find", "findone"]
      },
      {
        name: "activity-batch-attendance",
        action: ["find", "findone"]
      },
      {
        name: "college",
        action: ["find", "findone", "showStudents"]
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
        name: "response",
        action: ["find", "findone"]
      },
      {
        name: "rpc",
        action: ["find", "findone", "colleges"]
      },
      {
        name: "state",
        action: ["find", "findone", "zones"]
      },
      {
        name: "stream",
        action: ["find", "findone"]
      },
      {
        name: "student",
        action: ["find", "findone"]
      },
      {
        name: "user",
        action: ["find", "findone", "me"]
      },
      {
        name: "zone",
        action: ["find", "findone", "rpcs", "colleges"]
      },
      {
        name: "district",
        action: ["find", "findone"]
      }
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
        name: "activity",
        action: []
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "activity-batch-attendance",
        action: []
      },
      {
        name: "college",
        action: ["find", "findone", "showStudents"]
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
        name: "response",
        action: []
      },
      {
        name: "rpc",
        action: ["find", "findone"]
      },
      {
        name: "state",
        action: []
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "student",
        action: []
      },
      {
        name: "user",
        action: ["me"]
      },
      {
        name: "zone",
        action: ["find", "findone", "rpcs", "colleges"]
      },
      {
        name: "district",
        action: ["find", "findone"]
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
        name: "activity",
        action: []
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "activity-batch-attendance",
        action: []
      },
      {
        name: "college",
        action: ["find", "findone", "showStudents"]
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
        name: "response",
        action: []
      },
      {
        name: "rpc",
        action: ["find", "findone", "colleges"]
      },
      {
        name: "state",
        action: []
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "student",
        action: []
      },
      {
        name: "user",
        action: ["me"]
      },
      {
        name: "zone",
        action: []
      },
      {
        name: "district",
        action: ["find", "findone"]
      }
    ],
    grantAllPermissions: false
  },
  "College Admin": {
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
        name: "activity",
        action: []
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "activity-batch-attendance",
        action: []
      },
      {
        name: "college",
        action: ["find", "findone", "showStudents", "count", "create", "delete"]
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
        name: "response",
        action: []
      },
      {
        name: "rpc",
        action: []
      },
      {
        name: "state",
        action: []
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "student",
        action: []
      },
      {
        name: "user",
        action: ["me"]
      },
      {
        name: "zone",
        action: []
      },
      {
        name: "district",
        action: ["find", "findone"]
      }
    ],
    grantAllPermissions: false
  },
  " Student": {
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
        name: "activity",
        action: []
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "activity-batch-attendance",
        action: []
      },
      {
        name: "college",
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
        name: "response",
        action: []
      },
      {
        name: "rpc",
        action: []
      },
      {
        name: "state",
        action: []
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "student",
        action: ["findone", "update"]
      },
      {
        name: "user",
        action: ["me"]
      },
      {
        name: "zone",
        action: []
      },
      {
        name: "district",
        action: []
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
        name: "activity",
        action: []
      },
      {
        name: "activity-batch",
        action: []
      },
      {
        name: "activity-batch-attendance",
        action: []
      },
      {
        name: "college",
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
        name: "response",
        action: []
      },
      {
        name: "rpc",
        action: []
      },
      {
        name: "state",
        action: []
      },
      {
        name: "stream",
        action: []
      },
      {
        name: "student",
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
        name: "district",
        action: []
      }
    ],
    grantAllPermissions: true
  }
};

/**
 * This is test data, please change states zones and rpcs accordingly
 * state-> multiple zones -> zones with multiple rpcs
 */
const states = {
  "Uttar Pradesh": {
    zones: {
      "West-UP": {
        rpcs: ["Noida"]
      },
      "East-UP": {
        rpcs: ["Varanasi"]
      },
      "Central-UP": {
        rpcs: ["Kanpur", "Prayagrai"]
      }
    },
    districts: [
      "Agra",
      "Firozabad",
      "Mainpuri",
      "Mathura",
      "Varanasi",
      "Jaunpur",
      "Ghazipur"
    ]
  }
};

const allowedMedhaAdminRoutes = ["getroles", "getrole"];

const streams = ["Civil", "Computer", "Mechanical", "ENTC", "Instrumental"];

const publicRoutes = {
  controllers: [
    {
      name: "otp",
      action: ["requestotp", "validateotp", "requestotpforstudent", "checkotp"]
    },
    {
      name: "state",
      action: ["find"]
    },
    {
      name: "zone",
      action: ["find"]
    },
    {
      name: "rpc",
      action: ["find"]
    },
    {
      name: "college",
      action: ["find"]
    },
    {
      name: "student",
      action: ["register"]
    },
    {
      name: "district",
      action: ["find"]
    },
    {
      name: "stream",
      action: ["find"]
    }
  ]
};

module.exports = Object.freeze({
  roles,
  states,
  allowedMedhaAdminRoutes,
  streams,
  publicRoutes
});
