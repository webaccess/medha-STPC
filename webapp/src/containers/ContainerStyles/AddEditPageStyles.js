import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  elementroot: {
    width: "30%"
  },
  btnspace: {
    padding: "20px 18px 20px"
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
  /**Css for streams section */
  streamcard: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "15px !important",
    marginTop: "15px",
    marginLeft: "4px",
    position: "relative",
    "& label": {
      position: "absolute",
      top: "-8px",
      backgroundColor: "#fff"
    }
  },
  streamoffer: {
    borderRadius: "0px",
    boxShadow: "none !important"
  },
  streamcardcontent: {
    boxShadow: "none",
    borderBottom: "1px solid #ccc",
    marginBottom: "15px",
    borderRadius: "0px"
  },
  btnspaceadd: {
    padding: "0px 15px 15px"
  },
  /**End of css for streams */
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  }
}));

export default useStyles;
