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
  dateFrom: {
    label: "Start Date",
    id: "dateFrom",
    autoComplete: "dateFrom",
    required: true,
    placeholder: "From Date",
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
    autoComplete: "dateTo",
    required: true,
    placeholder: "To Date",
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
        message: "percentage ( Min percentage through SSC, HSC, graduation ) 1-100"
      }
    }
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
