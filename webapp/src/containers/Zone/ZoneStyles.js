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
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

export default useStyles;
