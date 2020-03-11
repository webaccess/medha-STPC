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
  root: {
    padding: theme.spacing(4)
  }
}));

export default useStyles;
