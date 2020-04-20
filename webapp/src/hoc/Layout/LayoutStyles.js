import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: "100%",
    backgroundColor: "#f4f6f8",
    padding: "25px",
    minHeight: "640px"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000,
    color: "#cdd4e1"
  }
}));

export default useStyles;
