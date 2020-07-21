export const mockEventDataToShow = [
  {
    id: 3,
    title: "Test",
    start_date_time: "2020-07-07T09:48:20.995Z",
    end_date_time: "2020-07-16T09:48:00.000Z",
    address: "UP",
    description: "<p>Test</p>\n",
    question_set: {
      id: 2,
      name: "Event Question Set",
      created_at: "2020-06-24T07:09:37.097Z",
      updated_at: "2020-06-24T07:09:37.097Z"
    },
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
    zone: {
      id: 1,
      name: "West Zone - Daurala (Meerut)",
      state: 1,
      created_at: "2020-06-24T07:09:35.322Z",
      updated_at: "2020-06-24T07:09:35.322Z"
    },
    rpc: {
      id: 1,
      name: "Agra",
      state: 1,
      main_college: 3,
      created_at: "2020-06-24T07:09:35.351Z",
      updated_at: "2020-06-24T08:50:17.773Z"
    },
    created_at: "2020-07-07T09:51:26.400Z",
    updated_at: "2020-07-15T06:26:54.263Z",
    qualifications: [
      {
        id: 14,
        qualification: "secondary",
        percentage: 70
      }
    ],
    educations: [
      {
        id: 4,
        education_year: "First",
        percentage: 70
      }
    ],
    upload_logo: null,
    streams: [],
    contacts: [
      {
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
      {
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
        state: 1,
        district: 1,
        individual: null,
        user: null,
        created_at: "2020-06-24T07:19:43.652Z",
        updated_at: "2020-06-24T07:19:43.652Z"
      }
    ]
  }
];

export const mockEventData = {
  id: 1,
  title: "Test Event",
  start_date_time: "2020-06-02T03:30:00.000Z",
  end_date_time: "2020-06-03T07:00:00.000Z",
  address: "UP",
  description: "<p>Test Event</p>\n",
  question_set: {
    id: 2,
    name: "Event Question Set",
    created_at: "2020-06-24T07:09:37.097Z",
    updated_at: "2020-06-24T07:09:37.097Z"
  },
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
  zone: null,
  rpc: null,
  created_at: "2020-06-24T08:28:22.562Z",
  updated_at: "2020-07-21T12:04:15.340Z",
  qualifications: [
    {
      id: 20,
      qualification: "secondary",
      percentage: 60
    }
  ],
  educations: [
    {
      id: 5,
      education_year: "First",
      percentage: 60
    }
  ],
  upload_logo: null,
  streams: [
    {
      id: 1,
      name: "Mechanical Engineering (Production)",
      created_at: "2020-06-24T07:09:35.408Z",
      updated_at: "2020-06-24T07:09:35.408Z"
    }
  ],
  contacts: [
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
        state: 1,
        district: 49,
        individual: null,
        user: null,
        created_at: "2020-06-24T07:18:46.694Z",
        updated_at: "2020-06-24T07:18:46.694Z"
      },
      zone: {
        id: 1,
        name: "West Zone - Daurala (Meerut)",
        state: 1,
        created_at: "2020-06-24T07:09:35.322Z",
        updated_at: "2020-06-24T07:09:35.322Z"
      },
      rpc: {
        id: 1,
        name: "Agra",
        state: 1,
        main_college: 3,
        created_at: "2020-06-24T07:09:35.351Z",
        updated_at: "2020-06-24T08:50:17.773Z"
      },
      college_code: "GPM23",
      principal: null,
      is_blocked: false,
      created_at: "2020-06-24T07:18:46.679Z",
      updated_at: "2020-07-10T06:33:23.643Z",
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
      ],
      tpos: []
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
        state: 1,
        district: 1,
        individual: null,
        user: null,
        created_at: "2020-06-24T07:19:43.652Z",
        updated_at: "2020-07-17T12:33:50.639Z"
      },
      zone: {
        id: 1,
        name: "West Zone - Daurala (Meerut)",
        state: 1,
        created_at: "2020-06-24T07:09:35.322Z",
        updated_at: "2020-06-24T07:09:35.322Z"
      },
      rpc: {
        id: 1,
        name: "Agra",
        state: 1,
        main_college: 3,
        created_at: "2020-06-24T07:09:35.351Z",
        updated_at: "2020-06-24T08:50:17.773Z"
      },
      college_code: "GLI34",
      principal: null,
      is_blocked: false,
      created_at: "2020-06-24T07:19:43.643Z",
      updated_at: "2020-07-17T12:33:50.578Z",
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
      ],
      tpos: []
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
        state: 1,
        district: 50,
        individual: null,
        user: null,
        created_at: "2020-07-17T12:35:44.460Z",
        updated_at: "2020-07-17T12:35:44.460Z"
      },
      zone: {
        id: 1,
        name: "West Zone - Daurala (Meerut)",
        state: 1,
        created_at: "2020-06-24T07:09:35.322Z",
        updated_at: "2020-06-24T07:09:35.322Z"
      },
      rpc: {
        id: 4,
        name: "Gorakhpur",
        state: 1,
        main_college: null,
        created_at: "2020-06-24T07:09:35.369Z",
        updated_at: "2020-06-24T07:09:35.369Z"
      },
      college_code: "khbjh",
      principal: null,
      is_blocked: false,
      created_at: "2020-07-17T12:35:44.457Z",
      updated_at: "2020-07-17T12:35:44.462Z",
      stream_strength: [],
      tpos: []
    }
  ]
};
