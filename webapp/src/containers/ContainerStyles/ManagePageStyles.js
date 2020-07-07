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
    padding: "3px 8px 0px 0px",
    cursor: "pointer"
  },
  PaddingSomeActionButton: {
    padding: "0px 8px 0px 0px",
    cursor: "pointer"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  },
  paddingDate: {
    paddingTop: "21px !important"
  },

  container: {
    alignSelf: "center",
    padding: "20px",
    margin: "10px auto"
  },

  csvInput: {
    alignSelf: "center",
    padding: "30px",
    display: "block",
    border: "2px solid #ccc",
    borderRadius: "10px",
    width: "100%",
    fontSize: "20px"
  },

  importButtonMargin: {
    alignSelf: "center",
    width: "100%",
    margin: "10px auto"
  },

  InputFileButton: {
    color: "#353535",
    backgroundColor: "#f6c80a",
    fontSize: "13px",
    fontWeight: "700",
    marginLeft: "2%",
    width: "96%",
    borderRadius: "0 !important",
    "&:hover,&:focus": {
      color: "#353535",
      backgroundColor: "#f6c80a"
    }
  },
  greenButton: {
    backgroundColor: "#43a047",
    color: "#fff",
    borderRadius: "3px",
    float: "right",
    // padding: "0px 12px",
    textTransform: "capitalize",
    fontSize: "13px",
    fontWeight: "700",
    "&:hover": {
      background: "#000",
      color: "#fff"
    }
  },
  ProgressBar: {
    marginLeft: "2%",
    paddingRight: "20px",
    marginTop: "8px"
  },
  flexGrow: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-end"
  }

  /** */
}));

export default useStyles;
