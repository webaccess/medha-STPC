import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { green } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";
import "../../../assets/cssstylesheet/ImageCssStyles.css";
import * as roleConstants from "../../../constants/RoleConstants";

import { Auth as auth, Spinner, Alert } from "../../../components";
import {
  Card,
  Grid,
  Divider,
  Typography,
  IconButton,
  Collapse,
  Box,
  CardMedia,
  Button
} from "@material-ui/core";
import useStyles from "./EligibleEventsStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import Img from "react-image";
import "react-multi-carousel/lib/styles.css";
import noImage from "../../../assets/images/no-image-icon.png";

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
      auth.getUserInfo().role.name === roleConstants.STUDENT &&
      auth.getUserInfo().studentInfo !== null &&
      auth.getUserInfo().studentInfo.id !== null
    ) {
      getEventDetails();
    } else {
      history.push({
        pathname: routeConstants.NOT_FOUND_URL
      });
    }
  }, []);

  /** This gets events details */
  async function getEventDetails() {
    let studentId = null;
    if (
      auth.getUserInfo() !== null &&
      auth.getUserInfo().role !== null &&
      auth.getUserInfo().role.name === roleConstants.STUDENT &&
      auth.getUserInfo().studentInfo !== null &&
      auth.getUserInfo().studentInfo.contact !== null &&
      auth.getUserInfo().studentInfo.contact.id !== null
    ) {
      studentId = auth.getUserInfo().studentInfo.contact.id;
      formState.authUserRegistering = studentId;
      if (studentId !== null && studentId !== undefined) {
        /** This will give all the eligible events for a student */
        const ELIGIBLE_EVENTS =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_INDIVIDUAL_URL +
          "/" +
          auth.getUserInfo().studentInfo.contact.id +
          "/" +
          strapiConstants.STRAPI_EVENTS;

        let params = {
          pageSize: -1,
          _sort: "start_date_time"
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
              viewData = res.data.result;
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

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Upcoming Events
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
        <Grid container spacing={3}>
          {formState.eventDetails.length ? (
            formState.eventDetails.map(data => {
              return (
                <Grid key={data.id} item xs={12} sm={6} md={4}>
                  <Card>
                    {/* <CardHeader className={classes.CardHeaderFooter}> */}
                    <Grid
                      container
                      direction="row"
                      justify="flex-end"
                      alignItems="center"
                      className={classes.CardHeaderFooter}
                    >
                      {data["isRegistered"] ? (
                        <React.Fragment>
                          <Grid item xs={2}>
                            <IconButton aria-label="is student registered">
                              <CheckCircleIcon style={{ color: green[500] }} />
                            </IconButton>
                          </Grid>
                          <Grid item xs={10}>
                            <Typography style={{ color: green[500] }}>
                              Registered
                            </Typography>
                          </Grid>
                        </React.Fragment>
                      ) : (
                        <div className={classes.successTickDiv}></div>
                      )}
                    </Grid>
                    {/* </CardHeader> */}
                    <Box className={classes.BoxPadding}>
                      {data["upload_logo"] !== null &&
                      data["upload_logo"] !== undefined &&
                      data["upload_logo"] !== {} ? (
                        <CardMedia
                          image={
                            strapiConstants.STRAPI_DB_URL_WITHOUT_HASH +
                            data["upload_logo"]["url"]
                          }
                          className={classes.EligibleEventsStyling}
                        />
                      ) : (
                        <CardMedia
                          image={noImage}
                          className={classes.NoEventsStyling}
                        />
                      )}
                      <Box className={classes.DivHeight}>
                        <Typography
                          variant="h5"
                          className={classes.TextAlign}
                          color="textPrimary"
                        >
                          {data.title}
                        </Typography>
                      </Box>
                      <Box>
                        <Grid container spacing={1} justify="center">
                          <Grid item md={3} xs={3}>
                            <Typography variant="h5" color="textPrimary">
                              Date
                            </Typography>
                          </Grid>
                          <Grid item md={9} xs={9}>
                            <Typography color="textSecondary">
                              {getDate(data)}
                            </Typography>
                          </Grid>
                          <Grid item md={3} xs={3}>
                            <Typography variant="h5" color="textPrimary">
                              Time
                            </Typography>
                          </Grid>
                          <Grid item md={9} xs={9}>
                            <Typography color="textSecondary">
                              {getTime(data)}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            md={3}
                            xs={3}
                            className={classes.GridHeight}
                          >
                            <Typography variant="h5" color="textPrimary">
                              Venue
                            </Typography>
                          </Grid>
                          <Grid item md={9} xs={9}>
                            <Typography color="textSecondary">
                              {getVenue(data)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                    <Divider />
                    <Box className={classes.CardHeaderFooter}>
                      <Grid item xs={12} md={11} justify="center">
                        <Button
                          variant="contained"
                          greenButtonChecker={formState.greenButtonChecker}
                          disableElevation
                          onClick={() => {
                            routeToDisplayEvent(data.id);
                          }}
                          fullWidth
                          className={classes.ReadMoreButton}
                        >
                          Read More
                        </Button>
                      </Grid>
                    </Box>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <React.Fragment>
              {formState.NoEventsData === true ? (
                <p className={classes.alignCenter}>No upcoming events</p>
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
