const AddCollegeFormSchema = {
  collegeName: {
    label: "Add College",
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
    label: "Add College Code",
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
    label: "Add Address",
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
    label: "Add state",
    id: "state",
    autoComplete: "state",
    required: false,
    placeholder: "state",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  zone: {
    label: "Add zone",
    id: "zone",
    autoComplete: "zone",
    required: false,
    placeholder: "zone",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  rpc: {
    label: "Add rpc",
    id: "rpc",
    autoComplete: "rpc",
    required: false,
    placeholder: "rpc",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  contactNumber: {
    label: "Add contact_number",
    id: "contact_number",
    autoComplete: "contact_number",
    required: true,
    placeholder: "contact_number",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Contact number is required"
      }
    }
  },
  collegeEmail: {
    label: "Add college_email",
    id: "college_email",
    autoComplete: "college_email",
    required: true,
    placeholder: "college_email",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "college_email is required"
      },
      validateEmailRegex: {
        value: "true",
        message: "Not an email"
      }
    }
  },
  principal: {
    label: "Add principal",
    id: "principal",
    autoComplete: "principal",
    required: false,
    placeholder: "principal",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  admins: {
    label: "Add admins",
    id: "admins",
    autoComplete: "admins",
    required: false,
    placeholder: "admins",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  streams: {
    label: "Add streams",
    id: "streams",
    autoComplete: "streams",
    required: false,
    placeholder: "streams",
    autoFocus: true,
    type: "text",
    validations: {}
  }
};
export default AddCollegeFormSchema;
