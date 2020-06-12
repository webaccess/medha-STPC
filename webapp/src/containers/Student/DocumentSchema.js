const DocumentSchema = {
  file: {
    label: "Upload",
    id: "file",
    required: true,
    placeholder: "Upload file",
    autoFocus: true,
    type: "file",
    validations: {
      required: {
        value: "true",
        message: "File is required"
      }
    }
  }
};
export default DocumentSchema;
