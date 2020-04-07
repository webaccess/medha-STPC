import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { green } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import "../../../assets/cssstylesheet/ImageCssStyles.css";

import { Auth as auth, Spinner, GreenButton, Alert } from "../../../components";
import {
  Card,
  CardContent,
  Grid,
  Divider,
  Typography,
  IconButton,
  Collapse,
  Tooltip
} from "@material-ui/core";
import useStyles from "./EligibleEventsStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import Img from "react-image";
import "react-multi-carousel/lib/styles.css";

const EligibleEvents = props => {
  const history = useHistory();
  const [open, setOpen] = useState(true);

  const classes = useStyles();
  const [formState, setFormState] = useState({
    eventDetails: [],
    greenButtonChecker: true,
    showRegisterModel: false,
    registerUserId: "",
    eventtitle: "",
    isStudentRegister: false,
    registrationFail: false,
    authUserRegistering: null,
    NoEventsData: false,
    registeredEventsIds: []
  });

  /** This use effect is called at the very begining and only once */
  useEffect(() => {
    if (
      auth.getUserInfo() !== null &&
      auth.getUserInfo().role !== null &&
      auth.getUserInfo().role.name === "Student" &&
      auth.getUserInfo().studentInfo !== null &&
      auth.getUserInfo().studentInfo.id !== null
    ) {
      getEventDetails();
      getRegisteredEvents();
    } else {
      history.push({
        pathname: routeConstants.NOT_FOUND_URL
      });
    }
  }, []);

  /** Check if a student is registered for a event */
  const getRegisteredEvents = async () => {
    const apiToCheckStudentRegistration =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_STUDENTS +
      "/" +
      auth.getUserInfo().studentInfo.id +
      "/registeredevents";
    await serviceProviders
      .serviceProviderForGetRequest(apiToCheckStudentRegistration)
      .then(res => {
        let registeredEvents = [];
        res.data.map(data => {
          registeredEvents.push(data.event.id);
        });
        formState.registeredEventsIds = registeredEvents;
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  /** Check if a student is registered for a event */
  const checkEventRegistered = eventId => {
    if (formState.registeredEventsIds.indexOf(eventId) !== -1) {
      return true;
    } else {
      return false;
    }
  };

  /** This gets events details */
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
        /** This will give all the eligible events for a student */
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
            let viewData = [];
            if (res.data.result.length === 0) {
              setFormState(formState => ({
                ...formState,
                NoEventsData: true
              }));
            } else {
              viewData = convertDataAndGetRegisteredStatus(res.data.result);
            }
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

  /** Function which get stuatus of events as registered or not */
  const convertDataAndGetRegisteredStatus = originalEventData => {
    originalEventData.map(data => {
      if (formState.registeredEventsIds.length === 0) {
        data["isRegistered"] = false;
      } else {
        data["isRegistered"] = checkEventRegistered(data["id"]);
      }
    });
    return originalEventData;
  };

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

  console.log(formState.eventDetails);
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Eligible Events
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {props.location.fromAddEvent && props.location.isRegistered ? (
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
              {props.location.registeredEventMessage}
            </Alert>
          </Collapse>
        ) : null}
        {props.location.fromAddEvent && !props.location.isRegistered ? (
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
              {props.location.registeredEventMessage}
            </Alert>
          </Collapse>
        ) : null}
        <Grid container justify="center" spacing={3}>
          {formState.eventDetails.length ? (
            formState.eventDetails.map(data => {
              return (
                <Grid key={data.id} item md={4} xs={12}>
                  <Card className={classes.cardHeight}>
                    {data["isRegistered"] ? (
                      <Tooltip title={"Registered"} placement="top">
                        <IconButton aria-label="is student registered">
                          <CheckCircleIcon style={{ color: green[500] }} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <div className={classes.successTickDiv}></div>
                    )}
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
                            md={12}
                            xs={12}
                            className={classes.buttonAlign}
                          >
                            <GreenButton
                              variant="contained"
                              color="primary"
                              greenButtonChecker={formState.greenButtonChecker}
                              disableElevation
                              onClick={() => {
                                routeToDisplayEvent(data.id);
                              }}
                            >
                              Read More
                            </GreenButton>
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
            <React.Fragment>
              {formState.NoEventsData === true ? (
                <p>No eligible events</p>
              ) : (
                <Spinner />
              )}
            </React.Fragment>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
export default EligibleEvents;
