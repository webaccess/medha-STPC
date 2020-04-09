import React, { useState, useEffect } from "react";
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
} from "@material-ui/core";
import Spinner from "../../components/Spinner/Spinner.js";
import CloseIcon from "@material-ui/icons/Close";

import * as routeConstants from "../../constants/RouteConstants";

import * as genericConstants from "../../constants/GenericConstants.js";

import Autocomplete from "@material-ui/lab/Autocomplete";
import CustomDateTimePicker from "../../components/CustomDateTimePicker/CustomDateTimePicker.js";
import Alert from "../../components/Alert/Alert.js";
import GrayButton from "../../components/GrayButton/GrayButton.js";
import YellowButton from "../../components/YellowButton/YellowButton.js";
import * as authPageConstants from "../../constants/AuthPageConstants.js";
import { makeStyles } from "@material-ui/core/styles";
import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import * as formUtilities from "../../Utilities/FormUtilities.js";
import * as databaseUtilities from "../../Utilities/StrapiUtilities.js";

import Img from "react-image";
import { useHistory } from "react-router-dom";
import * as serviceProvider from "../../api/Axios.js";
import ActivityFormSchema from "./ActivityFormSchema";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  root: {
    maxWidth: "100%",
  },
  btnspace: {
    padding: "20px 18px 20px",
  },
  btnspaceadd: {
    padding: "0px 15px 15px",
  },
  formgrid: {
    marginTop: theme.spacing(0),
    alignItems: "center",
  },
  divider: {
    marginTop: "15px",
    marginBottom: "15px",
  },
  add_more_btn: {
    float: "right",
  },
  streamcard: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "15px !important",
    position: "relative",
    "& label": {
      position: "absolute",
      top: "-8px",
      backgroundColor: "#fff",
    },
  },
  streamoffer: {
    paddingLeft: "15px",
    paddingRight: "15px",
    borderRadius: "0px",
    boxShadow: "none !important",
  },
  streamcardcontent: {
    boxShadow: "none",
    borderBottom: "1px solid #ccc",
    marginBottom: "15px",
    borderRadius: "0px",
  },
  title: {
    display: "flex",
    marginBottom: theme.spacing(1),
    "& h4": {
      flex: "1",
      fontWeight: "700",
    },
  },
  CardActionGrid: {
    backgroundColor: "#EEEEEE",
  },
  MarginBottom: {
    marginBottom: "10px",
  },
  toolbarMargin: {
    marginTop: theme.spacing(2),
    border: "1px solid",
  },
}));

