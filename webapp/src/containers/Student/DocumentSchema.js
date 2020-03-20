const DocumentSchema = {
  files: {
    label: "Upload",
    id: "files",
    required: true,
    placeholder: "Upload files",
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
