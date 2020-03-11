import React, { useState, useEffect } from "react";
import useStyles from "./AddEditCollegeStyles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import CollegeFormSchema from "../CollegeFormSchema";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import * as serviceProviders from "../../../api/Axios";
import { YellowButton, GrayButton } from "../../../components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory } from "react-router-dom";
import DynamicBar from "../../../components/DynamicBar/DynamicBar";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";

import { get } from "lodash";
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  TextField,
  Typography,
  Button,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import PropTypes from "prop-types";

const collegeName = "collegeName";
const collegeCode = "collegeCode";
const address = "address";
const state = "state";
const zone = "zone";
const rpc = "rpc";
const contactNumber = "contactNumber";
const collegeEmail = "collegeEmail";
const principal = "principal";
const admins = "admins";
const district = "district";
const block = "block";

/** Dynamic Bar */
const streams = "streams";
const strength = "strength";

const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const STREAMS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;
const USERS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;
const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const COLLEGES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
const DISTRICTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_DISTRICTS;

const AddEditCollege = props => {
  const history = useHistory();
  const classes = useStyles();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    states: [],
    isSuccess: false,
    dynamicBar: [{ index: Math.random() }],
    dynamicBarError: [],
    isEditCollege: props["editCollege"] ? props["editCollege"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0
  });
  const { className, ...rest } = props;
  const [user, setUser] = useState([]);
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [streamsData, setStreamsData] = useState([]);
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  /** Part for editing college */
  if (formState.isEditCollege && !formState.counter) {
    if (props["dataForEdit"]) {
      if (props["dataForEdit"]["name"]) {
        formState.values[collegeName] = props["dataForEdit"]["name"];
      }
      if (props["dataForEdit"]["college_code"]) {
        formState.values[collegeCode] = props["dataForEdit"]["college_code"];
      }
      if (props["dataForEdit"]["address"]) {
        formState.values[address] = props["dataForEdit"]["address"];
      }
      if (props["dataForEdit"]["contact_number"]) {
        formState.values[contactNumber] =
          props["dataForEdit"]["contact_number"];
      }
      if (props["dataForEdit"]["college_email"]) {
        formState.values[collegeEmail] = props["dataForEdit"]["college_email"];
      }
      if (props["dataForEdit"]["state"]) {
        formState.values[state] = props["dataForEdit"]["state"];
      }
      if (props["dataForEdit"]["district"]) {
        formState.values[district] = props["dataForEdit"]["district"];
      }
      if (props["dataForEdit"]["blocked"]) {
        formState.values[block] = props["dataForEdit"]["blocked"];
      }
      if (props["dataForEdit"]["rpc"] && props["dataForEdit"]["rpc"]["zone"]) {
        formState.values[zone] = props["dataForEdit"]["rpc"]["zone"];
      }
      if (props["dataForEdit"]["rpc"] && props["dataForEdit"]["rpc"]["id"]) {
        formState.values[rpc] = props["dataForEdit"]["rpc"]["id"];
      }
      if (
        props["dataForEdit"]["principal"] &&
        props["dataForEdit"]["principal"]["id"]
      ) {
        formState.values[principal] = props["dataForEdit"]["principal"]["id"];
      }
      if (
        props["dataForEdit"]["streamAndStrength"] &&
        props["dataForEdit"]["streamAndStrength"].length
      ) {
        let dynamicBar = [];
        for (let i in props["dataForEdit"]["streamAndStrength"]) {
          let tempDynamicBarrValue = {};
          tempDynamicBarrValue["index"] = Math.random();
          tempDynamicBarrValue[streams] =
            props["dataForEdit"]["streamAndStrength"][i]["streams"]["stream"][
              "id"
            ];
          tempDynamicBarrValue[strength] = props["dataForEdit"][
            "streamAndStrength"
          ][i]["streams"]["strength"].toString();
          dynamicBar.push(tempDynamicBarrValue);
        }
        formState.dynamicBar = dynamicBar;
      }
      console.log(formState);
      formState.counter += 1;
    }
  }

  /** Here we initialize our data */
  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(USERS_URL)
      .then(res => {
        setUser(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(STATES_URL)
      .then(res => {
        formState.states = res.data.result;
        setStates(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(STREAMS_URL)
      .then(res => {
        setStreamsData(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(DISTRICTS_URL)
      .then(res => {
        setDistricts(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
  }, []);

  /** This gets data into zones when we change the state */
  useEffect(() => {
    async function fetchData() {
      let url =
        STATES_URL +
        "/" +
        formState.values[state] +
        "/" +
        strapiConstants.STRAPI_ZONES;
      await serviceProviders
        .serviceProviderForGetRequest(url)
        .then(res => {
          if (Array.isArray(res.data)) {
            setZones(res.data[0].result);
          } else {
            setZones(res.data.result);
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    }
    if (formState.values[state]) {
      fetchData();
    }
    return () => {};
  }, [formState.values[state]]);

  useEffect(() => {
    async function fetchData() {
      let url =
        ZONES_URL +
        "/" +
        formState.values[zone] +
        "/" +
        strapiConstants.STRAPI_RPCS;
      await serviceProviders
        .serviceProviderForGetRequest(url)
        .then(res => {
          if (Array.isArray(res.data)) {
            setRpcs(res.data[0].result);
          } else {
            setRpcs(res.data.result);
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    }
    if (formState.values[zone]) {
      fetchData();
    }
    return () => {};
  }, [formState.values[zone]]);

  /** Handle change for text fields */
  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value
      },
      touched: {
        ...formState.touched,
        [e.target.name]: true
      }
    }));
    if (formState.errors.hasOwnProperty(e.target.name)) {
      delete formState.errors[e.target.name];
    }
  };

  /** Handle change for autocomplete fields */
  const handleChangeAutoComplete = (eventName, event, value) => {
    /**TO SET VALUES OF AUTOCOMPLETE */
    if (value !== null) {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [eventName]: value.id
        },
        touched: {
          ...formState.touched,
          [eventName]: true
        }
      }));

      /** This is used to remove any existing errors if present in auto complete */
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
    } else {
      /** This is used to remove clear out data form auto complete when we click cross icon of auto complete */
      delete formState.values[eventName];
    }
  };

  /** Dynamic bar */
  const addNewRow = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      dynamicBar: [...formState.dynamicBar, { index: Math.random() }]
    }));
  };
  const clickOnDelete = (record, index) => {
    setFormState(formState => ({
      ...formState,
      dynamicBar: formState.dynamicBar.filter(r => r !== record)
    }));
  };

  /** Handling multi select values for dynamic bar */
  const handleChangeForDynamicGrid = (
    eventName,
    event,
    selectedValueForAutoComplete,
    dynamicGridValue,
    isAutoComplete,
    isTextBox
  ) => {
    event.persist();
    /**TO SET VALUES OF AUTOCOMPLETE */
    if (isAutoComplete) {
      if (selectedValueForAutoComplete !== null) {
        setFormState(formState => ({
          ...formState,
          dynamicBar: formState.dynamicBar.map(r => {
            if (r["index"] === dynamicGridValue["index"]) {
              r[eventName] = selectedValueForAutoComplete["id"];
              return r;
            } else {
              return r;
            }
          })
        }));
      } else {
        /** This is used to remove clear out data form auto complete when we click cross icon of auto complete */
        setFormState(formState => ({
          ...formState,
          dynamicBar: formState.dynamicBar.map(r => {
            if (r["index"] === dynamicGridValue["index"]) {
              delete r[eventName];
              return r;
            } else {
              return r;
            }
          })
        }));
      }
    }
    if (isTextBox) {
      setFormState(formState => ({
        ...formState,
        dynamicBar: formState.dynamicBar.map(r => {
          if (r["index"] === dynamicGridValue["index"]) {
            r[eventName] = event.target.value;
            if (r[eventName] === "") {
              delete r[eventName];
            }
            return r;
          } else {
            return r;
          }
        })
      }));
    }
    /** Clear errors if any */
    formState.dynamicBarError.map(errorValues => {
      if (errorValues["index"] === dynamicGridValue["index"]) {
        delete errorValues[eventName];
      }
    });
  };

  /** Validate DynamicGrid */
  const validateDynamicGridValues = () => {
    let validationCounter = 0;
    /** Empty the error array of dynamic bar */
    formState.dynamicBarError = [];
    formState.dynamicBar.map(value => {
      let valueToPutInDynmicBarError = {};
      valueToPutInDynmicBarError["index"] = value["index"];
      /** Validate dynamikc bar */
      if (value.hasOwnProperty(streams) && !value.hasOwnProperty(strength)) {
        valueToPutInDynmicBarError[strength] =
          "Strength is required as Stream is present";
        validationCounter += 1;
      } else if (
        value.hasOwnProperty(strength) &&
        !value.hasOwnProperty(streams)
      ) {
        valueToPutInDynmicBarError[streams] =
          "Stream is required as Strength is present";
        validationCounter += 1;
      }
      formState.dynamicBarError.push(valueToPutInDynmicBarError);
    });
    if (validationCounter > 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = event => {
    /** Validate DynamicGrid */
    let isDynamicBarValid;
    isDynamicBarValid = validateDynamicGridValues();
    /** Validate rest other valuesv */
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
    /** Check if both form and dynamicBar id valid */
    if (isValid && isDynamicBarValid) {
      postCollegeData();
      /** Set state to reload form */
      setFormState(formState => ({
        ...formState,
        isValid: true
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
    event.preventDefault();
  };

  const hasError = field => (formState.errors[field] ? true : false);

  const checkErrorInDynamicBar = (field, currentDynamicBarValue) => {
    let errorData = { error: false, value: "" };
    if (formState.dynamicBarError.length) {
      formState.dynamicBarError.map(barErrorValue => {
        if (barErrorValue["index"] === currentDynamicBarValue["index"]) {
          if (barErrorValue.hasOwnProperty(field)) {
            errorData.error = true;
            errorData.value = barErrorValue[field];
          }
        }
      });
    }
    return errorData;
  };

  const getDynamicBarData = () => {
    let streamStrengthArrayValues = [];
    let id = 0;
    formState.dynamicBar.map(field => {
      let streamStrengthValue = {};
      if (field.hasOwnProperty(streams) && field.hasOwnProperty(strength)) {
        streamStrengthValue["id"] = id;
        streamStrengthValue["stream"] = field[streams];
        streamStrengthValue["strength"] = parseInt(field[strength]);
        streamStrengthArrayValues.push(streamStrengthValue);
      }
    });
    return streamStrengthArrayValues;
  };

  const postCollegeData = async () => {
    let streamStrengthArray = [];
    streamStrengthArray = getDynamicBarData();
    let postData = databaseUtilities.addCollege(
      formState.values[collegeName],
      formState.values[collegeCode],
      formState.values[address],
      formState.values[contactNumber],
      formState.values[collegeEmail].toLowerCase(),
      formState.values[block] ? formState.values[block] : false,
      formState.values[principal] ? formState.values[principal] : null,
      formState.values[rpc] ? formState.values[rpc] : null,
      formState.values[district] ? formState.values[district] : null,
      streamStrengthArray
    );

    if (formState.isEditCollege) {
      serviceProviders
        .serviceProviderForPutRequest(
          COLLEGES_URL,
          formState.dataForEdit["id"],
          postData
        )
        .then(res => {
          history.push({
            pathname: routeConstants.VIEW_COLLEGE,
            fromeditCollege: true,
            isDataEdited: true,
            editResponseMessage: "",
            editedData: {}
          });
        })
        .catch(error => {
          console.log(error.response);
          history.push({
            pathname: routeConstants.VIEW_COLLEGE,
            fromeditCollege: true,
            isDataEdited: false,
            editResponseMessage: "",
            editedData: {}
          });
        });
    } else {
      serviceProviders
        .serviceProviderForPostRequest(COLLEGES_URL, postData)
        .then(res => {
          history.push({
            pathname: routeConstants.VIEW_COLLEGE,
            fromAddCollege: true,
            isDataAdded: true,
            addResponseMessage: "",
            addedData: {}
          });
        })
        .catch(error => {
          history.push({
            pathname: routeConstants.VIEW_COLLEGE,
            fromAddCollege: true,
            isDataAdded: false,
            addResponseMessage: "",
            addedData: {}
          });
        });
    }
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {formState.isEditCollege
            ? genericConstants.EDIT_COLLEGE_TEXT
            : genericConstants.ADD_COLLEGE_TEXT}
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card className={classes.root} variant="outlined">
          <CardContent>
            <Grid container spacing={3} className={classes.formgrid}>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  // helperText="Please specify the college name"
                  id={get(CollegeFormSchema[collegeName], "id")}
                  label={get(CollegeFormSchema[collegeName], "label")}
                  name={collegeName}
                  onChange={handleChange}
                  placeholder={get(
                    CollegeFormSchema[collegeName],
                    "placeholder"
                  )}
                  required
                  type={get(CollegeFormSchema[collegeName], "type")}
                  value={formState.values[collegeName] || ""}
                  error={hasError(collegeName)}
                  helperText={
                    hasError(collegeName)
                      ? formState.errors[collegeName].map(error => {
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
                  id={get(CollegeFormSchema[collegeCode], "id")}
                  label={get(CollegeFormSchema[collegeCode], "label")}
                  name={collegeCode}
                  onChange={handleChange}
                  placeholder={get(
                    CollegeFormSchema[collegeCode],
                    "placeholder"
                  )}
                  required
                  value={formState.values[collegeCode] || ""}
                  error={hasError(collegeCode)}
                  helperText={
                    hasError(collegeCode)
                      ? formState.errors[collegeCode].map(error => {
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
                  label={get(CollegeFormSchema[collegeEmail], "label")}
                  id={get(CollegeFormSchema[collegeEmail], "id")}
                  name={collegeEmail}
                  onChange={handleChange}
                  placeholder={get(
                    CollegeFormSchema[collegeEmail],
                    "placeholder"
                  )}
                  required
                  value={formState.values[collegeEmail] || ""}
                  error={hasError(collegeEmail)}
                  helperText={
                    hasError(collegeEmail)
                      ? formState.errors[collegeEmail].map(error => {
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
                  <InputLabel ref={inputLabel} id="state-label">
                    {/* State */}
                  </InputLabel>
                  <Autocomplete
                    id={get(CollegeFormSchema[state], "id")}
                    options={states}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(state, event, value);
                    }}
                    /** This is used to set the default value to the auto complete */
                    value={
                      states[
                        states.findIndex(function(item, i) {
                          return item.id === formState.values[state];
                        })
                      ] || null
                    }
                    name={state}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(state)}
                        helperText={
                          hasError(state)
                            ? formState.errors[state].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                        placeholder={get(
                          CollegeFormSchema[state],
                          "placeholder"
                        )}
                        value={option => option.id}
                        name={state}
                        key={option => option.id}
                        label={get(CollegeFormSchema[state], "label")}
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
                  <InputLabel ref={inputLabel} id="zone-label">
                    {/* Zone */}
                  </InputLabel>

                  <Autocomplete
                    id={get(CollegeFormSchema[zone], "id")}
                    options={zones ? zones : <CircularProgress />}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(zone, event, value);
                    }}
                    /** This is used to set the default value to the auto complete */
                    value={
                      zones[
                        zones.findIndex(function(item, i) {
                          return item.id === formState.values[zone];
                        })
                      ] || null /** Please give a default " " blank value */
                    }
                    name={zone}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(zone)}
                        helperText={
                          hasError(zone)
                            ? formState.errors[zone].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                        placeholder={get(
                          CollegeFormSchema[zone],
                          "placeholder"
                        )}
                        value={option => option.id}
                        name={rpc}
                        key={option => option.id}
                        label={get(CollegeFormSchema[zone], "label")}
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
                  <InputLabel ref={inputLabel} id="rpcs-label">
                    {/* RPCs */}
                  </InputLabel>

                  <Autocomplete
                    id={get(CollegeFormSchema[rpc], "id")}
                    options={rpcs}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(rpc, event, value);
                    }}
                    name={rpc}
                    /** This is used to set the default value to the auto complete */
                    value={
                      rpcs[
                        rpcs.findIndex(function(item, i) {
                          return item.id === formState.values[rpc];
                        })
                      ] || null /** Please give a default " " blank value */
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(rpc)}
                        helperText={
                          hasError(rpc)
                            ? formState.errors[rpc].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                        placeholder={get(CollegeFormSchema[rpc], "placeholder")}
                        value={option => option.id}
                        name={rpc}
                        key={option => option.id}
                        label={get(CollegeFormSchema[rpc], "label")}
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
                  <InputLabel ref={inputLabel} id="districts-label">
                    {/* Districts */}
                  </InputLabel>

                  <Autocomplete
                    id={get(CollegeFormSchema[district], "id")}
                    options={districts}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(district, event, value);
                    }}
                    name={rpc}
                    /** This is used to set the default value to the auto complete */
                    value={
                      districts[
                        districts.findIndex(function(item, i) {
                          return item.id === formState.values[district];
                        })
                      ] || null /** Please give a default " " blank value */
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(district)}
                        helperText={
                          hasError(district)
                            ? formState.errors[district].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                        placeholder={get(
                          CollegeFormSchema[district],
                          "placeholder"
                        )}
                        value={option => option.id}
                        name={district}
                        key={option => option.id}
                        label={get(CollegeFormSchema[district], "label")}
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  id={get(CollegeFormSchema[address], "id")}
                  label={get(CollegeFormSchema[address], "label")}
                  name={address}
                  onChange={handleChange}
                  required
                  placeholder={get(CollegeFormSchema[address], "placeholder")}
                  value={formState.values[address] || ""}
                  error={hasError(address)}
                  helperText={
                    hasError(address)
                      ? formState.errors[address].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={3}>
              <Grid item md={3} xs={12}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  name={contactNumber}
                  onChange={handleChange}
                  required
                  placeholder={get(
                    CollegeFormSchema[contactNumber],
                    "placeholder"
                  )}
                  value={formState.values[contactNumber] || ""}
                  error={hasError(contactNumber)}
                  helperText={
                    hasError(contactNumber)
                      ? formState.errors[contactNumber].map(error => {
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
                  <InputLabel ref={inputLabel} id="principal-label">
                    {/* principal */}
                  </InputLabel>
                  {user.length ? (
                    <Autocomplete
                      id={get(CollegeFormSchema[principal], "id")}
                      options={user}
                      getOptionLabel={option => option.username}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(principal, event, value);
                      }}
                      /** This is used to set the default value to the auto complete */
                      value={
                        user[
                          user.findIndex(function(item, i) {
                            return item.id === formState.values[principal];
                          })
                        ] || null /** Please give a default " " blank value */
                      }
                      name={principal}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError(principal)}
                          helperText={
                            hasError(principal)
                              ? formState.errors[principal].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                          placeholder={get(
                            CollegeFormSchema[principal],
                            "placeholder"
                          )}
                          value={option => option.id}
                          name={principal}
                          key={option => option.id}
                          label={get(CollegeFormSchema[principal], "label")}
                          variant="outlined"
                        />
                      )}
                    />
                  ) : null}
                </FormControl>
              </Grid>
              {/** TPO */}
              <Grid item md={3} xs={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  className={classes.formControl}
                >
                  <InputLabel ref={inputLabel} id="admins-label">
                    {/* TPO */}
                  </InputLabel>
                  {user.length ? (
                    <Autocomplete
                      id={get(CollegeFormSchema[admins], "id")}
                      options={user}
                      getOptionLabel={option => option.username}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(admins, event, value);
                      }}
                      name={admins}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError(admins)}
                          helperText={
                            hasError(admins)
                              ? formState.errors[admins].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                          placeholder={get(
                            CollegeFormSchema[admins],
                            "placeholder"
                          )}
                          value={option => option.id}
                          name={principal}
                          key={option => option.id}
                          label={get(CollegeFormSchema[admins], "label")}
                          variant="outlined"
                        />
                      )}
                    />
                  ) : null}
                </FormControl>
              </Grid>
              <Divider />
              <Grid item md={3} xs={12}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        name={block}
                        checked={formState.values[block]}
                        onChange={handleChange}
                        value={formState.values[block]}
                        error={hasError(block)}
                        helperText={
                          hasError(block)
                            ? formState.errors[block].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                      />
                    }
                    label={get(CollegeFormSchema[block], "label")}
                  />
                </FormGroup>
              </Grid>
              <Grid item md={12} xs={12}>
                <Card>
                  <InputLabel htmlFor="outlined-stream-card" fullWidth>
                    {genericConstants.STREAMS_OFFERED_TEXT}
                  </InputLabel>

                  {formState.dynamicBar.map((val, idx) => {
                    let streamId = `stream-${idx}`,
                      strengthId = `strength-${idx}`;
                    return (
                      <Card id="outlined-stream-card" fullWidth>
                        <CardContent>
                          <Grid container spacing={3}>
                            <Grid item md xs>
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
                                  id={streamId}
                                  options={streamsData}
                                  getOptionLabel={option => option.name}
                                  onChange={(event, value) => {
                                    handleChangeForDynamicGrid(
                                      streams,
                                      event,
                                      value,
                                      val,
                                      true,
                                      false
                                    );
                                  }}
                                  data-id={idx}
                                  name={streamId}
                                  value={
                                    streamsData[
                                      streamsData.findIndex(function(item, i) {
                                        return (
                                          item.id ===
                                          formState.dynamicBar[idx][streams]
                                        );
                                      })
                                    ] || null
                                  }
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      value={option => option.id}
                                      name={streamId}
                                      error={
                                        checkErrorInDynamicBar(streams, val)[
                                          "error"
                                        ]
                                      }
                                      helperText={
                                        checkErrorInDynamicBar(streams, val)[
                                          "error"
                                        ]
                                          ? checkErrorInDynamicBar(
                                              streams,
                                              val
                                            )["value"]
                                          : null
                                      }
                                      placeholder={get(
                                        CollegeFormSchema[streams],
                                        "placeholder"
                                      )}
                                      key={option => option.id}
                                      label={get(
                                        CollegeFormSchema[streams],
                                        "label"
                                      )}
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </FormControl>
                            </Grid>
                            {/** Need to map streams with strength */}
                            <Grid item md xs>
                              <TextField
                                label="Strength"
                                name={strengthId}
                                variant="outlined"
                                fullWidth
                                data-id={idx}
                                id={strengthId}
                                value={
                                  formState.dynamicBar[idx][strength] || ""
                                }
                                error={
                                  checkErrorInDynamicBar(strength, val)["error"]
                                }
                                helperText={
                                  checkErrorInDynamicBar(strength, val)["error"]
                                    ? checkErrorInDynamicBar(strength, val)[
                                        "value"
                                      ]
                                    : null
                                }
                                placeholder={get(
                                  CollegeFormSchema[strength],
                                  "placeholder"
                                )}
                                onChange={event => {
                                  handleChangeForDynamicGrid(
                                    strength,
                                    event,
                                    null,
                                    val,
                                    false,
                                    true
                                  );
                                }}
                              />
                            </Grid>
                            <Grid item md xs>
                              {idx > 0 ? (
                                <DeleteForeverOutlinedIcon
                                  onClick={e => clickOnDelete(val, idx)}
                                />
                              ) : (
                                ""
                              )}
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    );
                  })}
                  <Divider />
                  <YellowButton
                    color="primary"
                    variant="contained"
                    className={classes.add_more_btn}
                    onClick={addNewRow}
                  >
                    {genericConstants.ADD_MORE_TEXT}
                  </YellowButton>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions className={classes.btnspace}>
            <YellowButton
              type="submit"
              color="primary"
              variant="contained"
              onClick={handleSubmit}
              className={classes.submitbtn}
            >
              {genericConstants.SAVE_BUTTON_TEXT}
            </YellowButton>
            <GrayButton
              color="primary"
              variant="contained"
              to={routeConstants.VIEW_COLLEGE}
              className={classes.resetbtn}
            >
              {genericConstants.CANCEL_BUTTON_TEXT}
            </GrayButton>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};
AddEditCollege.propTypes = {
  className: PropTypes.string
};
export default AddEditCollege;