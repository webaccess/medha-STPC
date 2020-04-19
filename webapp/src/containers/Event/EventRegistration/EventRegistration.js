import React, { useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { YellowButton, GrayButton } from "../../../components";
import useStyles from "../../ContainerStyles/ModalPopUpStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";

const EVENT_REG_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENT_REGISTRATION;
const EVENT_ID = "event";
const STUDENT_ID = "student";

const RegisterEvent = props => {
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    stateCounter: 0,
    isMultipleAdding: false,
    isErrorAddingStudentToEvent: false,
    fromAddStudentToRecruitmentDrive: false
  });

  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.values[EVENT_ID] = props.eventId;
    formState.values[STUDENT_ID] = props.userId;
    formState.isMultipleAdding = props.multipleUserIds
      ? props.multipleUserIds
      : false;
    formState.fromAddStudentToRecruitmentDrive = props.fromAddStudentToRecruitmentDrive
      ? true
      : false;
  }

  const handleSubmit = async event => {
    event.persist();
    setOpen(true);
    if (formState.fromAddStudentToRecruitmentDrive) {
      if (formState.isMultipleAdding) {
        for (let studentData in formState.values[STUDENT_ID]) {
          let postData = databaseUtilities.studentEventRegistration(
            formState.values[EVENT_ID],
            formState.values[STUDENT_ID][studentData]["id"]
          );
          await serviceProviders
            .serviceProviderForPostRequest(EVENT_REG_URL, postData)
            .then(res => {
              formState.stateCounter += 1;
            })
            .catch(error => {
              formState.isErrorAddingStudentToEvent = true;
              formState.stateCounter += 1;
            });
        }
      } else {
        let postData = databaseUtilities.studentEventRegistration(
          formState.values[EVENT_ID],
          formState.values[STUDENT_ID]
        );
        await serviceProviders
          .serviceProviderForPostRequest(EVENT_REG_URL, postData)
          .then(res => {
            formState.stateCounter += 1;
          })
          .catch(error => {
            formState.isErrorAddingStudentToEvent = true;
            formState.stateCounter += 1;
          });
      }

      if (formState.isMultipleAdding) {
        if (formState.isErrorAddingStudentToEvent) {
          props.setStatusDataWhileClosingModal(
            false,
            "Error registering students to the event '" +
              props.eventTitle +
              "'",
            true
          );
          props.modalClose();
        } else {
          props.setStatusDataWhileClosingModal(
            true,
            "Successfully registered " +
              props.userCount +
              " students to the event '" +
              props.eventTitle +
              "'",
            true
          );
          props.modalClose();
        }
      } else {
        if (formState.isErrorAddingStudentToEvent) {
          props.setStatusDataWhileClosingModal(
            false,
            "Error registering student to the event '" + props.eventTitle + "'",
            true
          );
          props.modalClose();
        } else {
          props.setStatusDataWhileClosingModal(
            true,
            "Successfully registered student to the event '" +
              props.eventTitle +
              "'",
            true
          );
          props.modalClose();
        }
      }

      setOpen(false);
    } else {
      setOpen(true);
      let postData = databaseUtilities.studentEventRegistration(
        formState.values[EVENT_ID],
        formState.values[STUDENT_ID]
      );
      serviceProviders
        .serviceProviderForPostRequest(EVENT_REG_URL, postData)
        .then(res => {
          formState.stateCounter += 1;
          setOpen(false);
          history.push({
            pathname: routeConstants.ELIGIBLE_EVENT,
            fromAddEvent: true,
            isRegistered: true,
            registeredEventMessage:
              "Successfully registered for event '" + props.eventTitle + "'"
          });
        })
        .catch(error => {
          formState.stateCounter += 1;
          setOpen(false);
          history.push({
            pathname: routeConstants.ELIGIBLE_EVENT,
            fromAddEvent: true,
            isRegistered: false,
            registeredEventMessage:
              "Error registering for event '" + props.eventTitle + "'"
          });
        });
    }
  };
  const classes = useStyles();
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.showModal}
      onClose={props.modalClose}
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
                  {formState.fromAddStudentToRecruitmentDrive ? (
                    formState.isMultipleAdding ? (
                      <p>
                        Are you sure you want to register selected students for
                        the event "{props.eventTitle}" ?
                      </p>
                    ) : (
                      <p>
                        Are you sure you want to register the selected student
                        for the event "{props.eventTitle}" ?
                      </p>
                    )
                  ) : (
                    <p>
                      Are you sure you want to register for the event "
                      {props.eventTitle}" ?
                    </p>
                  )}
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
                    Ok
                  </YellowButton>
                </Grid>
                <Grid item>
                  <GrayButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={props.modalClose}
                  >
                    Close
                  </GrayButton>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </Fade>
    </Modal>
  );
};
export default RegisterEvent;
