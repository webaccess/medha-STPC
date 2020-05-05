const RegistrationSchema = {
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
  fatherFirstName: {
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
        message: "Father's First Name is required"
      }
    }
  },
  fatherLastName: {
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
        message: " Father's Last Name is required"
      }
    }
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
  state: {
    label: "State",
    id: "state",
    autoComplete: "state",
    required: false,
    placeholder: "state",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  district: {
    label: "District",
    id: "district",
    autoComplete: "district",
    required: false,
    placeholder: "district",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  contact: {
    label: "Contact",
    id: "contact",
    autoComplete: "contact",
    required: true,
    placeholder: "contact",
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
  // dateofbirth: {
  //   label: "Date Of Birth",
  //   id: "dateofbirth",
  //   autoComplete: "dateofbirth",
  //   required: true,
  //   placeholder: "Date of Birth",
  //   autoFocus: true,
  //   type: "text",
  //   validations: {
  //     required: {
  //       value: "true",
  //       message: "Date of Birth is required"
  //     }
  //   }
  // },
  gender: {
    label: "Gender",
    id: "gender",
    autoComplete: "gender",
    required: true,
    placeholder: "gender",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Gender is required"
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
  physicallyHandicapped: {
    label: "Physically Handicapped",
    id: "physicallyHandicapped",
    autoComplete: "physicallyHandicapped",
    required: false,
    placeholder: "physicallyHandicapped",
    autoFocus: true,
    type: "checkbox",
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
    required: false,
    placeholder: "stream",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  // currentacademicyear: {
  //   label: "Current Academic Year",
  //   id: "currentacademicyear",
  //   autoComplete: "currentacademicyear",
  //   required: true,
  //   placeholder: "currentacademicyear",
  //   autoFocus: true,
  //   type: "text",
  //   validations: {}
  // },
  rollnumber: {
    label: "Roll Number",
    id: "rollnumber",
    autoComplete: "rollnumber",
    required: true,
    placeholder: "rollnumber",
    autoFocus: true,
    type: "integer",
    validations: {
      required: {
        value: "true",
        message: "Email is required"
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
        message: "Invalid Email"
      }
    }
  },

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
  otp: {
    label: "OTP",
    id: "otp",
    autoComplete: "otp",
    required: true,
    placeholder: "otp",
    autoFocus: true,
    type: "text",
    validations: {}
  }
};
export default RegistrationSchema;
