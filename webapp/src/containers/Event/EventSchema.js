const EventSchema = {
  eventName: {
    label: "Event Name",
    id: "eventname",
    autoComplete: "eventname",
    required: true,
    placeholder: "Event Name",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Event Name is required"
      }
    }
  },
  description: {
    label: "description Name",
    id: "description name",
    autoComplete: "description name",
    required: false,
    placeholder: "description Name",
    autoFocus: true,
    type: "text",
    validations: {}
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
  },

  address: {
    label: "Address",
    id: "address",
    autoComplete: "address",
    required: true,
    placeholder: "Address",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Address is required"
      }
    }
  },
  state: {
    label: "State",
    id: "state",
    autoComplete: "state",
    required: true,
    placeholder: "State",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "State is required"
      }
    }
  },

  zone: {
    label: "Zone",
    id: "zone",
    autoComplete: "zone",
    required: false,
    placeholder: "Zone",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  rpc: {
    label: "RPC",
    id: "rpc",
    autoComplete: "rpc",
    required: false,
    placeholder: "RPC",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  college: {
    label: "College",
    id: "college",
    autoComplete: "college",
    required: false,
    placeholder: "College",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  stream: {
    label: "Stream",
    id: "stream",
    autoComplete: "stream",
    required: false,
    placeholder: "Stream",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  percentage: {
    label: "Percentage",
    id: "percentage",
    autoComplete: "percentage",
    required: false,
    placeholder: "Percentage",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  educationpercentage: {
    label: "Percentage",
    id: "percentage",
    autoComplete: "percentage",
    required: false,
    placeholder: "Percentage",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  qualification: {
    label: "Qualification",
    id: "qualification",
    autoComplete: "Qualification",
    required: false,
    placeholder: "Qualification",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  education: {
    label: "Education",
    id: "education",
    autoComplete: "Education",
    required: false,
    placeholder: "Education",
    autoFocus: true,
    type: "text",
    validations: {}
  },

  files: {
    label: "Upload",
    id: "files",
    required: false,
    placeholder: "Upload files",
    autoFocus: true,
    type: "file",
    validations: {}
  }
};

export default EventSchema;
