const DashboardSchema = {
  Month: {
    label: "Select Month",
    id: "month_id",
    autoComplete: "Month",
    required: true,
    placeholder: "Select Month",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Month is required"
      }
    }
  },
  Year: {
    label: "Select Year",
    id: "year_id",
    autoComplete: "Year",
    required: true,
    placeholder: "Select Year",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Year is required"
      }
    }
  },
  zone: {
    label: "Zone",
    id: "zone",
    autoComplete: "zone",
    required: false,
    placeholder: "Choose Zone",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  rpc: {
    label: "RPC",
    id: "rpc",
    autoComplete: "rpc",
    required: false,
    placeholder: "Choose RPC",
    autoFocus: true,
    type: "text",
    validations: {}
  },
  contact: {
    label: "College",
    id: "college",
    autoComplete: "college",
    required: false,
    placeholder: "Choose College",
    autoFocus: true,
    type: "text",
    validations: {}
  }
};

export default DashboardSchema;
