import { makeStyles,useTheme } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  root: {
    maxWidth: "100%"
  },
  btnspace: {
    padding: "20px 18px 20px"
  },
  btnspaceadd: {
    padding: "0px 15px 15px"
  },
  formgrid: {
    marginTop: theme.spacing(0),
    alignItems: "center"
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
  streamcardcontent: {
    boxShadow: "none",
    borderBottom: "1px solid #ccc",
    marginBottom: "15px",
    borderRadius: "0px"
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
  }
}));
export default useStyles;
