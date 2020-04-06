import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  content: {
    display: "content"
  },
  title: {
    display: "flex",
    marginBottom: theme.spacing(1),
    "& h4": {
      flex: "1",
      fontWeight: "700"
    }
  },
  filterButtonsMargin: {
    alignSelf: "center",
    marginLeft: "10px"
  },
  tabledata: {
    marginTop: theme.spacing(3)
  },
  autoCompleteField: {
    width: 200
  },
  noDataMargin: {
    margin: "auto"
  },
  Cardtheming: {
    paddingBottom: "16px !important"
  },
  filterButton: {
    width: "100%",
    marginBottom: "24px"
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