const AddEditActivity = (props) => {
  let history = useHistory();

  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
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
    files: {},
    previewFile: {},
    showPreview: false,
    showEditPreview: props.location.editActivity
      ? props.location.editActivity
      : false,
    showNoImage: props.location.editActivity
      ? false
      : props.location.editActivity,
  });
  const [selectedDateFrom, setSelectedDateFrom] = React.useState(new Date());
  const [selectedDateTo, setSelectedDateTo] = React.useState(new Date());

  const activitytypelist = [
    { name: "Workshop", id: "workshop" },
    { name: "Training", id: "training" },
    { name: "Industrial Visit", id: "industrialVisit" },
  ];

  const educationyearlist = [
    { name: "First", id: "First" },
    { name: "Second", id: "Second" },
    { name: "Third", id: "Third" },
    { name: "Fourth", id: "Fourth" },
  ];

  const [isFailed, setIsFailed] = useState(false);

  const classes = useStyles();

  const [collegelist, setcollegelist] = useState([]);
  const [streamlist, setstreamlist] = useState([]);
  const [academicyearlist, setacademicyearlist] = useState([]);
  useEffect(() => {
    getColleges();
    getStreams();

    // setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  if (formState.dataForEdit && !formState.counter) {
    if (props.location["dataForEdit"]) {
      if (props.location["dataForEdit"]["title"]) {
        formState.values["activityname"] =
          props.location["dataForEdit"]["title"];
      }
      if (props.location["dataForEdit"]["activity_type"]) {
        formState.values["activitytype"] =
          props.location["dataForEdit"]["activity_type"];
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
        const id = props.location["dataForEdit"]["streams"].map((stream) => {
          return stream.id;
        });
        formState["stream"] = id;
      }
      if (props.location["dataForEdit"]["address"]) {
        formState.values["address"] = props.location["dataForEdit"]["address"];
      }
      if (props.location["dataForEdit"]["education_year"]) {
        formState.values["educationyear"] =
          props.location["dataForEdit"]["education_year"];
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
        props.location["dataForEdit"]["college"] &&
        props.location["dataForEdit"]["college"]["id"]
      ) {
        formState.values["college"] =
          props.location["dataForEdit"]["college"]["id"];
      }
      if (props.location["dataForEdit"]["start_date_time"]) {
        setSelectedDateFrom(
          new Date(props.location["dataForEdit"]["start_date_time"])
        );
      }
      if (props.location["dataForEdit"]["end_date_time"]) {
        setSelectedDateTo(
          new Date(props.location["dataForEdit"]["end_date_time"])
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

  const handleSubmit = (event) => {
    event.preventDefault();

    let schema;
    // if (formState.editActivity) {
    //   schema = Object.assign(
    //     {},
    //     _.omit(registrationSchema, ["password", "otp"])
    //   );
    // } else {
    //   schema = registrationSchema;
    // }
    console.log(schema);
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      ActivityFormSchema
    );
    console.log(checkAllFieldsValid);
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        ActivityFormSchema
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
        ActivityFormSchema
      );
    }
    console.log(isValid, formState);
    if (isValid) {
      /** CALL POST FUNCTION */
      console.log("postcall");
      postActivityData();

      /** Call axios from here */
      setFormState((formState) => ({
        ...formState,
        isValid: true,
      }));
    } else {
      setFormState((formState) => ({
        ...formState,
        isValid: false,
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
        selectedDateFrom.getFullYear() +
          "-" +
          (selectedDateFrom.getMonth() + 1 < 10
            ? "0" + (selectedDateFrom.getMonth() + 1)
            : selectedDateFrom.getMonth() + 1) +
          "-" +
          (selectedDateFrom.getDate() < 10
            ? "0" + selectedDateFrom.getDate()
            : selectedDateFrom.getDate()) +
          "T" +
          (selectedDateFrom.getHours() < 10
            ? "0" + selectedDateFrom.getHours()
            : selectedDateFrom.getHours()) +
          ":" +
          (selectedDateFrom.getMinutes() < 10
            ? "0" + selectedDateFrom.getMinutes()
            : selectedDateFrom.getMinutes()),
        selectedDateTo.getFullYear() +
          "-" +
          (selectedDateFrom.getMonth() + 1 < 10
            ? "0" + (selectedDateFrom.getMonth() + 1)
            : selectedDateFrom.getMonth() + 1) +
          "-" +
          (selectedDateTo.getDate() < 10
            ? "0" + selectedDateTo.getDate()
            : selectedDateTo.getDate()) +
          "T" +
          (selectedDateTo.getHours() < 10
            ? "0" + selectedDateTo.getHours()
            : selectedDateTo.getHours()) +
          ":" +
          (selectedDateTo.getMinutes() < 10
            ? "0" + selectedDateTo.getMinutes()
            : selectedDateTo.getMinutes()),
        formState.values["educationyear"],
        formState.values["address"],
        draftToHtml(convertToRaw(editorState.getCurrentContent())),
        formState.values["trainer"],
        formState["stream"],
        formState["dataForEdit"]["id"],
        formState.files
      );

      serviceProvider
        .serviceProviderForPutRequest(
          strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ACTIVITY,
          formState.dataForEdit.id,
          postData
        )
        .then((response) => {
          console.log("Success");

          setFormState({ ...formState, isSuccess: true });
          history.push({
            pathname: routeConstants.MANAGE_ACTIVITY,
            isDataEdited: true,
            editedData: response.data,
            fromEditActivity: true,
          });
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          setIsFailed(true);
        });
    } else {
      postData = databaseUtilities.addActivity(
        formState.values["activityname"],
        formState.values["activitytype"],
        formState.values["college"],
        selectedDateFrom.getFullYear() +
          "-" +
          (selectedDateFrom.getMonth() + 1 < 10
            ? "0" + (selectedDateFrom.getMonth() + 1)
            : selectedDateFrom.getMonth() + 1) +
          "-" +
          (selectedDateFrom.getDate() < 10
            ? "0" + selectedDateFrom.getDate()
            : selectedDateFrom.getDate()) +
          "T" +
          (selectedDateFrom.getHours() < 10
            ? "0" + selectedDateFrom.getHours()
            : selectedDateFrom.getHours()) +
          ":" +
          (selectedDateFrom.getMinutes() < 10
            ? "0" + selectedDateFrom.getMinutes()
            : selectedDateFrom.getMinutes()),
        selectedDateTo.getFullYear() +
          "-" +
          (selectedDateFrom.getMonth() + 1 < 10
            ? "0" + (selectedDateFrom.getMonth() + 1)
            : selectedDateFrom.getMonth() + 1) +
          "-" +
          (selectedDateTo.getDate() < 10
            ? "0" + selectedDateTo.getDate()
            : selectedDateTo.getDate()) +
          "T" +
          (selectedDateTo.getHours() < 10
            ? "0" + selectedDateTo.getHours()
            : selectedDateTo.getHours()) +
          ":" +
          (selectedDateTo.getMinutes() < 10
            ? "0" + selectedDateTo.getMinutes()
            : selectedDateTo.getMinutes()),
        formState.values["educationyear"],
        formState.values["address"],
        draftToHtml(convertToRaw(editorState.getCurrentContent())),
        formState.values["trainer"],
        formState["stream"],
        formState.files
      );
      console.log(postData);
      serviceProvider
        .serviceProviderForPostRequest(
          strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ACTIVITY,
          postData
        )
        .then((response) => {
          console.log(response);
          history.push({
            pathname: routeConstants.MANAGE_ACTIVITY,
            isDataAdded: true,
            addedData: response,
            fromAddActivity: true,
          });
          // ImageUpload(response);
        })
        .catch((err) => {
          console.log(err);
          setIsFailed(true);
        });
      console.log(postData);
    }
  };

  const getStreams = () => {
    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STREAMS
      )
      .then((res) => {
        console.log(res);
        setstreamlist(res.data.result.map(({ id, name }) => ({ id, name })));
      });
  };

  const getColleges = () => {
    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES
      )
      .then((res) => {
        console.log(res);
        setcollegelist(res.data.result.map(({ id, name }) => ({ id, name })));
      });
  };

  const handleChangefile = (e) => {
    e.persist();
    setFormState((formState) => ({
      ...formState,

      values: {
        ...formState.values,
        [e.target.name]: e.target.files[0].name,
      },
      touched: {
        ...formState.touched,
        [e.target.name]: true,
      },
      files: e.target.files[0],
      previewFile: URL.createObjectURL(e.target.files[0]),
      showPreview: true,
      showEditPreview: false,
      showNoImage: false,
    }));
    if (formState.errors.hasOwnProperty(e.target.name)) {
      delete formState.errors[e.target.name];
    }
  };
  const handleChange = (e) => {
    /** TO SET VALUES IN FORMSTATE */
    e.persist();
    setFormState((formState) => ({
      ...formState,

      values: {
        ...formState.values,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      },
      touched: {
        ...formState.touched,
        [e.target.name]: true,
      },
    }));
    if (formState.errors.hasOwnProperty(e.target.name)) {
      delete formState.errors[e.target.name];
    }
  };

  const handleChangeAutoComplete = (eventName, event, value) => {
    /**TO SET VALUES OF AUTOCOMPLETE */
    console.log("value is:  ");
    console.log(value);

    if (value !== null) {
      if (eventName === "stream") {
        const id = value.map((stream) => {
          return stream.id;
        });
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            [eventName]: value,
          },
          touched: {
            ...formState.touched,
            [eventName]: true,
          },
          stream: id,
        }));
      } else {
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            [eventName]: value.id,
          },
          touched: {
            ...formState.touched,
            [eventName]: true,
          },
        }));
      }
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
    } else {
      delete formState.values[eventName];
    }
  };

  const hasError = (field) => (formState.errors[field] ? true : false);

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
          <form autoComplete="off">
            <CardContent>
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label="Activity Name"
                      name="activityname"
                      value={formState.values["activityname"]}
                      variant="outlined"
                      error={hasError("activityname")}
                      required
                      fullWidth
                      onChange={handleChange}
                      helperText={
                        hasError("activityname")
                          ? formState.errors["activityname"].map((error) => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
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
                            value={editorState}
                            onEditorStateChange={(data) => {
                              setEditorState(data);
                            }}
                          />
                        </div>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container spacing={3} className={classes.Datetime}>
                  <Grid item md={6} xs={12}>
                    <CustomDateTimePicker
                      variant="inline"
                      format="dd/MM/yyyy HH:mm"
                      margin="normal"
                      required
                      id="date-picker-inline"
                      label="Date & Time From"
                      value={selectedDateFrom}
                      onChange={(date) => setSelectedDateFrom(date)}
                      error={hasError("datefrom")}
                      helperText={
                        hasError("datefrom")
                          ? formState.errors["datefrom"].map((error) => {
                              return error + " ";
                            })
                          : null
                      }
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomDateTimePicker
                      variant="inline"
                      format="dd/MM/yyyy HH:mm"
                      margin="normal"
                      required
                      id="date-picker-inline"
                      label="Date & Time To"
                      value={selectedDateTo}
                      onChange={(date) => setSelectedDateTo(date)}
                      error={hasError("dateto")}
                      helperText={
                        hasError("dateto")
                          ? formState.errors["dateto"].map((error) => {
                              return error + " ";
                            })
                          : null
                      }
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
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
                          ? formState.errors["address"].map((error) => {
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
                      getOptionLabel={(option) => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("college", event, value);
                      }}
                      value={
                        collegelist[
                          collegelist.findIndex(function (item, i) {
                            return item.id === formState.values.college;
                          })
                        ] || null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={hasError("college")}
                          label="College"
                          variant="outlined"
                          required
                          name="tester"
                          helperText={
                            hasError("college")
                              ? formState.errors["college"].map((error) => {
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
                      options={streamlist}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("stream", event, value);
                      }}
                      value={formState.values.stream}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={hasError("stream")}
                          label="Stream"
                          variant="outlined"
                          required
                          name="tester"
                          helperText={
                            hasError("stream")
                              ? formState.errors["stream"].map((error) => {
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
              {/* <Grid item md={4} xs={12}>
                <TextField
                  label="Marks"
                  name="marks"
                  value={formState.values["marks"] || ""}
                  variant="outlined"
                  required
                  fullWidth
                  disabled={formState.editActivity ? true : false}
                  onChange={handleChange}
                  error={hasError("marks")}
                  helperText={
                    hasError("marks")
                      ? formState.errors["marks"].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </Grid> */}
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="combo-box-demo"
                      className={classes.root}
                      options={educationyearlist}
                      getOptionLabel={(option) => option.name}
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
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={hasError("educationyear")}
                          label="Education Year"
                          variant="outlined"
                          name="tester"
                          helperText={
                            hasError("educationyear")
                              ? formState.errors["educationyear"].map(
                                  (error) => {
                                    return error + " ";
                                  }
                                )
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
                      options={activitytypelist}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("activitytype", event, value);
                      }}
                      value={
                        activitytypelist[
                          activitytypelist.findIndex(function (item, i) {
                            return item.id === formState.values.activitytype;
                          })
                        ] || null
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={hasError("activitytype")}
                          label="Activity Type"
                          variant="outlined"
                          name="tester"
                          helperText={
                            hasError("activitytype")
                              ? formState.errors["activitytype"].map(
                                  (error) => {
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
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={12} xs={12}>
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
                          ? formState.errors["trainer"].map((error) => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={12} xs={12}>
                    {console.log(formState.values.files)}
                    {formState.showPreview ? (
                      <Img
                        alt="abc"
                        loader={<Spinner />}
                        width="100%"
                        height="100%"
                        src={formState.previewFile}
                      />
                    ) : null}
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
                        width="100%"
                        height="100%"
                      />
                    ) : null}
                    {formState.showNoImage ? (
                      <Img
                        src="/images/noImage.png"
                        loader={<Spinner />}
                        width="100%"
                        height="100%"
                      />
                    ) : null}
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <TextField
                      fullWidth
                      id="files"
                      margin="normal"
                      name="files"
                      placeholder="Upload Logo"
                      onChange={handleChangefile}
                      required
                      type="file"
                      //value={formState.values["files"] || ""}
                      error={hasError("files")}
                      helperText={
                        hasError("files")
                          ? formState.errors["files"].map((error) => {
                              return error + " ";
                            })
                          : null
                      }
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
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
