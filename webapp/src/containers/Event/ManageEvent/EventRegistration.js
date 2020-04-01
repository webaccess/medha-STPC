import React, { useState } from "react";
import { Grid, Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { YellowButton, GrayButton } from "../../../components";
import useStyles from "./DeleteEventStyles";

const EVENT_REG_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENT_REGISTRATION;
const EVENT_ID = "event";
const STUDENT_ID = "student";

const RegisterEvent = props => {
  const [formState, setFormState] = useState({
    isStudentRegistered: false,
    isValid: false,
    values: {},
    stateCounter: 0
  });

  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.values[EVENT_ID] = props.eventName;
    formState.values[STUDENT_ID] = props.userRegistering;
    formState.isStudentRegistered = false;
  }

  const handleSubmit = async () => {
    let postData = databaseUtilities.studentEventRegistration(
      formState.values[EVENT_ID],
      formState.values[STUDENT_ID]
    );
    serviceProviders
      .serviceProviderForPostRequest(EVENT_REG_URL, postData)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          isValid: true
        }));
        formState.isStudentRegistered = true;
        handleCloseModal();
      })
      .catch(error => {
        console.log("error", error);
        formState.isStudentRegistered = false;
        handleCloseModal();
      });
  };

  const handleCloseModal = () => {
    setFormState(formState => ({
      ...formState,
      values: {},
      isStudentRegistered: false,
    }));
    if (formState.isStudentRegistered) {
      props.statusRegistartion(true);
    } else {
      props.statusRegistartion(false);
    }
    props.closeBlockModal();
  };

  const classes = useStyles();
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.showModal}
      onClose={handleCloseModal}
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
              Confirmation
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
                  <p>
                    Are you sure you want to Register for Event "
                    {props.eventTitle}" ?
                  </p>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                justify="center"
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
                    Yes
                  </YellowButton>
                </Grid>
                <Grid item>
                  <GrayButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={props.modalClose}
                  >
                    No
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

export default RegisterEvent;
