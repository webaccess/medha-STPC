import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  routebtn: {
    backgroundColor: "#43a047",
    color: "#fff",
    borderRadius: "3px",
    padding: "0px 12px",
    textTransform: "capitalize",
    fontSize: "13px",
    fontWeight: "700",
    "&:hover": {
      background: "#000",
      color: "#fff"
    }
  }
}));

export default useStyles;
