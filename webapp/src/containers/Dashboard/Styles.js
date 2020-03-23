import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  content: {
    paddingTop: "inherit",
    textAlign: "center"
  },
  image: {
    "margin-left": "20%",
    display: "inline-block",
    maxWidth: "100%",
    width: 560
  },
  title: {
    fontSize: "13px",
    fontWeight: 700,
    //color: "#546E7A"
    color: "#fff"
  },
  titleRoot: {
    padding: "4px",
    borderBottom: "1.5px solid #546E7A",
    backgroundColor: "#000"
  },
  h1: {
    textAlign: "center !important",
    fontSize: "26px !important",
    fontWeight: 700
  },
  root: {},
  table: {
    minWidth: 300
  },
  marginCard: {
    marginTop: "24px"
  },
  filterButtonsMargin: {
    // margin: theme.spacing(0.5)
    alignSelf: "center",
    marginLeft: "8px"
  }
}));

export default useStyles;
