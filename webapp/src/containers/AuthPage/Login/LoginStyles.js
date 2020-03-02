import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    marginTop: "0px",
    padding: "48px 16px 0px",
    height: "100%",
    alignContent: "center",
    justifyContent: "center"
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "#666",
    "&:hover": {
      background: "#666"
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
    minHeight: "100vh"
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
    top: "-18px",
    left: "24px",
    color: "#fff",
    width: "64px",
    height: "64px",
    padding: "8px",
    position: "absolute",
    fontSize: "32px",
    borderradius: "4px"
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
    fontSize: "0.8rem"
  }
}));

export default useStyles;
