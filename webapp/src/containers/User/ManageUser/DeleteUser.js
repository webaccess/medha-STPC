import React, { useState } from "react";
import { Grid, Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { YellowButton, GrayButton } from "../../../components";
import useStyles from "../../ContainerStyles/ModalPopUpStyles";

const USER_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;
const USER_ID = "UserName";

const DeleteUser = props => {
  const [formState, setFormState] = useState({
    isDeleteData: false,
    isValid: false,
    stateCounter: 0,
    values: {},
    username: "",
    dataToDelete: {}
  });

  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.values[USER_ID] = props.id;
    formState.isDeleteData = false;
    formState.dataToDelete = props.dataToDelete;
  }

  const handleCloseModal = (message = "") => {
    /** This event handles the scenario when the pop up is closed just by clicking outside the popup 
    to ensure that only string value is passed to message variable */
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
    deleteData();
    props.clearSelectedRow(true);
    event.preventDefault();
  };

  const deleteData = () => {
    if (props.isMultiDelete) {
      serviceProviders
        .serviceProviderForAllDeleteRequest(USER_URL, props.id)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDeleteData = true;
          handleCloseModal("Users has been deleted successfully");
        })
        .catch(error => {
          console.log("error", error);
          formState.isDeleteData = false;
          handleCloseModal(
            "An error has occured while deleting users. Kindly, try again"
          );
        });
    } else {
      serviceProviders
        .serviceProviderForDeleteRequest(USER_URL, props.id)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDeleteData = true;
          handleCloseModal(
            "User " +
              formState.dataToDelete["name"] +
              " has been deleted successfully"
          );
        })
        .catch(error => {
          console.log("error");
          formState.isDeleteData = false;
          handleCloseModal(
            "An error has occured while deleting user" +
              formState.dataToDelete["name"] +
              ". Kindly, try again"
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
                  {props.isMultiDelete ? (
                    <p>Are you sure you want to delete the selected users?</p>
                  ) : (
                    <p>
                      Are you sure you want to delete user "
                      {formState.dataToDelete["name"]}"?
                    </p>
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
                    onClick={props.modalClose}
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

export default DeleteUser;
