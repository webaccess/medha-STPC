import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  FormHelperText
} from "@material-ui/core";
import { Auth as auth, InlineDatePicker } from "../../../../components";
import useStyles from "../../../ContainerStyles/AddEditPageStyles";
import * as routeConstants from "../../../../constants/RouteConstants";
import * as _ from "lodash";
import * as genericConstants from "../../../../constants/GenericConstants.js";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Autocomplete from "@material-ui/lab/Autocomplete";
import GrayButton from "../../../../components/GrayButton/GrayButton.js";
import YellowButton from "../../../../components/YellowButton/YellowButton.js";
import * as strapiApiConstants from "../../../../constants/StrapiApiConstants.js";
import * as formUtilities from "../../../../Utilities/FormUtilities.js";
import * as databaseUtilities from "../../../../Utilities/StrapiUtilities.js";
import registrationSchema from "../AddEditStudentSchema";
import { useHistory } from "react-router-dom";
import * as serviceProvider from "../../../../api/Axios.js";
import LoaderContext from "../../../../context/LoaderContext";

const STATES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;
const DISTRICTS_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_DISTRICTS;

const AddEditStudentForCollegeAdmin = props => {
  const { setLoaderStatus } = useContext(LoaderContext);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2000-01-01T21:11:54")
  );

  const defaultParams = {
    pageSize: -1
  };

  const genderlist = [
    { name: "Male", id: "male" },
    { name: "Female", id: "female" }
  ];

  const physicallyHandicappedlist = [
    { name: "Yes", id: true },
    { name: "No", id: false }
  ];

  let history = useHistory();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    fatherFirstName: "",
    fatherLastName: "",
    address: "",
    district: null,
    state: null,
    email: "",
    contactNumber: "",
    userName: "",
    password: "",
    gender: "",
    physicallyHandicapped: null,
    college: null,
    stream: null,
    currentAcademicYear: null,
    collegeRollNumber: null,
    otp: ""
  });

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    showPassword: false,
    addStudent: props.location.addStudent ? props.location.addStudent : false,
    editStudent: props.location.editStudent
      ? props.location.editStudent
      : false,
    dataForEdit: props.location.dataForEdit ? props.location.dataForEdit : [],
    counter: 0
  });

  const { layout: Layout } = props;
  const classes = useStyles();
  const [statelist, setstatelist] = useState([]);
  const [districtlist, setdistrictlist] = useState([]);
  const [streamlist, setStreamlist] = useState([]);
  const [collegelist] = useState([auth.getUserInfo().college]);

  useEffect(() => {
    if (!formState.editStudent && !formState.addStudent) {
      history.push({
        pathname: routeConstants.MANAGE_STUDENT
      });
    } else if (formState.addStudent) {
      formState.values["college"] = auth.getUserInfo().college.id;
    }

    if (formState.editStudent) {
      registrationSchema["password"]["required"] = false;
      registrationSchema["password"]["validations"] = {};
    } else if (formState.addStudent) {
      registrationSchema["password"]["required"] = true;
      registrationSchema["password"]["validations"] = {
        required: {
          value: "true",
          message: "Password is required"
        }
      };
    }

    getStates();
    getDistrict();
    getStreams();
  }, []);

  const getStreams = () => {
    let streamsArray = [];
    for (let i in auth.getUserInfo().college.stream_strength) {
      streamsArray.push(
        auth.getUserInfo().college.stream_strength[i]["stream"]
      );
    }
    setStreamlist(streamsArray);
  };

  const getStates = () => {
    serviceProvider
      .serviceProviderForGetRequest(STATES_URL, defaultParams, {})
      .then(res => {
        setstatelist(res.data.result.map(({ id, name }) => ({ id, name })));
      });
  };

  const getDistrict = () => {
    serviceProvider
      .serviceProviderForGetRequest(DISTRICTS_URL, defaultParams)
      .then(res => {
        setdistrictlist(res.data.result.map(({ id, name }) => ({ id, name })));
      });
  };

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
      if (props.location["dataForEdit"]["studentInfo"]["date_of_birth"]) {
        setSelectedDate(
          new Date(
            props.location["dataForEdit"]["studentInfo"]["date_of_birth"]
          )
        );
      }
    }
    formState.counter += 1;
  }

  const handleSubmit = event => {
    setLoaderStatus(true);
    let schema;
    if (formState.editStudent) {
      schema = Object.assign({}, _.omit(registrationSchema, ["otp"]));
    } else {
      schema = registrationSchema;
    }
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      schema
    );
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
    if (isValid) {
      /** CALL POST FUNCTION */
      postStudentData();

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
        selectedDate.getFullYear() +
          "-" +
          (selectedDate.getMonth() + 1) +
          "-" +
          selectedDate.getDate(),
        formState.values["physicallyHandicapped"],
        formState.values["college"],
        formState.values["stream"],
        parseInt(formState.values["rollnumber"]),
        formState.dataForEdit.id,
        formState.values["password"] ? formState.values["password"] : undefined
      );
      let studentName =
        props.location["dataForEdit"]["first_name"] +
        " " +
        props.location["dataForEdit"]["studentInfo"]["father_first_name"] +
        " " +
        props.location["dataForEdit"]["last_name"];
      serviceProvider
        .serviceProviderForPutRequest(
          strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STUDENT,
          formState.dataForEdit.studentInfo.id,
          postData
        )
        .then(response => {
          setLoaderStatus(false);
          history.push({
            pathname: routeConstants.MANAGE_STUDENT,
            fromEditStudent: true,
            isStudentEdited: true,
            messageForEditStudent:
              "Student " + studentName + " has been edited successfully."
          });
        })
        .catch(err => {
          setLoaderStatus(false);
          console.log(JSON.stringify(err));
          history.push({
            pathname: routeConstants.MANAGE_STUDENT,
            fromEditStudent: true,
            isStudentEdited: false,
            messageForEditStudent:
              "An error has occured while updating student " +
              studentName +
              ". Kindly, try again."
          });
        });
    } else {
      postData = databaseUtilities.addStudentFromCollege(
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
        selectedDate.getFullYear() +
          "-" +
          (selectedDate.getMonth() + 1) +
          "-" +
          selectedDate.getDate(),
        formState.values["physicallyHandicapped"],
        formState.values["college"],
        formState.values["stream"],
        parseInt(formState.values["rollnumber"])
      );
      let url =
        strapiApiConstants.STRAPI_DB_URL +
        strapiApiConstants.STRAPI_COLLEGES +
        "/" +
        auth.getUserInfo().college.id +
        "/studentregister";
      serviceProvider
        .serviceProviderForPostRequest(url, postData)
        .then(response => {
          setLoaderStatus(false);
          history.push({
            pathname: routeConstants.MANAGE_STUDENT,
            fromAddStudent: true,
            isStudentAdded: true,
            messageForAddStudent:
              "Student " +
              formState.values["firstname"] +
              " " +
              formState.values["fatherFirstName"] +
              " " +
              formState.values["lastname"] +
              " has been added successfully"
          });
        })
        .catch(err => {
          setLoaderStatus(false);
          console.log(err);
          history.push({
            pathname: routeConstants.MANAGE_STUDENT,
            fromAddStudent: true,
            isStudentAdded: false,
            messageForAddStudent:
              "An error has occured while adding student " +
              formState.values["firstname"] +
              " " +
              formState.values["fatherFirstName"] +
              " " +
              formState.values["lastname"] +
              ". Kindly, try again. "
          });
        });
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
      <Grid item xs={12} className={classes.title}>
        {formState.editStudent ? (
          <Typography variant="h4" gutterBottom>
            Edit Student
          </Typography>
        ) : (
          <Typography variant="h4" gutterBottom>
            Add Student
          </Typography>
        )}
      </Grid>
      <Grid>
        <Card>
          <form autoComplete="off">
            <CardContent>
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label="First Name"
                      name="firstname"
                      value={formState.values["firstname"] || ""}
                      variant="outlined"
                      error={hasError("firstname")}
                      required
                      fullWidth
                      onChange={handleChange}
                      helperText={
                        hasError("firstname")
                          ? formState.errors["firstname"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label="Last Name"
                      name="lastname"
                      value={formState.values["lastname"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      error={hasError("lastname")}
                      onChange={handleChange}
                      helperText={
                        hasError("lastname")
                          ? formState.errors["lastname"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label="Father's First Name"
                      name="fatherFirstName"
                      value={formState.values["fatherFirstName"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      error={hasError("fatherFirstName")}
                      helperText={
                        hasError("fatherFirstName")
                          ? formState.errors["fatherFirstName"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label="Father's Last Name"
                      name="fatherLastName"
                      value={formState.values["fatherLastName"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      error={hasError("fatherLastName")}
                      helperText={
                        hasError("fatherLastName")
                          ? formState.errors["fatherLastName"].map(error => {
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
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="states-filter"
                      className={classes.root}
                      options={statelist}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("state", event, value);
                      }}
                      value={
                        statelist[
                          statelist.findIndex(function (item, i) {
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
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="district-filter"
                      className={classes.root}
                      options={districtlist}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("district", event, value);
                      }}
                      value={
                        districtlist[
                          districtlist.findIndex(function (item, i) {
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
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <InlineDatePicker
                      // variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Date of Birth"
                      value={selectedDate}
                      onChange={date => setSelectedDate(date)}
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
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="gender-filter"
                      className={classes.root}
                      options={genderlist}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("gender", event, value);
                      }}
                      value={
                        genderlist[
                          genderlist.findIndex(function (item, i) {
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
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label="Contact Number"
                      name="contact"
                      value={formState.values["contact"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
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
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="physically-handicapped-id"
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
                          physicallyHandicappedlist.findIndex(function (
                            item,
                            i
                          ) {
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
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label="Email-Id"
                      name="email"
                      value={formState.values["email"] || ""}
                      variant="outlined"
                      required
                      fullWidth
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
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={12} xs={12}>
                    <Autocomplete
                      id="college-filter"
                      className={classes.root}
                      options={collegelist}
                      getOptionLabel={option => option.name}
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
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="stream-filter"
                      className={classes.root}
                      options={streamlist}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("stream", event, value);
                      }}
                      value={
                        streamlist[
                          streamlist.findIndex(function (item, i) {
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
                  <Grid item md={6} xs={12}>
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
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label="Username"
                      name="username"
                      value={formState.values["username"] || ""}
                      variant="outlined"
                      required
                      fullWidth
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
                  <Grid item md={6} xs={12}>
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
                        value={formState.values[user.password]}
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
                        labelWidth={70}
                      />
                      <FormHelperText error={hasError("password")}>
                        {hasError("password")
                          ? formState.errors["password"].map(error => {
                              return error + " ";
                            })
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item md={12} xs={12} className={classes.btnspace}>
                  <YellowButton
                    color="primary"
                    type="submit"
                    mfullWidth
                    variant="contained"
                    style={{ marginRight: "18px" }}
                    onClick={event => {
                      event.preventDefault();
                      handleSubmit(event);
                    }}
                  >
                    <span>{genericConstants.SAVE_BUTTON_TEXT}</span>
                  </YellowButton>
                  <GrayButton
                    color="primary"
                    type="submit"
                    mfullWidth
                    variant="contained"
                    onClick={() => {
                      history.push(routeConstants.MANAGE_STUDENT);
                    }}
                  >
                    <span>{genericConstants.CANCEL_BUTTON_TEXT}</span>
                  </GrayButton>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
    // </Layout>
  );
};
export default AddEditStudentForCollegeAdmin;
