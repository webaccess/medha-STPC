const AddZoneForm = {
  content: {
    title: "Add Zone",
    button: "Save",
    cancel: "Cancel"
  },
  zone: {
    label: "Zone Name",
    id: "zonename",
    autoComplete: "zonename",
    required: true,
    placeholder: "zonename",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Zone Name is required"
      }
    }
  },
  state: {
    label: "State",
    id: "state",
    autoComplete: "state",
    required: true,
    placeholder: "state",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "State is required"
      }
    }
  },
};
export default AddZoneForm;