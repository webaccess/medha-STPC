import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  routebtn: {
    backgroundColor: "#f6c80a",
    color: "#000",
    borderRadius: "2px",
    padding: "3px 15px",
    fontSize: "12px",
    fontWeight: "700",
    "&:hover": {
      background: "#000",
      color: "#fff"
    }
  }
}));

export default useStyles;
