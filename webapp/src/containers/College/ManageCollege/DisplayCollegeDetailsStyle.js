import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  btnspace: {
    padding: "20px 18px 20px"
  },
  btnspaceadd: {
    padding: "0px 15px 15px"
  },
  labelside: {
    padding: "0px 0px 15px 0px",
    fontWeight: "600",
    paddingBottom: "3px",
    marginRight: "25px"
  },
  formgrid: {
    marginTop: theme.spacing(0),
    alignItems: "center",
    marginBottom: "10px"
  },
  divider: {
    marginTop: "15px",
    marginBottom: "15px"
  },
  add_more_btn: {
    float: "right"
  },
  streamcard: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "15px !important",
    marginTop: "15px",
    marginLeft: "4px",
    position: "relative"
  },
  streamoffer: {
    borderRadius: "0px",
    boxShadow: "none !important"
  },
  streamcardcontent: {
    boxShadow: "none",
    marginBottom: "15px",
    borderRadius: "0px"
  },
  labelside: {
    paddingBottom: "10px",
    fontWeight: "600",
    // backgroundColor: "#ccc",
    marginRight: "15px",
    fontWeight: "700",
    borderBottom: "1px solid #ccc"
  },
  Cardtheming: {
    paddingBottom: "16px !important"
  },
  Cardthemingstream: {
    paddingLeft: "0px"
  },
  labelcontent: {
    paddingBottom: "10px",
    borderBottom: "1px solid #f6c80a",
    marginRight: "15px",
    maxWidth: "100% !important"
  },
  CellHeader: {
    fontWeight: 600,
    padding: "16px",
    fontSize: "14px",
    textAlign: "left",
    lineHeight: "21px",
    letterSpacing: "-0.05px",
    verticalAlign: "inherit"
  },
  CellValue: {
    padding: "16px",
    fontSize: "14px",
    textAlign: "left",
    lineHeight: "21px",
    letterSpacing: "-0.05px",
    verticalAlign: "inherit"
  },
  AlternateRow: {
    backgroundColor: "#F4F6F8"
  },
  title: {
    display: "flex",
    marginBottom: theme.spacing(1),
    "& h4": {
      flex: "1",
      fontWeight: "700"
    }
  },
  CardActionGrid: {
    backgroundColor: "#EEEEEE"
  },
  MarginBottom: {
    marginBottom: "10px"
  },
  CssLabelStyling: {
    position: "absolute",
    top: "-8px",
    backgroundColor: "#fff"
  }
}));
export default useStyles;
