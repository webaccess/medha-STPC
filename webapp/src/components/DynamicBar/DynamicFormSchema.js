const DynamicFormSchema = {
  streams: {
    label: "Stream",
    id: "stream",
    autoComplete: "stream",
    required: false,
    placeholder: "Stream",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  strength: {
    label: "Strength",
    id: "strength",
    required: false,
    placeholder: "Strenth",
    type: "text",
    validations: {}
  }
};
export default DynamicFormSchema;
