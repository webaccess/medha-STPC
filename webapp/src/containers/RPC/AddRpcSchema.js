const AddRpcSchema = {
  rpcName: {
    label: "Rpc Name",
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
    label: "State Name",
    id: "statename",
    autoComplete: "statename",
    required: true,
    placeholder: "State Name",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "State Name is required"
      }
    }
  },
  zoneName: {
    label: "Zone Name",
    id: "zonename",
    autoComplete: "zonename",
    required: true,
    placeholder: "Zone Name",
    autoFocus: true,
    type: "text",
    validations: {
      required: {
        value: "true",
        message: "Zone Name is required"
      }
    }
  },
  collegeName: {
    label: "College Name",
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
