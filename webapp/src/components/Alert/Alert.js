import MuiAlert from "@material-ui/lab/Alert";
import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  MarginBottom: {
    marginBottom: "24px",
  },
}));

function Alert(props) {
  const classes = useStyles();
  return (
    <MuiAlert
      elevation={6}
      severity={props.severity}
      variant="filled"
      action={props.action}
      {...props}
      className={classes.MarginBottom}
    />
  );
}

export default Alert;
