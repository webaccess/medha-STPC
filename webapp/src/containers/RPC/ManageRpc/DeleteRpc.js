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

const RPC_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;

const DeleteRpc = props => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
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

  const handleSubmit = async event => {
    /** CALL Put FUNCTION */
    setOpen(true);
    event.preventDefault();
    event.persist();
    let status = {};
    /** Calls checkIfStateCanBeDelete function to check whether the state can be deleted
     and returns back an opbject with status and message*/
    if (props.isMultiDelete) {
      status = await checkIfMultiRPCCanBeDelete();
    } else {
      status = await checkIfRPCCanBeDelete(props.id);
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

  const checkIfMultiRPCCanBeDelete = async () => {
    let dataToSent = {};
    let isErrorCounter = 0;
    for (let i in props.id) {
      let status = await checkIfRPCCanBeDelete(props.id[i]);
      if (!status["status"]) {
        isErrorCounter += 1;
        break;
      }
    }
    if (isErrorCounter > 0) {
      dataToSent = { status: false, message: "Error deleting selected RPC's" };
    } else {
      dataToSent = { status: true, message: "Success" };
    }
    return dataToSent;
  };

  const deleteData = () => {
    if (props.isMultiDelete) {
      serviceProviders
        .serviceProviderForAllDeleteRequest(RPC_URL, props.id)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          console.log(res);
          formState.isDeleteData = true;
          handleCloseModal("RPC's have been deleted successfully.");
        })
        .catch(error => {
          console.log("error");
          formState.isDeleteData = false;
          handleCloseModal(
            "An error has occured while deleting RPC's. Kindly, try again."
          );
        });
    } else {
      serviceProviders
        .serviceProviderForDeleteRequest(RPC_URL, props.id)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDeleteData = true;
          handleCloseModal(
            "RPC " +
              formState.dataToDelete["name"] +
              " has been deleted successfully."
          );
        })
        .catch(error => {
          console.log("error");
          formState.isDeleteData = false;
          handleCloseModal(
            "An error has occured while deleting RPC" +
              formState.dataToDelete["name"] +
              ". Kindly, try again."
          );
        });
    }
  };

  /** This checks if the state can be deleted and returns back an array with status and message*/
  const checkIfRPCCanBeDelete = async id => {
    let dataToReturn = {};
    let collegesCheckUrl =
      RPC_URL + "/" + id + "/" + strapiConstants.STRAPI_COLLEGES_INDERIECT_URL;
    await serviceProviders
      .serviceProviderForGetRequest(collegesCheckUrl)
      .then(res => {
        if (res.data.result.length) {
          dataToReturn = {
            status: false,
            message:
              "Cannot delete RPC " +
              formState.dataToDelete["name"] +
              " as it is linked to other College's"
          };
        } else {
          dataToReturn = {
            status: true,
            message: "Success"
          };
        }
      })
      .catch(error => {
        console.log("error", error);
        /** return error */
        dataToReturn = {
          status: false,
          message: "Error deleting RPC " + formState.dataToDelete["name"]
        };
      });
    return dataToReturn;
  };

  const handleClose = async event => {
    props.clearSelectedRow(true);
    props.closeModal();
  };

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
                  {props.isMultiDelete
                    ? "Are you sure you want to delete the selected RPC's?"
                    : "Are you sure you want to delete RPC " +
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
                    onClick={handleClose}
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

export default DeleteRpc;
