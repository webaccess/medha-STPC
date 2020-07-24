export const mockTempDataForPastActivity = [
  {
    id: 3,
    title: "Career Awareness 1",
    activityType: "Workshop",
    activityBatch: "Batch 1",
    start_date_time: "Thu Jun 11 2020",
    end_date_time: "Tue Jun 23 2020",
    hasAttended: true,
    giveFeedback: false,
    editFeedback: true,
    cannotGiveFeedback: false,
    feedbackId: 11
  }
];

export const mockTempDataForPastEvent = [
  {
    id: 1,
    eventName: "test",
    start_date_time: "Thu Jun 25 2020",
    end_date_time: "Sat Jun 27 2020",
    hasAttended: true,
    giveFeedback: false,
    editFeedback: true,
    cannotGiveFeedback: false,
    feedbackId: 2
  }
];

export const mockDataForPAstActiviy = {
  result: [
    {
      id: 3,
      title: "Career Awareness 1",
      start_date_time: "2020-06-11T18:13:00.000Z",
      end_date_time: "2020-06-23T18:13:00.000Z",
      activitytype: {
        id: 2,
        name: "Workshop",
        is_active: true,
        created_at: "2020-06-25T07:00:19.813Z",
        updated_at: "2020-06-25T07:00:19.813Z"
      },
      academic_year: {
        id: 8,
        name: "AY 20-21",
        start_date: "2020-06-01",
        end_date: "2021-05-31",
        created_at: "2020-06-25T07:00:17.117Z",
        updated_at: "2020-06-25T07:00:17.117Z"
      },
      contact: {
        id: 1,
        name: "Government Polytechnic, Mainpuri",
        phone: "0356273400",
        phone_other: null,
        email: "collegeemail1@gmail.com",
        email_other: null,
        address_1: "Government Polytechnic, Mainpuri",
        address_2: null,
        city: null,
        pincode: null,
        contact_type: "organization",
        organization: 1,
        country: 1,
        village: null,
        state: 1,
        district: null,
        individual: null,
        user: null,
        created_at: "2020-06-25T07:04:15.407Z",
        updated_at: "2020-07-03T15:42:01.848Z"
      },
      education_year: "First",
      address: "sdsd",
      trainer_name: "yogesh",
      question_set: {
        id: 1,
        name: "Activity Question Set",
        created_at: "2020-06-25T07:00:19.966Z",
        updated_at: "2020-06-25T07:00:19.966Z"
      },
      description: "<p>Career Awareness 1</p>\n",
      cancelled: false,
      created_at: "2020-06-25T18:13:38.672Z",
      updated_at: "2020-06-30T05:22:23.235Z",
      activity_status: "completed",
      upload_logo: null,
      activityassignees: [
        {
          id: 4,
          activity: 3,
          contact: 31,
          activity_batch: 3,
          is_verified_by_college: true,
          created_at: "2020-06-25T18:15:14.342Z",
          updated_at: "2020-06-25T18:47:26.564Z"
        },
        {
          id: 5,
          activity: 3,
          contact: 30,
          activity_batch: 3,
          is_verified_by_college: true,
          created_at: "2020-06-25T18:15:14.342Z",
          updated_at: "2020-06-25T18:47:26.564Z"
        },
        {
          id: 6,
          activity: 3,
          contact: 20,
          activity_batch: 3,
          is_verified_by_college: true,
          created_at: "2020-06-25T18:46:48.520Z",
          updated_at: "2020-06-25T18:47:26.564Z"
        },
        {
          id: 7,
          activity: 3,
          contact: 22,
          activity_batch: 3,
          is_verified_by_college: true,
          created_at: "2020-06-25T18:46:48.520Z",
          updated_at: "2020-06-25T18:47:26.564Z"
        }
      ],
      streams: [
        {
          id: 1,
          name: "Mechanical Engineering (Production)",
          created_at: "2020-06-25T07:00:17.361Z",
          updated_at: "2020-06-25T07:00:17.361Z"
        },
        {
          id: 2,
          name: "Computer Science And Engineering",
          created_at: "2020-06-25T07:00:17.369Z",
          updated_at: "2020-06-25T07:00:17.369Z"
        }
      ],
      activity_batch: {
        id: 3,
        name: "Batch 1",
        activity: 3,
        start_date_time: "2020-06-18T18:14:00.000Z",
        end_date_time: "2020-06-19T18:14:00.000Z",
        created_at: "2020-06-25T18:15:14.336Z",
        updated_at: "2020-06-25T18:15:14.336Z"
      },
      isFeedbackProvided: true,
      feedbackSetId: 11,
      hasAttended: true
    }
  ],
  page: 1,
  pageSize: 10,
  rowCount: 1,
  pageCount: 1
};

