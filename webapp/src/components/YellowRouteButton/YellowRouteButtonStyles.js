import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  routebtn: {
    backgroundColor: "#f6c80a",
    color: "#000",
    borderRadius: "2px",
    padding: "8px 15px",
    fontSize: "13px",
    fontWeight: "700",
    border: "1px solid #ccb450",
    "&:hover": {
      background: "#000",
      color: "#fff"
    }
  }
}));

export default useStyles;
