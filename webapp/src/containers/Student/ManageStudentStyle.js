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
  }
}));

export default useStyles;
