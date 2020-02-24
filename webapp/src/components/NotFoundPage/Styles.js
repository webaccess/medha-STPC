import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  content: {
    paddingTop: 150,
    textAlign: "center"
  },
  image: {
    marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 560
  },
  root: {
    padding: theme.spacing(4)
  }
}));

export default useStyles;
