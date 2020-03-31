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
