import React, { useState } from "react";
import { Grid, Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import * as serviceProviders from "../../api/Axios";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import * as genericConstants from "../../constants/GenericConstants";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { YellowButton } from "../../components";
import useStyles from "./ManageStudentStyle";

const STUDENTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENTS;
const USER_ID = "UserName";

const DeleteStudents = props => {
  const [formState, setFormState] = useState({
    isDeleteData: false,
    isValid: false,
    stateCounter: 0,
    values: {}
  });

  // if (props.showModal && !formState.stateCounter) {
  //   formState.stateCounter = 0;
  //   formState.values[USER_ID] = props.id;
  //   formState.isDeleteData = false;
  // }

  const handleCloseModal = () => {
    setFormState(formState => ({
      ...formState,
      values: {},
      isDeleteData: false,
      isValid: false,
      stateCounter: 0
    }));

    if (formState.isDeleteData) {
      props.deleteEvent(true);
    } else {
      props.deleteEvent(false);
    }
    props.closeModal();
  };

  const handleSubmit = event => {
    /** CALL Put FUNCTION */
    deleteStudentData();
    event.preventDefault();
  };

  const deleteStudentData = () => {
    if (props.isMultiDelete) {
      serviceProviders
        .serviceProviderForAllDeleteRequest(STUDENTS_URL, props.id)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDeleteData = true;
          handleCloseModal();
        })
        .catch(error => {
          console.log("error", error);
          formState.isDeleteData = false;
          handleCloseModal();
        });
    } else {
      serviceProviders
        .serviceProviderForDeleteRequest(STUDENTS_URL, props.id)
        .then(res => {
          formState.isDeleteData = true;
          handleCloseModal();
        })
        .catch(error => {
          console.log("error", error);
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
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={props.showModal}>
        <div className={classes.paper}>
          <MuiDialogTitle>
            <Typography variant={"h2"} className={classes.textMargin}>
              {genericConstants.DELETE_TEXT}
            </Typography>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={props.modalClose}
            >
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>
          <div className={classes.edit_dialog}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item lg className={classes.deletemessage}>
                  {/* {props.isMultiDelete ? (
                    <p>Do you want to delete multiple user field?</p>
                  ) : (
                    <p>Do you want to delete this field?</p>
                  )} */}
                  {props.id ? "Do you want to delete" : null}
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

export default DeleteStudents;
