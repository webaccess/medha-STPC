import React, { useState, useEffect } from "react";

import { TextField, Button, Grid, Typography } from "@material-ui/core";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useStyles from "./DeleteZoneStyles";
import * as serviceProviders from "../../../api/Axios";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as strapiUtilities from "../../../Utilities/StrapiUtilities";

import * as genericConstants from "../../../constants/GenericConstants";
import ZoneSchema from "../ZoneSchema";
import { get } from "lodash";
import { green } from "@material-ui/core/colors";
import { YellowButton } from "../../../components";

const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const ZONE_ID = "stateName";

const DeleteZone = props => {
  const [formState, setFormState] = useState({
    isDeleteData: false,
    isValid: false,
    stateCounter: 0,
    values: {}
  });

  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.values[ZONE_ID] = props.id;
    formState.isDeleteData = false;
  }

  const handleCloseModal = () => {
    setFormState(formState => ({
      ...formState,
      values: {},
      isDeleteData: false,
      isValid: false,
      stateCounter: 0
    }));

    if (formState.isDeleteData) {
      props.deleteEvent(true);
    } else {
      props.deleteEvent(false);
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
      .serviceProviderForDeleteRequest(ZONES_URL, props.id)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          isValid: true
        }));
        formState.isDeleteData = true;
        handleCloseModal();
      })
      .catch(error => {
        console.log("error");
        formState.isDeleteData = false;
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

export default DeleteZone;
