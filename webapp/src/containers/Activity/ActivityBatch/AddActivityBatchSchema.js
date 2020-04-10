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
  },
  dateFrom: {
    label: "Start Date",
    id: "dateFrom",
    autoComplete: "dateFrom",
    required: true,
    placeholder: "From Date",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Start Date is required"
      }
    }
  },
  dateTo: {
    label: "End Date",
    id: "dateTo",
    autoComplete: "dateTo",
    required: true,
    placeholder: "To Date",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "End Date is required"
      }
    }
  }
};
export default AddActivityBatchSchema;
