import React, { useState, useContext } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Modal,
  Backdrop,
  Fade
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton, GrayButton } from "../../../components";
import useStyles from "../../ContainerStyles/ModalPopUpStyles";
import LoaderContext from "../../../context/LoaderContext";

const EVENT_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;
const EVENT_ID = "UserName";

const DeleteUser = props => {
  const { setLoaderStatus } = useContext(LoaderContext);
  const [formState, setFormState] = useState({
    isDeleteData: false,
    isValid: false,
    stateCounter: 0,
    values: {},
    dataToDelete: {}
  });

  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.values[EVENT_ID] = props.id;
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
    setLoaderStatus(true);
    props.clearSelectedRow(true);
    deleteData();
    event.preventDefault();
  };

  const deleteData = () => {
    if (props.isMultiDelete) {
      serviceProviders
        .serviceProviderForAllDeleteRequest(EVENT_URL, props.id)
        .then(res => {
          setLoaderStatus(false);
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDeleteData = true;
          handleCloseModal("Events has been deleted successfully");
        })
        .catch(error => {
          setLoaderStatus(false);
          console.log("error", error);
          formState.isDeleteData = false;
          handleCloseModal(
            "An error has occured while deleting events. Kindly, try again"
          );
        });
    } else {
      serviceProviders
        .serviceProviderForDeleteRequest(EVENT_URL, props.id)
        .then(res => {
          setLoaderStatus(false);
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDeleteData = true;
          handleCloseModal(
            "Event " +
              formState.dataToDelete["name"] +
              " has been deleted successfully"
          );
        })
        .catch(error => {
          setLoaderStatus(false);
          console.log("error");
          formState.isDeleteData = false;
          handleCloseModal(
            "An error has occured while deleting event" +
              formState.dataToDelete["name"] +
              ". Kindly, try again"
          );
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
                      <p>
                        Are you sure you want to delete "{props.seletedUser}"
                        Events?
                      </p>
                    ) : (
                      <p>
                        Are you sure you want to delete event "
                        {props.dataToDelete["name"]}"?
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
