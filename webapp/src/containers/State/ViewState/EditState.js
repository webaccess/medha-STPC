import React, { useState} from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { get } from "lodash";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import useStyles from "../StateStyles";
import * as serviceProviders from "../../../api/Axios";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as strapiUtilities from "../../../Utilities/StrapiUtilities";
import * as genericConstants from "../../../constants/GenericConstants";
import StateSchema from "../StateSchema";

const STATE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const STATE_SCEHMA_NAME = "state";

const EditState = props => {
  const [formState, setFormState] = useState({
    filterData: {},
    values: {},
    errors: {},
    isEditData: false,
    isValid: false,
    stateCounter: 0
  });

  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.values[STATE_SCEHMA_NAME] = props.dataToEdit["name"];
    formState.isEditData = false;
  }

  const handleCloseModal = () => {
    setFormState(formState => ({
      ...formState,
      getstates: [],
      filterData: {},
      values: {},
      errors: {},
      isEditData: false,
      isValid: false,
      stateCounter: 0
    }));

    if (formState.isEditData) {
      props.editEvent(true);
    } else {
      props.editEvent(false);
    }
    props.closeModal();
  };

  const handleChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      stateCounter: formState.stateCounter + 1
    }));
    if (formState.errors.hasOwnProperty(event.target.name)) {
      delete formState.errors[event.target.name];
    }
  };

  const handleSubmit = event => {
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      StateSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(formState.values, StateSchema);
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        StateSchema
      );
      formState.errors = formUtilities.setErrors(formState.values, StateSchema);
    }
    if (isValid) {
      /** CALL Put FUNCTION */
      console.log("formValid");
      postEditedData();
    } else {
      console.log("formInValid");
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
    event.preventDefault();
  };

  const postEditedData = () => {
    let postData = {};
    postData = strapiUtilities.addState(formState.values[STATE_SCEHMA_NAME]);
    serviceProviders
      .serviceProviderForPutRequest(STATE_URL, props.id, postData)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          isValid: true
        }));
        formState.isEditData = true;
        handleCloseModal();
      })
      .catch(error => {
        console.log("error");
        formState.isEditData = false;
        handleCloseModal();
      });
  };

  const hasError = field => (formState.errors[field] ? true : false);
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
            {genericConstants.EDIT_TEXT}
          </Typography>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item sm>
                <TextField
                  fullWidth
                  id={get(StateSchema[STATE_SCEHMA_NAME], "id")}
                  label={get(StateSchema[STATE_SCEHMA_NAME], "label")}
                  name={STATE_SCEHMA_NAME}
                  value={formState.values[STATE_SCEHMA_NAME] || ""}
                  onChange={handleChange}
                  type={get(StateSchema[STATE_SCEHMA_NAME], "type")}
                  variant="outlined"
                  margin="normal"
                  placeholder={get(
                    StateSchema[STATE_SCEHMA_NAME],
                    "placeholder"
                  )}
                  error={hasError(STATE_SCEHMA_NAME)}
                  helperText={
                    hasError(STATE_SCEHMA_NAME)
                      ? formState.errors[STATE_SCEHMA_NAME].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </Grid>
              <Grid item xs>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  {genericConstants.SAVE_BUTTON_TEXT}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Fade>
    </Modal>
  );
};

export default EditState;