export const mockDataForPastEvents = {
  result: [
    {
      id: 1,
      title: "test",
      start_date_time: "2020-06-25T08:50:16.140Z",
      end_date_time: "2020-06-27T08:50:00.000Z",
      address: "UP",
      description: "<p>qhdbjhd</p>\n",
      question_set: {
        id: 2,
        name: "Event Question Set",
        created_at: "2020-06-25T07:00:20.054Z",
        updated_at: "2020-06-25T07:00:20.054Z"
      },
      state: {
        id: 1,
        name: "Uttar Pradesh",
        is_active: true,
        abbreviation: "UP",
        identifier: "",
        country: 1,
        created_at: "2020-06-25T07:00:12.504Z",
        updated_at: "2020-06-25T07:00:12.504Z"
      },
      zone: {
        id: 1,
        name: "West Zone - Daurala (Meerut)",
        state: 1,
        created_at: "2020-06-25T07:00:17.240Z",
        updated_at: "2020-06-25T07:00:17.240Z"
      },
      rpc: {
        id: 1,
        name: "Agra",
        state: 1,
        main_college: 1,
        created_at: "2020-06-25T07:00:17.282Z",
        updated_at: "2020-07-21T12:13:39.989Z"
      },
      created_at: "2020-06-25T08:50:41.339Z",
      updated_at: "2020-07-16T18:31:05.579Z",
      qualifications: [],
      educations: [],
      upload_logo: null,
      streams: [],
      contacts: [
        {
          id: 7,
          name: "Government Polytechnic, Sinduria, Sonbhadra ",
          phone: "0356273546",
          phone_other: null,
          email: "CollegeEmail147@gmail.com",
          email_other: null,
          address_1: "Government Polytechnic, Sinduria, Sonbhadra ",
          address_2: null,
          city: null,
          pincode: null,
          contact_type: "organization",
          organization: 7,
          country: 1,
          village: null,
          state: 1,
          district: null,
          individual: null,
          user: null,
          created_at: "2020-06-25T07:04:15.562Z",
          updated_at: "2020-06-25T07:04:15.562Z"
        },
        {
          id: 3,
          name: "Government Polytechnic, Bareilly",
          phone: "0356273414",
          phone_other: null,
          email: "collegeemail15@gmail.com",
          email_other: null,
          address_1: "Government Polytechnic, Bareilly",
          address_2: null,
          city: null,
          pincode: null,
          contact_type: "organization",
          organization: 3,
          country: 1,
          village: null,
          state: 1,
          district: null,
          individual: null,
          user: null,
          created_at: "2020-06-25T07:04:15.478Z",
          updated_at: "2020-06-30T04:58:01.794Z"
        },
        {
          id: 2,
          name: "Government Leather Institute, Agra",
          phone: "0356273401",
          phone_other: null,
          email: "CollegeEmail2@gmail.com",
          email_other: null,
          address_1: "Government Leather Institute, Agra",
          address_2: null,
          city: null,
          pincode: null,
          contact_type: "organization",
          organization: 2,
          country: 1,
          village: null,
          state: 1,
          district: null,
          individual: null,
          user: null,
          created_at: "2020-06-25T07:04:15.456Z",
          updated_at: "2020-06-25T07:04:15.456Z"
        },
        {
          id: 4,
          name: "Government Girls Polytechnic, Bareilly",
          phone: "0356273415",
          phone_other: null,
          email: "collegeemail16@gmail.com",
          email_other: null,
          address_1: "Government Girls Polytechnic, Bareilly",
          address_2: null,
          city: null,
          pincode: null,
          contact_type: "organization",
          organization: 4,
          country: 1,
          village: null,
          state: 1,
          district: null,
          individual: null,
          user: null,
          created_at: "2020-06-25T07:04:15.499Z",
          updated_at: "2020-07-03T15:44:10.807Z"
        },
        {
          id: 6,
          name: "Sant Ravidas Govt. Polytechnic Chakia, Chandauli ",
          phone: "0356273545",
          phone_other: null,
          email: "CollegeEmail146@gmail.com",
          email_other: null,
          address_1: "Sant Ravidas Govt. Polytechnic Chakia, Chandauli ",
          address_2: null,
          city: null,
          pincode: null,
          contact_type: "organization",
          organization: 6,
          country: 1,
          village: null,
          state: 1,
          district: null,
          individual: null,
          user: null,
          created_at: "2020-06-25T07:04:15.538Z",
          updated_at: "2020-06-25T07:04:15.538Z"
        },
        {
          id: 5,
          name: "Government Polytechnic, Bargarh, Chitrakoot",
          phone: "0356273523",
          phone_other: null,
          email: "CollegeEmail124@gmail.com",
          email_other: null,
          address_1: "Government Polytechnic, Bargarh, Chitrakoot",
          address_2: null,
          city: null,
          pincode: null,
          contact_type: "organization",
          organization: 5,
          country: 1,
          village: null,
          state: 1,
          district: null,
          individual: null,
          user: null,
          created_at: "2020-06-25T07:04:15.518Z",
          updated_at: "2020-06-25T07:04:15.518Z"
        },
        {
          id: 1,
          name: "Government Polytechnic, Mainpuri",
          phone: "0356273400",
          phone_other: null,
          email: "collegeemail1@gmail.com",
          email_other: null,
          address_1: "Government Polytechnic, Mainpuri",
          address_2: null,
          city: null,
          pincode: null,
          contact_type: "organization",
          organization: 1,
          country: 1,
          village: null,
          state: 1,
          district: null,
          individual: null,
          user: null,
          created_at: "2020-06-25T07:04:15.407Z",
          updated_at: "2020-07-03T15:42:01.848Z"
        }
      ],
      isFeedbackProvided: true,
      feedbackSetId: 2,
      isRegistered: true,
      isHired: false,
      hasAttended: true,
      currentDate: "2020-07-23T14:50:15.156Z"
    }
  ],
  page: 1,
  pageSize: 10,
  rowCount: 1,
  pageCount: 1
};

