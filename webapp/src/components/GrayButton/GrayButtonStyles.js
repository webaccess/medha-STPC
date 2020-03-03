import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  resetbtn: {
    backgroundColor: "#666666",
    color: "#fff",
    borderRadius: "2px",
    padding: "3px 15px",
    fontSize: "12px",
    fontWeight: "700",
    "&:hover": {
      background: "#666"
    }
  }
}));

export default useStyles;
