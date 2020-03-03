import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  btnspace: {
    padding: "15px 18px 50px"
  },
  formgrid: {
    marginTop: theme.spacing(2),
    alignItems: "center"
  },
  divider: {
    marginTop: "15px",
    marginBottom: "15px"
  }
}));
export default useStyles;
