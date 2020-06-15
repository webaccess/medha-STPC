import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import * as strapiConstants from "../../constants/StrapiApiConstants";
import useStyles from "./ActivityBatch/DeleteActivityBatchStudentStyles";
import * as serviceProviders from "../../api/Axios";
import * as genericConstants from "../../constants/GenericConstants";
import { YellowButton } from "../../components";

const DeleteActivity = props => {
  const { activity } = props;
  const handleSubmit = event => {
    deleteData();
    event.preventDefault();
  };

  const deleteData = () => {
    const activityId = activity.id;

    const url = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY;
    serviceProviders
      .serviceProviderForDeleteRequest(url, activityId)
      .then(() => {
        props.deleteEvent(true, activity);
        props.closeModal();
      })
      .catch(error => {
        props.deleteEvent(false, error);
        props.closeModal();
      });
  };

  const classes = useStyles();
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.showModal}
      onClose={() => props.closeModal()}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={props.showModal}>
        <div className={classes.paper}>
          <Typography variant={"h2"} className={classes.textMargin}>
            {genericConstants.DELETE_TEXT}
          </Typography>
          <div className={classes.edit_dialog}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item lg className={classes.deletemessage}>
                  Do you want to delete Activty?
                </Grid>
                <Grid item xs>
                  <YellowButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    {genericConstants.DELETE_TEXT}
                  </YellowButton>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default DeleteActivity;
