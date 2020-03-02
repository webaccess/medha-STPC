import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  elementroot: {
    width: "30%"
  },
  submitbtn: {
    backgroundColor: "#43a047",
    color: "#fff",
    borderRadius: "1px",
    padding: "3px 15px",
    fontSize: "12px",
    fontWeight: "700",
    "&:hover": {
      background: "#43a047"
    }
  },
  resetbtn: {
    backgroundColor: "#666666",
    color: "#fff",
    borderRadius: "1px",
    padding: "3px 15px",
    fontSize: "12px",
    fontWeight: "700",
    "&:hover": {
      background: "#666"
    }
  },
  btnspace: {
    padding: "15px 18px 50px"
  },
  formgrid: {
    marginTop: theme.spacing(2),
    alignItems: "center"
  }
}));

export default useStyles;
