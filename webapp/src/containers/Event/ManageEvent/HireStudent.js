import React, { useState } from "react";
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
  console.log("Hired Student id", props.id);

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
      props.hiredSuccessfully(true);
    } else {
      props.hiredSuccessfully(false);
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
              {genericConstants.HIRE_BUTTON_TEXT}
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
                  <p>Are you sure you want Hire this Student?</p>
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
        </div>
      </Fade>
    </Modal>
  );
};
export default HireStudent;
