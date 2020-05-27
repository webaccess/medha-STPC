import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";

import useStyles from "../../ContainerStyles/ModalPopUpStyles";
import { Grid, Typography, IconButton } from "@material-ui/core";
import * as genericConstants from "../../../constants/GenericConstants";
import { GrayButton } from "../../../components";

const NoFeedback = props => {
  const classes = useStyles();

  const handleClose = () => {
    props.modalClose();
  };

  console.log("No feedback");

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.showModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={props.showModal}>
        <div className={classes.paper}>
          <div className={classes.blockpanel}>
            <Typography variant={"h2"} className={classes.textMargin}>
              Error
            </Typography>
            <div className={classes.crossbtn}>
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={props.modalClose}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className={classes.edit_dialog}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item lg className={classes.deletemessage}>
                  {props.forView
                    ? `No feedback for ${props.Title}`
                    : `Cannot add feedback for ${props.Title}`}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <GrayButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={handleClose}
                  >
                    Close
                  </GrayButton>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default NoFeedback;
