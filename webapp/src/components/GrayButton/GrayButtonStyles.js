import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  resetbtn: {
    backgroundColor: "#666666",
    color: "#fff",
    borderRadius: "3px",
    textTransform: "capitalize",
    fontSize: "13px",
    fontWeight: "700",
    "&:hover": {
      background: "#666666",
      color: "#fff"
    }
  }
}));

export default useStyles;
