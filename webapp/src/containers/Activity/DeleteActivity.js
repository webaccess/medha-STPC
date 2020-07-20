import React, { useState, useContext } from "react";
import { Grid, Typography, IconButton } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import useStyles from "./ActivityBatch/DeleteActivityBatchStudentStyles";
import * as serviceProviders from "../../api/Axios";
import * as genericConstants from "../../constants/GenericConstants";
import { YellowButton, GrayButton } from "../../components";
import LoaderContext from "../../context/LoaderContext";
import axios from "axios";

const DeleteActivity = props => {
  const { activity } = props;
  const { setLoaderStatus } = useContext(LoaderContext);
  const handleSubmit = event => {
    setLoaderStatus(true);
    props.clearSelectedRow(true);
    deleteData();
    event.preventDefault();
  };

  const deleteData = () => {
    const url = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY;
    if (props && props.isMultiDelete) {
      serviceProviders
        .serviceProviderForAllDeleteRequest(url, activity)
        .then(
          axios.spread((...response) => {
            setLoaderStatus(false);
            let count = 0;
            response.map(response => {
              if (response === null) count += 1;
            });
            if (count === 0) {
              props.deleteEvent(true, activity.length, true);
              props.closeModal();
            } else if (count === activity.length) {
              props.deleteEvent(false, "error", true);
              props.closeModal();
            } else if (count < activity.length) {
              props.deleteEvent(false, "warning", true);
              props.closeModal(1);
            }
          })
        )
        .catch(error => {
          console.log({ deleteActivityCatch: error });
          setLoaderStatus(false);
          props.deleteEvent(false, error);
          props.closeModal();
        });
    } else {
      const activityId = activity.id;

      serviceProviders
        .serviceProviderForDeleteRequest(url, activityId)
        .then(() => {
          setLoaderStatus(false);
          props.deleteEvent(true, activity);
          props.closeModal();
        })
        .catch(error => {
          setLoaderStatus(false);
          props.deleteEvent(false, error);
          props.closeModal();
        });
    }
  };

  const handleClose = async event => {
    // props.clearSelectedRow(true);
    props.closeModal();
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
          <div className={classes.blockpanel}>
            <Typography variant={"h2"} className={classes.textMargin}>
              {genericConstants.DELETE_TEXT}
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
                  {props.activity ? (
                    props.isMultiDelete ? (
                      <p>Do you want to delete {activity.length} Activties ?</p>
                    ) : (
                      <p>Do you want to delete Activty {activity.title}?</p>
                    )
                  ) : null}
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
                  <YellowButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    Ok
                  </YellowButton>
                </Grid>
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

export default DeleteActivity;
