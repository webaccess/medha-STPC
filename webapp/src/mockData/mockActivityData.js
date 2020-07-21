export const editActivityLocationData = {
  pathname: "/edit-activity",
  editActivity: true,
  dataForEdit: {
    id: 2,
    title: "Career Awareness 1",
    start_date_time: "2020-06-02T03:30:00.000Z",
    end_date_time: "2020-06-03T12:30:00.000Z",
    activitytype: {
      id: 2,
      name: "Workshop",
      is_active: true,
      created_at: "2020-06-24T07:09:36.955Z",
      updated_at: "2020-06-24T07:09:36.955Z"
    },
    academic_year: {
      id: 8,
      name: "AY 20-21",
      start_date: "2020-06-01",
      end_date: "2021-05-31",
      created_at: "2020-06-24T07:09:35.214Z",
      updated_at: "2020-06-24T07:09:35.214Z"
    },
    contact: {
      id: 2,
      name: "Government Polytechnic, Mainpuri",
      phone: "0356273400",
      phone_other: null,
      email: "collegeemail1@gmail.com",
      email_other: null,
      address_1: "UP",
      address_2: null,
      city: null,
      pincode: null,
      contact_type: "organization",
      organization: 1,
      country: null,
      village: null,
      state: 1,
      district: 49,
      individual: null,
      user: null,
      created_at: "2020-06-24T07:18:46.694Z",
      updated_at: "2020-06-24T07:18:46.694Z"
    },
    education_year: "First",
    address: "UP",
    trainer_name: "Vibha",
    question_set: {
      id: 1,
      name: "Activity Question Set",
      created_at: "2020-06-24T07:09:37.048Z",
      updated_at: "2020-06-24T07:09:37.048Z"
    },
    description: "<p>Test</p>\n",
    cancelled: null,
    created_at: "2020-06-24T08:20:24.170Z",
    updated_at: "2020-06-24T08:20:24.190Z",
    activity_status: null,
    upload_logo: null,
    activityassignees: [
      {
        id: 3,
        activity: 2,
        contact: 6,
        activity_batch: 2,
        is_verified_by_college: true,
        created_at: "2020-06-24T08:24:26.839Z",
        updated_at: "2020-06-24T08:24:33.727Z"
      },
      {
        id: 4,
        activity: 2,
        contact: 7,
        activity_batch: 2,
        is_verified_by_college: false,
        created_at: "2020-06-24T08:24:26.840Z",
        updated_at: "2020-07-05T14:14:10.717Z"
      },
      {
        id: 17,
        activity: 2,
        contact: 46,
        activity_batch: 2,
        is_verified_by_college: true,
        created_at: "2020-07-06T05:14:09.028Z",
        updated_at: "2020-07-06T05:14:13.409Z"
      }
    ],
    streams: [
      {
        id: 1,
        name: "Mechanical Engineering (Production)",
        created_at: "2020-06-24T07:09:35.408Z",
        updated_at: "2020-06-24T07:09:35.408Z"
      },
      {
        id: 2,
        name: "Computer Science And Engineering",
        created_at: "2020-06-24T07:09:35.414Z",
        updated_at: "2020-06-24T07:09:35.414Z"
      },
      {
        id: 3,
        name: "Electronics Engineering",
        created_at: "2020-06-24T07:09:35.419Z",
        updated_at: "2020-06-24T07:09:35.419Z"
      }
    ]
  },
  search: "",
  hash: "",
  key: "hnq6pw"
};

export const mockCollegeStreamListForMainpuriCollege = [
  {
    id: 1,
    name: "Mechanical Engineering (Production)"
  },
  {
    id: 2,
    name: "Computer Science And Engineering"
  },
  {
    id: 3,
    name: "Electronics Engineering"
  }
];

