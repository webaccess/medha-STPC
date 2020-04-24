import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../api/Axios";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Clock from "@material-ui/icons/AddAlarm";
import { green, red } from "@material-ui/core/colors";
import CloseIcon from "@material-ui/icons/Close";

import {
  Auth as auth,
  Spinner,
  GreenButton,
  YellowButton,
  Alert
} from "../../components";
import {
  Card,
  CardContent,
  Box,
  Grid,
  Divider,
  Typography,
  IconButton,
  Collapse,
  Button,
  CardMedia
} from "@material-ui/core";
import useStyles from "./EligibleActivityStyles.js";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../constants/RouteConstants";
import * as genericConstants from "../../constants/GenericConstants";
import Img from "react-image";
import "react-multi-carousel/lib/styles.css";
import noImage from "../../assets/images/no-image-icon.png";
//import RegisterEvent from "./EventRegistration";

const EligibleActivity = props => {
  const history = useHistory();
  const [open, setOpen] = useState(true);

  const classes = useStyles();
  const [formState, setFormState] = useState({
    activityDetails: {},
    galleryItems: [1, 2, 3, 4, 5],
    greenButtonChecker: true,
    showRegisterModel: false,
    registerUserId: "",
    NoActivityData: false,
    isStudentRegister: false,
    authUserRegistering: auth.getUserInfo().id
  });
  useEffect(() => {
    getactivityDetails();
  }, []);

  async function getactivityDetails() {
    let paramsForStudent = null;
    if (
      auth.getUserInfo().role.name === "Student" &&
      auth.getUserInfo().studentInfo !== null
    ) {
      paramsForStudent = auth.getUserInfo().studentInfo.id;
    } else {
      localStorage.clear();
      history.push({
        pathname: routeConstants.SIGN_IN_URL
      });
    }
    if (paramsForStudent !== null && paramsForStudent !== undefined) {
      const COLLEGES_URL =
        strapiConstants.STRAPI_DB_URL +
        "students/" +
        paramsForStudent +
        "/activity";
      let params = {
        pageSize: -1
      };
      await serviceProviders
        .serviceProviderForGetRequest(COLLEGES_URL, params)
        .then(res => {
          let viewData = res.data.result;
          if (res.data.result.length === 0) {
            setFormState(formState => ({
              ...formState,
              activityDetails: viewData,
              NoActivityData: true
            }));
          } else {
            setFormState(formState => ({
              ...formState,
              activityDetails: viewData
            }));
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    } else {
      if (auth.getUserInfo().role.name === "Student") {
        history.push({
          pathname: routeConstants.VIEW_PROFILE
        });
      } else {
        localStorage.clear();
        history.push({
          pathname: routeConstants.SIGN_IN_URL
        });
      }
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
  const getBatch = data => {
    return data.activity_batch.name;
  };

  const getBatchTime = data => {
    if (
      data.activity_batch.start_date_time &&
      data.activity_batch.end_date_time
    ) {
      let startTime = new Date(data.activity_batch["start_date_time"]);
      let endTime = new Date(data.activity_batch["end_date_time"]);
      return (
        startTime.toLocaleTimeString() + " to " + endTime.toLocaleTimeString()
      );
    } else {
      return null;
    }
  };

  const routeToDisplayActivity = data => {
    history.push({
      pathname: routeConstants.VIEW_ACTIVITY,
      dataForView: data
    });
  };
  const getRemainingDays = data => {
    let currentDate = new Date();
    let startDate = new Date(data["activity_batch"]["start_date_time"]);
    let remainingDays =
      (startDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
    console.log(remainingDays);
    if (remainingDays >= 2.0) return parseInt(remainingDays) + " Days to go";
    else if (remainingDays <= 2.0 && remainingDays >= 1) return "1 Day to go";
    else if (remainingDays < 1.0 && remainingDays >= 0.0) return "Today";
    else return 0;
  };
  /** Show event registration model */

  const handleCloseBlockModal = () => {
    /** This restores all the data when we close the modal */
    setFormState(formState => ({
      ...formState,
      showRegisterModel: false
    }));
  };
  console.log(formState);
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Upcoming Activity
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          {formState.activityDetails.length ? (
            formState.activityDetails.map(data => {
              return (
                <Grid item xs={12} sm={6} md={4}>
                  <Card>
                    {/* <CardHeader className={classes.CardHeaderFooter}> */}
                    <Grid
                      container
                      direction="row"
                      justify="flex-end"
                      alignItems="center"
                      className={classes.CardHeaderFooter}
                    >
                      <Grid item xs={2}>
                        <IconButton aria-label="is student registered">
                          <Clock style={{ color: green[500] }} />
                        </IconButton>
                      </Grid>

                      <Grid item xs={10}>
                        <Typography
                          className={classes.header}
                          style={{
                            color: green[500]
                          }}
                        >
                          {getRemainingDays(data)}
                        </Typography>
                      </Grid>
                      {/* {data["isRegistered"] ? (
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
                      )} */}
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
                              Venue
                            </Typography>
                          </Grid>
                          <Grid item md={9} xs={9}>
                            <Typography color="textSecondary">
                              {getVenue(data)}
                            </Typography>
                          </Grid>
                          <Grid item md={3} xs={3}>
                            <Typography variant="h5" color="textPrimary">
                              Batch
                            </Typography>
                          </Grid>
                          <Grid item md={9} xs={9}>
                            <Typography color="textSecondary">
                              {getBatch(data)}
                            </Typography>
                          </Grid>
                          <Grid item md={3} xs={3}>
                            <Typography variant="h5" color="textPrimary">
                              Time
                            </Typography>
                          </Grid>
                          <Grid item md={9} xs={9}>
                            <Typography color="textSecondary">
                              {getBatchTime(data)}
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
                            routeToDisplayActivity(data);
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
              {formState.NoActivityData === true ? (
                <p>No eligible Activity</p>
              ) : (
                <Spinner />
              )}
            </React.Fragment>
          )}
        </Grid>
        {/* <Card variant="outlined">
          <RegisterEvent
            showModal={formState.showRegisterModel}
            modalClose={modalClose}
            closeBlockModal={handleCloseBlockModal}
            eventName={formState.registerUserId}
            eventTitle={formState.eventtitle}
            userRegistering={formState.authUserRegistering}
            statusRegistartion={isRegistrationCompleted}
          />
        </Card> */}
      </Grid>
    </Grid>
  );
};
export default EligibleActivity;
