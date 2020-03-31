import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  Divider,
  InputLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Collapse
} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import CloseIcon from "@material-ui/icons/Close";
import { Auth as auth } from "../../components";
import * as routeConstants from "../../constants/RouteConstants";
import * as _ from "lodash";
import * as genericConstants from "../../constants/GenericConstants.js";
import { Redirect } from "react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
  KeyboardDateTimePicker
} from "@material-ui/pickers";
import Alert from "../../components/Alert/Alert.js";
import GrayButton from "../../components/GrayButton/GrayButton.js";
import YellowButton from "../../components/YellowButton/YellowButton.js";
import * as authPageConstants from "../../constants/AuthPageConstants.js";
import { makeStyles } from "@material-ui/core/styles";
import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import * as formUtilities from "../../Utilities/FormUtilities.js";
import * as databaseUtilities from "../../Utilities/StrapiUtilities.js";
//import registrationSchema from "./RegistrationSchema.js";
import { useHistory } from "react-router-dom";
import * as serviceProvider from "../../api/Axios.js";
import ActivityFormSchema from "./ActivityFormSchema";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%",
    "& > * + *": {
      marginTop: theme.spacing(3)
    }
  },
  btnspace: {
    padding: "0px 18px 50px"
  },
  formgrid: {
    marginTop: theme.spacing(2),
    alignItems: "center"
  },
  divider: {
    marginTop: "15px",
    marginBottom: "15px"
  },
  addcollegetextfield: {
    padding: "25px"
  }
}));

