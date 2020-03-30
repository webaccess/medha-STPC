import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Alert, YellowButton, GrayButton } from "../../../components";
import useStyles from "./AddEditEventStyles";
import * as serviceProvider from "../../../api/Axios";
import EventSchema from "../EventSchema";
import { get } from "lodash";
import DatePickers from "../../../components/Date/Date";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import * as formUtilities from "../../../Utilities/FormUtilities";
import { useHistory } from "react-router-dom";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants";

const eventName = "eventName";
const description = "description";
const dateFrom = "dateFrom";
const dateTo = "dateTo";
const timeFrom = "timeFrom";
const timeTo = "timeTo";
const address = "address";
const zone = "zone";
const rpc = "rpc";
const college = "college";
const stream = "stream";
const marks = "marks";
const age = "age";

const field = "upload_logo";
const ref = "event";
const files = "files";

const ZONES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ZONES;
const RPCS_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_RPCS;
const COLLEGE_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES;
const STREAM_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STREAMS;
const EVENTS_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_EVENTS;
const DOCUMENT_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_UPLOAD;

const AddEditEvent = props => {
  const classes = useStyles();
  const history = useHistory();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    showPassword: false,
    isEditUser: props["editUser"] ? props["editUser"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0,
    files: {}
  });

  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [streams, setStreams] = useState([]);

  /** Part for editing state */
  if (formState.dataForEdit && !formState.counter) {
    if (props["dataForEdit"]) {
      if (props["dataForEdit"]["title"]) {
        formState.values[eventName] = props["dataForEdit"]["title"];
      }
      if (props["dataForEdit"]["description"]) {
        formState.values[description] = props["dataForEdit"]["description"];
      }
      if (props["dataForEdit"]["start_date_time"]) {
        let date = new Date(props["dataForEdit"]["start_date_time"]);
        formState.values[dateFrom] =
          date.getDate() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getFullYear();
      }
      if (props["dataForEdit"]["end_date_time"]) {
        formState.values[dateTo] = props["dataForEdit"]["end_date_time"];
      }
      if (props["dataForEdit"]["address"]) {
        formState.values[address] = props["dataForEdit"]["address"];
      }
      if (props["dataForEdit"]["age"]) {
        formState.values[age] = props["dataForEdit"]["age"];
      }
      if (
        props["dataForEdit"]["colleges"] &&
        props["dataForEdit"]["colleges"][0]["id"]
      ) {
        formState.values[college] = props["dataForEdit"]["colleges"][0]["name"];
      }
      if (props["dataForEdit"]["rpc"] && props["dataForEdit"]["rpc"]["id"]) {
        formState.values[rpc] = props["dataForEdit"]["rpc"]["id"];
      }
      if (
        props["dataForEdit"]["streams"] &&
        props["dataForEdit"]["streams"][0]["id"]
      ) {
        formState.values[stream] = props["dataForEdit"]["streams"][0]["id"];
      }
    }
    formState.counter += 1;
  }

  useEffect(() => {
    let paramsForPageSize = {
      pageSize: -1
    };
    serviceProvider
      .serviceProviderForGetRequest(ZONES_URL, paramsForPageSize)
      .then(res => {
        setZones(res.data.result);
      })

      .catch(error => {
        console.log("errorZone", error);
      });
    serviceProvider
      .serviceProviderForGetRequest(RPCS_URL, paramsForPageSize)
      .then(res => {
        setRpcs(res.data.result);
      })

      .catch(error => {
        console.log("errorRPc", error);
      });
    serviceProvider
      .serviceProviderForGetRequest(COLLEGE_URL, paramsForPageSize)
      .then(res => {
        setColleges(res.data.result);
      })

      .catch(error => {
        console.log("errorcollege", error);
      });
    serviceProvider
      .serviceProviderForGetRequest(STREAM_URL, paramsForPageSize)
      .then(res => {
        setStreams(res.data.result);
      })

      .catch(error => {
        console.log("errorstream", error);
      });
  }, []);

  const hasError = field => (formState.errors[field] ? true : false);
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
        },
        isStateClearFilter: false
      }));
    } else {
      delete formState.values[eventName];
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      EventSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(formState.values, EventSchema);
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        EventSchema
      );
      formState.errors = formUtilities.setErrors(formState.values, EventSchema);
    }
    if (isValid) {
      /** CALL POST FUNCTION */
      postEventData();
      /** Call axios from here */
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
  };

  const postEventData = () => {
    let postData = databaseUtilities.addEvent(
      formState.values[eventName],
      formState.values[description],
      formState.values[dateFrom],
      formState.values[dateTo],
      formState.values[address],
      formState.values[marks],
      formState.values[age],
      formState.values[zone] ? formState.values[zone] : null,
      formState.values[rpc] ? formState.values[rpc] : null,
      formState.values[college] ? formState.values[college] : null,
      formState.values[stream] ? formState.values[stream] : null
    );
    serviceProvider
      .serviceProviderForPostRequest(EVENTS_URL, postData)
      .then(res => {
        postImage(res.data.id);
      })
      .catch(error => {
        console.log("posterror", error);
      });
  };

  const postImage = id => {
    let postImageData = databaseUtilities.uploadDocument(
      formState.files,
      ref,
      id,
      field
    );
    serviceProvider
      .serviceProviderForPostRequest(DOCUMENT_URL, postImageData)
      .then(res => {
        history.push({
          pathname: routeConstants.MANAGE_EVENT,
          fromAddEvent: true,
          isDataAdded: true,
          addResponseMessage: "",
          addedData: {}
        });
      })
      .catch(err => {
        console.log("error", err);
      });
  };

  const handleFileChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      },
      files: event.target.files[0]
    }));

    /** This is used to remove any existing errors if present in text field */
    if (formState.errors.hasOwnProperty(event.target.name)) {
      delete formState.errors[event.target.name];
    }
  };

  const handleDateChange = (datefrom, event) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [datefrom]: event.target.value
      },
      touched: {
        ...formState.touched,
        [datefrom]: true
      },
      isStateClearFilter: false
    }));
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.ADD_EVENT_TEXT}
        </Typography>
      </Grid>
      <Grid spacing={3}>
        <Card>
          <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <CardContent>
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label={get(EventSchema[eventName], "label")}
                      id={get(EventSchema[eventName], "id")}
                      name={eventName}
                      placeholder={get(EventSchema[eventName], "placeholder")}
                      value={formState.values[eventName] || ""}
                      error={hasError(eventName)}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      helperText={
                        hasError(eventName)
                          ? formState.errors[eventName].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label={get(EventSchema[description], "label")}
                      id={get(EventSchema[description], "id")}
                      name={description}
                      placeholder={get(EventSchema[description], "placeholder")}
                      value={formState.values[description] || ""}
                      error={hasError(description)}
                      variant="outlined"
                      required
                      fullWidth
                      multiline
                      onChange={handleChange}
                      helperText={
                        hasError(description)
                          ? formState.errors[description].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <DatePickers
                      onChange={event => {
                        handleDateChange(dateFrom, event);
                      }}
                      name={dateFrom}
                      label="Start Date"
                      fullWidth
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <DatePickers
                      onChange={event => {
                        handleDateChange(dateTo, event);
                      }}
                      name={dateTo}
                      label="End Date"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label={get(EventSchema[timeFrom], "label")}
                      id={get(EventSchema[timeFrom], "id")}
                      name={timeFrom}
                      placeholder={get(EventSchema[timeFrom], "placeholder")}
                      value={formState.values[timeFrom] || ""}
                      error={hasError(timeFrom)}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      helperText={
                        hasError(timeFrom)
                          ? formState.errors[timeFrom].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label={get(EventSchema[timeTo], "label")}
                      id={get(EventSchema[timeTo], "id")}
                      name={timeTo}
                      placeholder={get(EventSchema[timeTo], "placeholder")}
                      value={formState.values[timeTo] || ""}
                      error={hasError(timeTo)}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      helperText={
                        hasError(timeTo)
                          ? formState.errors[timeTo].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label={get(EventSchema[address], "label")}
                      id={get(EventSchema[address], "id")}
                      name={address}
                      placeholder={get(EventSchema[address], "placeholder")}
                      value={formState.values[address] || ""}
                      error={hasError(address)}
                      variant="outlined"
                      required
                      multiline
                      fullWidth
                      onChange={handleChange}
                      helperText={
                        hasError(address)
                          ? formState.errors[address].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}></Grid>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="combo-box-demo"
                      className={classes.root}
                      options={zones}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(zone, event, value);
                      }}
                      value={
                        zones[
                          zones.findIndex(function(item, i) {
                            return item.id === formState.values[zone];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={get(EventSchema[zone], "label")}
                          variant="outlined"
                          placeholder={get(EventSchema[zone], "placeholder")}
                          error={hasError(zone)}
                          helperText={
                            hasError(zone)
                              ? formState.errors[zone].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="combo-box-demo"
                      className={classes.root}
                      options={rpcs}
                      placeholder={get(EventSchema[rpcs], "placeholder")}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(rpc, event, value);
                      }}
                      value={
                        rpcs[
                          rpcs.findIndex(function(item, i) {
                            return item.id === formState.values[rpc];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={get(EventSchema[rpc], "label")}
                          variant="outlined"
                          placeholder={get(EventSchema[rpc], "placeholder")}
                          error={hasError(rpc)}
                          helperText={
                            hasError(rpc)
                              ? formState.errors[rpc].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="combo-box-demo"
                      className={classes.root}
                      options={colleges}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(college, event, value);
                      }}
                      value={
                        colleges[
                          colleges.findIndex(function(item, i) {
                            return item.id === formState.values[college];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={get(EventSchema[college], "label")}
                          variant="outlined"
                          placeholder={get(EventSchema[college], "placeholder")}
                          error={hasError(college)}
                          helperText={
                            hasError(college)
                              ? formState.errors[college].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="combo-box-demo"
                      className={classes.root}
                      options={streams}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(stream, event, value);
                      }}
                      value={
                        streams[
                          streams.findIndex(function(item, i) {
                            return item.id === formState.values[stream];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={get(EventSchema[stream], "label")}
                          placeholder={get(EventSchema[stream], "placeholder")}
                          variant="outlined"
                          error={hasError(stream)}
                          helperText={
                            hasError(stream)
                              ? formState.errors[stream].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label={get(EventSchema[marks], "label")}
                      id={get(EventSchema[marks], "id")}
                      name={marks}
                      placeholder={get(EventSchema[marks], "placeholder")}
                      value={formState.values[marks] || ""}
                      error={hasError(marks)}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      helperText={
                        hasError(marks)
                          ? formState.errors[marks].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}></Grid>
                  <Grid item md={6} xs={12}></Grid>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      fullWidth
                      id={get(EventSchema[files], "id")}
                      name={files}
                      onChange={handleFileChange}
                      required
                      type={get(EventSchema[files], "type")}
                      value={formState.values[files] || ""}
                      error={hasError(files)}
                      helperText={
                        hasError(files)
                          ? formState.errors[files].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      variant="outlined"
                      className={classes.elementroot}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
            <Grid item xs={12} className={classes.CardActionGrid}>
              <CardActions className={classes.btnspace}>
                <YellowButton type="submit" color="primary" variant="contained">
                  {genericConstants.SAVE_BUTTON_TEXT}
                </YellowButton>
                <GrayButton
                  type="submit"
                  color="primary"
                  variant="contained"
                  to={routeConstants.MANAGE_EVENT}
                >
                  {genericConstants.CANCEL_BUTTON_TEXT}
                </GrayButton>
              </CardActions>
            </Grid>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
export default AddEditEvent;
