import React, { useState, useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  TextField,
  Typography,
  FormHelperText
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  YellowButton,
  CustomDateTimePicker,
  GrayButton
} from "../../../components";
import useStyles from "./AddEditEventStyles";
import * as serviceProvider from "../../../api/Axios";
import EventSchema from "../EventSchema";
import { get } from "lodash";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import * as formUtilities from "../../../Utilities/FormUtilities";
import { useHistory } from "react-router-dom";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./RichTextFieldStyles.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

const eventName = "eventName";
const description = "description";
const dateFrom = "dateFrom";
const dateTo = "dateTo";
const address = "address";
const state = "state";
const zone = "zone";
const rpc = "rpc";
const college = "college";
const stream = "stream";
const marks = "marks";
const qualification = "qualification";
const field = "upload_logo";
const ref = "event";
const files = "files";

const STATES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;
const QUALIFICATIONS_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_QUALIFICATIONS;
const STREAM_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STREAMS;
const EVENTS_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_EVENTS;
const DOCUMENT_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_UPLOAD;
const COLLEGE_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES;

const AddEditEvent = props => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
  const classes = useStyles();
  // const theme = useTheme();
  const history = useHistory();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    showPassword: false,
    isEditEvent: props["editEvent"] ? props["editEvent"] : false,

    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0,
    files: {},
    descriptionError: false,
    dataToShowForMultiSelect: [],
    dataToShowForStreamMultiSelect: []
  });

  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [streams, setStreams] = useState([]);
  const [qualifications, setQualifications] = useState([]);

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

        formState.values[dateFrom] = props["dataForEdit"]["start_date_time"];
        //formState.defaultDate = date;
      }
      if (props["dataForEdit"]["end_date_time"]) {
        formState.values[dateTo] = props["dataForEdit"]["end_date_time"];
      }
      if (props["dataForEdit"]["address"]) {
        formState.values[address] = props["dataForEdit"]["address"];
      }
      if (
        props["dataForEdit"] &&
        props["dataForEdit"]["rpc"] &&
        props["dataForEdit"]["rpc"]["state"]
      ) {
        formState.values[state] = props["dataForEdit"]["rpc"]["state"];
      }

      if (props["dataForEdit"]["rpc"] && props["dataForEdit"]["rpc"]["id"]) {
        formState.values[rpc] = props["dataForEdit"]["rpc"]["id"];
      }
      if (
        props["dataForEdit"] &&
        props["dataForEdit"]["colleges"] &&
        props["dataForEdit"]["colleges"][0] &&
        props["dataForEdit"]["colleges"][0]["zone"]
      ) {
        formState.values[zone] = props["dataForEdit"]["colleges"][0]["zone"];
      }
      if (
        props["dataForEdit"]["colleges"] &&
        props["dataForEdit"]["colleges"].length
      ) {
        // formState.values[college] = props["dataForEdit"]["colleges"][0]["id"];
        formState.dataToShowForMultiSelect = props["dataForEdit"]["colleges"];
        let finalData = [];
        for (let i in props["dataForEdit"]["colleges"]) {
          finalData.push(props["dataForEdit"]["colleges"][i]["id"]);
        }
        formState.values[college] = finalData;
      }
      if (
        props["dataForEdit"]["streams"] &&
        props["dataForEdit"]["streams"].length
      ) {
        // formState.values[stream] = props["dataForEdit"]["streams"][0]["id"];
        formState.dataToShowForStreamMultiSelect =
          props["dataForEdit"]["streams"];
        let finalDataStream = [];
        for (let i in props["dataForEdit"]["streams"]) {
          finalDataStream.push(props["dataForEdit"]["streams"][i]["id"]);
        }
        formState.values[stream] = finalDataStream;
      }
      if (props["dataForEdit"]["marks"]) {
        formState.values[marks] = props["dataForEdit"]["marks"];
      }
      if (
        props["dataForEdit"] &&
        props["dataForEdit"]["qualification"] &&
        props["dataForEdit"]["qualification"]["id"]
      ) {
        formState.values[qualification] =
          props["dataForEdit"]["qualification"]["id"];
      }
      if (props["dataForEdit"] && props["dataForEdit"]["upload_logo"]) {
        //  formState.values[files] = props["dataForEdit"]["upload_logo"]["name"];
        formState.files.name = props["dataForEdit"]["upload_logo"]["hash"];
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
      .serviceProviderForGetRequest(QUALIFICATIONS_URL)
      .then(res => {
        setQualifications(res.data);
      })
      .catch(error => {
        console.log("errorQualifications", error);
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

  useEffect(() => {
    if (
      formState.values.hasOwnProperty(state) &&
      formState.values[state] !== null &&
      formState.values[state] !== undefined
    ) {
      fetchZoneRpcDistrictData();
    }
  }, [formState.values[state]]);

  /** Common function to get zones, rpcs after changing state */
  async function fetchZoneRpcDistrictData() {
    if (
      formState.values.hasOwnProperty(state) &&
      formState.values[state] !== null &&
      formState.values[state] !== undefined &&
      formState.values[state] !== ""
    ) {
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
    }
  }

  useEffect(() => {
    if (formState.values[zone] && formState.values[rpc]) {
      fetchCollegeData();
    }
  }, [formState.values[zone], formState.values[rpc]]);

  /** Function to get college data after selcting zones and rpc's */
  async function fetchCollegeData() {
    let params = {
      "zone.id": formState.values[zone],
      "rpc.id": formState.values[rpc],
      pageSize: -1
    };

    await serviceProvider
      .serviceProviderForGetRequest(COLLEGE_URL, params)
      .then(res => {
        setColleges(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
  }

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
    formState.descriptionError = false;
    if (
      convertToRaw(editorState.getCurrentContent()).blocks &&
      convertToRaw(editorState.getCurrentContent()).blocks.length
    ) {
      let arrayToCheckIn = convertToRaw(editorState.getCurrentContent()).blocks;
      let validationCounter = 0;
      for (let i in arrayToCheckIn) {
        if (
          arrayToCheckIn[i]["text"] &&
          arrayToCheckIn[i]["text"].trim().length !== 0
        ) {
          validationCounter += 1;
          break;
        }
      }
      if (validationCounter === 0) {
        formState.descriptionError = true;
      }
    }
    if (isValid && !formState.descriptionError) {
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
      formState.values[qualification] ? formState.values[qualification] : null,
      formState.values[zone] ? formState.values[zone] : null,
      formState.values[rpc] ? formState.values[rpc] : null,
      formState.values[college] ? formState.values[college] : null,
      formState.values[stream] ? formState.values[stream] : null
    );
    if (formState.isEditEvent) {
      serviceProvider
        .serviceProviderForPutRequest(
          EVENTS_URL,
          formState.dataForEdit["id"],
          postData
        )
        .then(res => {
          if (formState.files.name) {
            postImage(res.data.id);
          } else {
            history.push({
              pathname: routeConstants.MANAGE_EVENT,
              fromAddEvent: true,
              isDataAdded: true,
              addResponseMessage: "",
              addedData: {}
            });
          }
        })
        .catch(error => {
          console.log("puterror", error);
        });
    } else {
      serviceProvider
        .serviceProviderForPostRequest(EVENTS_URL, postData)
        .then(res => {
          if (formState.files.name) {
            postImage(res.data.id);
          } else {
            history.push({
              pathname: routeConstants.MANAGE_EVENT,
              fromAddEvent: true,
              isDataAdded: true,
              addResponseMessage: "",
              addedData: {}
            });
          }
        })
        .catch(error => {
          console.log("posterror", error);
        });
    }
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
        [datefrom]: event
      },
      touched: {
        ...formState.touched,
        [datefrom]: true
      },
      isStateClearFilter: false
    }));
  };

  const handleMultiSelectChange = (eventName, event, value) => {
    if (eventName === college) {
      formState.dataToShowForMultiSelect = value;
    }
    if (eventName === stream) {
      formState.dataToShowForStreamMultiSelect = value;
    }
    let multiarray = [];
    for (var i = 0; i < value.length; i++) {
      multiarray.push(value[i].id);
    }
    if (value !== null) {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [eventName]: multiarray
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
                  <Grid item md={12} xs={12} className={"descriptionBox"}>
                    <Grid
                      className={
                        formState.descriptionError
                          ? classes.streamcardError
                          : classes.streamcard
                      }
                    >
                      <Card className={classes.streamoffer}>
                        <InputLabel
                          htmlFor="outlined-stream-card"
                          fullwidth={true.toString()}
                          error={formState.descriptionError}
                        >
                          {genericConstants.DESCRIPTION}
                        </InputLabel>
                        <div className="rdw-root">
                          <Editor
                            editorState={editorState}
                            toolbarClassName="rdw-toolbar"
                            wrapperClassName="rdw-wrapper"
                            editorClassName="rdw-editor"
                            onEditorStateChange={data => {
                              formState.descriptionError = false;
                              setEditorState(data);
                            }}
                          />
                        </div>
                        {formState.descriptionError ? (
                          <FormHelperText error={true}>
                            Description is required
                          </FormHelperText>
                        ) : null}
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <CustomDateTimePicker
                      onChange={event => {
                        handleDateChange(dateFrom, event);
                      }}
                      value={formState.values[dateFrom]}
                      name={dateFrom}
                      label={get(EventSchema[dateFrom], "label")}
                      fullWidth
                      error={hasError(dateFrom)}
                      helperText={
                        hasError(dateFrom)
                          ? formState.errors[dateFrom].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomDateTimePicker
                      onChange={event => {
                        handleDateChange(dateTo, event);
                      }}
                      value={formState.values[dateTo]}
                      name={dateTo}
                      label={get(EventSchema[dateTo], "label")}
                      fullWidth
                      error={hasError(dateTo)}
                      helperText={
                        hasError(dateTo)
                          ? formState.errors[dateTo].map(error => {
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
                          states.findIndex(function (item, i) {
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
                          zones.findIndex(function (item, i) {
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
                          rpcs.findIndex(function (item, i) {
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
                      id={get(EventSchema[college], "id")}
                      multiple
                      options={colleges}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleMultiSelectChange(college, event, value);
                      }}
                      filterSelectedOptions
                      name={college}
                      value={formState.dataToShowForMultiSelect || null}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError(college)}
                          helperText={
                            hasError(college)
                              ? formState.errors[college].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                          placeholder={get(EventSchema[college], "placeholder")}
                          value={option => option.id}
                          name={college}
                          key={option => option.id}
                          label={get(EventSchema[college], "label")}
                          variant="outlined"
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
                      id={get(EventSchema[stream], "id")}
                      multiple
                      options={streams}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleMultiSelectChange(stream, event, value);
                      }}
                      filterSelectedOptions
                      name={stream}
                      value={formState.dataToShowForStreamMultiSelect || null}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError(stream)}
                          helperText={
                            hasError(stream)
                              ? formState.errors[stream].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                          placeholder={get(EventSchema[stream], "placeholder")}
                          value={option => option.id}
                          name={stream}
                          key={option => option.id}
                          label={get(EventSchema[stream], "label")}
                          variant="outlined"
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
                  <Grid item md={12} xs={12}>
                    <Autocomplete
                      id="combo-box-demo"
                      className={classes.root}
                      options={qualifications}
                      placeholder={get(
                        EventSchema[qualification],
                        "placeholder"
                      )}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(qualification, event, value);
                      }}
                      value={
                        qualifications[
                          qualifications.findIndex(function (item, i) {
                            return item.id === formState.values[qualification];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={get(EventSchema[qualification], "label")}
                          variant="outlined"
                          placeholder={get(
                            EventSchema[qualification],
                            "placeholder"
                          )}
                          error={hasError(qualification)}
                          helperText={
                            hasError(qualification)
                              ? formState.errors[qualification].map(error => {
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
                      inputProps={{ accept: "image/*" }}
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
