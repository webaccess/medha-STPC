import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";

const Modal = props => {
  function _onClick(e, close) {
    if (!props.event) {
      return;
    }
    props.event(e);
    props.close(close);
  }

  return (
    <Dialog
      open={props.show}
      onClose={props.close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.header}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.close}
          style={props.footer.displayClose}
          color="primary"
        >
          {props.footer.footerCloseName}
        </Button>
        <Button
          onClick={_onClick}
          href={props.footer.footerHref}
          style={props.footer.displaySave}
          color="primary"
          autoFocus
        >
          {props.footer.footerSaveName}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
