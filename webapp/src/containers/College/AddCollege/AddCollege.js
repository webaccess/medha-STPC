import React, { useState, useEffect } from "react";
import useStyles from "./AddCollegeStyles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import CollegeFormSchema from "../CollegeFormSchema";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import * as serviceProviders from "../../../api/Axios";
import { Alert, GreenButton, GrayButton } from "../../../components";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { get } from "lodash";
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  TextField,
  Typography
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
const streams = "streams";

const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const STREAMS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;
const USERS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;
const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const COLLEGES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;

const AddCollege = props => {
  const classes = useStyles();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false
  });
  const { className, ...rest } = props;
  const [user, setUser] = useState([]);
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [streamsData, setStreamsData] = useState([]);
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  /** Here we initialize our data */
  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(USERS_URL)
      .then(res => {
        setUser(res.data);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(STATES_URL)
      .then(res => {
        setStates(res.data);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(STREAMS_URL)
      .then(res => {
        setStreamsData(res.data);
      })
      .catch(error => {
        console.log("error", error);
      });
  }, []);

  /** This gets data into zones when we change the state */
  useEffect(() => {
    let url =
      STATES_URL +
      "/" +
      formState.values[state] +
      "/" +
      strapiConstants.STRAPI_ZONES;
    serviceProviders
      .serviceProviderForGetRequest(url)
      .then(res => {
        if (Array.isArray(res.data)) {
          setZones(res.data[0].zones);
        } else {
          setZones(res.data.zones);
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  }, [formState.values[state]]);

  useEffect(() => {
    let url =
      ZONES_URL +
      "/" +
      formState.values[zone] +
      "/" +
      strapiConstants.STRAPI_RPCS;
    serviceProviders
      .serviceProviderForGetRequest(url)
      .then(res => {
        setRpcs(res.data.rpcs);
        console.log("rpcdata", res.data);
      })
      .catch(error => {
        console.log("error", error);
      });
  }, [formState.values[zone]]);

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [e.target.name]: e.target.value
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

  const hasError = field => (formState.errors[field] ? true : false);

  const postCollegeData = async () => {
    let postData = databaseUtilities.addCollege(
      formState.values[collegeName],
      formState.values[collegeCode],
      formState.values[address],
      formState.values[contactNumber],
      formState.values[collegeEmail],
      formState.values[principal] ? formState.values[principal] : null,
      formState.values[rpc] ? formState.values[rpc] : null
    );
    serviceProviders
      .serviceProviderForPostRequest(COLLEGES_URL, postData)
      .then(res => {
        console.log(res);
        setIsFailed(false);
        setIsSuccess(true);
      })
      .catch(error => {
        console.log(error.response);
        setIsSuccess(false);
        setIsFailed(true);
      });
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.ADD_COLLEGE_TEXT}
        </Typography>
        {isSuccess ? (
          <Alert severity="success">
            {genericConstants.ALERT_SUCCESS_BUTTON_MESSAGE}
          </Alert>
        ) : null}
        {isFailed ? (
          <Alert severity="error">
            {genericConstants.ALERT_ERROR_BUTTON_MESSAGE}
          </Alert>
        ) : null}
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card className={classes.root} variant="outlined">
          <form autoComplete="off" noValidate onSubmit={handleSubmit}>
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
                    id={get(CollegeFormSchema[address], "id")}
                    label={get(CollegeFormSchema[address], "label")}
                    name={address}
                    onChange={handleChange}
                    required
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
                    {states.length ? (
                      <Autocomplete
                        id={get(CollegeFormSchema[state], "id")}
                        options={states}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(state, event, value);
                        }}
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
                            value={option => option.id}
                            name={state}
                            key={option => option.id}
                            label={get(CollegeFormSchema[state], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    ) : null}
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
                      id={get(CollegeFormSchema[zone], "id")}
                      options={zones}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(zone, event, value);
                      }}
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
                    <InputLabel
                      ref={inputLabel}
                      id="demo-simple-select-outlined-label"
                    >
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
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name={contactNumber}
                    onChange={handleChange}
                    required
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
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    label={get(CollegeFormSchema[collegeEmail], "label")}
                    id={get(CollegeFormSchema[collegeEmail], "id")}
                    name={collegeEmail}
                    onChange={handleChange}
                    required
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
              <Divider className={classes.divider} />
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
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
                    {user.length ? (
                      <Autocomplete
                        id={get(CollegeFormSchema[principal], "id")}
                        options={user}
                        getOptionLabel={option => option.username}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(principal, event, value);
                        }}
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
                <Grid item md={4} xs={12}>
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
                <Grid item md={4} xs={12}>
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
                    {streams.length ? (
                      <Autocomplete
                        id={get(CollegeFormSchema[streams], "id")}
                        options={streamsData}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(streams, event, value);
                        }}
                        name={streams}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError(streams)}
                            helperText={
                              hasError(streams)
                                ? formState.errors[streams].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            value={option => option.id}
                            name={principal}
                            key={option => option.id}
                            label={get(CollegeFormSchema[streams], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    ) : null}
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
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
        </Card>
      </Grid>
    </Grid>
  );
};
AddCollege.propTypes = {
  className: PropTypes.string
};
export default AddCollege;
