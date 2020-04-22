import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import * as serviceProviders from "../../api/Axios";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import { YellowButton, GrayButton } from "../../components";
import useStyles from "../ContainerStyles/ModalPopUpStyles";
const STUDENTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENTS;

const ApprovedStudents = props => {
  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = useState([]);
  const [formState, setFormState] = useState({
    isDataBlockUnblock: false,
    isValid: false,
    stateCounter: 0,
    values: {}
  });

  const handleCloseModal = (message = "") => {
    setOpen(false);
    /** This event handles the scenario when the pop up is closed just by clicking outside the popup 
    to ensure that only string value is passed to message variable */
    if (typeof message !== "string") {
      message = "";
    }
    setFormState(formState => ({
      ...formState,
      values: {},
      isDataBlockUnblock: false,
      isValid: false,
      stateCounter: 0
    }));
    if (formState.isDataBlockUnblock) {
      props.closeModal(true, message);
    } else {
      props.closeModal(false, message);
    }
  };

  const handleSubmit = event => {
    /** CALL Put FUNCTION */
    setOpen(true);
    event.preventDefault();
    event.persist();
    /** Calls checkIfStateCanBeDelete function to check whether the state can be deleted
      and returns back an opbject with status and message*/
    ApprovedStudent();
  };

  const ApprovedStudent = () => {
    if (props.isMultiBlock || props.isMultiUnblock) {
      let approve_url = "";
      if (props.isMultiUnblock) {
        approve_url =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_STUDENT +
          "/unapprove";
      } else {
        approve_url =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_STUDENT +
          "/approve";
      }
      let postData = {
        ids: props.multiBlockCollegeIds
      };
      serviceProviders
        .serviceProviderForPostRequest(approve_url, postData)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDataBlockUnblock = true;
          if (props.isMultiUnblock) {
            handleCloseModal("The students has been unapproved.");
          } else {
            handleCloseModal("The students has been approved.");
          }
        })
        .catch(error => {
          console.log("error");
          formState.isDataBlockUnblock = false;
          if (props.isMultiUnblock) {
            handleCloseModal(
              "An error has occured while unapproving the students. Kindly, try again."
            );
          } else {
            handleCloseModal(
              "An error has occured while approving the students. Kindly, try again."
            );
          }
        });
    } else {
      let approve_url = "";
      if (props.verifiedByCollege) {
        approve_url =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_STUDENT +
          "/unapprove";
      } else {
        approve_url =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_STUDENT +
          "/approve";
      }
      let ids = [];
      ids.push(props.dataToBlockUnblock["id"]);
      let postData = {
        ids: ids
      };
      serviceProviders
        .serviceProviderForPostRequest(approve_url, postData)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDataBlockUnblock = true;
          if (props.verifiedByCollege) {
            handleCloseModal(
              "The student " + props.cellName + " has been unapproved."
            );
          } else {
            handleCloseModal(
              "The student " + props.cellName + " has been approved."
            );
          }
        })
        .catch(error => {
          console.log("error");
          formState.isDataBlockUnblock = false;
          if (props.verifiedByCollege) {
            handleCloseModal(
              "An error has occured while unapproving the student" +
                props.cellName +
                ". Kindly, try again."
            );
          } else {
            handleCloseModal(
              "An error has occured while approving the student" +
                props.cellName +
                ". Kindly, try again."
            );
          }
        });
    }
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
                {props.isMultiBlock || props.isMultiUnblock
                  ? props.isMultiBlock
                    ? "Approve"
                    : "Unapprove"
                  : null}

                {!props.isMultiBlock && !props.isMultiUnblock
                  ? props.verifiedByCollege
                    ? "Unapprove"
                    : "Approve"
                  : null}
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
                    {props.isMultiBlock || props.isMultiUnblock
                      ? props.isMultiBlock
                        ? "Are you sure you want to approve " +
                          props.multiBlockCollegeIds.length +
                          " selected students"
                        : "Are you sure you want to Unapprove  " +
                          props.multiBlockCollegeIds.length +
                          " selected students"
                      : null}
                    {!props.isMultiBlock && !props.isMultiUnblock
                      ? props.verifiedByCollege
                        ? "Are you sure you want to Unapprove student " +
                          props.cellName
                        : "Are you sure you want to approve student " +
                          props.cellName
                      : null}
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

export default ApprovedStudents;