export const mockCollegeListForAddingActivity = [
  {
    id: 1,
    name: "Government Polytechnic, Mainpuri",
    contact: {
      id: 2,
      name: "Government Polytechnic, Mainpuri",
      phone: "0356273400",
      phone_other: null,
      email: "collegeemail1@gmail.com",
      email_other: null,
      address_1: "UP",
      address_2: null,
      city: null,
      pincode: null,
      contact_type: "organization",
      organization: 1,
      country: null,
      village: null,
      state: {
        id: 1,
        name: "Uttar Pradesh",
        is_active: true,
        abbreviation: "UP",
        identifier: "",
        country: 1,
        created_at: "2020-06-24T07:09:28.252Z",
        updated_at: "2020-06-24T07:09:28.252Z"
      },
      district: {
        id: 49,
        name: "Mainpuri",
        is_active: true,
        abbreviation: "MP",
        identifier: null,
        state: 1,
        created_at: "2020-06-24T07:09:28.554Z",
        updated_at: "2020-06-24T07:09:28.554Z"
      },
      individual: null,
      user: null,
      created_at: "2020-06-24T07:18:46.694Z",
      updated_at: "2020-06-24T07:18:46.694Z"
    },
    stream_strength: [
      {
        id: 1,
        stream: {
          id: 2,
          name: "Computer Science And Engineering",
          created_at: "2020-06-24T07:09:35.414Z",
          updated_at: "2020-06-24T07:09:35.414Z"
        },
        first_year_strength: 0,
        second_year_strength: 0,
        third_year_strength: 0
      },
      {
        id: 2,
        stream: {
          id: 1,
          name: "Mechanical Engineering (Production)",
          created_at: "2020-06-24T07:09:35.408Z",
          updated_at: "2020-06-24T07:09:35.408Z"
        },
        first_year_strength: 0,
        second_year_strength: 0,
        third_year_strength: 0
      },
      {
        id: 3,
        stream: {
          id: 3,
          name: "Electronics Engineering",
          created_at: "2020-06-24T07:09:35.419Z",
          updated_at: "2020-06-24T07:09:35.419Z"
        },
        first_year_strength: 0,
        second_year_strength: 0,
        third_year_strength: 0
      }
    ]
  },
  {
    id: 2,
    name: "Government Leather Institute, Agra",
    contact: {
      id: 3,
      name: "Government Leather Institute, Agra",
      phone: "0356273401",
      phone_other: null,
      email: "collegeemail2@gmail.com",
      email_other: null,
      address_1: "UP",
      address_2: null,
      city: null,
      pincode: null,
      contact_type: "organization",
      organization: 2,
      country: null,
      village: null,
      state: {
        id: 1,
        name: "Uttar Pradesh",
        is_active: true,
        abbreviation: "UP",
        identifier: "",
        country: 1,
        created_at: "2020-06-24T07:09:28.252Z",
        updated_at: "2020-06-24T07:09:28.252Z"
      },
      district: {
        id: 1,
        name: "Agra",
        is_active: true,
        abbreviation: "AG",
        identifier: null,
        state: 1,
        created_at: "2020-06-24T07:09:28.265Z",
        updated_at: "2020-06-24T07:09:28.265Z"
      },
      individual: null,
      user: null,
      created_at: "2020-06-24T07:19:43.652Z",
      updated_at: "2020-07-17T12:33:50.639Z"
    },
    stream_strength: [
      {
        id: 8,
        stream: {
          id: 1,
          name: "Mechanical Engineering (Production)",
          created_at: "2020-06-24T07:09:35.408Z",
          updated_at: "2020-06-24T07:09:35.408Z"
        },
        first_year_strength: 0,
        second_year_strength: 0,
        third_year_strength: 0
      },
      {
        id: 9,
        stream: {
          id: 2,
          name: "Computer Science And Engineering",
          created_at: "2020-06-24T07:09:35.414Z",
          updated_at: "2020-06-24T07:09:35.414Z"
        },
        first_year_strength: 0,
        second_year_strength: 0,
        third_year_strength: 0
      }
    ]
  },
  {
    id: 3,
    name: "Zila Parishad Agriculture College",
    contact: {
      id: 47,
      name: "Zila Parishad Agriculture College",
      phone: "9087654786",
      phone_other: null,
      email: "yogesh@gmail.com",
      email_other: null,
      address_1: "asdccc",
      address_2: null,
      city: null,
      pincode: null,
      contact_type: "organization",
      organization: 3,
      country: null,
      village: null,
      state: {
        id: 1,
        name: "Uttar Pradesh",
        is_active: true,
        abbreviation: "UP",
        identifier: "",
        country: 1,
        created_at: "2020-06-24T07:09:28.252Z",
        updated_at: "2020-06-24T07:09:28.252Z"
      },
      district: {
        id: 50,
        name: "Mathura",
        is_active: true,
        abbreviation: "MT",
        identifier: null,
        state: 1,
        created_at: "2020-06-24T07:09:28.559Z",
        updated_at: "2020-06-24T07:09:28.559Z"
      },
      individual: null,
      user: null,
      created_at: "2020-07-17T12:35:44.460Z",
      updated_at: "2020-07-17T12:35:44.460Z"
    },
    stream_strength: []
  }
];

