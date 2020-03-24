const CollegeFormSchema = {
  collegeName: {
    label: "College Name",
    id: "name",
    autoComplete: "name",
    required: true,
    placeholder: "College Name",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "College Name is required"
      }
    }
  },
  collegeCode: {
    label: "College Code",
    id: "college_code",
    autoComplete: "college_code",
    required: true,
    placeholder: "College Code",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "College Code is required"
      }
    }
  },
  address: {
    label: "Address",
    id: "address",
    autoComplete: "address",
    required: true,
    placeholder: "College Address",
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
    placeholder: "Choose State",
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
    required: true,
    placeholder: "Choose Zone",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Zone is required"
      }
    }
  },
  rpc: {
    label: "RPC",
    id: "rpc",
    autoComplete: "rpc",
    required: true,
    placeholder: "Choose rpc",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "RPC is required"
      }
    }
  },
  district: {
    label: "District",
    id: "district",
    autoComplete: "district",
    required: false,
    placeholder: "Choose district",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  block: {
    label: "Block",
    id: "block",
    autoComplete: "block",
    required: false,
    placeholder: "block",
    autoFocus: true,
    type: "checkbox",
    validations: {}
  },
  contactNumber: {
    label: "Contact Number",
    id: "contact_number",
    autoComplete: "contact_number",
    required: true,
    placeholder: "College Contact Number",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Contact Number is required"
      }
    }
  },
  collegeEmail: {
    label: "Email",
    id: "college_email",
    autoComplete: "college_email",
    required: true,
    placeholder: "College Email of the format abc@abc.com",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Email is required"
      },
      validateEmailRegex: {
        value: "true",
        message: "Not an email"
      }
    }
  },
  principal: {
    label: "Principal Name",
    id: "principal",
    autoComplete: "principal",
    required: false,
    placeholder: "Choose Principal",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  admins: {
    label: "TPO Name",
    id: "admins",
    autoComplete: "admins",
    required: false,
    placeholder: "Choose TPO",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  streams: {
    label: "Stream",
    id: "streams",
    autoComplete: "streams",
    required: false,
    placeholder: "Choose Stream",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  strength: {
    label: "Strength",
    id: "streams",
    autoComplete: "strength",
    required: false,
    placeholder: "Enter Strength",
    autoFocus: true,
    type: "text",
    validations: {}
  }
};
export default CollegeFormSchema;
