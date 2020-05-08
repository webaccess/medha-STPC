const UserSchema = {
  username: {
    label: "User Name",
    id: "username",
    autoComplete: "username",
    required: true,
    placeholder: "User name",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "User Name is required"
      }
    }
  },
  password: {
    label: "Password",
    id: "password",
    autoComplete: "password",
    required: true,
    placeholder: "Password",
    autoFocus: true,
    type: "password",
    validations: {
      required: {
        value: "true",
        message: "password is required"
      },
      validatePasswordMinLength: {
        value: "true",
        message: "Password is too short"
      }
    }
  },
  firstname: {
    label: "First Name",
    id: "firstname",
    autoComplete: "firstname",
    required: true,
    placeholder: "First name",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "First Name is required"
      }
    }
  },
  lastname: {
    label: "Last Name",
    id: "lastname",
    autoComplete: "lastname",
    required: true,
    placeholder: "Last name",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Last Name is required"
      }
    }
  },
  email: {
    label: "Email",
    id: "email",
    autoComplete: "email",
    required: true,
    placeholder: "Email of the format abc@abc.com",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Email is required"
      },
      validateEmailRegex: {
        value: "true",
        message: "Not an Email"
      }
    }
  },
  contact: {
    label: "Contact Number",
    id: "contact_number",
    autoComplete: "Contact Number",
    required: true,
    placeholder: "Contact Number",
    autoFocus: true,
    type: "integer",
    validations: {
      required: {
        value: "true",
        message: "Contact number is required"
      },
      validateMobileNumber: {
        value: 10,
        message: "Please enter a valid contact number"
      }
    }
  },
  blocked: {
    label: "Block/Unblock",
    id: "block-unblock",
    autoComplete: "active",
    required: false,
    placeholder: "active",
    autoFocus: true,
    type: "checkbox",
    validations: {}
  },
  state: {
    label: "State",
    id: "state",
    autoComplete: "state",
    required: false,
    placeholder: "Choose State",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  zone: {
    label: "Zone",
    id: "zone",
    autoComplete: "zone",
    required: false,
    placeholder: "Choose Zone",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  rpc: {
    label: "RPC",
    id: "rpc",
    autoComplete: "rpc",
    required: false,
    placeholder: "Choose RPC",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  college: {
    label: "College",
    id: "college",
    autoComplete: "college",
    required: false,
    placeholder: "Choose College",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  role: {
    label: "Role",
    id: "role",
    autoComplete: "role",
    required: true,
    placeholder: "Choose Role",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Role is required"
      }
    }
  }
};

export default UserSchema;
