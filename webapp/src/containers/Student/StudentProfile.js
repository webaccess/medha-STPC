import React, { useState, useEffect } from "react";
import { Auth as auth, Typography, GrayButton } from "../../components";
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
import YellowButton from "../../components/YellowButton/YellowButton.js";
import { makeStyles } from "@material-ui/core/styles";
import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import { useHistory } from "react-router-dom";
import Alert from "../../components/Alert/Alert.js";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  btnspace: {
    padding: "15px 18px 50px"
  },
  btnspaceadd: {
    padding: "0px 15px 15px"
  },
  labelside: {
    padding: "0px 0px 15px 0px",
    fontWeight: "600",
    paddingBottom: "3px",
    marginRight: "25px"
  },
  formgrid: {
    marginTop: theme.spacing(0),
    alignItems: "center"
  },
  divider: {
    marginTop: "15px",
    marginBottom: "15px"
  },
  add_more_btn: {
    float: "right"
  },
  streamcard: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "15px !important",
    margin: "15px",
    position: "relative",
    "& label": {
      position: "absolute",
      top: "-8px",
      backgroundColor: "#fff"
    }
  },
  streamoffer: {
    paddingLeft: "15px",
    paddingRight: "15px",
    borderRadius: "0px",
    boxShadow: "none !important"
  },
  streamcardcontent: {
    boxShadow: "none",
    borderBottom: "1px solid #ccc",
    marginBottom: "15px",
    borderRadius: "0px"
  },
  labelside: {
    paddingBottom: "10px",
    fontWeight: "600",
    // backgroundColor: "#ccc",
    marginRight: "15px",
    fontWeight: "700",
    borderBottom: "1px solid #ccc"
  },
  Cardtheming: {
    paddingBottom: "16px !important"
  },
  Cardthemingstream: {
    paddingLeft: "0px"
  },
  labelcontent: {
    paddingBottom: "10px",
    borderBottom: "1px solid #f6c80a",
    marginRight: "15px",
    maxWidth: "100% !important"
  },
  padding: {
    padding: "0px !important"
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
    gender: "",
    physicallyHandicapped: null,
    college: null,
    stream: null,
    rollnumber: null
  });

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
    eventId: props["location"]["eventId"],
    eventTitle: props["location"]["eventTitle"]
  });
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2000-01-01T21:11:54")
  );
  const classes = useStyles();

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    handleSetDetails();
    if (props.location.success && !formState.counter) {
      setSuccess(true);
      formState.counter += 1;
    }
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
              gender: data.studentInfo.gender,
              district: data.studentInfo.district
                ? data.studentInfo.district.name
                : "",
              stream: data.studentInfo.stream.name,
              physicallyHandicapped: data.studentInfo.physicallyHandicapped
            });
            setSelectedDate(new Date(data.studentInfo.date_of_birth));
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        history.push({
          pathname: routeConstants.DASHBOARD_URL
        });
      }
    }
  }

  const editData = () => {
    history.push({
      pathname: routeConstants.EDIT_PROFILE,
      editStudent: true,
      dataForEdit: formState.details
    });
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
    }
  };

  return (
    <Grid>
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
      <Grid item xs={12} className={classes.formgrid}>
        <Grid className={classes.root} variant="outlined">
          <Card>
            <CardContent>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={12} xs={12} className={classes.padding}>
                  {formState.values ? (
                    <form>
                      <Card style={{ boxShadow: "none" }}>
                        <CardContent className={classes.Cardtheming}>
                          <Grid
                            className={classes.filterOptions}
                            container
                            spacing={1}
                          >
                            <Grid md={2} className={classes.labelside}>
                              <Typography>First Name:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>
                                {formState.values.firstname}
                              </Typography>
                            </Grid>
                            <Grid md={2} className={classes.labelside}>
                              <Typography>Last Name:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>
                                {formState.values.lastname}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>

                        <CardContent className={classes.Cardtheming}>
                          <Grid
                            className={classes.filterOptions}
                            container
                            spacing={1}
                          >
                            <Grid md={2} className={classes.labelside}>
                              <Typography> Father's First Name:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>
                                {formState.values.fatherFirstName}
                              </Typography>
                            </Grid>
                            <Grid md={2} className={classes.labelside}>
                              <Typography>Father's Last Name:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>
                                {formState.values.fatherLastName}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>

                        <CardContent className={classes.Cardtheming}>
                          <Grid
                            className={classes.filterOptions}
                            container
                            spacing={1}
                          >
                            <Grid md={2} className={classes.labelside}>
                              <Typography>Address:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>
                                {formState.values.address}
                              </Typography>
                            </Grid>
                            <Grid md={2} className={classes.labelside}>
                              <Typography> State:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>{formState.values.state}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>

                        <CardContent className={classes.Cardtheming}>
                          <Grid
                            className={classes.filterOptions}
                            container
                            spacing={1}
                          >
                            <Grid md={2} className={classes.labelside}>
                              <Typography> District:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>
                                {formState.values.district}
                              </Typography>
                            </Grid>
                            <Grid md={2} className={classes.labelside}>
                              <Typography> Contact Number:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>
                                {formState.values.contact}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>

                        <CardContent className={classes.Cardtheming}>
                          <Grid
                            className={classes.filterOptions}
                            container
                            spacing={1}
                          >
                            <Grid md={2} className={classes.labelside}>
                              <Typography> Email:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>{formState.values.email}</Typography>
                            </Grid>
                            <Grid md={2} className={classes.labelside}>
                              <Typography> Date of Birth:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>
                                {selectedDate.getFullYear() +
                                  "-" +
                                  (selectedDate.getMonth() + 1) +
                                  "-" +
                                  selectedDate.getDate()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                        <CardContent className={classes.Cardtheming}>
                          <Grid
                            className={classes.filterOptions}
                            container
                            spacing={1}
                          >
                            <Grid md={2} className={classes.labelside}>
                              <Typography> Gender:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>{formState.values.gender}</Typography>
                            </Grid>
                            <Grid md={2} className={classes.labelside}>
                              <Typography> Roll Number:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>
                                {formState.values.rollnumber}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>

                        <CardContent className={classes.Cardtheming}>
                          <Grid
                            className={classes.filterOptions}
                            container
                            spacing={1}
                          >
                            <Grid md={2} className={classes.labelside}>
                              <Typography> College:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>
                                {formState.values.college}
                              </Typography>
                            </Grid>
                            <Grid md={2} className={classes.labelside}>
                              <Typography> Stream:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>{formState.values.stream}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                        <CardContent className={classes.Cardtheming}>
                          <Grid
                            className={classes.filterOptions}
                            container
                            spacing={1}
                          >
                            <Grid md={2} className={classes.labelside}>
                              <Typography> Username:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>
                                {formState.values.username}
                              </Typography>
                            </Grid>
                            <Grid md={2} className={classes.labelside}>
                              <Typography> Physically Handicapped:</Typography>
                            </Grid>
                            <Grid md={3} className={classes.labelcontent}>
                              <Typography>
                                {formState.values.physicallyHandicapped
                                  ? "Yes"
                                  : "No"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>

                        <CardActions className={classes.btnspace}>
                          {auth.getUserInfo().role.name === "Student" ? (
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
                      </Card>
                    </form>
                  ) : null}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StudentProfile;
