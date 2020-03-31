const AddRpcSchema = {
  rpcName: {
    label: "RPC",
    id: "rpcname",
    autoComplete: "rpcname",
    required: true,
    placeholder: "RPC",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "RPC Name is required"
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
        message: "State is required"
      }
    }
  },
  collegeName: {
    label: "College",
    id: "collegename",
    autoComplete: "collegename",
    required: false,
    placeholder: "Select College",
    autoFocus: true,
    type: "text",
    validations: {}
  }
};
export default AddRpcSchema;
