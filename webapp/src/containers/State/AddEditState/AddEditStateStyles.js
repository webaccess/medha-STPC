import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  elementroot: {
    width: "30%"
  },
  formgrid: {
    marginTop: theme.spacing(2),
    alignItems: "center"
  },
  btnspace: {
    padding: "15px 18px 50px"
  }
}));

export default useStyles;
