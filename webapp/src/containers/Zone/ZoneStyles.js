import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    display: "content"
  },
  filterOptions: {
    marginTop: theme.spacing(3)
  },
  filterMargin: {
    margin: theme.spacing(3)
  },
  filterButtonsMargin: {
    margin: theme.spacing(0.5)
  }
}));

export default useStyles;
