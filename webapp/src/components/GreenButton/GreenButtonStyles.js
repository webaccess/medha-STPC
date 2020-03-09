import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  submitbtn: {
    backgroundColor: "#f6c80a",
    color: "#353535",
    borderRadius: "3px",
    padding: "0px 12px",
    textTransform: "Capitalize",
    fontSize: "13px",
    fontWeight: "700",
    "&:hover": {
      background: "#f6c80a"
    }
  }
}));

export default useStyles;
