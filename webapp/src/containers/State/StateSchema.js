const StateSchema = {
  content: {
    title: "Add State",
    button: "Save"
  },
  state: {
    label: "State Name",
    id: "statename",
    autoComplete: "statename",
    required: true,
    placeholder: "statename",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "State Name is required"
      }
    }
  }
};
export default StateSchema;
