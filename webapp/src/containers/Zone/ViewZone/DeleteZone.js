import React, { useState } from "react";
import { Grid, Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import useStyles from "./DeleteZoneStyles";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton, GrayButton } from "../../../components";
import * as strapiConstants from "../../../constants/StrapiApiConstants";

const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;

const DeleteZone = props => {
  const [formState, setFormState] = useState({
    isDeleteData: false,
    isValid: false,
    stateCounter: 0,
    values: {},
    dataToDelete: {}
  });

  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.dataToDelete = props.dataToDelete;
    formState.isDeleteData = false;
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
    status = await checkIfZoneCanBeDelete();
    if (status["status"]) {
      deleteData();
    } else {
      formState.isDeleteData = false;
      handleCloseModal(
        status["message"]
      ); /** returns back a message saying state cannot be deleted */
    }
  };

  /** This checks if the state can be deleted and returns back an array with status and message*/
  const checkIfZoneCanBeDelete = async () => {
    let dataToReturn = {};
    let collegesCheckUrl =
      ZONES_URL + "/" + props.id + "/" + strapiConstants.STRAPI_COLLEGES;
    await serviceProviders
      .serviceProviderForGetRequest(collegesCheckUrl)
      .then(res => {
        if (res.data.result.length) {
          dataToReturn = {
            status: false,
            message:
              "Cannot delete Zone " +
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
          message: "Error deleting Zone " + formState.dataToDelete["name"]
        };
      });
    return dataToReturn;
  };

  const deleteData = () => {
    serviceProviders
      .serviceProviderForDeleteRequest(ZONES_URL, props.id)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          isValid: true
        }));
        formState.isDeleteData = true;
        handleCloseModal(
          "Zone " + formState.dataToDelete["name"] + " successfully deleted"
        );
      })
      .catch(error => {
        console.log("error");
        formState.isDeleteData = false;
        handleCloseModal(
          "Error deleting Zone " + formState.dataToDelete["name"]
        );
      });
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
                  Are you sure you want to delete?
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
                    OK
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

export default DeleteZone;
