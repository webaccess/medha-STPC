import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  btnspace: {
    padding: "15px 18px 50px"
  },
  btnspaceadd: {
    padding: "0px 15px 15px"
  },
  labelside: {
    padding: "0px 0px 15px 0px",
    fontWeight: "600",
    paddingBottom: "3px",
    marginRight: "25px"
  },
  formgrid: {
    marginTop: theme.spacing(0),
    alignItems: "center"
  },
  divider: {
    marginTop: "15px",
    marginBottom: "15px"
  },
  streamcard: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "15px !important",
    margin: "15px",
    position: "relative",
    "& label": {
      position: "absolute",
      top: "-8px",
      backgroundColor: "#fff"
    }
  },
  streamoffer: {
    paddingLeft: "15px",
    paddingRight: "15px",
    borderRadius: "0px",
    boxShadow: "none !important"
  },
  streamcardcontent: {
    boxShadow: "none",
    borderBottom: "1px solid #ccc",
    marginBottom: "15px",
    borderRadius: "0px"
  },
  labelside: {
    paddingBottom: "10px",
    fontWeight: "600",
    // backgroundColor: "#ccc",
    marginRight: "15px",
    fontWeight: "700",
    borderBottom: "1px solid #ccc"
  },
  Cardtheming: {
    paddingBottom: "16px !important"
  },
  Cardthemingstream: {
    paddingLeft: "0px"
  },
  labelcontent: {
    paddingBottom: "10px",
    borderBottom: "1px solid #f6c80a",
    marginRight: "15px",
    maxWidth: "100% !important"
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
  cardHeight: {
    height: "600px",
    maxWidth: "400px"
  },
  imageDiv: {
    width: "100%",
    height: "200px",
    contain: "content"
  },
  titleDiv: { width: "100%", height: "50px" },
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
  },
  CardHeader: {
    // backgroundColor: "#EEEEEE",
    marginTop: "-12px"
  },
  header: {
    fontWeight: 700,
    fontSize: "17px",
    fontWeight: "bold"
  }
}));
export default useStyles;
