import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  resetbtn: {
    backgroundColor: "#666666",
    color: "#fff",
    borderRadius: "2px",
    padding: "8px 15px",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "0px",
    "&:hover": {
      background: "#666"
    }
  }
}));

export default useStyles;
