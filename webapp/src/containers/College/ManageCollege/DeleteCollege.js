import React, { useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import CloseIcon from "@material-ui/icons/Close";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import useStyles from "./DeleteCollegeStyles";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton } from "../../../components";

const COLLEGE_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
const COLLEGE_ID = "id";

const DeleteZone = props => {
  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = useState({
    isDeleteData: false,
    isValid: false,
    stateCounter: 0,
    values: {},
    dataToDelete: {}
  });

  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.values[COLLEGE_ID] = props.id;
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
      status = await checkIfMultiCollegeCanBeDelete();
    } else {
      status = await checkIfCollegeCanBeDelete(props.id);
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

  const checkIfMultiCollegeCanBeDelete = async () => {
    let dataToSent = {};
    let isErrorCounter = 0;
    for (let i in props.id) {
      let status = await checkIfCollegeCanBeDelete(props.id[i]);
      if (!status["status"]) {
        isErrorCounter += 1;
        break;
      }
    }
    if (isErrorCounter > 0) {
      dataToSent = {
        status: false,
        message: "Error removing selected Colleges"
      };
    } else {
      dataToSent = { status: true, message: "Success" };
    }
    return dataToSent;
  };

  /** This checks if the state can be deleted and returns back an array with status and message*/
  const checkIfCollegeCanBeDelete = async id => {
    let dataToReturn = {};
    let studentsCheckUrl =
      COLLEGE_URL + "/" + id + "/" + strapiConstants.STRAPI_STUDENT;
    await serviceProviders
      .serviceProviderForGetRequest(studentsCheckUrl)
      .then(res => {
        if (res.data.result.length) {
          dataToReturn = {
            status: false,
            message:
              "Cannot remove College " +
              formState.dataToDelete["name"] +
              " as it is linked to other Students"
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
          message: "Error removing College " + formState.dataToDelete["name"]
        };
      });
    return dataToReturn;
  };

  const deleteData = () => {
    if (props.isMultiDelete) {
      serviceProviders
        .serviceProviderForAllDeleteRequest(COLLEGE_URL, props.id)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          console.log(res);
          formState.isDeleteData = true;
          handleCloseModal("Colleges successfully removed");
        })
        .catch(error => {
          console.log("error");
          formState.isDeleteData = false;
          handleCloseModal("Error removing selected Colleges");
        });
    } else {
      serviceProviders
        .serviceProviderForDeleteRequest(COLLEGE_URL, props.id)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDeleteData = true;
          handleCloseModal(
            "College " +
              formState.dataToDelete["name"] +
              " successfully removed"
          );
        })
        .catch(error => {
          console.log("error");
          formState.isDeleteData = false;
          handleCloseModal(
            "Error removing College " + formState.dataToDelete["name"]
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
                    ? "Are you sure you want to remove " +
                      props.id.length +
                      " Colleges?"
                    : "Are you sure you want to remove College " +
                      formState.dataToDelete["name"] +
                      "?"}
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
          <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </Fade>
    </Modal>
  );
};

export default DeleteZone;
