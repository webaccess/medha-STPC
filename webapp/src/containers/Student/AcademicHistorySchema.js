const AcademicYearSchema = {
  academicYear: {
    label: "Academic Year",
    id: "academicYear",
    autoComplete: "academicYear",
    required: true,
    placeholder: "Academic Year",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Academic year is required"
      }
    }
  },
  educationYear: {
    label: "Education Year",
    id: "educationYear",
    autoComplete: "educationYear",
    required: true,
    placeholder: "Education Year",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Education year is required"
      }
    }
  }
};
export default AcademicYearSchema;
