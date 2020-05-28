import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(4)
    maxWidth: "100%"
  },
  content: {
    display: "content"
  },
  filterOptions: {
    // marginTop: theme.spacing(3)
  },
  filterMargin: {
    // margin: theme.spacing(3)
  },
  filterButtonsMargin: {
    // margin: theme.spacing(0.5)
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
    // padding: theme.spacing(2, 4, 3)
  },
  tabledata: {
    marginTop: theme.spacing(3)
  },
  textMargin: {
    margin: "10px"
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
  elementroot: {
    width: "30% !important"
  },
  marginTop: {
    marginTop: "8px"
  },
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
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  },
  editDialogue: {
    padding: "8px"
  },
  paddingDate: {
    paddingTop: "21px !important"
  }
  /** */
}));

export default useStyles;
