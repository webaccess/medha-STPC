import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  submitbtn: {
    backgroundColor: "#43a047",
    color: "#fff",
    borderRadius: "1px",
    padding: "3px 15px",
    fontSize: "12px",
    fontWeight: "700",
    "&:hover": {
      background: "#43a047"
    }
  }
}));

export default useStyles;
