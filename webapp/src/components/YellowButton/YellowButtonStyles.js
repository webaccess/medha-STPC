import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  submitbtn: {
    backgroundColor: "#f6c80a",
    color: "#353535",
    borderRadius: "3px",
    textTransform: "capitalize",
    fontSize: "13px",
    fontWeight: "700",
    "&:hover": {
      background: "#f6c80a",
      color: "#353535"
    }
  }
}));

export default useStyles;
