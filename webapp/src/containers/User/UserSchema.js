const UserSchema = {
  username: {
    label: "User Name",
    id: "username",
    autoComplete: "username",
    required: true,
    placeholder: "username",
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
    placeholder: "password",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Password is required"
      }
    }
  },
  firstname: {
    label: "First Name",
    id: "firstname",
    autoComplete: "firstname",
    required: true,
    placeholder: "firstname",
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
    placeholder: "lastname",
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
    placeholder: "email",
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
    label: "Contact",
    id: "contact",
    autoComplete: "contact",
    required: false,
    placeholder: "contact",
    autoFocus: true,
    type: "integer",
    validations: {
    }
  },
  active: {
    label: "Active",
    id: "active",
    autoComplete: "active",
    required: false,
    placeholder: "active",
    autoFocus: true,
    type: "checkbox",
    validations: {
    }
  },
  state: {
    label: "State",
    id: "state",
    autoComplete: "state",
    required: false,
    placeholder: "state",
    autoFocus: true,
    type: "text",
    validations: {
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
    validations: {
    }
  },
  rpc: {
    label: "RPC",
    id: "rpc",
    autoComplete: "rpc",
    required: false,
    placeholder: "rpc",
    autoFocus: true,
    type: "text",
    validations: {
    }
  },
  college: {
    label: "College",
    id: "college",
    autoComplete: "college",
    required: false,
    placeholder: "college",
    autoFocus: true,
    type: "text",
    validations: {
    }
  },
  role: {
    label: "Role",
    id: "role",
    autoComplete: "role",
    required: false,
    placeholder: "role",
    autoFocus: true,
    type: "text",
    validations: {
      
    }
  },
};

export default UserSchema;
