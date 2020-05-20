import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Auth as auth, Spinner, GreenButton } from "../../../components";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Icon,
  Typography,
  Checkbox,
  FormControlLabel,
  CardMedia,
  Box
} from "@material-ui/core";
import useStyles from "./ViewEventStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import Img from "react-image";
import * as formUtilities from "../../../Utilities/FormUtilities";
import ReactHtmlParser from "react-html-parser";
import "../../../assets/cssstylesheet/ImageCssStyles.css";
import RegisterEvent from "../EventRegistration/EventRegistration";
import noImage from "../../../assets/images/no-image-icon.png";

const EVENTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;

const ViewEvent = props => {
  const history = useHistory();
  const classes = useStyles();
  const [formState, setFormState] = useState({
    eventDetails: {},
    greenButtonChecker: true,
    registeredEventsIds: [],
    registeredForEvent: false,
    isReadAllTerms: false,
    showRegisterModel: false
  });
  useEffect(() => {
    getEventDetails();
    getRegisteredEvents();
  }, []);

  /** Check if a student is registered for a event */
  const getRegisteredEvents = async () => {
    if (auth.getUserInfo().role.name === "Student") {
      const apiToCheckStudentRegistration =
        strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_CONTACT_URL +
        "/" +
        auth.getUserInfo().studentInfo.contact.id +
        "/get-individual-registered-events";
      await serviceProviders
        .serviceProviderForGetRequest(apiToCheckStudentRegistration)
        .then(res => {
          let registeredEvents = [];
          res.data.result.map(data => {
            registeredEvents.push(data.event.id);
          });
          let isEventRegistered = checkEventRegistered(registeredEvents);
          setFormState(formState => ({
            ...formState,
            registeredEventsIds: registeredEvents,
            registeredForEvent: isEventRegistered
          }));
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  };

  async function getEventDetails() {
    let paramsForEvent = null;
    if (auth.getUserInfo() && auth.getUserInfo().role) {
      if (
        auth.getUserInfo().role.name === "Medha Admin" ||
        auth.getUserInfo().role.name === "Student" ||
        auth.getUserInfo().role.name === "College Admin"
      ) {
        paramsForEvent = props["location"]["dataForView"];
      }
      if (paramsForEvent !== null && paramsForEvent !== undefined) {
        await serviceProviders
          .serviceProviderForGetOneRequest(EVENTS_URL, paramsForEvent)
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
        if (auth.getUserInfo().role.name === "Medha Admin") {
          history.push({
            pathname: routeConstants.MANAGE_EVENT
          });
        } else if (auth.getUserInfo().role.name === "Student") {
          history.push({
            pathname: routeConstants.ELIGIBLE_EVENT
          });
        } else {
          history.push({
            pathname: routeConstants.DASHBOARD_URL
          });
        }
      }
    } else {
      auth.clearAppStorage();
      history.push({
        pathname: routeConstants.SIGN_IN_URL
      });
    }
  }

  const route = () => {
    if (auth.getUserInfo().role.name === "Student") {
      history.push({
        pathname: routeConstants.ELIGIBLE_EVENT
      });
    } else if (
      auth.getUserInfo().role.name === "Medha Admin" ||
      auth.getUserInfo().role.name === "College Admin"
    ) {
      history.push({
        pathname: routeConstants.MANAGE_EVENT
      });
    } else {
      auth.clearToken();
      auth.clearUserInfo();
      history.push({
        pathname: routeConstants.SIGN_IN_URL
      });
    }
  };

  /** Gives formatted time */
  const getTime = () => {
    let startTime = new Date(formState.eventDetails["start_date_time"]);
    if (
      formState.eventDetails["start_date_time"] &&
      formState.eventDetails["end_date_time"]
    ) {
      let endTime = new Date(formState.eventDetails["end_date_time"]);
      return (
        startTime.toLocaleTimeString() + " to " + endTime.toLocaleTimeString()
      );
    } else {
      startTime = new Date(formState.eventDetails["start_date_time"]);
      return startTime.toLocaleTimeString();
    }
  };

  /** Gives formatted date */
  const getDate = () => {
    let startDate = new Date(formState.eventDetails["start_date_time"]);
    if (
      formState.eventDetails["start_date_time"] &&
      formState.eventDetails["end_date_time"]
    ) {
      let endDate = new Date(formState.eventDetails["end_date_time"]);
      return startDate.toDateString() + " to " + endDate.toDateString();
    } else {
      startDate = new Date(formState.eventDetails["start_date_time"]);
      return startDate.toDateString();
    }
  };

  /** Gets event venue */
  const getVenue = () => {
    return formState.eventDetails["address"];
  };

  /** Registers a student for a particular event */
  const register = event => {
    setFormState(formState => ({
      ...formState,
      showRegisterModel: true
    }));
  };

  const checkEventRegistered = registeredEvents => {
    if (registeredEvents.indexOf(props["location"]["dataForView"]) !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const handleCheckBoxChange = () => {
    setFormState(formState => ({
      ...formState,
      isReadAllTerms: !formState.isReadAllTerms
    }));
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showRegisterModel: false
    }));
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          View Event
        </Typography>
        <GreenButton
          variant="contained"
          color="primary"
          disableElevation
          onClick={route}
          to={routeConstants.MANAGE_EVENT}
          startIcon={<Icon>keyboard_arrow_left</Icon>}
          greenButtonChecker={formState.greenButtonChecker}
        >
          Back to listing
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card>
          <CardContent>
            <Grid container spacing={3} className={classes.formgrid}>
              <Grid item md={12} xs={12}>
                {!formUtilities.checkEmpty(formState.eventDetails) ? (
                  <React.Fragment>
                    <Grid item md={12} xs={12} className={classes.title}>
                      <Typography
                        variant="h4"
                        gutterBottom
                        color="textSecondary"
                      >
                        {formState.eventDetails["title"]}
                      </Typography>
                    </Grid>
                    <Divider />
                    <Grid
                      container
                      spacing={2}
                      className={classes.defaultMargin}
                    >
                      <Grid item md={4} xs={12}>
                        <Grid
                          item
                          className={classes.defaultMargin}
                          spacing={4}
                        >
                          <Box>
                            {formState.eventDetails["upload_logo"] !== null &&
                            formState.eventDetails["upload_logo"] !==
                              undefined &&
                            formState.eventDetails["upload_logo"] !== {} ? (
                              <CardMedia
                                image={
                                  strapiConstants.STRAPI_DB_URL_WITHOUT_HASH +
                                  formState.eventDetails["upload_logo"]["url"]
                                }
                                className={classes.ViewEventImageStyling}
                              />
                            ) : (
                              <CardMedia
                                image={noImage}
                                className={classes.NoEventsStyling}
                              />
                            )}

                            <Box className={classes.MarginTop}>
                              <Grid container spacing={1} justify="center">
                                <Grid item md={3} xs={3}>
                                  <Typography variant="h5" color="textPrimary">
                                    Date
                                  </Typography>
                                </Grid>
                                <Grid item md={9} xs={9}>
                                  <Typography color="textSecondary">
                                    {getDate()}
                                  </Typography>
                                </Grid>
                                <Grid item md={3} xs={3}>
                                  <Typography variant="h5" color="textPrimary">
                                    Time
                                  </Typography>
                                </Grid>
                                <Grid item md={9} xs={9}>
                                  <Typography color="textSecondary">
                                    {getTime()}
                                  </Typography>
                                </Grid>
                                <Grid item md={3} xs={3}>
                                  <Typography variant="h5" color="textPrimary">
                                    Venue
                                  </Typography>
                                </Grid>
                                <Grid item md={9} xs={9}>
                                  <Typography color="textSecondary">
                                    {getVenue()}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>
                          </Box>
                        </Grid>

                        <Divider />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        {ReactHtmlParser(formState.eventDetails["description"])}
                      </Grid>
                    </Grid>
                    {auth.getUserInfo().role.name === "Student" ? (
                      <Grid spacing={2} className={classes.defaultMargin}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              disabled={formState.registeredForEvent}
                              checked={
                                formState.registeredForEvent
                                  ? true
                                  : formState.isReadAllTerms
                              }
                              onChange={handleCheckBoxChange}
                              name="checkedB"
                              color="primary"
                            />
                          }
                          label={genericConstants.EVENT_CONFIRMATION}
                        />
                      </Grid>
                    ) : null}
                    <Grid>
                      {auth.getUserInfo().role.name === "Student" ? (
                        <Grid item md={12} xs={12}>
                          <CardActions className={classes.btnspace}>
                            <GreenButton
                              variant="contained"
                              color="primary"
                              buttonDisabled={!formState.isReadAllTerms}
                              disableElevation
                              onClick={register}
                              to={routeConstants.MANAGE_EVENT}
                              greenButtonChecker={formState.greenButtonChecker}
                            >
                              {formState.registeredForEvent
                                ? genericConstants.EVENT_REGISTERED
                                : genericConstants.EVENT_REGISTRATION}
                            </GreenButton>
                          </CardActions>
                        </Grid>
                      ) : null}
                    </Grid>
                  </React.Fragment>
                ) : (
                  <Spinner />
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {auth.getUserInfo().role.name === "Student" ? (
        <RegisterEvent
          showModal={formState.showRegisterModel}
          modalClose={modalClose}
          eventId={props["location"]["dataForView"]}
          eventTitle={formState.eventDetails["title"]}
          userId={auth.getUserInfo().studentInfo.contact.id}
        />
      ) : null}
    </Grid>
  );
};
export default ViewEvent;
