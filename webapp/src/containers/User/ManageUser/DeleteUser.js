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

const USER_URL =
  strapiConstants.STRAPI_DB_URL +
  strapiConstants.STRAPI_CONTACT_URL +
  strapiConstants.STRAPI_DELETE_URL;
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

  const handleCloseModal = (message = "", count = 0) => {
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
      props.closeModal(true, message, 0);
    } else {
      props.closeModal(false, message, count);
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
      let deleteId = {
        id: props.id
      };
      serviceProviders
        .serviceProviderForPostRequest(USER_URL, deleteId)
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
          console.log(error.response.status);
          if (error.response.status == 403) {
            formState.isDeleteData = false;
            console.log(error.response.data.message);
            if (props.id.length == 1) {
              handleCloseModal(error.response.data.message);
            } else {
              if (error.response.data.message[0] < props.id.length)
                handleCloseModal(error.response.data.message, 1);
              else if (props.id.length >= 2)
                handleCloseModal(error.response.data.message, 1);
              else handleCloseModal(error.response.data.message);
            }
          } else {
            formState.isDeleteData = false;
            handleCloseModal(
              "An error has occured while deleting users. Kindly, try again"
            );
          }
        });
    } else {
      let deleteArray = [];
      deleteArray.push(parseInt(props.id));
      let deleteId = {
        id: deleteArray
      };
      serviceProviders
        .serviceProviderForPostRequest(USER_URL, deleteId)
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
          console.log("error", error);
          console.log(error.response.status);
          if (error.response.status == 403) {
            formState.isDeleteData = false;
            console.log(error.response.data.message);
            handleCloseModal(error.response.data.message);
          } else {
            formState.isDeleteData = false;
            handleCloseModal(
              "An error has occured while deleting user" +
                formState.dataToDelete["name"] +
                ". Kindly, try again"
            );
          }
        });
    }
  };

  const handleClose = async event => {
    props.clearSelectedRow(true);
    props.closeModal();
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
                  {props.id ? (
                    props.isMultiDelete ? (
                      <p>Are you sure you want to delete the selected users?</p>
                    ) : (
                      <p>
                        Are you sure you want to delete user "
                        {formState.dataToDelete["name"]}"?
                      </p>
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

export default DeleteUser;
