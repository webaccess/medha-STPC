import React, { useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton, GrayButton } from "../../../components";
import useStyles from "../../ContainerStyles/ModalPopUpStyles";

const REGISTRATION_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENT_REGISTRATION;

const HireStudent = props => {
  const [open, setOpen] = React.useState(false);

  const [formState, setFormState] = useState({
    isStudentHired: false,
    isValid: false,
    stateCounter: 0,
    values: {}
  });

  const handleCloseModal = () => {
    setOpen(false);
    setFormState(formState => ({
      ...formState,
      values: {},
      isStudentHired: false,
      isValid: false,
      stateCounter: 0
    }));

    if (formState.isStudentHired) {
      props.hiredSuccessfully(true, true, props.isHired, props.isUnHired);
    } else {
      props.hiredSuccessfully(false, true, props.isHired, props.isUnHired);
    }
    props.closeHireModal();
  };

  const handleSubmit = event => {
    setOpen(true);
    /** CALL Put FUNCTION */
    studentHired();
    event.preventDefault();
  };

  const studentHired = () => {
    var body;
    if (props.isHired) {
      body = {
        hired_at_event: true
      };
    }
    if (props.isUnHired) {
      body = {
        hired_at_event: false
      };
    }
    serviceProviders
      .serviceProviderForPutRequest(REGISTRATION_URL, props.id, body)
      .then(res => {
        formState.isStudentHired = true;
        handleCloseModal();
      })
      .catch(error => {
        console.log("error---", error);
        formState.isStudentHired = false;
        handleCloseModal();
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
              {props.isHired
                ? genericConstants.HIRE_BUTTON_TEXT
                : genericConstants.DEHIRE_BUTTON_TEXT}
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
                  {props.isHired ? (
                    <p>Are you sure you want Hire {props.studentName}?</p>
                  ) : (
                    <p>Are you sure you want Dehire {props.studentName}?</p>
                  )}
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
export default HireStudent;
