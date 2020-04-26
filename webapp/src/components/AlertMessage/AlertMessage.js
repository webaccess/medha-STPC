import React from "react";
import { Collapse, IconButton } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";

const AlertMessage = props => {
  let alertTitle = props.alertTitle;
  return (
    <Collapse in={props.openAlert}>
      <Alert
        variant={props.variant}
        severity={alertTitle}
        action={
          <IconButton
            aria-label={props.arialabel}
            color={props.color}
            size={props.size}
            onClick={props.onClick}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {props.children}
      </Alert>
    </Collapse>
  );
};

export default AlertMessage;
