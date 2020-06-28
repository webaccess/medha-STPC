import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  greenButton: {
    backgroundColor: "#43a047",
    color: "#fff",
    borderRadius: "3px",
    // padding: "0px 12px",
    textTransform: "capitalize",
    fontSize: "13px",
    fontWeight: "700",
    "&:hover": {
      background: "#000",
      color: "#fff"
    }
  },
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
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "capitalize"
  },
  titleRoot: {
    padding: "4px",
    borderBottom: "1.5px solid #000",
    backgroundColor: "#000000"
  },
  h1: {
    textAlign: "center !important",
    fontSize: "26px !important",
    fontWeight: 700
  },
  root: {},
  dasboard_table: {
    minWidth: "100%"
  },

  marginCard: {
    marginTop: "24px"
  },
  filterButtonsMargin: {
    // margin: theme.spacing(0.5)
    alignSelf: "center",
    marginLeft: "8px"
  },
  dash_search_btn: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "flex-start",
    width: "100%"
  },
  move_right: {
    float: "right"
  }
}));

export default useStyles;
