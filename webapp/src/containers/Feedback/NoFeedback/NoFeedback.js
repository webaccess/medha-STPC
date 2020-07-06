import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";

import useStyles from "../../ContainerStyles/ModalPopUpStyles";
import {
  Grid,
  Typography,
  IconButton,
  Card,
  CardActions
} from "@material-ui/core";
import * as genericConstants from "../../../constants/GenericConstants";
import { GrayButton } from "../../../components";

const NoFeedback = props => {
  const classes = useStyles();

  const handleClose = () => {
    props.modalClose();
  };

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
              {props.errorHeading ? props.errorHeading : `Feedback`}
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
                <Grid item xs={12} className={classes.fullWidth}>
                  <Grid item xs={12} className={classes.formgrid}>
                    <Typography variant="h5" gutterBottom color="textSecondary">
                      {props.Title}
                    </Typography>
                  </Grid>
                  <Card>
                    <Grid item xs={12} className={classes.edit_dialog}>
                      <Grid item xs={12} md={12}>
                        <CardActions justify="flex-end">
                          {props.errorMessage ? props.errorMessage : "Error"}
                        </CardActions>
                      </Grid>
                    </Grid>
                  </Card>
                  <Grid xs={12} className={classes.edit_dialog}>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      container
                      direction="row"
                      justify="flex-end"
                      alignItems="center"
                      spacing={2}
                    >
                      <CardActions justify="flex-end">
                        <GrayButton
                          type="submit"
                          color="primary"
                          variant="contained"
                          onClick={handleClose}
                        >
                          CLOSE
                        </GrayButton>
                      </CardActions>
                    </Grid>
                  </Grid>
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
