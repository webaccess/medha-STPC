import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  btnspace: {
    padding: "15px 18px 50px"
  },
  formgrid: {
    marginTop: theme.spacing(0),
    alignItems: "center"
  },
  title: {
    display: "flex",
    marginBottom: theme.spacing(1),
    "& h4": {
      flex: "1",
      fontWeight: "700"
    }
  },
  defaultMargin: {
    margin: "2%"
  },
  imageDiv: {
    width: "100%",
    height: "200px",
    display: "flex",
    backgroundColor: "white",
    margin: "auto"
  }
}));
export default useStyles;
