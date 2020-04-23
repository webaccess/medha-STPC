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
import useStyles from "../ContainerStyles/ModalPopUpStyles";

const STUDENTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENTS;
const USERS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;

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
      props.closeModal(true, message);
    } else {
      props.closeModal(false, message);
    }
  };

  const handleSubmit = event => {
    /** CALL Put FUNCTION */
    props.clearSelectedRow(true);

    deleteStudentData();
    event.preventDefault();
  };

  const deleteStudentData = () => {
    if (props.isMultiDelete) {
      serviceProviders
        .serviceProviderForAllDeleteRequest(STUDENTS_URL, props.id)
        .then(res => {
          serviceProviders
            .serviceProviderForAllDeleteRequest(USERS_URL, props.UserID)
            .then(res => {
              setFormState(formState => ({
                ...formState,
                isValid: true
              }));

              formState.isDeleteData = true;
              handleCloseModal("Students have been deleted successfully.");
            })
            .catch(error => {
              console.log("UserDeleteError", error);
            });
        })
        .catch(error => {
          console.log("error");
          formState.isDeleteData = false;
          handleCloseModal(
            "An error has occured while deleting students. Kindly, try again."
          );
        });
    } else {
      serviceProviders
        .serviceProviderForDeleteRequest(STUDENTS_URL, props.id)
        .then(res => {
          serviceProviders
            .serviceProviderForDeleteRequest(
              USERS_URL,
              props.dataToDelete["userId"]
            )
            .then(res => {
              formState.isDeleteData = true;
              handleCloseModal(
                "Student " +
                props.dataToDelete["name"] +
                " has been deleted successfully."
              );
            })
            .catch(error => {
              console.log("studenterror", error);
            });
        })
        .catch(error => {
          console.log("error", error);
          handleCloseModal(
            "An error has occured while deleting student " +
            props.dataToDelete["name"] +
            ". Kindly, try again."
          );
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
                  {props.isMultiDelete
                    ? "Are you sure you want to delete the selected students ?"
                    : "Are you sure you want to delete the student " +
                    props.dataToDelete["name"] +
                    " ?"}
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
