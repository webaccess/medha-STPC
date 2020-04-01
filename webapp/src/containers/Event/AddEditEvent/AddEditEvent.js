import React, { useState, useEffect } from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";

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
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Styles.css";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

const eventName = "eventName";
const description = "description";
const dateFrom = "dateFrom";
const dateTo = "dateTo";
const timeFrom = "timeFrom";
const timeTo = "timeTo";
const address = "address";
const state = "state";
const zone = "zone";
const rpc = "rpc";
const college = "college";
const stream = "stream";
const marks = "marks";
const qualifications = "qualifications";

const field = "upload_logo";
const ref = "event";
const files = "files";

const STATES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

const AddEditEvent = props => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
  const classes = useStyles();
  // const theme = useTheme();
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

  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [streams, setStreams] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [personName, setPersonName] = React.useState([]);
  const [collegeName, setCollegeName] = React.useState([]);

  /** Part for editing state */
  if (formState.dataForEdit && !formState.counter) {
    if (props["dataForEdit"]) {
      if (props["dataForEdit"]["title"]) {
        formState.values[eventName] = props["dataForEdit"]["title"];
      }
      if (props["dataForEdit"]["description"]) {
        formState.values[description] = props["dataForEdit"]["description"];
        const blocksFromHtml = htmlToDraft(props["dataForEdit"]["description"]);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
      if (props["dataForEdit"]["start_date_time"]) {
        let today = new Date(props["dataForEdit"]["start_date_time"]);
        let date =
          today.getDate() +
          "-" +
          parseInt(today.getMonth() + 1) +
          "-" +
          today.getFullYear();

        formState.values[dateFrom] = date;
        //formState.defaultDate = date;
      }
      if (props["dataForEdit"]["end_date_time"]) {
        formState.values[dateTo] = props["dataForEdit"]["end_date_time"];
      }
      if (props["dataForEdit"]["address"]) {
        formState.values[address] = props["dataForEdit"]["address"];
      }
      // if (props["dataForEdit"]["age"]) {
      //   formState.values[age] = props["dataForEdit"]["age"];
      // }

      if (props["dataForEdit"]["rpc"] && props["dataForEdit"]["rpc"]["id"]) {
        formState.values[rpc] = props["dataForEdit"]["rpc"]["id"];
      }
      if (
        props["dataForEdit"]["colleges"] &&
        props["dataForEdit"]["colleges"].length
      ) {
        formState.values[college] = props["dataForEdit"]["colleges"][0]["id"];
      }
      if (
        props["dataForEdit"]["streams"] &&
        props["dataForEdit"]["streams"].length
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
      .serviceProviderForGetRequest(STATES_URL)
      .then(res => {
        setStates(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
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

  /** This gets data into zones, rpcs and districts when we change the state */
  useEffect(() => {
    if (formState.values[state]) {
      fetchZoneRpcDistrictData();
    }
    if (formState.values[zone] && formState.values[rpc]) {
      fetchCollegeData();
    }
    return () => {};
  }, [formState.values]);

  /** Common function to get zones, rpcs after changing state */
  async function fetchZoneRpcDistrictData() {
    let zones_url =
      STATES_URL +
      "/" +
      formState.values[state] +
      "/" +
      strapiApiConstants.STRAPI_ZONES;

    await serviceProvider
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
      strapiApiConstants.STRAPI_RPCS;

    await serviceProvider
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
  }

  /** Common function to get colleges after changing zone & rpc */
  async function fetchCollegeData() {
    let colleges_url =
      ZONES_URL +
      "/" +
      formState.values[zone] +
      "/" +
      strapiApiConstants.STRAPI_COLLEGES;

    await serviceProvider
      .serviceProviderForGetRequest(colleges_url)
      .then(res => {
        setColleges(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  const handleChangeMultiSelect = (stream, event) => {
    setPersonName(event.target.value);
    let streamarray = [];
    for (var i = 0; i < streams.length; i++) {
      for (var j = 0; j < event.target.value.length; j++) {
        if (streams[i].name == event.target.value[j]) {
          streamarray.push(streams[i].id);
        }
      }
    }
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [stream]: streamarray
      },
      touched: {
        ...formState.touched,
        [stream]: true
      },
      isStateClearFilter: false
    }));
  };
  const handleChangeCollegeMultiSelect = (college, event) => {
    setCollegeName(event.target.value);
    let collegearray = [];
    for (var i = 0; i < colleges.length; i++) {
      for (var j = 0; j < event.target.value.length; j++) {
        if (colleges[i].name === event.target.value[j]) {
          collegearray.push(colleges[i].id);
        }
      }
    }
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [college]: collegearray
      },
      touched: {
        ...formState.touched,
        [college]: true
      },
      isStateClearFilter: false
    }));
  };

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
      draftToHtml(convertToRaw(editorState.getCurrentContent())),
      formState.values[dateFrom],
      formState.values[dateTo],
      formState.values[address],
      formState.values[marks],
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
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={12} xs={12}>
                    <Grid className={classes.streamcard}>
                      <Card className={classes.streamoffer}>
                        <InputLabel
                          htmlFor="outlined-stream-card"
                          fullwidth={true.toString()}
                        >
                          {genericConstants.DESCRIPTION}
                        </InputLabel>
                        <div className="rdw-storybook-root">
                          <Editor
                            editorState={editorState}
                            toolbarClassName="rdw-storybook-toolbar"
                            wrapperClassName="rdw-storybook-wrapper"
                            editorClassName="rdw-storybook-editor"
                            onEditorStateChange={data => {
                              setEditorState(data);
                            }}
                          />
                        </div>
                      </Card>
                    </Grid>
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
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="combo-box-demo"
                      className={classes.root}
                      options={states}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(state, event, value);
                      }}
                      value={
                        states[
                          states.findIndex(function(item, i) {
                            return item.id === formState.values[state];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={get(EventSchema[state], "label")}
                          variant="outlined"
                          placeholder={get(EventSchema[state], "placeholder")}
                          error={hasError(state)}
                          helperText={
                            hasError(state)
                              ? formState.errors[state].map(error => {
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
                    <FormControl className={classes.formControl}>
                      <InputLabel id="demo-mutiple-checkbox-label">
                        Colleges
                      </InputLabel>
                      <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={collegeName}
                        onChange={event => {
                          handleChangeCollegeMultiSelect(college, event);
                        }}
                        input={<Input />}
                        renderValue={selected => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {colleges.map(name => (
                          <MenuItem key={name.id} value={name.name}>
                            <Checkbox
                              checked={collegeName.indexOf(name.name) > -1}
                            />
                            <ListItemText primary={name.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={6} xs={12}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="demo-mutiple-checkbox-label">
                        Streams
                      </InputLabel>
                      <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={personName}
                        onChange={event => {
                          handleChangeMultiSelect(stream, event);
                        }}
                        // onChange={handleChangeMultiSelect}
                        input={<Input />}
                        renderValue={selected => selected.join(", ")}
                        MenuProps={MenuProps}
                      >
                        {streams.map(name => (
                          <MenuItem key={name.id} value={name.name}>
                            <Checkbox
                              checked={personName.indexOf(name.name) > -1}
                            />
                            <ListItemText primary={name.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                  {/* <Grid item md={12} xs={12}>
                  <Autocomplete
                      id="combo-box-demo"
                      className={classes.root}
                      options={qualifications}
                      placeholder={get(EventSchema[qualifications], "placeholder")}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(qualifications, event, value);
                      }}
                      value={
                        qualifications[
                          qualifications.findIndex(function(item, i) {
                            return item.id === formState.values[qualifications];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={get(EventSchema[qualifications], "label")}
                          variant="outlined"
                          placeholder={get(EventSchema[qualifications], "placeholder")}
                          error={hasError(qualifications)}
                          helperText={
                            hasError(qualifications)
                              ? formState.errors[qualifications].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid> */}
                  {/* <Grid item md={6} xs={12}></Grid> */}
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
