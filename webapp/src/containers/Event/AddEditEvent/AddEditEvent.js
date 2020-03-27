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
import useStyles from "../ManageEvent/ManageEventStyles";
import * as serviceProvider from "../../../api/Axios";
import EventSchema from "../EventSchema";
import { get } from "lodash";
import DatePickers from "../../../components/Date/Date";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import * as formUtilities from "../../../Utilities/FormUtilities";
import { useHistory } from "react-router-dom";

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

const ZONES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ZONES;
const RPCS_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_RPCS;
const COLLEGE_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES;
const STREAM_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STREAMS;

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
    counter: 0
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
        console.log("return", true);
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
        props["dataForEdit"]["streams"]["id"]
      ) {
        console.log("insidedata", true);
        formState.values[stream] = props["dataForEdit"]["streams"][0]["name"];
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
      console.log("ready to post");
      // postUserData();

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

  const handleDateChange = (datefrom, event) => {
    // console.log("handleDateChange", event.target.value);
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
          ADD EVENTS
          {/* {genericConstants.ADD_USER_TITLE} */}
        </Typography>
        {/* alert */}
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card className={classes.root} variant="outlined">
          <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <CardContent>
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
              <Grid container spacing={3} className={classes.formgrid}>
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
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={3} xs={12}>
                  <DatePickers
                    onChange={event => {
                      handleDateChange(dateFrom, event);
                    }}
                    name={dateFrom}
                    label="Start Date"
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <DatePickers
                    onChange={event => {
                      handleDateChange(dateTo, event);
                    }}
                    name={dateTo}
                    label="End Date"
                  />
                </Grid>
                <Grid item md={3} xs={12}>
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
                <Grid item md={3} xs={12}>
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
              <Grid container spacing={3} className={classes.formgrid}>
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
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={4} xs={12}>
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
                <Grid item md={4} xs={12}>
                  <Autocomplete
                    id="combo-box-demo"
                    className={classes.root}
                    options={rpcs}
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
                <Grid item md={4} xs={12}>
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
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={4} xs={12}>
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
                <Grid item md={4} xs={12}>
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
                <Grid item md={4} xs={12}>
                  <TextField
                    label={get(EventSchema[age], "label")}
                    id={get(EventSchema[age], "id")}
                    name={age}
                    placeholder={get(EventSchema[age], "placeholder")}
                    value={formState.values[age] || ""}
                    error={hasError(age)}
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleChange}
                    helperText={
                      hasError(age)
                        ? formState.errors[age].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions className={classes.btnspace}>
              <YellowButton type="submit" color="primary" variant="contained">
                {/* {genericConstants.SAVE_BUTTON_TEXT} */}
                SAVE
              </YellowButton>
              <GrayButton
                type="submit"
                color="primary"
                variant="contained"
                // to={routeConstants.VIEW_USER}
              >
                CANCEL
                {/* {genericConstants.CANCEL_BUTTON_TEXT} */}
              </GrayButton>
            </CardActions>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
export default AddEditEvent;
