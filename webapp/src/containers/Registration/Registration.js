import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Box
} from "@material-ui/core";
import axios from "axios";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Logo from "../../components/Logo/Logo.js";
import Button from "../../components/GreenButton/GreenButton.js";
import * as authPageConstants from "../../constants/AuthPageConstants.js";
import { makeStyles } from "@material-ui/core/styles";

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
    confirmpassword: "",
    gender: "",
    physicallyChallanged: null,
    college: null,
    stream: null,
    currentAcademicYear: null,
    collegeRollNumber: null
  });
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2014-08-18T21:11:54")
  );

  const [labelWidth, setLabelWidth] = React.useState(0);
  const inputLabel = React.useRef(null);
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

  const getStreams = () => {
    axios.get("http://localhost:1337/streams").then(res => {
      setstreamlist(res.data.map(({ id, name }) => ({ id, name })));
    });
  };

  const getColleges = () => {
    axios.get("http://localhost:1337/colleges").then(res => {
      setcollegelist(res.data.map(({ id, name }) => ({ id, name })));
    });
  };

  const getStates = () => {
    axios.get("http://localhost:1337/states").then(res => {
      //   const sanitzedOptions = res.data.map(state => {
      //     return {
      //       id: state.id,
      //       name: state.name
      //     };
      //   });
      setstatelist(res.data.map(({ id, name }) => ({ id, name })));
    });
  };

  const getDistrict = () => {
    axios.get("http://localhost:1337/districts").then(res => {
      //   const sanitzedOptions = res.data.map(district => {
      //     return {
      //       id: district.id,
      //       name: district.name
      //     };
      //   });
      setdistrictlist(res.data.map(({ id, name }) => ({ id, name })));
    });
  };

  return (
    <Card>
      {console.log(districtlist)}
      {console.log(statelist)}
      {console.log(user)}

      <Box p={3} mt={3} bgcolor="black">
        <Logo />
      </Box>
      <Container>
        <form autoComplete="off">
          <CardHeader title="Student Registration" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  label="First Name"
                  name="firstname"
                  value={user.firstName}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    setUser({ ...user, firstName: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Last Name"
                  name="lastname"
                  value={user.lastName}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    setUser({ ...user, lastName: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Father's First Name"
                  name="fatherfirstname"
                  value={user.fatherFirstName}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    setUser({ ...user, fatherFirstName: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Father's Last Name"
                  name="fatherlastname"
                  value={user.fatherLastName}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    setUser({ ...user, fatherLastName: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={user.address}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    setUser({ ...user, address: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControl
                  // className={classes.formControl}
                  variant="outlined"
                  fullWidth
                >
                  <InputLabel
                    /*ref={inputLabel}*/ id="demo-simple-select-label"
                  >
                    State
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    // labelWidth={labelWidth}
                    id="demo-simple-select"
                    placeholder="Add state"
                    onChange={event => {
                      console.log(event.target);
                      setUser({ ...user, state: event.target.value });
                    }}
                    value={user.state || ""}
                  >
                    {statelist.map(state => {
                      return (
                        <MenuItem key={state.id} value={state.id}>
                          {state.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControl
                  // className={classes.formControl}
                  variant="outlined"
                  fullWidth
                >
                  <InputLabel
                    /*ref={inputLabel}*/ id="demo-simple-select-label"
                  >
                    District
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    // labelWidth={labelWidth}
                    id="demo-simple-select"
                    placeholder="Add district"
                    onChange={event => {
                      console.log(event.target);
                      setUser({ ...user, district: event.target.value });
                    }}
                    value={user.district || ""}
                  >
                    {districtlist.map(district => {
                      return (
                        <MenuItem key={district.id} value={district.id}>
                          {district.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={4} xs={12}>
                <TextField
                  label="Contact Number"
                  name="contactnumber"
                  value={user.contactNumber}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    setUser({ ...user, contactNumber: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date of Birth"
                    value={selectedDate}
                    onChange={date => setSelectedDate(date)}
                    KeyboardButtonProps={{
                      "aria-label": "change date"
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControl
                  // className={classes.formControl}
                  variant="outlined"
                  fullWidth
                >
                  <InputLabel
                    /*ref={inputLabel}*/ id="demo-simple-select-label"
                  >
                    Gender
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    // labelWidth={labelWidth}
                    id="demo-simple-select"
                    placeholder="Gender"
                    onChange={event => {
                      console.log(event.target);
                      setUser({ ...user, gender: event.target.value });
                    }}
                    value={user.gender || ""}
                  >
                    <MenuItem key={1} value="male">
                      Male
                    </MenuItem>

                    <MenuItem key={2} value="female">
                      Female
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControl
                  // className={classes.formControl}
                  variant="outlined"
                  fullWidth
                >
                  <InputLabel
                    /*ref={inputLabel}*/ id="demo-simple-select-label"
                  >
                    Physically Challenged
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    // labelWidth={labelWidth}
                    id="demo-simple-select"
                    placeholder="Physically Challenged"
                    onChange={event => {
                      console.log(event.target);
                      setUser({
                        ...user,
                        physicallyChallanged: event.target.value
                      });
                    }}
                    value={user.physicallyChallanged || ""}
                  >
                    <MenuItem key={1} value="true">
                      Yes
                    </MenuItem>

                    <MenuItem key={2} value="false">
                      No
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl
                  // className={classes.formControl}
                  variant="outlined"
                  fullWidth
                >
                  <InputLabel
                    /*ref={inputLabel}*/ id="demo-simple-select-label"
                  >
                    College
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    // labelWidth={labelWidth}
                    id="demo-simple-select"
                    placeholder="Add College"
                    onChange={event => {
                      console.log(event.target);
                      setUser({ ...user, college: event.target.value });
                    }}
                    value={user.college || ""}
                  >
                    {collegelist.map(college => {
                      return (
                        <MenuItem key={college.id} value={college.id}>
                          {college.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl
                  // className={classes.formControl}
                  variant="outlined"
                  fullWidth
                >
                  <InputLabel
                    /*ref={inputLabel}*/ id="demo-simple-select-label"
                  >
                    Streams
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    // labelWidth={labelWidth}
                    id="demo-simple-select"
                    placeholder="Add Stream"
                    onChange={event => {
                      console.log(event.target);
                      setUser({ ...user, stream: event.target.value });
                    }}
                    value={user.stream || ""}
                  >
                    {streamlist.map(stream => {
                      return (
                        <MenuItem key={stream.id} value={stream.id}>
                          {stream.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl
                  // className={classes.formControl}
                  variant="outlined"
                  fullWidth
                >
                  <InputLabel
                    /*ref={inputLabel}*/ id="demo-simple-select-label"
                  >
                    Current Academic Year
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    // labelWidth={labelWidth}
                    id="demo-simple-select"
                    placeholder="current academic year"
                    onChange={event => {
                      console.log(event.target);
                      setUser({
                        ...user,
                        currentAcademicYear: event.target.value
                      });
                    }}
                    value={user.currentAcademicYear || ""}
                  >
                    <MenuItem key={1} value="2019-20">
                      2019-20
                    </MenuItem>

                    <MenuItem key={2} value="2018-19">
                      2018-19
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  label="College Roll Number "
                  name="collegerollnumber"
                  value={user.collegeRollNumber}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    setUser({ ...user, collegeRollNumber: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  label="User Name"
                  name="username"
                  value={user.userName}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    setUser({ ...user, userName: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Email-Id"
                  name="emailid"
                  value={user.email}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    setUser({ ...user, email: event.target.value })
                  }
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={user.password}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    setUser({ ...user, password: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Confirm Password"
                  name="confirmpassword"
                  type="password"
                  value={user.confirmpassword}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={event =>
                    setUser({ ...user, confirmpassword: event.target.value })
                  }
                />
              </Grid>
              <Grid item md={12} xs={12} style={{ textAlign: "end" }}>
                <Button
                  color="primary"
                  type="submit"
                  mfullWidth
                  variant="contained"
                >
                  {authPageConstants.REGISTER}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Container>
    </Card>
  );
};
export default Registration;
