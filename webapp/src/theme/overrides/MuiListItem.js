import { colors } from "@material-ui/core";

export default {
  root: {
    "&$selected": {
      backgroundColor: "#666",
      color: "#f6c80a",
      borderLeft: "4px solid #f6c80a",
      "&:hover": {
        backgroundColor: "#666",
        color: "#f6c80a",
        borderLeft: "4px solid #f6c80a"
      }
    },
    cursor: "pointer"
  }
};
