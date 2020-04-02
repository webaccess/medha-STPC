import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  elementroot: {
    width: "30%"
  },
  btnspace: {
    padding: "20px 18px 20px"
  },
  formgrid: {
    marginTop: theme.spacing(0),
    alignItems: "center"
  },
  CardActionGrid: {
    backgroundColor: "#EEEEEE"
  },
  title: {
    display: "flex",
    marginBottom: theme.spacing(1),
    "& h4": {
      flex: "1",
      fontWeight: "700"
    }
  }
}));

export default useStyles;
