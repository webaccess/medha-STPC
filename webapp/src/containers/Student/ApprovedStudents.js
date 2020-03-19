import React, { useState } from "react";
import { Grid, Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import * as serviceProviders from "../../api/Axios";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import { YellowButton } from "../../components";
import useStyles from "./ManageStudentStyle";

const STUDENTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENTS;

const ApprovedStudents = props => {
  const [formState, setFormState] = useState({
    isDataBlock: false,
    isValid: false,
    stateCounter: 0,
    values: {}
  });
  const handleCloseModal = () => {
    setFormState(formState => ({
      ...formState,
      values: {},
      isDataBlock: false,
      isValid: false,
      stateCounter: 0
    }));

    if (formState.isDataBlock) {
      props.blockEvent(true);
    } else {
      props.blockEvent(false);
    }
    props.closeBlockModal();
  };

  const handleSubmit = event => {
    /** CALL Put FUNCTION */
    ApprovedStudent();
    event.preventDefault();
  };

  const ApprovedStudent = () => {
    var body;
    if (props.Data === true || props.isUnMulBlocked === true) {
      body = {
        verifiedByCollege: false
      };
    } else if (props.Data === false || props.isMulBlocked === true) {
      body = {
        verifiedByCollege: true
      };
    }

    if (props.isMulBlocked || props.isUnMulBlocked) {
      serviceProviders
        .serviceProviderForAllBlockRequest(STUDENTS_URL, props.id, body)
        .then(res => {
          formState.isDataBlock = true;
          handleCloseModal();
        })
        .catch(error => {
          console.log("error---", error);
          formState.isDataBlock = false;
          handleCloseModal();
        });
    } else {
      serviceProviders
        .serviceProviderForPutRequest(STUDENTS_URL, props.id, body)
        .then(res => {
          formState.isDataBlock = true;
          handleCloseModal();
        })
        .catch(error => {
          console.log("error", error);
          formState.isDataBlock = false;
          handleCloseModal();
        });
    }
  };

  const classes = useStyles();
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.getModel}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={props.getModel}>
        <div className={classes.paper}>
          <div className={classes.deletepanel}>
            <Typography variant={"h2"} className={classes.textMargin}>
              {props.Data ? "Unapprove" : "Approve"}
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
                  {props.Data === false || props.isMulBlocked === true
                    ? "Do you want to approved selected student"
                    : null}
                  {props.Data === true || props.isUnMulBlocked === true
                    ? "Do you want to Unapprove selected student"
                    : null}
                </Grid>
                <Grid item xs>
                  <YellowButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    {props.Data === true || props.isUnMulBlocked === true
                      ? "Unapprove"
                      : null}
                    {props.Data === false || props.isMulBlocked === true
                      ? "Approve"
                      : null}
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

export default ApprovedStudents;
