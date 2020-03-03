import React, { useState, useEffect } from "react";

import { TextField, Button, Grid, Typography } from "@material-ui/core";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useStyles from "./ViewRpcStyles";
import * as serviceProviders from "../../../api/Axios";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as strapiUtilities from "../../../Utilities/StrapiUtilities";

import * as genericConstants from "../../../constants/GenericConstants";
import AddRpcSchema from "../AddRpcSchema";
import { get } from "lodash";

const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
// const ZONE_SCHEMA_NAME = "zoneName";
// const STATE_SCEHMA_NAME = "stateName";

const RPC_SCHEMA_NAME = "rpcName";
const STATE_SCHEMA_NAME = "stateName";
const ZONE_SCHEMA_NAME = "zoneName";
const COLLEGE_SCHEMA_NAME = "collegeName";

const EditRpc = props => {
  const classes = useStyles();
  const [formState, setFormState] = useState({
    getstates: [],
    getzones: [],
    getrpcs: [],
    filterData: {},
    values: {},
    errors: {},
    isEditData: false,
    isValid: false,
    stateCounter: 0
  });
  const hasError = field => (formState.errors[field] ? true : false);
  // console.log("datatoedit-->>", props.dataToEdit["zone"]["name"]);

  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.values[RPC_SCHEMA_NAME] = props.dataToEdit["name"];
    formState.values[ZONE_SCHEMA_NAME] = props.dataToEdit["zone"]["id"];
    formState.getzones = props.zones;
    formState.isEditData = false;
    console.log("print", formState);
  }
  console.log("zonedata-->>", formState.values[ZONE_SCHEMA_NAME]);
  const handleCloseModal = () => {
    setFormState(formState => ({
      ...formState,
      getstates: [],
      getzones: [],
      getrpcs: [],
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

  const handleChangeAutoComplete = (targetName, event, value) => {
    event.persist();
    if (value !== null) {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [targetName]: value.id
        },
        stateCounter: formState.stateCounter + 1
      }));
      if (formState.errors.hasOwnProperty(targetName)) {
        delete formState.errors[targetName];
      }
    } else {
      if (formState.values[targetName]) {
        delete formState.values[targetName];
      }
    }
  };

  const handleSubmit = event => {
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      AddRpcSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        AddRpcSchema
      );
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        AddRpcSchema
      );
      formState.errors = formUtilities.setErrors(
        formState.values,
        AddRpcSchema
      );
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
    let state = strapiUtilities.setState(formState.values[ZONE_SCHEMA_NAME]);
    postData = strapiUtilities.addZone(
      formState.values[ZONE_SCHEMA_NAME],
      state
    );
    serviceProviders
      .serviceProviderForPutRequest(ZONES_URL, props.id, postData)
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
                  id={get(AddRpcSchema[RPC_SCHEMA_NAME], "id")}
                  label={get(AddRpcSchema[RPC_SCHEMA_NAME], "label")}
                  name={RPC_SCHEMA_NAME}
                  value={formState.values[RPC_SCHEMA_NAME] || ""}
                  onChange={handleChange}
                  type={get(AddRpcSchema[RPC_SCHEMA_NAME], "type")}
                  variant="outlined"
                  margin="normal"
                  placeholder={get(
                    AddRpcSchema[RPC_SCHEMA_NAME],
                    "placeholder"
                  )}
                  error={hasError(RPC_SCHEMA_NAME)}
                  helperText={
                    hasError(RPC_SCHEMA_NAME)
                      ? formState.errors[RPC_SCHEMA_NAME].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </Grid>
              <Grid item sm>
                <Autocomplete
                  id="combo-box-demo"
                  options={formState.getzones}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete(ZONE_SCHEMA_NAME, event, value);
                  }}
                  defaultValue={formState.getzones[0]}
                  name={get(AddRpcSchema[ZONE_SCHEMA_NAME], "type")}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={hasError(ZONE_SCHEMA_NAME)}
                      helperText={
                        hasError(ZONE_SCHEMA_NAME)
                          ? formState.errors[ZONE_SCHEMA_NAME].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      name={ZONE_SCHEMA_NAME}
                      key={option => option.id}
                      label={get(AddRpcSchema[ZONE_SCHEMA_NAME], "label")}
                      variant="outlined"
                      className={classes.autoCompleteField}
                    />
                  )}
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
export default EditRpc;
