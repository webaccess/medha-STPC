import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  content: {
    paddingTop: "inherit",
    textAlign: "center"
  },
  image: {
    "margin-left": "20%",
    display: "inline-block",
    maxWidth: "100%",
    width: 560
  },
  title: {
    fontSize: "18px",
    fontWeight: 700
  },

  h1: {
    textAlign: "center !important",
    fontSize: "26px !important",
    fontWeight: 700
  },
  root: {},
  table: {
    minWidth: 300
  }
}));

export default useStyles;
