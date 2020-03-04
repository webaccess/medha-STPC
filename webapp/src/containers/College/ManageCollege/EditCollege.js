import React, { useState, useEffect } from "react";

import {
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Divider,
  CardActions
} from "@material-ui/core";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useStyles from "./EditCollegeStyles";
import * as serviceProviders from "../../../api/Axios";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as strapiUtilities from "../../../Utilities/StrapiUtilities";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import CollegeFormSchema from "../CollegeFormSchema";
import { get } from "lodash";
import { GreenButton, GrayButton } from "../../../components";

const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const STREAMS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;
const USERS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;
const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const COLLEGES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;

const STATE_SCEHMA_NAME = "stateName";
const COLLEGE_NAME = "collegeName";
const COLLEGE_CODE = "collegeCode";
const ADDRESS = "address";
const STATE = "state";
const ZONE = "zone";
const RPC = "rpc";
const CONTACT_NUMBER = "contactNumber";
const COLLEGE_EMAIL = "collegeEmail";
const PRINCIPAL = "principal";
const ADMINS = "admins";
const STREAMS = "streams";

const EditCollege = props => {
  const [formState, setFormState] = useState({
    filterData: {},
    values: {},
    errors: {},
    isEditData: false,
    isValid: false,
    stateCounter: 0,
    states: [],
    user: [],
    zones: [],
    rpcs: [],
    streamsData: []
  });
  const inputLabel = React.useRef(null);

  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    if (props.dataToEdit["name"]) {
      formState.values[COLLEGE_NAME] = props.dataToEdit["name"];
    }
    if (props.dataToEdit["college_code"]) {
      formState.values[COLLEGE_CODE] = props.dataToEdit["college_code"];
    }
    if (props.dataToEdit["address"]) {
      formState.values[ADDRESS] = props.dataToEdit["address"];
    }
    if (props.dataToEdit["rpc"] && props.dataToEdit["rpc"]["zone"]) {
      formState.values[ZONE] = props.dataToEdit["rpc"]["zone"];
      formState.values[STATE] = props.dataToEdit["state"];
      formState.zones = props.zonesForEdit;
      formState.rpcs = props.rpcsForEdit;
      // getState(props.dataToEdit["rpc"]["zone"]);
    }
    if (props.dataToEdit["rpc"]) {
      formState.values[RPC] = props.dataToEdit["rpc"]["id"];
    }
    if (props.dataToEdit["contact_number"]) {
      formState.values[CONTACT_NUMBER] = props.dataToEdit["contact_number"];
    }
    if (props.dataToEdit["college_email"]) {
      formState.values[COLLEGE_EMAIL] = props.dataToEdit["college_email"];
    }
    if (props.dataToEdit["principal"]) {
      formState.values[PRINCIPAL] = props.dataToEdit["principal"]["id"];
    }
    /** This needs to change for multiselect */
    if (props.dataToEdit["admins"] && props.dataToEdit["admins"].length) {
      formState.values[ADMINS] = props.dataToEdit["admins"]["id"];
    }
    /** This needs to change for multiselect */
    if (props.dataToEdit["streams"] && props.dataToEdit["streams"].length) {
      formState.values[STREAMS] = props.dataToEdit["streams"]["id"];
    }

    formState.isEditData = false;
    formState.states = props.statesData;
    formState.user = props.userData;
    formState.streamsData = props.streamsDataForEdit;
  }

  /** This is used for changing values when the state changes . It gets the value for zones corresponding to the states */
  useEffect(() => {
    let url =
      STATES_URL +
      "/" +
      formState.values[STATE] +
      "/" +
      strapiConstants.STRAPI_ZONES;
    serviceProviders
      .serviceProviderForGetRequest(url)
      .then(res => {
        if (Array.isArray(res.data)) {
          setFormState(formState => ({
            ...formState,
            zones: res.data[0].zones
          }));
        } else {
          setFormState(formState => ({
            ...formState,
            zones: res.data.zones
          }));
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  }, [formState.values[STATE]]);

  /** This is used for changing values when the zone changes . It gets the value for rpcs corresponding to the zones */
  useEffect(() => {
    let url =
      ZONES_URL +
      "/" +
      formState.values[ZONE] +
      "/" +
      strapiConstants.STRAPI_RPCS;
    serviceProviders
      .serviceProviderForGetRequest(url)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          rpcs: res.data.rpcs
        }));
      })
      .catch(error => {
        console.log("error", error);
      });
  }, [formState.values[ZONE]]);

  const handleCloseModal = () => {
    setFormState(formState => ({
      ...formState,
      filterData: {},
      values: {},
      errors: {},
      isEditData: false,
      isValid: false,
      stateCounter: 0,
      states: [],
      user: [],
      zones: [],
      rpcs: [],
      streamsData: []
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
      CollegeFormSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        CollegeFormSchema
      );
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        CollegeFormSchema
      );
      formState.errors = formUtilities.setErrors(
        formState.values,
        CollegeFormSchema
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
    let postData = strapiUtilities.addCollege(
      formState.values[COLLEGE_NAME],
      formState.values[COLLEGE_CODE],
      formState.values[ADDRESS],
      formState.values[CONTACT_NUMBER],
      formState.values[COLLEGE_EMAIL],
      formState.values[PRINCIPAL] ? formState.values[PRINCIPAL] : null,
      formState.values[RPC] ? formState.values[RPC] : null
    );
    serviceProviders
      .serviceProviderForPutRequest(COLLEGES_URL, props.id, postData)
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

  const handleChangeAutoComplete = (targetName, event, value) => {
    if (targetName === STATE) {
      delete formState.values[ZONE];
      delete formState.values[RPC];
      setFormState(formState => ({
        ...formState,
        zones: [],
        rpcs: [],
        stateCounter: formState.stateCounter + 1
      }));
    }
    if (targetName === ZONE) {
      delete formState.values[RPC];
      setFormState(formState => ({
        ...formState,
        rpcs: [],
        stateCounter: formState.stateCounter + 1
      }));
    }
    console.log(formState);
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
            {genericConstants.EDIT_COLLEGE_TEXT}
          </Typography>
          <div className={classes.edit_dialog}>
            <Grid item xs={12}>
              <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      id={get(CollegeFormSchema[COLLEGE_NAME], "id")}
                      label={get(CollegeFormSchema[COLLEGE_NAME], "label")}
                      margin="normal"
                      name={COLLEGE_NAME}
                      onChange={handleChange}
                      required
                      type={get(CollegeFormSchema[COLLEGE_NAME], "type")}
                      value={formState.values[COLLEGE_NAME] || ""}
                      error={hasError(COLLEGE_NAME)}
                      helperText={
                        hasError(COLLEGE_NAME)
                          ? formState.errors[COLLEGE_NAME].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      id={get(CollegeFormSchema[COLLEGE_CODE], "id")}
                      label={get(CollegeFormSchema[COLLEGE_CODE], "label")}
                      margin="normal"
                      name={COLLEGE_CODE}
                      onChange={handleChange}
                      required
                      value={formState.values[COLLEGE_CODE] || ""}
                      error={hasError(COLLEGE_CODE)}
                      helperText={
                        hasError(COLLEGE_CODE)
                          ? formState.errors[COLLEGE_CODE].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      id={get(CollegeFormSchema[ADDRESS], "id")}
                      label={get(CollegeFormSchema[ADDRESS], "label")}
                      margin="normal"
                      name={ADDRESS}
                      onChange={handleChange}
                      required
                      value={formState.values[ADDRESS] || ""}
                      error={hasError(ADDRESS)}
                      helperText={
                        hasError(ADDRESS)
                          ? formState.errors[ADDRESS].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel
                        ref={inputLabel}
                        id="demo-simple-select-outlined-label"
                      >
                        {/* State */}
                      </InputLabel>
                      <Autocomplete
                        id={get(CollegeFormSchema[STATE], "id")}
                        options={formState.states}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(STATE, event, value);
                        }}
                        defaultValue={
                          formState.states[
                            formState.states.findIndex(function(item, i) {
                              return item.id === formState.values[STATE];
                            })
                          ]
                        }
                        name={STATE}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError(STATE)}
                            helperText={
                              hasError(STATE)
                                ? formState.errors[STATE].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            value={option => option.id}
                            name={STATE}
                            key={option => option.id}
                            label={get(CollegeFormSchema[STATE], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel
                        ref={inputLabel}
                        id="demo-simple-select-outlined-label"
                      >
                        {/* Zone */}
                      </InputLabel>

                      <Autocomplete
                        id={get(CollegeFormSchema[ZONE], "id")}
                        options={formState.zones}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(ZONE, event, value);
                        }}
                        defaultValue={
                          formState.zones[
                            formState.zones.findIndex(function(item, i) {
                              return item.id === formState.values[ZONE];
                            })
                          ]
                        }
                        name={ZONE}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError(ZONE)}
                            helperText={
                              hasError(ZONE)
                                ? formState.errors[ZONE].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            value={option => option.id}
                            name={ZONE}
                            key={option => option.id}
                            label={get(CollegeFormSchema[ZONE], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel
                        ref={inputLabel}
                        id="demo-simple-select-outlined-label"
                      >
                        {/* RPCs */}
                      </InputLabel>

                      <Autocomplete
                        id={get(CollegeFormSchema[RPC], "id")}
                        options={formState.rpcs}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(RPC, event, value);
                        }}
                        defaultValue={
                          formState.rpcs[
                            formState.rpcs.findIndex(function(item, i) {
                              return item.id === formState.values[RPC];
                            })
                          ]
                        }
                        name={RPC}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError(RPC)}
                            helperText={
                              hasError(RPC)
                                ? formState.errors[RPC].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            value={option => option.id}
                            name={RPC}
                            key={option => option.id}
                            label={get(CollegeFormSchema[RPC], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      name={CONTACT_NUMBER}
                      onChange={handleChange}
                      required
                      value={formState.values[CONTACT_NUMBER] || ""}
                      error={hasError(CONTACT_NUMBER)}
                      helperText={
                        hasError(CONTACT_NUMBER)
                          ? formState.errors[CONTACT_NUMBER].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      label={get(CollegeFormSchema[COLLEGE_EMAIL], "label")}
                      id={get(CollegeFormSchema[COLLEGE_EMAIL], "id")}
                      name={COLLEGE_EMAIL}
                      onChange={handleChange}
                      required
                      value={formState.values[COLLEGE_EMAIL] || ""}
                      error={hasError(COLLEGE_EMAIL)}
                      helperText={
                        hasError(COLLEGE_EMAIL)
                          ? formState.errors[COLLEGE_EMAIL].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      variant="outlined"
                    />
                  </Grid>
                  <Divider />
                  <Grid item md={3} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel
                        ref={inputLabel}
                        id="demo-simple-select-outlined-label"
                      >
                        {/* principal */}
                      </InputLabel>
                      <Autocomplete
                        id={get(CollegeFormSchema[PRINCIPAL], "id")}
                        options={formState.user}
                        getOptionLabel={option => option.username}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(PRINCIPAL, event, value);
                        }}
                        defaultValue={
                          formState.user[
                            formState.user.findIndex(function(item, i) {
                              return item.id === formState.values[PRINCIPAL];
                            })
                          ]
                        }
                        name={PRINCIPAL}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError(PRINCIPAL)}
                            helperText={
                              hasError(PRINCIPAL)
                                ? formState.errors[PRINCIPAL].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            value={option => option.id}
                            name={PRINCIPAL}
                            key={option => option.id}
                            label={get(CollegeFormSchema[PRINCIPAL], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel
                        ref={inputLabel}
                        id="demo-simple-select-outlined-label"
                      >
                        {/* TPO */}
                      </InputLabel>
                      <Autocomplete
                        id={get(CollegeFormSchema[ADMINS], "id")}
                        options={formState.user}
                        getOptionLabel={option => option.username}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(ADMINS, event, value);
                        }}
                        name={ADMINS}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError(ADMINS)}
                            helperText={
                              hasError(ADMINS)
                                ? formState.errors[ADMINS].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            value={option => option.id}
                            name={ADMINS}
                            key={option => option.id}
                            label={get(CollegeFormSchema[ADMINS], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Divider />
                  <Grid item md={3} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel
                        ref={inputLabel}
                        id="demo-simple-select-outlined-label"
                      >
                        {/* Streams */}
                      </InputLabel>
                      <Autocomplete
                        id={get(CollegeFormSchema[STREAMS], "id")}
                        options={formState.streamsData}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(STREAMS, event, value);
                        }}
                        name={STREAMS}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError(STREAMS)}
                            helperText={
                              hasError(STREAMS)
                                ? formState.errors[STREAMS].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            value={option => option.id}
                            name={STREAMS}
                            key={option => option.id}
                            label={get(CollegeFormSchema[STREAMS], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <CardActions className={classes.btnspace}>
                  <GreenButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    className={classes.submitbtn}
                  >
                    {genericConstants.SAVE_BUTTON_TEXT}
                  </GreenButton>
                  <GrayButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    to={routeConstants.VIEW_COLLEGE}
                    className={classes.resetbtn}
                  >
                    {genericConstants.CANCEL_BUTTON_TEXT}
                  </GrayButton>
                </CardActions>
              </form>
            </Grid>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default EditCollege;
