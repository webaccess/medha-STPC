import React, { useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import * as serviceProviders from "../../api/Axios";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import * as genericConstants from "../../constants/GenericConstants";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { YellowButton, GrayButton } from "../../components";
import useStyles from "./ApproveStudentStyles";

const STUDENTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENTS;
const USER_ID = "UserName";

const DeleteStudents = props => {

  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = useState({
    isDeleteData: false,
    isValid: false,
    stateCounter: 0,
    values: {}
  });

  const handleCloseModal = (message = "") => {
    if (typeof message !== "string") {
      message = "";
    }
    setFormState(formState => ({
      ...formState,
      values: {},
      isDeleteData: false,
      isValid: false,
      stateCounter: 0
    }));

    if (formState.isDeleteData) {
      props.deleteEvent(true, message);
    } else {
      props.deleteEvent(false, message);
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
          handleCloseModal("selected " + props.id.length + "students are succesfully deleted");
        })
        .catch(error => {
          console.log("error", error);
          formState.isDeleteData = false;
          handleCloseModal("Error in Deleting " + props.id.length + " selected students");
        });
    } else {
      serviceProviders
        .serviceProviderForDeleteRequest(STUDENTS_URL, props.id)
        .then(res => {
          formState.isDeleteData = true;
          handleCloseModal("Successfully deleted selected student " + props.dataToDelete["name"]);
        })
        .catch(error => {
          console.log("error", error);
          handleCloseModal("Error in deleting selected student " + props.dataToDelete["name"]);
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
          <div className={classes.blockpanel}>
            <Typography variant={"h2"} className={classes.textMargin}>
              {genericConstants.DELETE_TEXT}
            </Typography>
            <div className={classes.crossbtn}>
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={handleCloseModal}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className={classes.edit_dialog}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item lg className={classes.deletemessage}>
                {props.isMultiDelete ? (
                     "Are you sure you want to delete " +  props.id.length + " students ?"
                  ) : (
                    "  Are you sure you want to delete student " +
                     props.dataToDelete["name"] + " ?"
                    
                  )}
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
                    onClick={handleCloseModal}
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

export default DeleteStudents;
