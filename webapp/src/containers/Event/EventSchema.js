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
    label: "Description",
    id: "description",
    autoComplete: "description",
    required: true,
    placeholder: "Description",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Description is required"
      }
    }
  },
  dateFrom: {
    label: "Date From",
    id: "dateFrom",
    autoComplete: "dateFrom",
    required: true,
    placeholder: "From Date",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Date From is required"

      }
    }
  },
  dateTo: {
    label: "date To",
    id: "dateTo",
    autoComplete: "dateTo",
    required: true,
    placeholder: "To Date",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Date To is required"

      }
    }
  },
  timeFrom: {
    label: "Time From",
    id: "timeFrom",
    autoComplete: "timeFrom",
    required: true,
    placeholder: "Time From",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Time From is required"
      }
    }
  },
  timeTo: {
    label: "Time To",
    id: "timeTo",
    autoComplete: "Time To",
    required: true,
    placeholder: "Time To",
    autoFocus: true,
    type: "integer",
    validations: {
      required: {
        value: "true",
        message: "Time To is required"
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
    required: false,
    placeholder: "State",
    autoFocus: true,
    type: "text",
    validations: {}
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
  marks: {
    label: "Marks",
    id: "marks",
    autoComplete: "marks",
    required: true,
    placeholder: "Marks",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Marks is required"
      }
    }
  },
  // qualifications: {
  //   label: "qualifications",
  //   id: "qualifications",
  //   autoComplete: "Qualifications",
  //   required: true,
  //   placeholder: "Qualifications",
  //   autoFocus: true,
  //   type: "text",
  //   validations: {
  //     required: {
  //       value: "true",
  //       message: "Qualifications is required"
  //     }
  //   }
  // },
  files: {
    label: "Upload",
    id: "files",
    required: true,
    placeholder: "Upload files",
    autoFocus: true,
    type: "file",
    validations: {
      required: {
        value: "true",
        message: "File is required"
      }
    }
  }
};

export default EventSchema;