export const mockAddActivityResponse = {
  id: 9,
  title: "Soft Skills 1",
  start_date_time: "2020-07-18T12:48:46.994Z",
  end_date_time: "2020-07-25T12:48:00.000Z",
  activitytype: {
    id: 1,
    name: "Training",
    is_active: true,
    created_at: "2020-06-24T07:09:36.947Z",
    updated_at: "2020-06-24T07:09:36.947Z"
  },
  academic_year: {
    id: 8,
    name: "AY 20-21",
    start_date: "2020-06-01",
    end_date: "2021-05-31",
    created_at: "2020-06-24T07:09:35.214Z",
    updated_at: "2020-06-24T07:09:35.214Z"
  },
  contact: {
    id: 2,
    name: "Government Polytechnic, Mainpuri",
    phone: "0356273400",
    phone_other: null,
    email: "collegeemail1@gmail.com",
    email_other: null,
    address_1: "UP",
    address_2: null,
    city: null,
    pincode: null,
    contact_type: "organization",
    organization: 1,
    country: null,
    village: null,
    state: 1,
    district: 49,
    individual: null,
    user: null,
    created_at: "2020-06-24T07:18:46.694Z",
    updated_at: "2020-06-24T07:18:46.694Z"
  },
  education_year: "First",
  address: "test",
  trainer_name: "test",
  question_set: {
    id: 1,
    name: "Activity Question Set",
    created_at: "2020-06-24T07:09:37.048Z",
    updated_at: "2020-06-24T07:09:37.048Z"
  },
  description: "<p>test</p>\n",
  cancelled: null,
  created_at: "2020-07-18T12:49:33.398Z",
  updated_at: "2020-07-18T12:49:33.413Z",
  activity_status: "scheduled",
  upload_logo: null,
  activityassignees: [],
  streams: [
    {
      id: 1,
      name: "Mechanical Engineering (Production)",
      created_at: "2020-06-24T07:09:35.408Z",
      updated_at: "2020-06-24T07:09:35.408Z"
    }
  ]
};

export const mockManageActivityLocationData = {
  pathname: "/manage-activity",
  search: "",
  hash: "",
  state: null,
  key: "z07kg0"
};

export const mockViewActivityData = {
  result: {
    id: 10,
    title: "Job Preparation 1",
    start_date_time: "2020-07-18T13:00:30.766Z",
    end_date_time: "2020-07-24T13:00:00.000Z",
    activitytype: {
      id: 2,
      name: "Workshop",
      is_active: true,
      created_at: "2020-06-24T07:09:36.955Z",
      updated_at: "2020-06-24T07:09:36.955Z"
    },
    academic_year: {
      id: 8,
      name: "AY 20-21",
      start_date: "2020-06-01",
      end_date: "2021-05-31",
      created_at: "2020-06-24T07:09:35.214Z",
      updated_at: "2020-06-24T07:09:35.214Z"
    },
    contact: {
      id: 2,
      name: "Government Polytechnic, Mainpuri",
      phone: "0356273400",
      phone_other: null,
      email: "collegeemail1@gmail.com",
      email_other: null,
      address_1: "UP",
      address_2: null,
      city: null,
      pincode: null,
      contact_type: "organization",
      organization: 1,
      country: null,
      village: null,
      state: 1,
      district: 49,
      individual: null,
      user: null,
      created_at: "2020-06-24T07:18:46.694Z",
      updated_at: "2020-06-24T07:18:46.694Z"
    },
    education_year: "First",
    address: "Job Preparation 1",
    trainer_name: "yogesh",
    question_set: {
      id: 1,
      name: "Activity Question Set",
      created_at: "2020-06-24T07:09:37.048Z",
      updated_at: "2020-06-24T07:09:37.048Z"
    },
    description: "<p>Job Preparation 1</p>\n",
    cancelled: null,
    created_at: "2020-07-18T13:00:58.278Z",
    updated_at: "2020-07-18T13:01:14.936Z",
    activity_status: "cancelled",
    upload_logo: null,
    activityassignees: [],
    streams: [
      {
        id: 1,
        name: "Mechanical Engineering (Production)",
        created_at: "2020-06-24T07:09:35.408Z",
        updated_at: "2020-06-24T07:09:35.408Z"
      }
    ]
  }
};
