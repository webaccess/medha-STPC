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

const DELETE_ACADEMIC_HISTORY_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACADEMIC_HISTORY;
const ACADEMIC_HISTORY_ID = "id";

const DeleteAcademicHistory = props => {
  const [formState, setFormState] = useState({
    isDeleteData: false,
    isValid: false,
    documentCounter: 0,
    values: {}
  });

  if (props.showModal && !formState.documentCounter) {
    formState.documentCounter = 0;
    formState.values[ACADEMIC_HISTORY_ID] = props.id;
    formState.isDeleteData = false;
  }

  const handleCloseModal = data => {
    setFormState(formState => ({
      ...formState,
      values: {},
      isDeleteData: false,
      isValid: false,
      documentCounter: 0
    }));
    console.log(formState.isDeleteData);
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
      .serviceProviderForDeleteRequest(DELETE_ACADEMIC_HISTORY_URL, props.id)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          isValid: true
        }));
        formState.isDeleteData = true;
        console.log(res.data);
        handleCloseModal(res.data.academic_year.name);
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
                  Do yo want to delete this field?
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

export default DeleteAcademicHistory;
