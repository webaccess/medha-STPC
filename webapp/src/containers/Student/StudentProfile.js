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

import * as serviceProvider from "../../api/Axios.js";

import Button from "../../components/GreenButton/GreenButton.js";
import * as authPageConstants from "../../constants/AuthPageConstants.js";
import { makeStyles } from "@material-ui/core/styles";
import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import * as formUtilities from "../../Utilities/FormUtilities.js";
import * as databaseUtilities from "../../Utilities/StrapiUtilities.js";
import registrationSchema from "../Registration/RegistrationSchema.js";
import { useHistory } from "react-router-dom";
import {
  Alert,
  Auth as auth,
  Validation as validateInput
} from "../../components";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const StudentProfile = props => {
  let history = useHistory();
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    fatherFirstName: "",
    fatherLastName: "",
    address: "",
    district: null,
    state: null,
    email: "",
    contact: "",
    username: "",
    password: "",
    gender: "",
    physicallyHandicapped: null,
    college: null,
    stream: null,
    currentAcademicYear: null,
    rollnumber: null
  });

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    showPassword: false
  });
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2000-01-01T21:11:54")
  );
  const classes = useStyles();

  const genderlist = [
    { name: "Male", id: "male" },
    { name: "Female", id: "female" }
  ];

  const physicallyHandicappedlist = [
    { name: "Yes", id: true },
    { name: "No", id: false }
  ];

  const [statelist, setstatelist] = useState([]);
  const [districtlist, setdistrictlist] = useState([]);
  const [collegelist, setcollegelist] = useState([]);
  const [streamlist, setstreamlist] = useState([]);

  useEffect(() => {
    getStates();
    getDistrict();
    getColleges();
    getStreams();
    handleSetDetails();
    // setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  useEffect(() => {
    setFormState(formState => ({
      ...formState,

      values: user
    }));
  }, [user]);
  const handleSetDetails = () => {
    let details = auth.getUserInfo();
    serviceProvider
      .serviceProviderForGetOneRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STUDENT,
        2
      )
      .then(response => {
        details = response.data;
        console.log(details);
        setUser({
          ...user,
          firstname: details.user.first_name,
          lastname: details.user.last_name,
          username: details.user.username,
          email: details.user.email,
          state: details.user.state,
          college: details.user.college,
          contact: details.user.contact_number,
          fatherFirstName: details.father_first_name,
          fatherLastName: details.father_last_name,
          address: details.address,
          rollnumber: details.roll_number.toString(),
          gender: details.gender,
          district: details.district.id,
          stream: details.stream.id,
          physicallyHandicapped: details.physicallyHandicapped
        });
        setSelectedDate(details.date_of_birth);
      })
      .catch(err => {
        console.log(err);
      });
  };

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
      //  postStudentData();

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
    <Card>
      {console.log(auth.getUserInfo())}
      {console.log(props)}
      {console.log(formState)}
      {console.log(collegelist)}
      {console.log(user)}
      <form autoComplete="off">
        <CardHeader title="Edit Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                label="First Name"
                name="firstname"
                value={formState.values["firstname"] || ""}
                variant="outlined"
                error={hasError("firstname")}
                required
                fullWidth
                onChange={e => {
                  handleChange(e);
                  setUser({ ...user, firstname: e.target.value });
                }}
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
                onChange={e => {
                  handleChange(e);
                  setUser({ ...user, lastname: e.target.value });
                }}
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
            <Grid item md={4} xs={12}>
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
                      return item.id === user.state;
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
            <Grid item md={4} xs={12}>
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
                      return item.id === user.district;
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

            <Grid item md={4} xs={12}>
              <TextField
                label="Contact Number"
                name="contact"
                value={formState.values["contact"] || ""}
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
                options={genderlist}
                getOptionLabel={option => option.name}
                onChange={(event, value) => {
                  handleChangeAutoComplete("gender", event, value);
                }}
                value={
                  genderlist[
                    genderlist.findIndex(function(item, i) {
                      return item.id === user.gender;
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
            <Grid item md={4} xs={12}>
              <TextField
                label="Email-Id"
                name="email"
                value={formState.values["email"] || ""}
                variant="outlined"
                required
                fullWidth
                readOnly
                // onChange={e=>{handleChange(e);
                // setUser({...user,email:e.target.value})}}
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
                  setUser({ ...user, college: value.id });
                }}
                value={
                  collegelist[
                    collegelist.findIndex(function(item, i) {
                      return item.id === user.college;
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
            <Grid item md={6} xs={12}>
              <Autocomplete
                id="combo-box-demo"
                className={classes.root}
                options={streamlist}
                getOptionLabel={option => option.name}
                onChange={(event, value) => {
                  handleChangeAutoComplete("stream", event, value);
                }}
                value={
                  streamlist[
                    streamlist.findIndex(function(item, i) {
                      return item.id === user.stream;
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
                value={formState.values["username"] || ""}
                variant="outlined"
                required
                fullWidth
                readOnly
                // onChange={e=>{handleChange(e);
                // setUser({...user,username:e.target.value})}}
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
                      return item.id === user.physicallyHandicapped;
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
  );
};

export default StudentProfile;
