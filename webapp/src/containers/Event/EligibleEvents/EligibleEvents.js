import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { green } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import "../../../assets/cssstylesheet/ImageCssStyles.css";

import {
  Auth as auth,
  Spinner,
  GreenButton,
  YellowButton,
  Alert
} from "../../../components";
import {
  Card,
  CardContent,
  Grid,
  Divider,
  Typography,
  IconButton,
  Collapse
} from "@material-ui/core";
import useStyles from "./EligibleEventsStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as FormUtilities from "../../../Utilities/FormUtilities";
import Img from "react-image";
import "react-multi-carousel/lib/styles.css";
import RegisterEvent from "../EventRegistration/EventRegistration";

const EligibleEvents = props => {
  const history = useHistory();
  const [open, setOpen] = useState(true);

  const classes = useStyles();
  const [formState, setFormState] = useState({
    eventDetails: {},
    greenButtonChecker: true,
    showRegisterModel: false,
    registerUserId: "",
    eventtitle: "",
    isStudentRegister: false,
    registrationFail: false,
    authUserRegistering: null
  });
  useEffect(() => {
    getEventDetails();
  }, []);

  async function getEventDetails() {
    let studentId = null;
    if (
      auth.getUserInfo() !== null &&
      auth.getUserInfo().role !== null &&
      auth.getUserInfo().role.name === "Student" &&
      auth.getUserInfo().studentInfo !== null &&
      auth.getUserInfo().studentInfo.id !== null
    ) {
      studentId = auth.getUserInfo().studentInfo.id;
      formState.authUserRegistering = studentId;
      if (studentId !== null && studentId !== undefined) {
        const ELIGIBLE_EVENTS =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_STUDENTS +
          "/" +
          auth.getUserInfo().studentInfo.id +
          "/" +
          strapiConstants.STRAPI_EVENTS;
        let params = {
          pageSize: -1
        };
        await serviceProviders
          .serviceProviderForGetRequest(ELIGIBLE_EVENTS, params)
          .then(res => {
            let viewData = res.data.result;
            setFormState(formState => ({
              ...formState,
              eventDetails: viewData
            }));
          })
          .catch(error => {
            console.log("error", error);
          });
      } else {
        auth.clearAppStorage();
        history.push({
          pathname: routeConstants.SIGN_IN_URL
        });
      }
    } else {
      auth.clearAppStorage();
      history.push({
        pathname: routeConstants.SIGN_IN_URL
      });
    }
  }

  const getTime = data => {
    let startTime = new Date(data["start_date_time"]);
    if (data["start_date_time"] && data["end_date_time"]) {
      let endTime = new Date(data["end_date_time"]);
      return (
        startTime.toLocaleTimeString() + " to " + endTime.toLocaleTimeString()
      );
    } else {
      startTime = new Date(data["start_date_time"]);
      return startTime.toLocaleTimeString();
    }
  };

  const getDate = data => {
    let startDate = new Date(data["start_date_time"]);
    if (data["start_date_time"] && data["end_date_time"]) {
      let endDate = new Date(data["end_date_time"]);
      return startDate.toDateString() + " to " + endDate.toDateString();
    } else {
      startDate = new Date(data["start_date_time"]);
      return startDate.toDateString();
    }
  };

  const getVenue = data => {
    return data["address"];
  };

  const routeToDisplayEvent = id => {
    history.push({
      pathname: routeConstants.VIEW_EVENT,
      dataForView: id
    });
  };

  /** Show event registration model */
  const registerUserForEvent = (event, id, title) => {
    setFormState(formState => ({
      ...formState,
      showRegisterModel: true,
      registerUserId: id,
      eventtitle: title
    }));
  };

  const isRegistrationCompleted = status => {
    formState.isStudentRegister = status;
  };

  const isRegistrationFailed = status => {
    formState.registrationFail = status;
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showRegisterModel: false
    }));
    // if (formState.isDataDeleted) {
    //   getEventDetails();
    // }
  };

  const handleCloseBlockModal = () => {
    /** This restores all the data when we close the modal */
    setFormState(formState => ({
      ...formState,
      showRegisterModel: false
    }));
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Eligible Events
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {formState.isStudentRegister ? (
          <Collapse in={open}>
            <Alert
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {genericConstants.ALERT_SUCCESS_STUDENT_REGISTRATION}
            </Alert>
          </Collapse>
        ) : null}
        {formState.registrationFail ? (
          <Collapse in={open}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {genericConstants.ALERT_ERROR_STUDENT_REGISTRATION}
            </Alert>
          </Collapse>
        ) : null}
        <Grid container justify="center" spacing={3}>
          {formState.eventDetails.length ? (
            formState.eventDetails.map(data => {
              return (
                <Grid key={data.id} item md={4} xs={12}>
                  <Card className={classes.cardHeight}>
                    {formState.isStudentRegister ? (
                      <IconButton aria-label="add to favorites">
                        <CheckCircleIcon style={{ color: green[500] }} />
                      </IconButton>
                    ) : null}
                    <CardContent>
                      {data["upload_logo"] !== null &&
                      data["upload_logo"] !== undefined &&
                      data["upload_logo"] !== {} ? (
                        <React.Fragment>
                          <Grid
                            item
                            className={classes.defaultMargin}
                            spacing={4}
                          >
                            <div className={classes.imageDiv}>
                              <Img
                                src={
                                  strapiConstants.STRAPI_DB_URL_WITHOUT_HASH +
                                  data["upload_logo"]["url"]
                                }
                                className="image-center"
                                loader={<Spinner />}
                                width="100%"
                                height="100%"
                              />
                            </div>
                          </Grid>
                          <Divider className={classes.defaultMargin} />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Grid
                            item
                            className={classes.defaultMargin}
                            spacing={4}
                          >
                            <div className={classes.imageDiv}>
                              <Img
                                className="image-center"
                                src="/images/noImage.png"
                                loader={<Spinner />}
                                width="100%"
                                height="100%"
                              />
                            </div>
                          </Grid>
                          <Divider className={classes.defaultMargin} />
                        </React.Fragment>
                      )}
                      <div className={classes.titleDiv}>
                        <Grid item xs={12}>
                          <Typography variant="h5" gutterBottom>
                            <b>{data.title}</b>
                          </Typography>
                        </Grid>
                      </div>
                      <div className={classes.contentDiv}>
                        <Grid container className={classes.defaultMargin}>
                          <Grid item md={3} xs={3}>
                            <b>Date :-</b>
                          </Grid>
                          <Grid item md={9} xs={9}>
                            {getDate(data)}
                          </Grid>
                        </Grid>
                        <Grid container className={classes.defaultMargin}>
                          <Grid item md={3} xs={3}>
                            <b>Time :-</b>
                          </Grid>
                          <Grid item md={9} xs={9}>
                            {getTime(data)}
                          </Grid>
                        </Grid>
                        <Grid container className={classes.defaultMargin}>
                          <Grid item md={3} xs={3}>
                            <b>Venue :-</b>
                          </Grid>
                          <Grid item md={9} xs={9}>
                            {getVenue(data)}
                          </Grid>
                        </Grid>
                      </div>
                      <div className={classes.buttonsDiv}>
                        <Grid container>
                          <Grid
                            item
                            md={6}
                            xs={6}
                            className={classes.buttonAlign}
                          >
                            <GreenButton
                              variant="contained"
                              color="primary"
                              disableElevation
                              greenButtonChecker={formState.greenButtonChecker}
                              onClick={e =>
                                registerUserForEvent(e, data.id, data.title)
                              }
                            >
                              Register
                            </GreenButton>
                          </Grid>
                          <Grid
                            item
                            md={6}
                            xs={6}
                            className={classes.buttonAlign}
                          >
                            <YellowButton
                              variant="contained"
                              color="primary"
                              disableElevation
                              onClick={() => {
                                routeToDisplayEvent(data.id);
                              }}
                            >
                              Read More
                            </YellowButton>
                          </Grid>
                        </Grid>
                      </div>
                      <Divider className={classes.defaultMargin} />
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Spinner />
          )}
        </Grid>
        <Card variant="outlined">
          <RegisterEvent
            showModal={formState.showRegisterModel}
            modalClose={modalClose}
            closeBlockModal={handleCloseBlockModal}
            eventName={formState.registerUserId}
            eventTitle={formState.eventtitle}
            userRegistering={formState.authUserRegistering}
            statusRegistartion={isRegistrationCompleted}
            registrationFailed={isRegistrationFailed}
          />
        </Card>
      </Grid>
    </Grid>
  );
};
export default EligibleEvents;
