import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  submitbtn: {
    backgroundColor: "#43a047",
    color: "#fff",
    borderRadius: "2px",
    padding: "8px 15px",
    fontSize: "13px",
    fontWeight: "700",
    "&:hover": {
      background: "#43a047"
    }
  }
}));

export default useStyles;
