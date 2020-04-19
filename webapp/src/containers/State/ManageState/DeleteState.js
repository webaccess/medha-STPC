import React, { useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import useStyles from "../../ContainerStyles/ModalPopUpStyles";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton, GrayButton } from "../../../components";

const STATE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const STATE_ID = "state";

const DeleteState = props => {
  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = useState({
    isDeleteData: false,
    isValid: false,
    stateCounter: 0,
    values: {},
    dataToDelete: {}
  });

  /** This is called when we open the modal */
  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.values[STATE_ID] = props.id;
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

  const deleteData = () => {
    if (props.isMultiDelete) {
      serviceProviders
        .serviceProviderForAllDeleteRequest(STATE_URL, props.id)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          console.log(res);
          formState.isDeleteData = true;
          handleCloseModal("States has been deleted successfully.");
        })
        .catch(error => {
          console.log("error");
          formState.isDeleteData = false;
          handleCloseModal(
            "An error has occured while deleting states. Kindly, try again."
          );
        });
    } else {
      serviceProviders
        .serviceProviderForDeleteRequest(STATE_URL, props.id)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDeleteData = true;
          handleCloseModal(
            "State " +
              formState.dataToDelete["name"] +
              " has been deleted successfully."
          );
        })
        .catch(error => {
          console.log("error");
          formState.isDeleteData = false;
          handleCloseModal(
            "An error has occured while deleting states" +
              formState.dataToDelete["name"] +
              ". Kindly, try again."
          );
        });
    }
  };

  const handleSubmit = async event => {
    /** CALL Put FUNCTION */
    setOpen(true);
    event.preventDefault();
    event.persist();
    let status = {};
    /** Calls checkIfStateCanBeDelete function to check whether the state can be deleted
    and returns back an opbject with status and message*/
    if (props.isMultiDelete) {
      status = await checkIfMultiStateCanBeDelete();
    } else {
      status = await checkIfStateCanBeDelete(props.id);
    }
    setOpen(false);
    if (status["status"]) {
      deleteData();
    } else {
      formState.isDeleteData = false;
      handleCloseModal(
        status["message"]
      ); /** returns back a message saying state cannot be deleted */
    }
  };

  const checkIfMultiStateCanBeDelete = async () => {
    let dataToSent = {};
    let isErrorCounter = 0;
    for (let i in props.id) {
      let status = await checkIfStateCanBeDelete(props.id[i]);
      if (!status["status"]) {
        isErrorCounter += 1;
        break;
      }
    }
    if (isErrorCounter > 0) {
      dataToSent = { status: false, message: "Error deleting selected States" };
    } else {
      dataToSent = { status: true, message: "Success" };
    }
    return dataToSent;
  };

  /** This checks if the state can be deleted and returns back an array with status and message*/
  const checkIfStateCanBeDelete = async id => {
    let stateCanBeDeletedCounter = 0;
    let dataToReturn = {};
    let zonesCheckUrl =
      STATE_URL + "/" + id + "/" + strapiConstants.STRAPI_ZONES;
    let rpcsCheckUrl = STATE_URL + "/" + id + "/" + strapiConstants.STRAPI_RPCS;
    await serviceProviders
      .serviceProviderForGetRequest(zonesCheckUrl)
      .then(res => {
        if (res.data.result.length) {
          dataToReturn = {
            status: false,
            message:
              "Cannot delete State " +
              formState.dataToDelete["name"] +
              " as it is linked to other RPC's or Zone's"
          };
        } else {
          stateCanBeDeletedCounter += 1;
        }
      })
      .catch(error => {
        console.log("error", error);
        /** return error */
        dataToReturn = {
          status: false,
          message: "Error deleting state " + formState.dataToDelete["name"]
        };
      });

    await serviceProviders
      .serviceProviderForGetRequest(rpcsCheckUrl)
      .then(res => {
        if (res.data.result.length) {
          dataToReturn = {
            status: false,
            message:
              "Cannot delete State " +
              formState.dataToDelete["name"] +
              " as it is linked to other RPC's or Zone's"
          };
        } else {
          stateCanBeDeletedCounter += 1;
        }
      })
      .catch(error => {
        console.log("error", error);
        /** return error */
        dataToReturn = {
          status: false,
          message: "Error deleting State " + formState.dataToDelete["name"]
        };
      });

    if (stateCanBeDeletedCounter === 2) {
      dataToReturn = {
        status: true,
        message: "Success"
      };
    }
    return dataToReturn;
  };

  const classes = useStyles();
  return (
    <React.Fragment>
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
                  className={classes.closeButton}
                  aria-label="close"
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
                    {props.isMultiDelete
                      ? "Are you sure you want to delete " +
                        props.id.length +
                        " states?"
                      : "Are you sure you want to delete state " +
                        formState.dataToDelete["name"] +
                        "?"}
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
            <Backdrop className={classes.backdrop} open={open}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </div>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default DeleteState;
