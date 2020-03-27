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

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
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
    editStudent: props.location.editStudent
      ? props.location.editStudent
      : false,
    dataForEdit: props.location.dataForEdit
      ? props.location.dataForEdit
      : false,
    counter: 0
  });
  const [selectedDateFrom, setSelectedDateFrom] = React.useState(new Date());
  const [selectedDateTo, setSelectedDateTo] = React.useState(new Date());

  const genderlist = [
    { name: "Male", id: "male" },
    { name: "Female", id: "female" }
  ];

  const physicallyHandicappedlist = [
    { name: "Yes", id: true },
    { name: "No", id: false }
  ];
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const { layout: Layout } = props;
  const classes = useStyles();

  const [statelist, setstatelist] = useState([]);
  const [districtlist, setdistrictlist] = useState([]);
  const [collegelist, setcollegelist] = useState([]);
  const [streamlist, setstreamlist] = useState([]);

  useEffect(() => {
    getStates();
    getDistrict();
    getColleges();
    getStreams();

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
    // if (formState.editStudent) {
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
      schema
    );
    console.log(checkAllFieldsValid);
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(formState.values, schema);

      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        schema
      );
      formState.errors = formUtilities.setErrors(formState.values, schema);
    }
    console.log(isValid, formState);
    if (isValid) {
      /** CALL POST FUNCTION */
      console.log("postcall");
      // postStudentData();

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

  const postStudentData = () => {
    let postData;
    if (formState.editStudent) {
      postData = databaseUtilities.editStudent(
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
      postData = databaseUtilities.addStudent(
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
        formState.values["password"],
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
        formState.values.otp
      );
      console.log(postData);
      axios
        .post(
          strapiApiConstants.STRAPI_DB_URL +
            strapiApiConstants.STRAPI_REGISTER_STUDENT,
          postData
        )
        .then(response => {
          console.log(response);
          history.push(routeConstants.REGISTERED);
        })
        .catch(err => {
          console.log(err);
        });
    }
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
          {formState.editStudent
            ? genericConstants.EDIT_STUDENT_PROFILE
            : genericConstants.ADD_ACTIVITY}
        </Typography>
        {isFailed && formState.editStudent ? (
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
        {isFailed && !formState.editStudent ? (
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
                    format="dd/MM/yyyy"
                    margin="normal"
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
                  <KeyboardDatePicker
                    // variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
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
              <Grid item md={3} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={statelist}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("state", event, value);
                  }}
                  value={
                    statelist[
                      statelist.findIndex(function(item, i) {
                        return item.id === formState.values.state;
                      })
                    ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={hasError("state")}
                      label="State"
                      variant="outlined"
                      name="tester"
                      helperText={
                        hasError("state")
                          ? formState.errors["state"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={districtlist}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("district", event, value);
                  }}
                  value={
                    districtlist[
                      districtlist.findIndex(function(item, i) {
                        return item.id === formState.values.district;
                      })
                    ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={hasError("district")}
                      label="District"
                      variant="outlined"
                      name="tester"
                      helperText={
                        hasError("district")
                          ? formState.errors["district"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item md={3} xs={12}>
                <TextField
                  label="Contact Number"
                  name="contact"
                  value={formState.values["contact"] || ""}
                  variant="outlined"
                  required
                  fullWidth
                  readOnly
                  disabled
                  error={hasError("contact")}
                  helperText={
                    hasError("contact")
                      ? formState.errors["contact"].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    // variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date of Birth"
                    // value={selectedDate}
                    // onChange={date => setSelectedDate(date)}
                    error={hasError("dateofbirth")}
                    helperText={
                      hasError("dateofbirth")
                        ? formState.errors["dateofbirth"].map(error => {
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
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={genderlist}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("gender", event, value);
                  }}
                  value={
                    genderlist[
                      genderlist.findIndex(function(item, i) {
                        return item.id === formState.values.gender;
                      })
                    ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={hasError("gender")}
                      label="Gender"
                      required
                      variant="outlined"
                      name="tester"
                      helperText={
                        hasError("gender")
                          ? formState.errors["gender"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  label="Email-Id"
                  name="email"
                  value={formState.values["email"] || ""}
                  variant="outlined"
                  required
                  fullWidth
                  disabled={formState.editStudent ? true : false}
                  onChange={handleChange}
                  error={hasError("email")}
                  helperText={
                    hasError("email")
                      ? formState.errors["email"].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={collegelist}
                  disabled={formState.editStudent ? true : false}
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
              <Grid item md={3} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={streamlist}
                  disabled={formState.editStudent ? true : false}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("stream", event, value);
                  }}
                  value={
                    streamlist[
                      streamlist.findIndex(function(item, i) {
                        return item.id === formState.values.stream;
                      })
                    ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={hasError("stream")}
                      label="Stream"
                      variant="outlined"
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

              <Grid item md={3} xs={12}>
                <TextField
                  label="College Roll Number "
                  name="rollnumber"
                  value={formState.values["rollnumber"] || ""}
                  variant="outlined"
                  fullWidth
                  required
                  onChange={handleChange}
                  error={hasError("rollnumber")}
                  helperText={
                    hasError("rollnumber")
                      ? formState.errors["rollnumber"].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </Grid>
              <Grid item md={3} xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  value={formState.values["username"] || ""}
                  variant="outlined"
                  required
                  fullWidth
                  disabled={formState.editStudent ? true : false}
                  onChange={handleChange}
                  error={hasError("username")}
                  helperText={
                    hasError("username")
                      ? formState.errors["username"].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </Grid>

              {formState.editStudent ? null : (
                <Grid item md={3} xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel
                      htmlFor="outlined-adornment-password"
                      fullWidth
                      error={hasError("password")}
                    >
                      Password
                    </InputLabel>
                    <OutlinedInput
                      label="Password"
                      name="password"
                      type={formState.showPassword ? "text" : "password"}
                      // value={formState.values[user.password]}
                      required
                      fullWidth
                      onChange={handleChange}
                      error={hasError("password")}
                      helperText={
                        hasError("password")
                          ? formState.errors["password"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      endAdornment={
                        <InputAdornment
                          position="end"
                          error={hasError("password")}
                        >
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {formState.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              )}
              <Grid item md={3} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={physicallyHandicappedlist}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete(
                      "physicallyHandicapped",
                      event,
                      value
                    );
                  }}
                  value={
                    physicallyHandicappedlist[
                      physicallyHandicappedlist.findIndex(function(item, i) {
                        return (
                          item.id === formState.values.physicallyHandicapped
                        );
                      })
                    ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={hasError("physicallyHandicapped")}
                      label="Physically Handicapped"
                      variant="outlined"
                      name="tester"
                      helperText={
                        hasError("physicallyHandicapped")
                          ? formState.errors["physicallyHandicapped"].map(
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
              {formState.editStudent ? (
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
                    <span>{authPageConstants.REGISTER}</span>
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
