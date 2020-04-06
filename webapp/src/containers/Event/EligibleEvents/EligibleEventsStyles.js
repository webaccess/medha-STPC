import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
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
  cardHeight: {
    height: "600px"
  },
  imageDiv: {
    width: "100%",
    height: "200px",
    display: "flex",
    backgroundColor: "white",
    margin: "auto"
  },
  titleDiv: {
    width: "100%",
    height: "50px"
  },
  contentDiv: {
    width: "100%",
    height: "200px"
  },
  buttonsDiv: {
    width: "100%",
    height: "50px"
  },
  buttonAlign: {
    textAlign: "center"
  }
}));
export default useStyles;