const AddEditActivity = props => {
  let history = useHistory();

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
    files: {}
  });
  const [selectedDateFrom, setSelectedDateFrom] = React.useState(new Date());
  const [selectedDateTo, setSelectedDateTo] = React.useState(new Date());

  const activitytypelist = [
    { name: "Workshop", id: "workshop" },
    { name: "Training", id: "training" },
    { name: "Industrial Visit", id: "industrialVisit" }
  ];

  const educationyearlist = [
    { name: "First", id: "First" },
    { name: "Second", id: "Second" },
    { name: "Third", id: "Third" },
    { name: "Fourth", id: "Fourth" }
  ];
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const { layout: Layout } = props;
  const classes = useStyles();

  const [statelist, setstatelist] = useState([]);
  const [districtlist, setdistrictlist] = useState([]);
  const [collegelist, setcollegelist] = useState([]);
  const [streamlist, setstreamlist] = useState([]);
  const [zonelist, setzonelist] = useState([]);
  const [rpclist, setrpclist] = useState([]);
  const [academicyearlist, setacademicyearlist] = useState([]);
  useEffect(() => {
    getStates();
    getDistrict();
    getColleges();
    getStreams();
    getZones();
    getRpc();
    getAcademicYear();
    // setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  if (formState.dataForEdit && !formState.counter) {
    if (props.location["dataForEdit"]) {
      if (props.location["dataForEdit"]["first_name"]) {
        formState.values["firstname"] =
          props.location["dataForEdit"]["first_name"];
      }
      if (props.location["dataForEdit"]["last_name"]) {
        formState.values["lastname"] =
          props.location["dataForEdit"]["last_name"];
      }
      if (props.location["dataForEdit"]["email"]) {
        formState.values["email"] = props.location["dataForEdit"]["email"];
      }
      if (props.location["dataForEdit"]["contact_number"]) {
        formState.values["contact"] =
          props.location["dataForEdit"]["contact_number"];
      }
      if (props.location["dataForEdit"]["username"]) {
        formState.values["username"] =
          props.location["dataForEdit"]["username"];
      }

      if (
        props.location["dataForEdit"]["state"] &&
        props.location["dataForEdit"]["state"]["id"]
      ) {
        formState.values["state"] =
          props.location["dataForEdit"]["state"]["id"];
      }
      if (
        props.location["dataForEdit"]["studentInfo"]["stream"] &&
        props.location["dataForEdit"]["studentInfo"]["stream"]["id"]
      ) {
        formState.values["stream"] =
          props.location["dataForEdit"]["studentInfo"]["stream"]["id"];
      }

      if (
        props.location["dataForEdit"]["studentInfo"]["district"] &&
        props.location["dataForEdit"]["studentInfo"]["district"]["id"]
      ) {
        formState.values["district"] =
          props.location["dataForEdit"]["studentInfo"]["district"]["id"];
      }

      if (props.location["dataForEdit"]["studentInfo"]["father_first_name"]) {
        formState.values["fatherFirstName"] =
          props.location["dataForEdit"]["studentInfo"]["father_first_name"];
      }
      if (props.location["dataForEdit"]["studentInfo"]["father_last_name"]) {
        formState.values["fatherLastName"] =
          props.location["dataForEdit"]["studentInfo"]["father_last_name"];
      }
      if (props.location["dataForEdit"]["studentInfo"]["address"]) {
        formState.values["address"] =
          props.location["dataForEdit"]["studentInfo"]["address"];
      }
      if (props.location["dataForEdit"]["studentInfo"]["gender"]) {
        formState.values["gender"] =
          props.location["dataForEdit"]["studentInfo"]["gender"];
      }

      if (props.location["dataForEdit"]["studentInfo"]["roll_number"]) {
        formState.values["rollnumber"] =
          props.location["dataForEdit"]["studentInfo"]["roll_number"];
      }

      if (props.location["dataForEdit"]["studentInfo"]) {
        formState.values["physicallyHandicapped"] =
          props.location["dataForEdit"]["studentInfo"]["physicallyHandicapped"];
      }
      if (
        props.location["dataForEdit"]["college"] &&
        props.location["dataForEdit"]["college"]["id"]
      ) {
        formState.values["college"] =
          props.location["dataForEdit"]["college"]["id"];
      }
      // if (props.location["dataForEdit"]["studentInfo"]["date_of_birth"]) {
      //   setSelectedDate(
      //     new Date(
      //       props.location["dataForEdit"]["studentInfo"]["date_of_birth"]
      //     )
      //   );
      // }
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

  const handleSubmit = event => {
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

  const postActivityData = () => {
    let postData;
    if (formState.editActivity) {
      postData = databaseUtilities.editActivity(
        formState.values["firstname"],
        formState.values["lastname"],
        formState.values["fatherFirstName"],
        formState.values["fatherLastName"],
        formState.values["address"],
        formState.values["state"],
        formState.values["district"],
        formState.values["email"],
        formState.values["contact"],
        formState.values["username"],
        formState.values["gender"],
        // selectedDate.getFullYear() +
        //   "-" +
        //   (selectedDate.getMonth() + 1) +
        //   "-" +
        //   selectedDate.getDate(),
        formState.values["physicallyHandicapped"],
        formState.values["college"],
        formState.values["stream"],
        parseInt(formState.values["rollnumber"]),
        formState.dataForEdit.id
      );
      console.log(postData);
      console.log(formState.dataForEdit.id);
      serviceProvider
        .serviceProviderForPutRequest(
          strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STUDENT,
          formState.dataForEdit.studentInfo.id,
          postData
        )
        .then(response => {
          console.log(response);
          console.log("Success");
          setIsSuccess(true);
          setFormState({ ...formState, isSuccess: true });
          history.push({
            pathname: routeConstants.VIEW_PROFILE,
            success: true
          });
        })
        .catch(err => {
          console.log(err);
          console.log(err.response.data);
          console.log(JSON.stringify(err));
          setIsFailed(true);
        });
    } else {
      postData = databaseUtilities.addActivity(
        formState.values["activityname"],
        formState.values["activitytype"],
        formState.values["academicyear"],
        formState.values["college"],
        selectedDateFrom.getFullYear() +
          "-" +
          (selectedDateFrom.getMonth() + 1 < 9
            ? "0" + (selectedDateFrom.getMonth() + 1)
            : selectedDateFrom.getMonth() + 1) +
          "-" +
          (selectedDateFrom.getDate() < 9
            ? "0" + selectedDateFrom.getDate()
            : selectedDateFrom.getDate()) +
          "T" +
          (selectedDateFrom.getHours() < 9
            ? "0" + selectedDateFrom.getHours()
            : selectedDateFrom.getHours()) +
          ":" +
          (selectedDateFrom.getMinutes() < 9
            ? "0" + selectedDateFrom.getMinutes()
            : selectedDateFrom.getMinutes()),
        selectedDateTo.getFullYear() +
          "-" +
          (selectedDateFrom.getMonth() + 1 < 9
            ? "0" + (selectedDateFrom.getMonth() + 1)
            : selectedDateFrom.getMonth() + 1) +
          "-" +
          selectedDateTo.getDate() +
          "T" +
          selectedDateTo.getHours() +
          ":" +
          selectedDateTo.getMinutes(),
        formState.values["educationyear"],
        formState.values["address"],
        formState.values["description"],
        formState.values["trainer"],
        formState.values["stream"]
      );
      console.log(postData);
      serviceProvider
        .serviceProviderForPostRequest(
          strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ACTIVITY,
          postData
        )
        .then(response => {
          console.log(response);
          ImageUpload(response);
        })
        .catch(err => {
          console.log(err);
          setIsFailed(true);
        });
      console.log(postData);
    }
  };

  const ImageUpload = response => {
    console.log(response);
    let ImageData = databaseUtilities.uploadDocument(
      formState.files,
      "activity",
      response.data.id,
      "upload_logo"
    );
    console.log(ImageData);
    serviceProvider
      .serviceProviderForPostRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_UPLOAD,
        ImageData
      )
      .then(res => {
        console.log(res);
        //setIsSuccess(true);
        history.push(routeConstants.MANAGE_ACTIVITY);
      })
      .catch(error => {
        console.log(error);
        setIsFailed(true);
      });
  };
  const getAcademicYear = () => {
    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_ACADEMIC_YEARS
      )
      .then(response => {
        console.log(response);
        setacademicyearlist(
          response.data.result.map(({ id, name }) => ({ id, name }))
        );
      })
      .catch(err => {
        console.log(err);
      });
  };
  const getZones = () => {
    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ZONES
      )
      .then(response => {
        console.log(response);
        setzonelist(response.data.result.map(({ id, name }) => ({ id, name })));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getRpc = () => {
    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_RPCS
      )
      .then(response => {
        console.log(response);
        setrpclist(response.data.result.map(({ id, name }) => ({ id, name })));
      })
      .catch(err => {
        console.log(err);
      });
  };
  const getStreams = () => {
    axios
      .get(strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STREAMS)
      .then(res => {
        console.log(res);
        setstreamlist(res.data.result.map(({ id, name }) => ({ id, name })));
      });
  };

  const getColleges = () => {
    axios
      .get(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES
      )
      .then(res => {
        console.log(res);
        setcollegelist(res.data.result.map(({ id, name }) => ({ id, name })));
      });
  };

  const getStates = () => {
    axios
      .get(strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES)
      .then(res => {
        console.log(res);
        //   const sanitzedOptions = res.data.map(state => {
        //     return {
        //       id: state.id,
        //       name: state.name
        //     };
        //   });
        setstatelist(res.data.result.map(({ id, name }) => ({ id, name })));
      });
  };

  const getDistrict = () => {
    axios
      .get(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_DISTRICTS
      )
      .then(res => {
        console.log(res);
        //   const sanitzedOptions = res.data.map(district => {
        //     return {
        //       id: district.id,
        //       name: district.name
        //     };
        //   });
        setdistrictlist(res.data.result.map(({ id, name }) => ({ id, name })));
      });
  };
  const handleChangefile = e => {
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
      },
      files: e.target.files[0]
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
    console.log("value is:  ");
    console.log(value);

    if (value !== null) {
      if (eventName === "stream") {
        const id = value.map(stream => {
          return stream.id;
        });
        setFormState(formState => ({
          ...formState,
          values: {
            ...formState.values,
            [eventName]: id
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
      delete formState.values[eventName];
    }
  };

  const handleClickShowPassword = () => {
    setFormState({
      ...formState,
      showPassword: !formState.showPassword
    });
  };

  const hasError = field => (formState.errors[field] ? true : false);

  return (
    <Grid>
      {console.log(formState)}
      {console.log(selectedDateFrom)}
      {console.log(selectedDateTo)}
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {formState.editActivity
            ? genericConstants.EDIT_STUDENT_PROFILE
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
      <Card>
        {console.log(props)}
        {console.log(formState)}
        {console.log(districtlist)}
        {console.log(statelist)}
        <form autoComplete="off">
          <CardContent>
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
                      ? formState.errors["activityname"].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formState.values["description"]}
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  rows="3"
                  error={hasError("description")}
                  onChange={handleChange}
                  helperText={
                    hasError("description")
                      ? formState.errors["description"].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDateTimePicker
                    // variant="inline"
                    format="dd/MM/yyyy HH:mm"
                    margin="normal"
                    required
                    id="date-picker-inline"
                    label="Date & Time From"
                    value={selectedDateFrom}
                    onChange={date => setSelectedDateFrom(date)}
                    error={hasError("datefrom")}
                    helperText={
                      hasError("datefrom")
                        ? formState.errors["datefrom"].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date"
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item md={3} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDateTimePicker
                    // variant="inline"
                    format="dd/MM/yyyy HH:mm"
                    margin="normal"
                    required
                    id="date-picker-inline"
                    label="Date & Time To"
                    value={selectedDateTo}
                    onChange={date => setSelectedDateTo(date)}
                    error={hasError("dateto")}
                    helperText={
                      hasError("dateto")
                        ? formState.errors["dateto"].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change date"
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  id="files"
                  margin="normal"
                  name="files"
                  placeholder="Upload Logo"
                  onChange={handleChangefile}
                  required
                  type="file"
                  value={formState.values["files"] || ""}
                  error={hasError("files")}
                  helperText={
                    hasError("files")
                      ? formState.errors["files"].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                  variant="outlined"
                />
              </Grid>
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
              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={collegelist}
                  disabled={formState.editActivity ? true : false}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("college", event, value);
                  }}
                  value={
                    collegelist[
                      collegelist.findIndex(function(item, i) {
                        return item.id === formState.values.college;
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

              <Grid item md={6} xs={12} className={classes.root}>
                <Autocomplete
                  multiple={true}
                  id="tags-outlined"
                  required
                  options={streamlist}
                  disabled={formState.editActivity ? true : false}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("stream", event, value);
                  }}
                  // value={
                  //   streamlist[
                  //     streamlist.findIndex(function(item, i) {
                  //       return item.id === formState.values.stream;
                  //     })
                  //   ] || null
                  // }
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
              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={academicyearlist}
                  disabled={formState.editActivity ? true : false}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("academicyear", event, value);
                  }}
                  value={
                    academicyearlist[
                      academicyearlist.findIndex(function(item, i) {
                        return item.id === formState.values.academicyear;
                      })
                    ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={hasError("academicyear")}
                      label="Academic Year"
                      variant="outlined"
                      name="tester"
                      helperText={
                        hasError("academicyear")
                          ? formState.errors["academicyear"].map(error => {
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
                  options={educationyearlist}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("educationyear", event, value);
                  }}
                  value={
                    educationyearlist[
                      educationyearlist.findIndex(function(item, i) {
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
                  id="combo-box-demo"
                  className={classes.root}
                  options={activitytypelist}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("activitytype", event, value);
                  }}
                  value={
                    activitytypelist[
                      activitytypelist.findIndex(function(item, i) {
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
                      history.push(routeConstants.VIEW_PROFILE);
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
                    onClick={handleSubmit}
                  >
                    <span>{authPageConstants.CREATE_ACTIVITY}</span>
                  </YellowButton>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </form>
      </Card>
    </Grid>
  );
};
export default AddEditActivity;
