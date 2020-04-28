import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    padding: "16px 16px 0px",
    height: "100%",
    alignContent: "center",
    justifyContent: "center"
  },
  submit: {
    margin: theme.spacing(5, 0, 2),
    backgroundColor: "#f6c80a !important",
    color: "#010101 !important",
    fontWeight: "700 !important",
    "&:hover": {
      backgroundColor: "#f6c80a"
    }
  },
  margin: {
    marginTop: theme.spacing(2)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  rootDesktop: {
    width: "960px",
    display: "flex",
    overflow: "visible",
    position: "relative",
    maxWidth: "100%"
  },
  root: {
    width: "960px",
    overflow: "visible",
    position: "relative",
    maxWidth: "100%"
  },
  masterlogin2: {
    display: "flex",
    marginTop: "65px"
  },
  masterlogin1: {
    flexGrow: "1",
    maxWidth: "100%",
    overflowx: "hidden",
    paddingtop: "64px"
  },

  masterlogin: {
    height: "100%",
    display: "flex;",
    alignItems: "center",
    justifyContent: "center"
  },

  loginlock: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#ccc !important",
    display: "flex",
    justifyContent: "center",
    color: "#fff",
    alignItems: "center",
    marginRight: "15px"
  },
  signin_header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    marginBottom: "25px"
  },

  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: "500px",
    display: "flex",
    padding: "24px",
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  playIcon: {
    height: 38,
    width: 38,
    positions: "absolute"
  },

  cssLabel: {
    color: "#666666"
  },

  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: `#dedede !important`
    }
  },

  cssFocused: {
    borderColor: `#dedede !important`,
    color: `#666666 !important`
  },

  notchedOutline: {
    borderWidth: "1px",
    borderColor: "#666 !important"
  },
  linkColor: {
    color: "#21abdc",
    fontSize: "0.8rem",
    textAlign: "right"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  }
}));

export default useStyles;
