const EducationSchema = {
  qualification: {
    label: "Qualification",
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
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Board is required"
      }
    }
  },
  yearOfPassing: {
    label: "Year Of Passing",
    id: "yearOfPassing",
    autoComplete: "yearOfPassing",
    required: true,
    placeholder: "Year Of Passing",
    autoFocus: true,
    type: "number",
    validations: {
      required: {
        value: "true",
        message: "Year Of Passing is required"
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
        message: "Percentage is required"
      }
    }
  }
};
export default EducationSchema;
