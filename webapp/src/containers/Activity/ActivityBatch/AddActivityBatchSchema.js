const AddActivityBatchSchema = {
  name: {
    label: "Batch Name",
    id: "name",
    autoComplete: "name",
    required: true,
    placeholder: "Namr of Activity Batch",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Name is required"
      }
    }
  }
};
export default AddActivityBatchSchema;
