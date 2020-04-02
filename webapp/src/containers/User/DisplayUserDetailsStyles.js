import { makeStyles } from "@material-ui/core/styles";
import { BorderTopOutlined } from "@material-ui/icons";
const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  btnspace: {
    padding: "15px 18px 50px"
  },
  btnspaceadd: {
    padding: "0px 15px 15px"
  },
  formgrid: {
    marginTop: theme.spacing(0),
    alignItems: "center",
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
    margin: "15px",
    position: "relative",
    "& label": {
      position: "absolute",
      top: "-8px",
      backgroundColor: "#fff"
    }
  },
  streamoffer: {
    paddingLeft: "15px",
    paddingRight: "15px",
    borderRadius: "0px",
    boxShadow: "none !important"
  },
  labelside: {
    paddingBottom: "10px",
    fontWeight: "600",
    // backgroundColor: "#ccc",
    marginRight:"15px",
    fontWeight:"700",
    borderBottom:"1px solid #ccc"
  },
  Cardtheming: {
    paddingBottom: "16px !important"
  },
  labelcontent: {
    paddingBottom: "10px",
    borderBottom: "1px solid #f6c80a",
    marginRight:"15px",
    maxWidth:"100% !important"
  },
  streamcardcontent: {
    boxShadow: "none",
    borderBottom: "1px solid #ccc",
    marginBottom: "15px",
    borderRadius: "0px"
  }
}));
export default useStyles;
