const EducationSchema = {
  yearOfPassing: {
    label: "Year of passing",
    id: "yearofpassing",
    autoComplete: "yearofpassing",
    required: true,
    placeholder: "Year of passing",
    autoFocus: true,
    type: "number",
    validations: {
      required: {
        value: "true",
        message: "Year is required"
      }
    }
  },
  educationYear: {
    label: "Education Year",
    id: "educationyear",
    autoComplete: "educationyear",
    required: true,
    placeholder: "Education Year",
    autoFocus: true,
    type: "number",
    validations: {
      required: {
        value: "true",
        message: "Education year is required"
      }
    }
  },
  percentage: {
    label: "Percentage",
    id: "percentage",
    autoComplete: "percentage",
    required: true,
    placeholder: "Percentage",
    autoFocus: true,
    type: "number",
    validations: {
      required: {
        value: "true",
        message: "Percentage are required"
      }
    }
  },
  qualification: {
    label: "qualification",
    id: "qualification",
    autoComplete: "qualification",
    required: true,
    placeholder: "Qualification",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Qualification is required"
      }
    }
  },
  board: {
    label: "Board",
    id: "board",
    autoComplete: "board",
    required: true,
    placeholder: "board",
    autoFocus: true,
    type: "number",
    validations: {
      required: {
        value: "true",
        message: "Board is required"
      }
    }
  },
  otherboard: {
    label: "Other Board",
    id: "otherboard",
    autoComplete: "otherboard",
    required: true,
    placeholder: "otherboard",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  institute: {
    label: "Institute",
    id: "institute",
    autoComplete: "institute",
    required: false,
    placeholder: "Institute",
    autoFocus: true,
    type: "text"
  },
  pursuing: {
    label: "Pursuing",
    id: "pursuing",
    autoComplete: "pursuing",
    required: false,
    placeholder: "Pursuing",
    autoFocus: true,
    type: "boolean"
  },
  marksObtained: {
    label: "Marks obtained",
    id: "marksObtained",
    autoComplete: "marksObtained",
    required: true,
    placeholder: "Marks Obtained",
    autoFocus: true,
    type: "number",
    validations: {
      required: {
        value: "true",
        message: "Marks obtained are required"
      }
    }
  },
  totalMarks: {
    label: "Total marks",
    id: "totalMarks",
    autoComplete: "totalMarks",
    required: true,
    placeholder: "Total marks",
    autoFocus: true,
    type: "number",
    validations: {
      required: {
        value: "true",
        message: "Total marks are required"
      }
    }
  }
};
export default EducationSchema;