export const viewDocumentResponseMock = {
  result: [
    {
      id: 1,
      year_of_passing: {
        id: 8,
        name: "AY 20-21",
        start_date: "2020-06-01",
        end_date: "2021-05-31",
        created_at: "2020-06-25T07:00:17.117Z",
        updated_at: "2020-06-25T07:00:17.117Z"
      },
      education_year: "first",
      percentage: null,
      qualification: "undergraduate",
      institute: null,
      pursuing: true,
      contact: {
        id: 20,
        name: "First Last",
        phone: "1764679768",
        phone_other: null,
        email: "yogesh.dalvi856@gmail.com",
        email_other: null,
        address_1: "UP",
        address_2: null,
        city: null,
        pincode: null,
        contact_type: "individual",
        organization: null,
        country: null,
        village: null,
        state: 1,
        district: 116,
        individual: 13,
        user: 13,
        created_at: "2020-06-25T07:11:06.775Z",
        updated_at: "2020-07-22T18:11:01.709Z"
      },
      board: {
        id: 4,
        name: "UPBOARD",
        created_at: "2020-06-25T07:00:19.850Z",
        updated_at: "2020-06-25T07:00:19.850Z"
      },
      other_qualification: null,
      marks_obtained: null,
      total_marks: null,
      created_at: "2020-06-25T07:11:06.775Z",
      updated_at: "2020-06-25T07:11:06.775Z",
      other_board: null,
      document: null,
      isResume: false
    },
    { document: null, isResume: true }
  ]
};

export const viewEducationResponse = {
  result: [
    {
      id: 1,
      year_of_passing: {
        id: 8,
        name: "AY 20-21",
        start_date: "2020-06-01",
        end_date: "2021-05-31",
        created_at: "2020-06-25T07:00:17.117Z",
        updated_at: "2020-06-25T07:00:17.117Z"
      },
      education_year: "first",
      percentage: null,
      qualification: "undergraduate",
      institute: null,
      pursuing: true,
      contact: {
        id: 20,
        name: "First Last",
        phone: "1764679768",
        phone_other: null,
        email: "yogesh.dalvi856@gmail.com",
        email_other: null,
        address_1: "UP",
        address_2: null,
        city: null,
        pincode: null,
        contact_type: "individual",
        organization: null,
        country: null,
        village: null,
        state: 1,
        district: 116,
        individual: 13,
        user: 13,
        created_at: "2020-06-25T07:11:06.775Z",
        updated_at: "2020-07-22T18:11:01.709Z"
      },
      board: {
        id: 4,
        name: "UPBOARD",
        created_at: "2020-06-25T07:00:19.850Z",
        updated_at: "2020-06-25T07:00:19.850Z"
      },
      other_qualification: null,
      marks_obtained: null,
      total_marks: null,
      created_at: "2020-06-25T07:11:06.775Z",
      updated_at: "2020-06-25T07:11:06.775Z",
      other_board: null
    }
  ],
  page: 1,
  pageSize: 10,
  rowCount: 1,
  pageCount: 1
};
