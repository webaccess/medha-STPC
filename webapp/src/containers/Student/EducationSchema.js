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
        message: "Marks is required"
      }
    }
  }
};
export default EducationSchema;
