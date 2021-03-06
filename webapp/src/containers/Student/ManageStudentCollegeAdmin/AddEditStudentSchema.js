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
  middlename: {
    label: "Middle Name",
    id: "middlename",
    autoComplete: "middlename",
    required: false,
    placeholder: "middlename",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  fatherFullName: {
    label: "Father's Full Name",
    id: "fatherFullName",
    autoComplete: "fatherFullName",
    required: true,
    placeholder: "Father's Full Name ",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Father's Full Name is required"
      }
    }
  },
  motherFullName: {
    label: "Mother's Full Name",
    id: "motherFullName",
    autoComplete: "motherFullName",
    required: true,
    placeholder: "Mother's Full Name",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: " Mother's Full Name is required"
      }
    }
  },
  // address: {
  //   label: "Address",
  //   id: "address",
  //   autoComplete: "address",
  //   required: true,
  //   placeholder: "Address",
  //   autoFocus: true,
  //   type: "text",
  //   validations: {
  //     required: {
  //       value: "true",
  //       message: "Address is required"
  //     }
  //   }
  // },
  // state: {
  //   label: "State",
  //   id: "state",
  //   autoComplete: "state",
  //   required: false,
  //   placeholder: "State",
  //   autoFocus: true,
  //   type: "text",
  //   validations: {}
  // },
  // district: {
  //   label: "District",
  //   id: "district",
  //   autoComplete: "district",
  //   required: false,
  //   placeholder: "District",
  //   autoFocus: true,
  //   type: "text",
  //   validations: {}
  // },
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
    label: "Enrollment Number",
    id: "rollnumber",
    autoComplete: "rollnumber",
    required: true,
    placeholder: "Enrollment Number",
    autoFocus: true,
    type: "integer",
    validations: {
      required: {
        value: "true",
        message: "Enrollment Number is required"
      }
    }
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
    type: "multi-select",
    validations: {}
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
