import React, { useState, useEffect, useContext } from "react";
import useStyles from "../../ContainerStyles/AddEditPageStyles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import CollegeFormSchema from "../CollegeFormSchema";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import * as serviceProviders from "../../../api/Axios";
import {
  YellowButton,
  GrayButton,
  ReadOnlyTextField
} from "../../../components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory } from "react-router-dom";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import { Auth as auth } from "../../../components";

import { get } from "lodash";
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Switch,
  Backdrop,
  Chip
} from "@material-ui/core";
import PropTypes from "prop-types";
import LoaderContext from "../../../context/LoaderContext";

const collegeName = "collegeName";
const collegeCode = "collegeCode";
const address = "address";
const state = "state";
const zone = "zone";
const rpc = "rpc";
const contactNumber = "contactNumber";
const collegeEmail = "collegeEmail";
const principal = "principal";
const tpos = "tpos";
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
const COLLEGES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
const DISTRICTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_DISTRICTS;

const AddEditCollege = props => {
  const history = useHistory();
  const classes = useStyles();
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);

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
    counter: 0,
    isStateClearFilter: false,
    showing: false,
    dataToShowForMultiSelect: [],
    isCollegeAdmin:
      auth.getUserInfo().role.name === "College Admin" ? true : false
  });
  const { className, ...rest } = props;
  const [user, setUser] = useState([]);
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [streamsData, setStreamsData] = useState([]);
  const [streamsDataBackup, setStreamsDataBackup] = useState([]);
  const inputLabel = React.useRef(null);

  const [collegeInfo, setCollegeInfo] = useState({
    college:
      auth.getUserInfo().role.name === "College Admin"
        ? auth.getUserInfo().college
        : {},
    state:
      auth.getUserInfo().role.name === "College Admin"
        ? auth.getUserInfo().state
        : {},
    rpc:
      auth.getUserInfo().role.name === "College Admin"
        ? auth.getUserInfo().rpc
        : {},
    zone:
      auth.getUserInfo().role.name === "College Admin"
        ? auth.getUserInfo().zone
        : {}
  });

  React.useEffect(() => {
    if (auth.getUserInfo().role.name === "Medha Admin") {
      setFormState(formState => ({
        ...formState,
        showing: true
      }));
    } else if (auth.getUserInfo().role.name === "College Admin") {
      setFormState(formState => ({
        ...formState,
        showing: false
      }));
    }
  }, []);

  /** Part for editing college */
  if (formState.isEditCollege && !formState.counter) {
    setLoaderStatus(true);
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
        formState.values[state] = props["dataForEdit"]["state"]["id"];
      }
      if (props["dataForEdit"]["district"]) {
        formState.values[district] = props["dataForEdit"]["district"]["id"];
      }
      if (props["dataForEdit"]["blocked"]) {
        formState.values[block] = props["dataForEdit"]["blocked"];
      }
      if (props["dataForEdit"]["zone"]) {
        formState.values[zone] = props["dataForEdit"]["zone"]["id"];
      }
      if (props["dataForEdit"]["rpc"]) {
        formState.values[rpc] = props["dataForEdit"]["rpc"]["id"];
      }
      if (
        props["dataForEdit"]["principal"] &&
        props["dataForEdit"]["principal"]["id"]
      ) {
        formState.values[principal] = props["dataForEdit"]["principal"]["id"];
      }
      if (
        props["dataForEdit"]["stream_strength"] &&
        props["dataForEdit"]["stream_strength"].length
      ) {
        let dynamicBar = [];
        for (let i in props["dataForEdit"]["stream_strength"]) {
          let tempDynamicBarrValue = {};
          tempDynamicBarrValue["index"] = Math.random();
          tempDynamicBarrValue[streams] =
            props["dataForEdit"]["stream_strength"][i]["stream"]["id"];
          tempDynamicBarrValue[strength] = props["dataForEdit"][
            "stream_strength"
          ][i]["strength"].toString();
          dynamicBar.push(tempDynamicBarrValue);
        }
        formState.dynamicBar = dynamicBar;
      }
      if (
        props["dataForEdit"]["tpos"] &&
        props["dataForEdit"]["tpos"].length !== 0
      ) {
        formState.dataToShowForMultiSelect = props["dataForEdit"]["tpos"];
        let finalData = [];
        for (let i in props["dataForEdit"]["tpos"]) {
          finalData.push(props["dataForEdit"]["tpos"][i]["id"]);
        }
        formState.values[tpos] = finalData;
      }
      formState.counter += 1;
    }
  }

  /** Here we initialize our data and bring users, states and streams*/
  useEffect(() => {
    setLoaderStatus(true);
    let paramsForPageSize = {
      pageSize: -1
    };
    serviceProviders
      .serviceProviderForGetRequest(USERS_URL, paramsForPageSize)
      .then(res => {
        setUser(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(STATES_URL, paramsForPageSize)
      .then(res => {
        formState.states = res.data.result;
        setStates(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(STREAMS_URL, paramsForPageSize)
      .then(res => {
        setStreamsDataBackup(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(STREAMS_URL, paramsForPageSize)
      .then(res => {
        let dataForEditing = res.data.result;
        if (formState.isEditCollege) {
          let tempStreamData = dataForEditing;
          let streamStrengthArray = props["dataForEdit"]["stream_strength"];
          for (let i in streamStrengthArray) {
            let id = streamStrengthArray[i]["stream"]["id"];
            for (let j in tempStreamData) {
              if (tempStreamData[j]["id"] === id) tempStreamData.splice(j, 1);
            }
          }
          setStreamsData(tempStreamData);
        } else {
          setStreamsData(dataForEditing);
        }
      })
      .catch(error => {
        console.log("error", error);
      });
    setLoaderStatus(false);
  }, []);

  /** This gets data into zones, rpcs and districts when we change the state */
  useEffect(() => {
    if (formState.values[state]) {
      fetchZoneRpcDistrictData();
    }
    return () => {};
  }, [formState.values[state]]);

  /** Common function to get zones, rpcs, districts after changing state */
  async function fetchZoneRpcDistrictData() {
    let zones_url =
      STATES_URL +
      "/" +
      formState.values[state] +
      "/" +
      strapiConstants.STRAPI_ZONES;

    await serviceProviders
      .serviceProviderForGetRequest(zones_url)
      .then(res => {
        setZones(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });

    let rpcs_url =
      STATES_URL +
      "/" +
      formState.values[state] +
      "/" +
      strapiConstants.STRAPI_RPCS;

    await serviceProviders
      .serviceProviderForGetRequest(rpcs_url)
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

    let params = {
      pageSize: -1,
      "state.id": formState.values[state]
    };

    if (formState.values[state] !== undefined) {
      await serviceProviders
        .serviceProviderForGetRequest(DISTRICTS_URL, params)
        .then(res => {
          setDistricts(res.data.result);
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }

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
    if (eventName === tpos) {
      formState.dataToShowForMultiSelect = value;
    }
    if (get(CollegeFormSchema[eventName], "type") === "multi-select") {
      let finalValues = [];
      for (let i in value) {
        finalValues.push(value[i]["id"]);
      }
      value = {
        id: finalValues
      };
    }
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
        },
        isStateClearFilter: false
      }));
      if (eventName === state) {
        fetchZoneRpcDistrictData();
      }
      /** This is used to remove any existing errors if present in auto complete */
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
    } else {
      let setStateFilterValue = false;
      /** If we click cross for state the zone and rpc should clear off! */
      if (eventName === state) {
        /** 
        This flag is used to determine that state is cleared which clears 
        off zone and rpc by setting their value to null 
        */
        setStateFilterValue = true;
        /** 
        When state is cleared then clear rpc and zone 
        */
        setRpcs([]);
        setZones([]);
        setDistricts([]);
        delete formState.values[zone];
        delete formState.values[rpc];
        delete formState.values[district];
      }
      setFormState(formState => ({
        ...formState,
        isStateClearFilter: setStateFilterValue
      }));
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
    if (record[streams]) {
      let streamsTempArray = [];
      streamsTempArray = streamsData;
      streamsDataBackup.map(streams => {
        if (record["streams"] === streams["id"]) {
          streamsTempArray.push(streams);
        }
      });
      setStreamsData(streamsTempArray);
    }
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
              let streamsTempArray = [];
              streamsData.map(streams => {
                if (streams["id"] !== selectedValueForAutoComplete["id"]) {
                  streamsTempArray.push(streams);
                }
              });
              setStreamsData(streamsTempArray);
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
              let streamsTempArray = [];
              streamsTempArray = streamsData;
              streamsDataBackup.map(streams => {
                if (r[eventName] === streams["id"]) {
                  streamsTempArray.push(streams);
                }
              });
              setStreamsData(streamsTempArray);
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
    formState.dynamicBar.map(field => {
      let streamStrengthValue = {};
      if (field.hasOwnProperty(streams) && field.hasOwnProperty(strength)) {
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
      formState.values[zone] ? formState.values[zone] : null,
      formState.values[district] ? formState.values[district] : null,
      streamStrengthArray,
      formState.values[tpos] ? formState.values[tpos] : []
    );
    setLoaderStatus(true);
    if (formState.isEditCollege) {
      serviceProviders
        .serviceProviderForPutRequest(
          COLLEGES_URL,
          formState.dataForEdit["id"],
          postData
        )
        .then(res => {
          history.push({
            pathname: routeConstants.MANAGE_COLLEGE,
            fromeditCollege: true,
            isDataEdited: true,
            editResponseMessage: "",
            editedData: {}
          });
          setLoaderStatus(false);
        })
        .catch(error => {
          console.log(error.response);
          history.push({
            pathname: routeConstants.MANAGE_COLLEGE,
            fromeditCollege: true,
            isDataEdited: false,
            editResponseMessage: "",
            editedData: {}
          });
          setLoaderStatus(false);
        });
    } else {
      serviceProviders
        .serviceProviderForPostRequest(COLLEGES_URL, postData)
        .then(res => {
          history.push({
            pathname: routeConstants.MANAGE_COLLEGE,
            fromAddCollege: true,
            isDataAdded: true,
            addResponseMessage: "",
            addedData: {}
          });
          setLoaderStatus(false);
        })
        .catch(error => {
          history.push({
            pathname: routeConstants.MANAGE_COLLEGE,
            fromAddCollege: true,
            isDataAdded: false,
            addResponseMessage: "",
            addedData: {}
          });
          setLoaderStatus(false);
        });
    }
  };

  const clickedCancelButton = () => {
    if (auth.getUserInfo().role.name === "Medha Admin") {
      history.push({
        pathname: routeConstants.MANAGE_COLLEGE
      });
    } else if (auth.getUserInfo().role.name === "College Admin") {
      history.push({
        pathname: routeConstants.VIEW_COLLEGE
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
      <Grid spacing={3}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
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
                <Grid item md={6} xs={12}>
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
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={12} xs={12}>
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
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  {formState.isCollegeAdmin ? (
                    <ReadOnlyTextField
                      id="StateName"
                      label={get(CollegeFormSchema[state], "label")}
                      defaultValue={collegeInfo.state.name}
                    />
                  ) : (
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
                            states.findIndex(function (item, i) {
                              return item.id === formState.values[state];
                            })
                          ] || null
                        }
                        name={state}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError(state)}
                            required
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
                  )}
                </Grid>
                <Grid item md={6} xs={12}>
                  {formState.isCollegeAdmin ? (
                    <ReadOnlyTextField
                      id="ZoneName"
                      label={get(CollegeFormSchema[zone], "label")}
                      defaultValue={collegeInfo.zone.name}
                    />
                  ) : (
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
                          formState.isStateClearFilter
                            ? null
                            : zones[
                                zones.findIndex(function (item, i) {
                                  return item.id === formState.values[zone];
                                })
                              ] ||
                              null /** Please give a default " " blank value */
                        }
                        name={zone}
                        renderInput={params => (
                          <TextField
                            {...params}
                            required
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
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  {formState.isCollegeAdmin ? (
                    <ReadOnlyTextField
                      id={get(CollegeFormSchema[rpcs], "id")}
                      label={get(CollegeFormSchema[rpc], "label")}
                      defaultValue={collegeInfo.rpc.name}
                    />
                  ) : (
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
                          formState.isStateClearFilter
                            ? null
                            : rpcs[
                                rpcs.findIndex(function (item, i) {
                                  return item.id === formState.values[rpc];
                                })
                              ] ||
                              null /** Please give a default " " blank value */
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            required
                            error={hasError(rpc)}
                            helperText={
                              hasError(rpc)
                                ? formState.errors[rpc].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            placeholder={get(
                              CollegeFormSchema[rpc],
                              "placeholder"
                            )}
                            value={option => option.id}
                            name={rpc}
                            key={option => option.id}
                            label={get(CollegeFormSchema[rpc], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  )}
                </Grid>
                <Grid item md={6} xs={12}>
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
                      name={district}
                      /** This is used to set the default value to the auto complete */
                      value={
                        formState.isStateClearFilter
                          ? null
                          : districts[
                              districts.findIndex(function (item, i) {
                                return item.id === formState.values[district];
                              })
                            ] ||
                            null /** Please give a default " " blank value */
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
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
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
            </Grid>
            <Divider className={classes.divider} />
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
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
                <Grid item md={6} xs={12}>
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
                            user.findIndex(function (item, i) {
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
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className={classes.formControl}
                  >
                    <InputLabel ref={inputLabel} id="tpos-label">
                      {/* TPO */}
                    </InputLabel>
                    {user.length ? (
                      <Autocomplete
                        id={get(CollegeFormSchema[tpos], "id")}
                        multiple
                        options={user}
                        getOptionLabel={option => option.username}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(tpos, event, value);
                        }}
                        name={tpos}
                        filterSelectedOptions
                        value={formState.dataToShowForMultiSelect || null}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError(tpos)}
                            helperText={
                              hasError(tpos)
                                ? formState.errors[tpos].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            placeholder={get(
                              CollegeFormSchema[tpos],
                              "placeholder"
                            )}
                            label={get(CollegeFormSchema[tpos], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    ) : null}
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12}>
                  <div
                    style={{ display: formState.showing ? "block" : "none" }}
                  >
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Switch
                            name={block}
                            checked={formState.values[block] || false}
                            onChange={handleChange}
                            value={formState.values[block] || false}
                            error={hasError(block).toString()}
                            helpertext={
                              hasError(block)
                                ? formState.errors[block].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                          />
                        }
                        label={
                          formState.values[block] === true ? "Unblock" : "Block"
                        }
                      />
                    </FormGroup>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={1} className={classes.formgrid}>
                <Grid item md={12} xs={12} className={classes.streamcard}>
                  <Card className={classes.streamoffer}>
                    <InputLabel
                      htmlFor="outlined-stream-card"
                      fullwidth={true.toString()}
                    >
                      {genericConstants.STREAMS_OFFERED_TEXT}
                    </InputLabel>

                    {formState.dynamicBar.map((val, idx) => {
                      let streamId = `stream-${idx}`,
                        strengthId = `strength-${idx}`;
                      return (
                        <Card
                          id="outlined-stream-card"
                          fullwidth={true.toString()}
                          className={classes.streamcardcontent}
                          key={Math.random()}
                        >
                          <CardContent>
                            <Grid container spacing={1}>
                              <Grid item xs={5}>
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
                                      streamsDataBackup[
                                        streamsDataBackup.findIndex(function (
                                          item,
                                          i
                                        ) {
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
                              <Grid item xs={5}>
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
                                    checkErrorInDynamicBar(strength, val)[
                                      "error"
                                    ]
                                  }
                                  helperText={
                                    checkErrorInDynamicBar(strength, val)[
                                      "error"
                                    ]
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
                              <Grid item xs={2}>
                                {idx > 0 ? (
                                  <DeleteForeverOutlinedIcon
                                    onClick={e => clickOnDelete(val, idx)}
                                    style={{ color: "red", fontSize: "24px" }}
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
                    <div className={classes.btnspaceadd}>
                      <YellowButton
                        disabled={streamsData.length ? false : true}
                        color="primary"
                        variant="contained"
                        className={classes.add_more_btn}
                        onClick={addNewRow}
                      >
                        {genericConstants.ADD_MORE_TEXT}
                      </YellowButton>
                    </div>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <Grid item xs={12} className={classes.CardActionGrid}>
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
                onClick={clickedCancelButton}
                className={classes.resetbtn}
              >
                {genericConstants.CANCEL_BUTTON_TEXT}
              </GrayButton>
            </CardActions>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};
AddEditCollege.propTypes = {
  className: PropTypes.string
};
export default AddEditCollege;
