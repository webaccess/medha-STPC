import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  content: {
    display: "content"
  },
  filterButtonsMargin: {
    alignSelf: "center",
    marginLeft: "10px"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  edit_dialog: {
    padding: "15px 15px"
  },
  deletemessage: {
    flex: "inherit",
    fontSize: "14px",
    paddingBottom: "18px !important"
  },
  blockpanel: {
    display: "flex",
    position: "relative",
    "& h2": {
      flexGrow: "1"
    }
  },
  crossbtn: {
    position: "absolute",
    top: "-7px",
    right: "-7px",
    padding: "0px",
    color: "#fff"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "primary"
  },
  tabledata: {
    marginTop: theme.spacing(3)
  },
  textMargin: {
    margin: "0px",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: "16px",
    paddingLeft: "8px",
    width: "100%"
  },
  autoCompleteField: {
    width: 200
  },
  noDataMargin: {
    margin: "auto"
  },
  title: {
    display: "flex",
    marginBottom: theme.spacing(1),
    "& h4": {
      flex: "1",
      fontWeight: "700"
    }
  },
  Cardtheming: {
    paddingBottom: "16px !important"
  },
  FontWeight: { fontWeight: 700 },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  },
  fullWidth: {
    width: "98%",
    paddingLeft: "15px"
  },
  paddingDiv: {
    padding: "2%"
    // paddingRight: "5%"
  }
}));

export default useStyles;
