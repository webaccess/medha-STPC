import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  FormControl,
  Divider,
  InputLabel,
  IconButton,
  InputAdornment,
  OutlinedInput
} from "@material-ui/core";
import * as routeConstants from "../../constants/RouteConstants";
import { Redirect } from "../../../node_modules/react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Button from "../../components/GreenButton/GreenButton.js";
import * as authPageConstants from "../../constants/AuthPageConstants.js";
import { makeStyles } from "@material-ui/core/styles";
import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import * as formUtilities from "../../Utilities/FormUtilities.js";
import * as databaseUtilities from "../../Utilities/StrapiUtilities.js";
import registrationSchema from "../Registration/RegistrationSchema.js";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const Registration = props => {
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
    contactNumber: props.prop.location.state.contactNumber,
    userName: "",
    password: "",
    gender: "",
    physicallyHandicapped: null,
    college: null,
    stream: null,
    currentAcademicYear: null,
    collegeRollNumber: null,
    otp: props.prop.location.state.otp
  });

  const [formState, setFormState] = useState({
    isValid: false,
    values: { contact: props.prop.location.state.contactNumber },
    touched: {},
    errors: {},
    isSuccess: false,
    showPassword: false
  });
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2000-01-01T21:11:54")
  );
  const { layout: Layout } = props.prop;
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

  const handleSubmit = event => {
    event.preventDefault();

    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      registrationSchema
    );
    console.log(checkAllFieldsValid);
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        registrationSchema
      );

      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        registrationSchema
      );
      formState.errors = formUtilities.setErrors(
        formState.values,
        registrationSchema
      );
    }
    console.log(isValid, formState);
    if (isValid) {
      /** CALL POST FUNCTION */
      console.log("postcall");
      postStudentData();

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
    let postData = databaseUtilities.addStudent(
      formState.values["firstname"],
      formState.values["lastname"],
      formState.values["fatherFirstName"],
      formState.values["fatherLastName"],
      formState.values["address"],
      formState.values["state"],
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
      parseInt(formState.values["rollnumber"]),
      user.otp
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
    <Layout>
      <Card>
        {console.log(props)}
        {console.log(formState)}
        {console.log(districtlist)}
        {console.log(statelist)}
        {console.log(user)}
        <form autoComplete="off">
          <CardHeader title="Student Registration" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  label="First Name"
                  name="firstname"
                  value={formState.values[user.firstName]}
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
                  value={formState.values[user.lastName]}
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
              <Grid item md={6} xs={12}>
                <TextField
                  label="Father's First Name"
                  name="fatherFirstName"
                  value={formState.values[user.fatherFirstName]}
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
                  value={formState.values[user.fatherLastName]}
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
              <Grid item md={12} xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={formState.values[user.address]}
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
              <Grid item md={4} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={statelist}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("state", event, value);
                  }}
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
              <Grid item md={4} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={districtlist}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("district", event, value);
                  }}
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

              <Grid item md={4} xs={12}>
                <TextField
                  label="Contact Number"
                  name="contact"
                  value={user.contactNumber}
                  variant="outlined"
                  required
                  fullWidth
                  readOnly
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
              <Grid item md={4} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    variant="inline"
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
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item md={4} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={[
                    { name: "Male", id: "male" },
                    { name: "Female", id: "female" }
                  ]}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("gender", event, value);
                  }}
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
              <Grid item md={4} xs={12}>
                <TextField
                  label="Email-Id"
                  name="email"
                  value={formState.values[user.email]}
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
              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={collegelist}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("college", event, value);
                  }}
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
              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={streamlist}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete("stream", event, value);
                  }}
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
                  value={formState.values[user.collegeRollNumber]}
                  variant="outlined"
                  fullWidth
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
              <Grid item md={6} xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  value={formState.values[user.userName]}
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
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <Autocomplete
                  id="combo-box-demo"
                  className={classes.root}
                  options={[
                    { name: "Yes", id: true },
                    { name: "No", id: false }
                  ]}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete(
                      "physicallyHandicapped",
                      event,
                      value
                    );
                  }}
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
              <Grid item md={12} xs={12} style={{ textAlign: "end" }}>
                <Button
                  color="primary"
                  type="submit"
                  mfullWidth
                  variant="contained"
                  onClick={handleSubmit}
                >
                  <span style={{ margin: "10px" }}>
                    {authPageConstants.REGISTER}
                  </span>
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
    </Layout>
  );
};
export default Registration;
