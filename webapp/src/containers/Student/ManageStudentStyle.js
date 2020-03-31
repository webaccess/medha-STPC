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
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "primary",
    boxShadow: theme.shadows[5],
    marginBottom: theme.spacing(3)
  },
  tabledata: {
    marginTop: theme.spacing(3)
  },
  textMargin: {
    margin: "0px",
    backgroundColor: "#000",
    color: "#fff",
    fontSize: "18px",
    paddingLeft: "8px"
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
  crossbtn: {
    position: "absolute",
    top: "-7px",
    right: "-7px",
    padding: "0px",
    color: "#fff"
  },
  deletepanel: {
    display: "flex",
    position: "relative",
    "& h2": {
      flexGrow: "1"
    }
  },
  edit_dialog: {
    padding: "15px 15px"
  },
  /**css for datatable action buttons */
  DisplayFlex: {
    display: "flex"
  },
  PaddingActionButton: {
    padding: "2px 8px 0px 8px",
    cursor: "pointer"
  },
  PaddingFirstActionButton: {
    padding: "0px 8px 0px 0px",
    cursor: "pointer"
  }
  /** */
}));

export default useStyles;
