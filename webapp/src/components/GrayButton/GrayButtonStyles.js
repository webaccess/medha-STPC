import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  resetbtn: {
    backgroundColor: "#666666",
    color: "#fff",
    borderRadius: "3px",
    padding: "0px 12px",
    textTransform: "capitalize",
    fontSize: "13px",
    fontWeight: "700",
    marginRight: "15px",
    letterSpacing: "0px",
    "&:hover": {
      background: "#666"
    }
  }
}));

export default useStyles;
