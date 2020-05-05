import React, { useState, useEffect, useContext } from "react";
import {
  Auth as auth,
  Typography,
  YellowButton,
  GrayButton,
  ReadOnlyTextField
} from "../../components";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Collapse,
  IconButton
} from "@material-ui/core";
import * as routeConstants from "../../constants/RouteConstants";

import * as genericConstants from "../../constants/GenericConstants.js";

import * as serviceProvider from "../../api/Axios.js";
import CloseIcon from "@material-ui/icons/Close";

import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import { useHistory } from "react-router-dom";
import Alert from "../../components/Alert/Alert.js";
import useStyles from "../ContainerStyles/ViewPageStyles.js";
import LoaderContext from "../../context/LoaderContext";
import SetIndexContext from "../../context/SetIndexContext";

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
    dataofbirth: "",
    gender: "",
    physicallyHandicapped: null,
    college: null,
    stream: null,
    rollnumber: null,
    futureAspirations: null
  });
  const { setLoaderStatus } = useContext(LoaderContext);

  const futureAspirationsList = [
    { id: "private_job", name: "Private Job" },
    { id: "others", name: "Others" },
    { id: "higher_studies", name: "Higher Studies" },
    { id: "marriage", name: "Marriage" },
    { id: "entrepreneurship", name: "Entrepreneurship" },
    { id: "government_jobs", name: "Government Job" },
    { id: "apprenticeship", name: "Apprenticeship" }
  ];

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    details: {},
    isSuccess: false,
    editable: false,
    showPassword: false,
    counter: 0,
    fromAddStudentToRecruitmentDrive:
      props["location"]["fromAddStudentToRecruitmentDrive"],
    fromEventStudentList: props["location"]["fromEventStudentList"],
    fromManageStudentList: props["location"]["fromManageStudentList"],
    eventId: props["location"]["eventId"],
    eventTitle: props["location"]["eventTitle"]
  });
  const classes = useStyles();
  const { setIndex } = useContext(SetIndexContext);
  setIndex(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoaderStatus(true);
    handleSetDetails();
    if (props.location.success && !formState.counter) {
      setSuccess(true);
      formState.counter += 1;
    }
    setLoaderStatus(false);
    // setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  useEffect(() => {
    setFormState(formState => ({
      ...formState,

      values: user
    }));
  }, [user]);
  async function handleSetDetails() {
    let paramsForEvent = null;
    if (auth.getUserInfo() && auth.getUserInfo().role) {
      if (auth.getUserInfo().role.name === "Medha Admin") {
        paramsForEvent = props["location"]["dataForStudent"];
      } else if (auth.getUserInfo().role.name === "Student") {
        paramsForEvent = props.data ? props.data.id : auth.getUserInfo().id;
      } else if (auth.getUserInfo().role.name === "College Admin") {
        paramsForEvent = props["location"]["dataForStudent"];
      }
      if (paramsForEvent !== null && paramsForEvent !== undefined) {
        await serviceProvider
          .serviceProviderForGetOneRequest(
            strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_USERS,
            paramsForEvent
          )
          .then(res => {
            const data = res.data.result;
            let date = new Date(data.studentInfo.date_of_birth);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let dt = date.getDate();
            if (dt < 10) {
              dt = "0" + dt;
            }
            if (month < 10) {
              month = "0" + month;
            }
            setFormState({ ...formState, details: data });
            setUser({
              ...user,
              firstname: data.first_name,
              lastname: data.last_name,
              username: data.username,
              email: data.email,
              state: data.state ? data.state.name : "",
              college: data.college.name,
              contact: data.contact_number,
              fatherFirstName: data.studentInfo.father_first_name,
              fatherLastName: data.studentInfo.father_last_name,
              address: data.studentInfo.address,
              rollnumber: data.studentInfo.roll_number.toString(),
              dataofbirth: dt + "/" + month + "/" + year,
              gender: data.studentInfo.gender,
              district: data.studentInfo.district
                ? data.studentInfo.district.name
                : "",
              stream: data.studentInfo.stream.name,
              physicallyHandicapped: data.studentInfo.physicallyHandicapped,
              futureAspirations:
                futureAspirationsList[
                  futureAspirationsList.findIndex(function (item, i) {
                    return item.id === data.studentInfo.future_aspirations;
                  })
                ] || null
            });
            setLoaderStatus(false);
          })
          .catch(err => {
            console.log(err);
            setLoaderStatus(false);
          });
      } else {
        history.push({
          pathname: routeConstants.DASHBOARD_URL
        });
        setLoaderStatus(false);
      }
    }
    setLoaderStatus(false);
  }

  const editData = () => {
    if (auth.getUserInfo().role.name === "Student") {
      history.push({
        pathname: routeConstants.EDIT_PROFILE,
        editStudent: true,
        dataForEdit: formState.details
      });
    } else if (auth.getUserInfo().role.name === "College Admin") {
      history.push({
        pathname: routeConstants.EDIT_STUDENT_FROM_COLLEGE_ADMIN,
        dataForEdit: formState.details,
        editStudent: true
      });
    }
  };

  const handleClickCancel = event => {
    event.preventDefault();
    if (formState.fromAddStudentToRecruitmentDrive) {
      history.push({
        pathname: routeConstants.ADD_STUDENT_DRIVE,
        eventId: formState.eventId,
        eventTitle: formState.eventTitle
      });
    } else if (formState.fromEventStudentList) {
      history.push({
        pathname: routeConstants.EVENT_STUDENT_LIST,
        eventId: formState.eventId,
        eventTitle: formState.eventTitle
      });
    } else if (formState.fromManageStudentList) {
      history.push({
        pathname: routeConstants.MANAGE_STUDENT,
        eventId: formState.eventId,
        eventTitle: formState.eventTitle
      });
    }
  };

  return (
    <Grid>
      {console.log(formState)}
      {success ? (
        <Collapse in={success}>
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setSuccess(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {genericConstants.ALERT_SUCCESS_DATA_EDITED_MESSAGE}
          </Alert>
        </Collapse>
      ) : null}
      <Grid item xs={12} className={classes.title}>
        {auth.getUserInfo().role.name === "College Admin" ? (
          <Typography variant="h4" gutterBottom>
            View Student
          </Typography>
        ) : null}
      </Grid>
      <Grid spacing={3}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="firstname"
                    label="First Name"
                    defaultValue={formState.values.firstname}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="lastname"
                    label="Last Name"
                    defaultValue={formState.values.lastname}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="fathersFirstName"
                    label="Father's First Name"
                    defaultValue={formState.values.fatherFirstName}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="fathersLastName"
                    label="Father's Last Name"
                    defaultValue={formState.values.fatherLastName}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={12} xs={12}>
                  <ReadOnlyTextField
                    id="address"
                    label="Address"
                    defaultValue={formState.values.address}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="state"
                    label="State"
                    defaultValue={formState.values.state}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="district"
                    label="District"
                    defaultValue={formState.values.district}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="dateOfBirth"
                    label="Date Of Birth"
                    defaultValue={formState.values.dataofbirth}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="gender"
                    label="Gender"
                    defaultValue={formState.values.gender}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="contact"
                    label="Contact"
                    defaultValue={formState.values.contact}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="physicallyHandicapped"
                    label="Physically Handicapped"
                    defaultValue={
                      formState.values.physicallyHandicapped ? "Yes" : "No"
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={12} xs={12}>
                  <ReadOnlyTextField
                    id="email"
                    label="Email"
                    defaultValue={formState.values.email}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={12} xs={12}>
                  <ReadOnlyTextField
                    id="college"
                    label="College"
                    defaultValue={formState.values.college}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="stream"
                    label="Stream"
                    defaultValue={formState.values.stream}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="rollNumber"
                    label="College Roll Number"
                    defaultValue={formState.values.rollnumber}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="username"
                    label="Username"
                    defaultValue={formState.values.username}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="futureAspirations"
                    label="Future Aspirations"
                    defaultValue={
                      formState.values.futureAspirations
                        ? formState.values.futureAspirations.name
                        : null
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <Grid item xs={12} className={classes.CardActionGrid}>
            <CardActions className={classes.btnspace}>
              {auth.getUserInfo().role.name === "Student" ||
              auth.getUserInfo().role.name === "College Admin" ? (
                <YellowButton
                  type="submit"
                  color="primary"
                  variant="contained"
                  onClick={editData}
                  className={classes.submitbtn}
                >
                  {genericConstants.EDIT_TEXT}
                </YellowButton>
              ) : null}
              {auth.getUserInfo().role.name === "Medha Admin" ||
              auth.getUserInfo().role.name === "College Admin" ? (
                <GrayButton
                  color="primary"
                  variant="contained"
                  onClick={handleClickCancel}
                  className={classes.resetbtn}
                >
                  {genericConstants.CANCEL_BUTTON_TEXT}
                </GrayButton>
              ) : null}
            </CardActions>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StudentProfile;
