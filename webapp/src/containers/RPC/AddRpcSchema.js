const AddRpcSchema = {
  rpcName: {
    label: "RPC Name",
    id: "rpcname",
    autoComplete: "rpcname",
    required: true,
    placeholder: "RPC Name",
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
    placeholder: "State",
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
    placeholder: "College Name",
    autoFocus: true,
    type: "text",
    validations: {}
  }
};
export default AddRpcSchema;
