import React, { useState } from "react";
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
import useStyles from "./ApproveStudentStyles";

const STUDENTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENTS;

const ApprovedStudents = props => {
  const [open, setOpen] = React.useState(false);
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
          <div className={classes.blockpanel}>
            <Typography variant={"h2"} className={classes.textMargin}>
              {props.Data ? "Unapprove" : "Approve"}
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
                  {props.Data === false || props.isMulBlocked === true
                    ? "Are you sure you want to approve selected student?"
                    : null}
                  {props.Data === true || props.isUnMulBlocked === true
                    ? "Are you sure you want to unapprove selected student?"
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
  );
};

export default ApprovedStudents;
