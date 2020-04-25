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
import * as serviceProviders from "../../../../api/Axios";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import { YellowButton, GrayButton } from "../../../../components";
import useStyles from "../../../ContainerStyles/ModalPopUpStyles";

const ApprovedStudents = props => {
  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = useState({
    isDataToApproveUnapprove: false,
    isValid: false,
    stateCounter: 0,
    values: {}
  });

  const handleCloseModal = (message = "") => {
    setOpen(false);
    if (typeof message !== "string") {
      message = "";
    }
    setFormState(formState => ({
      ...formState,
      values: {},
      isDataToApproveUnapprove: false,
      isValid: false,
      stateCounter: 0
    }));
    if (formState.isDataToApproveUnapprove) {
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
    props.clearSelectedRow(true);
    ApprovedStudent();
  };

  const ApprovedStudent = () => {
    if (props.isMultiApprove || props.isMultiUnapprove) {
      let urlForApproveUnapprove = "";
      if (props.isMultiUnapprove) {
        urlForApproveUnapprove =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_STUDENT +
          "/unapprove";
      } else {
        urlForApproveUnapprove =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_STUDENT +
          "/approve";
      }
      let postData = {
        ids: props.multiApproveUnapproveStudentIds
      };
      serviceProviders
        .serviceProviderForPostRequest(urlForApproveUnapprove, postData)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDataToApproveUnapprove = true;
          if (props.isMultiUnapprove) {
            handleCloseModal("The selected students have been unapproved.");
          } else {
            handleCloseModal("The selected students have been approved.");
          }
        })
        .catch(error => {
          console.log("error");
          formState.isDataToApproveUnapprove = false;
          if (props.isMultiUnapprove) {
            handleCloseModal(
              "An error has occured while unapproving the selected students. Kindly, try again."
            );
          } else {
            handleCloseModal(
              "An error has occured while approving the selected students. Kindly, try again."
            );
          }
        });
    } else {
      let urlForApproveUnapprove = "";
      if (props.verifiedByCollege) {
        urlForApproveUnapprove =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_STUDENT +
          "/unapprove";
      } else {
        urlForApproveUnapprove =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_STUDENT +
          "/approve";
      }
      let ids = [];
      ids.push(props.dataToApproveUnapprove["id"]);
      let postData = {
        ids: ids
      };
      serviceProviders
        .serviceProviderForPostRequest(urlForApproveUnapprove, postData)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDataToApproveUnapprove = true;
          if (props.verifiedByCollege) {
            handleCloseModal(
              "The student " + props.studentName + " has been unapproved."
            );
          } else {
            handleCloseModal(
              "The student " + props.studentName + " has been approved."
            );
          }
        })
        .catch(error => {
          console.log("error");
          formState.isDataToApproveUnapprove = false;
          if (props.verifiedByCollege) {
            handleCloseModal(
              "An error has occured while unapproving the student" +
                props.studentName +
                ". Kindly, try again."
            );
          } else {
            handleCloseModal(
              "An error has occured while approving the student" +
                props.studentName +
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
                {props.isMultiApprove || props.isMultiUnapprove
                  ? props.isMultiApprove
                    ? "Approve"
                    : "Unapprove"
                  : null}

                {!props.isMultiApprove && !props.isMultiUnapprove
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
                    {props.isMultiApprove || props.isMultiUnapprove
                      ? props.isMultiApprove
                        ? "Are you sure you want to approve the selected students"
                        : "Are you sure you want to Unapprove the selected students"
                      : null}
                    {!props.isMultiApprove && !props.isMultiUnapprove
                      ? props.verifiedByCollege
                        ? "Are you sure you want to unapprove the student " +
                          props.studentName
                        : "Are you sure you want to approve the student " +
                          props.studentName
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
