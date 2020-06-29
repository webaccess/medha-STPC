import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Divider,
  InputLabel,
  IconButton,
  Collapse,
  FormHelperText,
  Button,
  FormGroup,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import Spinner from "../../components/Spinner/Spinner.js";
import CloseIcon from "@material-ui/icons/Close";

import * as routeConstants from "../../constants/RouteConstants";

import * as genericConstants from "../../constants/GenericConstants.js";
import { get } from "lodash";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CustomDateTimePicker from "../../components/CustomDateTimePicker/CustomDateTimePicker.js";
import Alert from "../../components/Alert/Alert.js";
import GrayButton from "../../components/GrayButton/GrayButton.js";
import YellowButton from "../../components/YellowButton/YellowButton.js";
import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import * as formUtilities from "../../utilities/FormUtilities.js";
import * as databaseUtilities from "../../utilities/StrapiUtilities.js";

import Img from "react-image";
import { useHistory } from "react-router-dom";
import * as serviceProvider from "../../api/Axios.js";
import ActivityFormSchema from "./ActivityFormSchema";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import useStyles from "../../containers/ContainerStyles/AddEditPageStyles.js";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import LoaderContext from "../../context/LoaderContext";
import moment from "moment";
import axios from "axios";
import { includes } from "lodash";

const QUESTION_SET =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_QUESTION_SET;

