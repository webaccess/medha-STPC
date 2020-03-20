import React, { useState } from "react";
import { Grid, Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import useStyles from "./DeleteRpcStyles";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton } from "../../../components";

const RPC_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;

const DeleteRpc = props => {
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
    event.preventDefault();
    event.persist();
    let status = {};
    /** Calls checkIfStateCanBeDelete function to check whether the state can be deleted
     and returns back an opbject with status and message*/
    status = await checkIfRPCCanBeDelete();
    if (status["status"]) {
      deleteData();
    } else {
      formState.isDeleteData = false;
      handleCloseModal(
        status["message"]
      ); /** returns back a message saying state cannot be deleted */
    }
  };

  const deleteData = () => {
    serviceProviders
      .serviceProviderForDeleteRequest(RPC_URL, props.id)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          isValid: true
        }));
        formState.isDeleteData = true;
        handleCloseModal(
          "RPC " + formState.dataToDelete["name"] + " successfully deleted"
        );
      })
      .catch(error => {
        console.log("error");
        formState.isDeleteData = false;
        handleCloseModal(
          "Error deleting RPC " + formState.dataToDelete["name"]
        );
      });
  };

  /** This checks if the state can be deleted and returns back an array with status and message*/
  const checkIfRPCCanBeDelete = async () => {
    let dataToReturn = {};
    let collegesCheckUrl =
      RPC_URL + "/" + props.id + "/" + strapiConstants.STRAPI_COLLEGES;
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
                  Do yo want to delete this field?
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

export default DeleteRpc;
