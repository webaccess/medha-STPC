import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    // padding: theme.spacing(1),
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
  edit_dialog: {
    padding: "15px 15px"
  },
  deletemessage: {
    flex: "1 auto"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "primary"
    // padding: theme.spacing(2, 0, 3)
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
  }
}));

export default useStyles;
