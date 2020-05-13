const ZoneSchema = {
  content: {
    title: "Add Zone",
    button: "Save",
    cancel: "Cancel"
  },
  zoneName: {
    label: "Zone",
    id: "zoneName",
    autoComplete: "Zone",
    required: true,
    placeholder: "Zone",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Zone Name is required"
      }
    }
  },
  stateName: {
    label: "State",
    id: "statename",
    autoComplete: "statename",
    required: true,
    placeholder: "Select State",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Please select a state"
      }
    }
  }
};
export default ZoneSchema;
