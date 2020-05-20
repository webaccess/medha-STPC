import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import useStyles from "../CommonStyles/DeleteStyles.js";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton } from "../../../components";

const EDUCATION_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EDUCATIONS;
const EDUCATION_ID = "education";

const DeleteEducation = props => {
  const [formState, setFormState] = useState({
    isDeleteData: false,
    isValid: false,
    educationCounter: 0,
    values: {}
  });

  console.log("props----->", props);
  if (props.showModal && !formState.educationCounter) {
    formState.educationCounter = 0;
    formState.values[EDUCATION_ID] = props.data.id;
    formState.isDeleteData = false;
  }

  const handleCloseModal = data => {
    setFormState(formState => ({
      ...formState,
      values: {},
      isDeleteData: false,
      isValid: false,
      educationCounter: 0
    }));

    if (formState.isDeleteData) {
      props.deleteEvent(true, data);
    } else {
      props.deleteEvent(false, data);
    }
    props.closeModal();
  };

  const handleSubmit = event => {
    /** CALL Put FUNCTION */
    deleteData();
    event.preventDefault();
  };

  const deleteData = () => {
    serviceProviders
      .serviceProviderForDeleteRequest(EDUCATION_URL, props.data.id)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          isValid: true
        }));
        formState.isDeleteData = true;
        handleCloseModal(res.data.qualification);
      })
      .catch(error => {
        console.log("error");
        formState.isDeleteData = false;
        handleCloseModal(error.response.data.message);
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
          <Typography variant={"h2"} className={classes.textMargin}>
            {genericConstants.DELETE_TEXT}
          </Typography>
          <div className={classes.edit_dialog}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item lg className={classes.deletemessage}>
                  Are you sure you want to delete education{" "}
                  {props.data.education} ?
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

export default DeleteEducation;
