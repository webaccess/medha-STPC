import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",

    alignItems: "center",
    justifyContent: "center"
  },
  form: {
    marginTop: theme.spacing(4)
  }
}));
export default useStyles;