const AddEditActivity = props => {
  let history = useHistory();
  const dateFrom = "dateFrom";
  const dateTo = "dateTo";

  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      dateFrom: moment(),
      dateTo: moment()
    },
    touched: {},
    errors: {},
    isSuccess: false,
    showPassword: false,
    editActivity: props.location.editActivity
      ? props.location.editActivity
      : false,
    dataForEdit: props.location.dataForEdit
      ? props.location.dataForEdit
      : false,
    counter: 0,
    stream: [],
    files: null,
    descriptionError: false,
    discriptionMinLengthError: false,
    previewFile: {},
    showPreview: false,
    showEditPreview: props.location.editActivity
      ? props.location.dataForEdit.upload_logo
        ? true
        : false
      : false,
    showNoImage: props.location.editActivity
      ? false
      : props.location.editActivity
  });

  if (formState.dataForEdit && !formState.counter) {
    if (props.location["dataForEdit"]) {
      if (props.location["dataForEdit"]["title"]) {
        formState.values["activityname"] =
          props.location["dataForEdit"]["title"];
      }
      if (props.location["dataForEdit"]["activitytype"]) {
        formState.values["activitytype"] =
          props.location["dataForEdit"]["activitytype"]["id"];
      }
      if (
        props.location["dataForEdit"]["academic_year"] &&
        props.location["dataForEdit"]["academic_year"]["id"]
      ) {
        formState.values["academicyear"] =
          props.location["dataForEdit"]["academic_year"]["id"];
      }
      if (props.location["dataForEdit"]["streams"]) {
        formState.values["stream"] = props.location["dataForEdit"]["streams"];
      }
      if (props.location["dataForEdit"]["address"]) {
        formState.values["address"] = props.location["dataForEdit"]["address"];
      }
      if (props.location["dataForEdit"]["education_year"]) {
        formState.values["educationyear"] =
          props.location["dataForEdit"]["education_year"];
      }
      if (props.location["dataForEdit"]["activity_status"]) {
        formState.values["activitystatus"] =
          props.location["dataForEdit"]["activity_status"];
      }
      if (
        props.location["dataForEdit"]["question_set"] &&
        props.location["dataForEdit"]["question_set"]
      ) {
        formState.values["questionSet"] =
          props.location["dataForEdit"]["question_set"]["id"];
      }
      if (
        props.location["dataForEdit"] &&
        props.location["dataForEdit"]["cancelled"]
      ) {
        formState.values["cancelled"] = props.location["dataForEdit"][
          "cancelled"
        ]
          ? true
          : false;
      }

      if (props.location["dataForEdit"]["description"]) {
        // formState.values["description"] = props["dataForEdit"]["description"];
        const blocksFromHtml = htmlToDraft(
          props.location["dataForEdit"]["description"]
        );
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
      if (props.location["dataForEdit"]["trainer_name"]) {
        formState.values["trainer"] =
          props.location["dataForEdit"]["trainer_name"];
      }

      if (
        props.location["dataForEdit"]["contact"] &&
        props.location["dataForEdit"]["contact"]["id"]
      ) {
        formState.values["college"] =
          props.location["dataForEdit"]["contact"]["id"];
      }
      if (props.location["dataForEdit"]["start_date_time"]) {
        formState.values[dateFrom] = moment(
          props.location["dataForEdit"]["start_date_time"]
        );
      }
      if (props.location["dataForEdit"]["end_date_time"]) {
        formState.values[dateTo] = moment(
          props.location["dataForEdit"]["end_date_time"]
        );
      }
      if (
        props.location["dataForEdit"]["upload_logo"] &&
        props.location["dataForEdit"]["upload_logo"]["id"]
      ) {
        formState.files = props.location["dataForEdit"]["upload_logo"];
        //      formState.values["files"] =
        //        props.location["dataForEdit"]["upload_logo"]["name"];
      }
    }
    formState.counter += 1;
  }

  if (props.location.state && !formState.counter) {
    if (props.location.state.contactNumber && props.location.state.otp) {
      formState.values["contact"] = props.location.state.contactNumber;
      formState.values["otp"] = props.location.state.otp;
    }
    formState.counter += 1;
  }

  // const [selectedDateFrom, setSelectedDateFrom] = React.useState(new Date());
  // const [selectedDateTo, setSelectedDateTo] = React.useState(new Date());
  const { setLoaderStatus } = useContext(LoaderContext);

  const educationyearlist = [
    { name: "First", id: "First" },
    { name: "Second", id: "Second" },
    { name: "Third", id: "Third" }
  ];

  const activityNameList = [
    { name: "Soft Skills 1", id: "Soft Skills 1" },
    { name: "Soft Skills 2", id: "Soft Skills 2" },
    { name: "Career Awareness 1", id: "Career Awareness 1" },
    { name: "Career Awareness 2", id: "Career Awareness 2" },
    { name: "Job Preparation 1", id: "Job Preparation 1" },
    { name: "Job Preparation 2", id: "Job Preparation 2" },
    { name: "Job Preparation 3", id: "Job Preparation 3" },
    { name: "Industrial Visit", id: "Industrial Visit" },
    { name: "Industry Talk", id: "Industry Talk" }
  ];

  const activityStatus = [
    { name: "Scheduled", id: "scheduled" },
    { name: "Completed", id: "completed" },
    { name: "Cancelled", id: "cancelled" }
  ];

  const [stream, setStream] = useState([]);
  const [isFailed, setIsFailed] = useState(false);

  const classes = useStyles();

  const [collegelist, setcollegelist] = useState([]);
  const [streamlist, setstreamlist] = useState([]);
  const [collegeStreamList, setCollegeStreamList] = useState([]);
  const [activityType, setActivityType] = useState([]);
  const [questionSetData, setQuestionSetData] = useState([]);

  useEffect(() => {
    serviceProvider
      .serviceProviderForGetRequest(QUESTION_SET)
      .then(res => {
        setQuestionSetData(res.data);
      })
      .catch(error => {});
    setLoaderStatus(true);
    getColleges();
    getStreams();
    getActivityTypes();
    setLoaderStatus(false);
  }, []);

  const getActivityTypes = async () => {
    const activityTypeUrl =
      strapiApiConstants.STRAPI_DB_URL +
      strapiApiConstants.STRAPI_ACTIVITY_TYPE;
    await serviceProvider
      .serviceProviderForGetRequest(activityTypeUrl)
      .then(res => {
        setActivityType(res.data);
      })
      .catch(error => {});
  };

  const getStreams = () => {
    axios
      .get(strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STREAMS)
      .then(res => {
        const list = res.data.map(({ id, name }) => ({
          id,
          name
        }));
        setstreamlist(list);

        if (formState.dataForEdit) {
          const streamIds = props.location["dataForEdit"]["streams"].map(
            stream => stream.id
          );
          const selectedStream = list.filter(stream => {
            if (includes(streamIds, stream.id)) {
              return stream;
            }
          });

          setStream(selectedStream);
        }
      });
  };

  useEffect(() => {
    setLoaderStatus(true);
    if (
      formState.values.hasOwnProperty("college") &&
      formState.values["college"] &&
      collegelist.length > 0
    ) {
      const college = collegelist.find(
        college => college.contact.id == formState.values["college"]
      );

      const collegeStreamIds = college.stream_strength.map(s => s.stream.id);
      const list = streamlist.filter(stream => {
        if (includes(collegeStreamIds, stream.id)) {
          return stream;
        }
      });

      setCollegeStreamList(list);
    }

    setLoaderStatus(false);
  }, [formState.values["college"], collegelist, streamlist]);

  const handleSubmit = event => {
    event.preventDefault();
    setLoaderStatus(true);

    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      ActivityFormSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        ActivityFormSchema,
        true,
        dateFrom,
        dateTo
      );
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        ActivityFormSchema
      );
      formState.errors = formUtilities.setErrors(
        formState.values,
        ActivityFormSchema,
        true,
        dateFrom,
        dateTo
      );
    }
    formState.descriptionError = false;

    if (
      convertToRaw(editorState.getCurrentContent()).blocks &&
      convertToRaw(editorState.getCurrentContent()).blocks.length
    ) {
      let arrayToCheckIn = convertToRaw(editorState.getCurrentContent()).blocks;
      let validationCounter = 0;
      let validationMinCounter = 0;
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
      for (let i in arrayToCheckIn) {
        if (
          arrayToCheckIn[i]["text"] &&
          arrayToCheckIn[i]["text"].trim().length > 320
        ) {
          validationMinCounter += 1;
          break;
        }
      }

      if (validationMinCounter !== 0) {
        formState.discriptionMinLengthError = true;
      }
    }
    if (
      isValid &&
      !formState.descriptionError &&
      !formState.discriptionMinLengthError
    ) {
      /** CALL POST FUNCTION */
      postActivityData();

      /** Call axios from here */
      setFormState(formState => ({
        ...formState,
        isValid: true
      }));
    } else {
      setLoaderStatus(false);
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
  };

  const postActivityData = () => {
    let postData;
    if (formState.editActivity) {
      postData = databaseUtilities.editActivity(
        formState.showPreview,
        formState.values["activityname"],
        formState.values["activitytype"],
        formState.values["college"],
        formState.values[dateFrom],
        formState.values[dateTo],
        formState.values["educationyear"],
        formState.values["address"],
        formState.values["cancelled"] ? formState.values["cancelled"] : false,
        draftToHtml(convertToRaw(editorState.getCurrentContent())),
        formState.values["trainer"],
        stream.map(stream => stream.id),
        formState["dataForEdit"]["id"],
        formState.files,
        formState.values["questionSet"],
        formState.values["activitystatus"]
      );
      serviceProvider
        .serviceProviderForPutRequest(
          strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ACTIVITY,
          formState.dataForEdit.id,
          postData
        )
        .then(response => {
          setFormState({ ...formState, isSuccess: true });
          history.push({
            pathname: routeConstants.MANAGE_ACTIVITY,
            isDataEdited: true,
            editedData: response.data,
            fromEditActivity: true
          });
          setLoaderStatus(false);
        })
        .catch(err => {
          setIsFailed(true);
          setLoaderStatus(false);
        });
    } else {
      postData = databaseUtilities.addActivity(
        formState.values["activityname"],
        formState.values["activitytype"],
        formState.values["college"],
        formState.values[dateFrom],
        formState.values[dateTo],
        formState.values["educationyear"],
        formState.values["address"],
        draftToHtml(convertToRaw(editorState.getCurrentContent())),
        formState.values["trainer"],
        stream.map(stream => stream.id),
        formState.files,
        formState.values["questionSet"],
        formState.values["cancelled"]
      );
      serviceProvider
        .serviceProviderForPostRequest(
          strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ACTIVITY,
          postData
        )
        .then(({ data }) => {
          history.push({
            pathname: routeConstants.MANAGE_ACTIVITY,
            isDataAdded: true,
            addedData: data,
            fromAddActivity: true
          });
          setLoaderStatus(false);
        })
        .catch(err => {
          setIsFailed(true);
          setLoaderStatus(false);
        });
    }
  };

  const getColleges = async () => {
    await serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES,
        { pageSize: -1 }
      )
      .then(res => {
        setcollegelist(
          res.data.result.map(({ id, name, contact, stream_strength }) => ({
            id,
            name,
            contact,
            stream_strength
          }))
        );
      });
  };

  const handleChangefile = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,

      values: {
        ...formState.values,
        [e.target.name]: e.target.files[0].name
      },
      touched: {
        ...formState.touched,
        [e.target.name]: true
      },
      files: e.target.files[0],
      previewFile: URL.createObjectURL(e.target.files[0]),
      showPreview: true,
      showEditPreview: false,
      showNoImage: false
    }));
    if (formState.errors.hasOwnProperty(e.target.name)) {
      delete formState.errors[e.target.name];
    }
  };
  const handleChange = e => {
    /** TO SET VALUES IN FORMSTATE */
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

  const handleChangeAutoComplete = (eventName, event, value) => {
    /**TO SET VALUES OF AUTOCOMPLETE */
    if (value !== null) {
      if (eventName === "college") {
        setFormState(formState => ({
          ...formState,
          values: {
            ...formState.values,
            [eventName]: value.contact.id
          },
          touched: {
            ...formState.touched,
            [eventName]: true
          }
        }));
      } else {
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
      }
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
    } else {
      if (eventName === "college") {
        delete formState.values["stream"];
        formState.stream = [];
        setCollegeStreamList([]);
        setStream([]);
      }
      delete formState.values[eventName];
    }
  };

  const handleStreamChange = (eventName, event, value) => {
    /**TO SET VALUES OF AUTOCOMPLETE */
    if (value !== null) {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [eventName]: value
        },
        touched: {
          ...formState.touched,
          [eventName]: true
        }
      }));
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
      setStream(value);
    }
  };

  const handleDateChange = (dateObject, event) => {
    if (formState.errors.hasOwnProperty(dateObject)) {
      delete formState.errors[dateObject];
    }
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [dateObject]: event
      },
      touched: {
        ...formState.touched,
        [dateObject]: true
      },
      isStateClearFilter: false
    }));
  };

  const hasError = field => (formState.errors[field] ? true : false);

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {formState.editActivity
            ? genericConstants.EDIT_ACTIVITY_TEXT
            : genericConstants.ADD_ACTIVITY_TEXT}
        </Typography>
        {isFailed && formState.editActivity ? (
          <Collapse in={isFailed}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setIsFailed(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {genericConstants.ALERT_ERROR_DATA_EDITED_MESSAGE}
            </Alert>
          </Collapse>
        ) : null}
        {isFailed && !formState.editActivity ? (
          <Collapse in={isFailed}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setIsFailed(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {genericConstants.ALERT_ERROR_DATA_ADDED_MESSAGE}
            </Alert>
          </Collapse>
        ) : null}
      </Grid>
      <Grid spacing={3}>
        <Card>
          <form autoComplete="off" noValidate>
            <CardContent>
              <Grid item xs={12} md={6} xl={3}>
                <Grid container className={classes.formgridInputFile}>
                  <Grid item md={10} xs={12}>
                    <div className={classes.imageDiv}>
                      {formState.showPreview ? (
                        <Img
                          alt="abc"
                          loader={<Spinner />}
                          className={classes.UploadImage}
                          src={formState.previewFile}
                        />
                      ) : null}
                      {!formState.showPreview && !formState.showEditPreview ? (
                        <div className={classes.DefaultNoImage}></div>
                      ) : null}
                      {/* {formState.showEditPreview&&formState.dataForEdit.upload_logo===null? <div class={classes.DefaultNoImage}></div>:null} */}
                      {formState.showEditPreview &&
                      formState.dataForEdit["upload_logo"] !== null &&
                      formState.dataForEdit["upload_logo"] !== undefined &&
                      formState.dataForEdit["upload_logo"] !== {} ? (
                        <Img
                          src={
                            strapiApiConstants.STRAPI_DB_URL_WITHOUT_HASH +
                            formState.dataForEdit["upload_logo"]["url"]
                          }
                          loader={<Spinner />}
                          className={classes.UploadImage}
                        />
                      ) : null}
                      {formState.showNoImage ? (
                        <Img
                          src="/images/noImage.png"
                          loader={<Spinner />}
                          className={classes.UploadImage}
                        />
                      ) : null}
                    </div>
                  </Grid>
                </Grid>
                <Grid container className={classes.MarginBottom}>
                  <Grid item md={10} xs={12}>
                    <TextField
                      fullWidth
                      id="files"
                      margin="normal"
                      name="files"
                      placeholder="Upload Logo"
                      onChange={handleChangefile}
                      required
                      type="file"
                      inputProps={{ accept: "image/*" }}
                      //value={formState.values["files"] || ""}
                      error={hasError("files")}
                      helperText={
                        hasError("files")
                          ? formState.errors["files"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      variant="outlined"
                      className={classes.inputFile}
                    />
                    <label htmlFor={get(ActivityFormSchema["files"], "id")}>
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        fullWidth
                        className={classes.InputFileButton}
                        startIcon={<AddOutlinedIcon />}
                      >
                        ADD NEW FILE
                      </Button>
                    </label>
                  </Grid>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={12} xs={12}>
                    <Autocomplete
                      id="activitytype"
                      className={classes.root}
                      options={activityType}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("activitytype", event, value);
                      }}
                      value={
                        activityType[
                          activityType.findIndex(function (item, i) {
                            return item.id === formState.values.activitytype;
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError("activitytype")}
                          label="Activity Type"
                          variant="outlined"
                          name="tester"
                          helperText={
                            hasError("activitytype")
                              ? formState.errors["activitytype"].map(error => {
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
                  <Grid item md={12} xs={12}>
                    <Autocomplete
                      id="activityname"
                      className={classes.root}
                      options={activityNameList}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("activityname", event, value);
                      }}
                      value={
                        activityNameList[
                          activityNameList.findIndex(function (item, i) {
                            return item.id === formState.values["activityname"];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError("activityname")}
                          label="Activity Name"
                          variant="outlined"
                          required
                          name="activityname"
                          helperText={
                            hasError("activityname")
                              ? formState.errors["activityname"].map(error => {
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
                  <Grid item md={12} xs={12} className={"descriptionBox"}>
                    <Grid
                      className={
                        formState.descriptionError ||
                        formState.discriptionMinLengthError
                          ? classes.descriptionBoxError
                          : classes.descriptionBox
                      }
                    >
                      <Card className={classes.streamoffer}>
                        <InputLabel
                          htmlFor="outlined-stream-card"
                          fullwidth={true.toString()}
                          error={
                            formState.descriptionError ||
                            formState.discriptionMinLengthError
                          }
                        >
                          {genericConstants.DESCRIPTION}
                        </InputLabel>
                        <div className="rdw-root">
                          <Editor
                            editorState={editorState}
                            toolbarClassName="rdw-toolbar"
                            wrapperClassName="rdw-wrapper"
                            editorClassName="rdw-editor"
                            value={editorState}
                            onEditorStateChange={data => {
                              formState.descriptionError = false;
                              formState.discriptionMinLengthError = false;
                              setEditorState(data);
                            }}
                          />
                        </div>
                        {formState.descriptionError ? (
                          <FormHelperText error={true}>
                            Description is required
                          </FormHelperText>
                        ) : null}
                        {formState.discriptionMinLengthError ? (
                          <FormHelperText error={true}>
                            Description length should be less than 320
                            characters
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
                      value={formState.values[dateFrom] || null}
                      name={dateFrom}
                      label={get(ActivityFormSchema[dateFrom], "label")}
                      placeholder={get(
                        ActivityFormSchema[dateFrom],
                        "placeholder"
                      )}
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
                      value={formState.values[dateTo] || null}
                      name={dateTo}
                      label={get(ActivityFormSchema[dateTo], "label")}
                      placeholder={get(
                        ActivityFormSchema[dateTo],
                        "placeholder"
                      )}
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
                      label="Address"
                      name="address"
                      value={formState.values["address"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      error={hasError("address")}
                      helperText={
                        hasError("address")
                          ? formState.errors["address"].map(error => {
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
                      options={collegelist}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("college", event, value);
                      }}
                      value={
                        collegelist[
                          collegelist.findIndex(function (item, i) {
                            return item.contact.id === formState.values.college;
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError("college")}
                          label="College"
                          variant="outlined"
                          required
                          name="tester"
                          helperText={
                            hasError("college")
                              ? formState.errors["college"].map(error => {
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
                  <Grid item md={12} xs={12} className={classes.root}>
                    <Autocomplete
                      multiple={true}
                      id="tags-outlined"
                      required
                      options={collegeStreamList}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleStreamChange("stream", event, value);
                      }}
                      value={stream}
                      filterSelectedOptions
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError("stream")}
                          label="Stream"
                          variant="outlined"
                          required
                          name="tester"
                          helperText={
                            hasError("stream")
                              ? formState.errors["stream"].map(error => {
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
                      options={educationyearlist}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("educationyear", event, value);
                      }}
                      value={
                        educationyearlist[
                          educationyearlist.findIndex(function (item, i) {
                            return item.id === formState.values.educationyear;
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError("educationyear")}
                          label="Education Year"
                          variant="outlined"
                          name="tester"
                          helperText={
                            hasError("educationyear")
                              ? formState.errors["educationyear"].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    {formState.editActivity ? (
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Switch
                              name={"cancelled"}
                              checked={formState.values["cancelled"] || false}
                              onChange={handleChange}
                              value={formState.values["cancelled"] || false}
                              error={hasError("cancelled")}
                              helperText={
                                hasError("cancelled")
                                  ? formState.errors["cancelled"].map(error => {
                                      return error + " ";
                                    })
                                  : null
                              }
                            />
                          }
                          label={
                            formState.values["cancelled"]
                              ? "Uncancelled"
                              : "Cancelled"
                          }
                        />
                      </FormGroup>
                    ) : null}
                  </Grid>
                </Grid>
                {formState.editActivity ? (
                  <Grid container spacing={3} className={classes.formgrid}>
                    <Grid item md={6} xs={12}>
                      <Autocomplete
                        id="combo-box-demo"
                        className={classes.root}
                        options={activityStatus}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(
                            "activitystatus",
                            event,
                            value
                          );
                        }}
                        value={
                          activityStatus[
                            activityStatus.findIndex(function (item, i) {
                              return (
                                item.id === formState.values.activitystatus
                              );
                            })
                          ] || null
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError("activitystatus")}
                            label="Activity Status"
                            variant="outlined"
                            name="tester"
                            helperText={
                              hasError("activitystatus")
                                ? formState.errors["activitystatus"].map(
                                    error => {
                                      return error + " ";
                                    }
                                  )
                                : null
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                ) : null}
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label="Trainer Name"
                      name="trainer"
                      value={formState.values["trainer"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      error={hasError("trainer")}
                      helperText={
                        hasError("trainer")
                          ? formState.errors["trainer"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id={"question_set"}
                      className={classes.root}
                      options={questionSetData}
                      placeholder={"Select Question Set"}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("questionSet", event, value);
                      }}
                      required
                      value={
                        questionSetData[
                          questionSetData.findIndex(function (item, i) {
                            return item.id === formState.values["questionSet"];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={"Question-Set"}
                          variant="outlined"
                          required
                          placeholder={"Select Question Set"}
                          error={hasError("questionSet")}
                          helperText={
                            hasError("questionSet")
                              ? formState.errors["questionSet"].map(error => {
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
              <Grid item xs={12} md={6} xl={3}>
                {formState.editActivity ? (
                  <Grid item md={12} xs={12} className={classes.btnspace}>
                    <YellowButton
                      color="primary"
                      type="submit"
                      mfullWidth
                      variant="contained"
                      style={{ marginRight: "18px" }}
                      onClick={handleSubmit}
                    >
                      <span>{genericConstants.SAVE_BUTTON_TEXT}</span>
                    </YellowButton>
                    <GrayButton
                      color="primary"
                      type="submit"
                      mfullWidth
                      variant="contained"
                      onClick={() => {
                        history.push(routeConstants.MANAGE_ACTIVITY);
                      }}
                    >
                      <span>{genericConstants.CANCEL_BUTTON_TEXT}</span>
                    </GrayButton>
                  </Grid>
                ) : (
                  <Grid item md={12} xs={12} className={classes.btnspace}>
                    <YellowButton
                      color="primary"
                      type="submit"
                      mfullWidth
                      variant="contained"
                      style={{ marginRight: "18px" }}
                      onClick={handleSubmit}
                    >
                      <span>{genericConstants.SAVE_BUTTON_TEXT}</span>
                    </YellowButton>
                    <GrayButton
                      color="primary"
                      type="submit"
                      mfullWidth
                      variant="contained"
                      onClick={() => {
                        history.push(routeConstants.MANAGE_ACTIVITY);
                      }}
                    >
                      <span>{genericConstants.CANCEL_BUTTON_TEXT}</span>
                    </GrayButton>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
export default AddEditActivity;
