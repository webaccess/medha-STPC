const ActivityFormSchema = {
  activityname: {
    label: "Activity Name",
    id: "activityname",
    autoComplete: "activityname",
    required: true,
    placeholder: "activityname",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Activity Name is required"
      }
    }
  },
  files: {
    label: "files",
    id: "files",
    required: false,
    placeholder: "Upload files",
    autoFocus: true,
    type: "file",
    validations: {}
  },
  address: {
    label: "Address",
    id: "address",
    autoComplete: "address",
    required: true,
    placeholder: "address",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Address is required"
      }
    }
  },
  zone: {
    label: "Zone",
    id: "zone",
    autoComplete: "zone",
    required: false,
    placeholder: "zone",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  rpc: {
    label: "RPC",
    id: "rpc",
    autoComplete: "rpc",
    required: false,
    placeholder: "rpc",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  college: {
    label: "College",
    id: "college",
    autoComplete: "college",
    required: true,
    placeholder: "college",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "College is required"
      }
    }
  },
  stream: {
    label: "Stream",
    id: "stream",
    autoComplete: "stream",
    required: true,
    placeholder: "stream",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Stream is required"
      }
    }
  },
  academicyear: {
    label: "Academic Year",
    id: "academicyear",
    autoComplete: "academicyear",
    required: false,
    placeholder: "academicyear",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  trainer: {
    label: "trainer Name",
    id: "trainer",
    autoComplete: "trainer",
    required: true,
    placeholder: "trainer",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Trainer Name is required"
      }
    }
  },
  activitytype: {
    label: "Activity Type",
    id: "activitytype",
    autoComplete: "activitytype",
    required: true,
    placeholder: "activitytype",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Activity Type is required"
      }
    }
  },
  educationyear: {
    label: "Education Year",
    id: "educationyear",
    autoComplete: "educationyear",
    required: true,
    placeholder: "educationyear",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Education Year is required"
      }
    }
  },
  dateFrom: {
    label: "Start Date",
    id: "dateFrom",
    autoComplete: "startDate",
    required: true,
    placeholder: "Start Date",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Start Date is required"
      }
    }
  },
  dateTo: {
    label: "End Date",
    id: "dateTo",
    autoComplete: "endDate",
    required: true,
    placeholder: "End Date",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "End Date is required"
      }
    }
  }
};
export default ActivityFormSchema;
