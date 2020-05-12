const RegistrationSchema = {
  firstname: {
    label: "First Name",
    id: "firstname",
    autoComplete: "firstname",
    required: true,
    placeholder: "First Name",
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
    placeholder: "Last Name",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Last Name is required"
      }
    }
  },
  fatherFirstName: {
    label: "Father's First Name",
    id: "fatherFirstName",
    autoComplete: "fatherFirstName",
    required: true,
    placeholder: "Father's First Name ",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Father's First Name is required"
      }
    }
  },
  fatherLastName: {
    label: "Father's Last Name",
    id: "fatherLastName",
    autoComplete: "fatherLastName",
    required: true,
    placeholder: "Father's Last Name",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: " Father's Last Name is required"
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
  district: {
    label: "District",
    id: "district",
    autoComplete: "district",
    required: false,
    placeholder: "District",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  dateofbirth: {
    label: "Date of Birth",
    id: "dateOfBirth",
    autoComplete: "dateOfBirth",
    required: false,
    placeholder: "Date of Birth",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  contact: {
    label: "Contact Number",
    id: "contact",
    autoComplete: "contact",
    required: true,
    placeholder: "Contact Number",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Contact Number is required"
      },
      validateMobileNumber: {
        value: "true",
        message: "Not an Contact Number"
      }
    }
  },
  gender: {
    label: "Gender",
    id: "gender",
    autoComplete: "gender",
    required: true,
    placeholder: "Gender",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Gender is required"
      }
    }
  },
  physicallyHandicapped: {
    label: "Physically Handicapped",
    id: "physicallyHandicapped",
    autoComplete: "physicallyHandicapped",
    required: false,
    placeholder: "Physically Handicapped",
    autoFocus: true,
    type: "checkbox",
    validations: {}
  },
  college: {
    label: "College",
    id: "college",
    autoComplete: "college",
    required: true,
    placeholder: "College",
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
    placeholder: "Stream",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Stream is required"
      }
    }
  },
  rollnumber: {
    label: "College Roll Number",
    id: "rollnumber",
    autoComplete: "rollnumber",
    required: true,
    placeholder: "College Roll Number",
    autoFocus: true,
    type: "integer",
    validations: {
      required: {
        value: "true",
        message: "College Roll is required"
      }
    }
  },
  futureAspirations: {
    label: "Future Aspirations",
    id: "futureAspirations",
    autoComplete: "futureAspirations",
    required: false,
    placeholder: "futureAspirations",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  email: {
    label: "Email",
    id: "email",
    autoComplete: "email",
    required: true,
    placeholder: "Email",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Email is required"
      },
      validateEmailRegex: {
        value: "true",
        message: "Invalid Email"
      }
    }
  },
  futureAspirations: {
    label: "Future Aspirations",
    id: "futureAspirations",
    autoComplete: "futureAspirations",
    required: false,
    placeholder: "futureAspirations",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  username: {
    label: "Username",
    id: "username",
    autoComplete: "username",
    required: true,
    placeholder: "Username",
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
    required: false,
    placeholder: "Password",
    autoFocus: true,
    type: "text",
    validations: {}
  }
};
export default RegistrationSchema;