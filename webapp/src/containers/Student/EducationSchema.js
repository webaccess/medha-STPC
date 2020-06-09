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
        message: "Year of passing is required"
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
  marks: {
    label: "Marks",
    id: "marks",
    autoComplete: "marks",
    required: true,
    placeholder: "Marks",
    autoFocus: true,
    type: "number",
    validations: {
      required: {
        value: "true",
        message: "Marks are required"
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
  }
};
export default EducationSchema;
