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
  Typography
} from "@material-ui/core";
import useStyles from "./ViewEventStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import Img from "react-image";
import * as formUtilities from "../../../Utilities/FormUtilities";
import ReactHtmlParser from "react-html-parser";
import "../../../assets/cssstylesheet/ImageCssStyles.css";

const EVENTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;

const ViewEvent = props => {
  const history = useHistory();
  const classes = useStyles();
  const [formState, setFormState] = useState({
    eventDetails: {},
    greenButtonChecker: true
  });
  useEffect(() => {
    getEventDetails();
  }, []);

  async function getEventDetails() {
    let paramsForEvent = null;
    if (auth.getUserInfo() && auth.getUserInfo().role) {
      if (auth.getUserInfo().role.name === "Medha Admin") {
        paramsForEvent = props["location"]["dataForView"];
      } else if (auth.getUserInfo().role.name === "Student") {
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

  const getVenue = () => {
    return formState.eventDetails["address"];
  };

  const register = () => {};
  return (
    <Grid>
      {console.log(formState)}
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Event
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
                      <Typography variant="h4" gutterBottom>
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
                          {formState.eventDetails["upload_logo"] !== null &&
                          formState.eventDetails["upload_logo"] !== undefined &&
                          formState.eventDetails["upload_logo"] !== {} ? (
                            <div className={classes.imageDiv}>
                              <Img
                                src={
                                  strapiConstants.STRAPI_DB_URL_WITHOUT_HASH +
                                  formState.eventDetails["upload_logo"]["url"]
                                }
                                className="image-center"
                                loader={<Spinner />}
                                width="100%"
                                height="100%"
                              />
                            </div>
                          ) : (
                            <div className={classes.imageDiv}>
                              <Img
                                className="image-center"
                                src="/images/noImage.png"
                                loader={<Spinner />}
                                width="100%"
                                height="100%"
                              />
                            </div>
                          )}
                        </Grid>
                        <Grid container className={classes.defaultMargin}>
                          <Grid item md={3} xs={3}>
                            <b>Date :-</b>
                          </Grid>
                          <Grid item md={9} xs={9}>
                            {getDate()}
                          </Grid>
                        </Grid>
                        <Grid container className={classes.defaultMargin}>
                          <Grid item md={3} xs={3}>
                            <b>Time :-</b>
                          </Grid>
                          <Grid item md={9} xs={9}>
                            {getTime()}
                          </Grid>
                        </Grid>
                        <Grid container className={classes.defaultMargin}>
                          <Grid item md={3} xs={3}>
                            <b>Venue :-</b>
                          </Grid>
                          <Grid item md={9} xs={9}>
                            {getVenue()}
                          </Grid>
                        </Grid>
                        <Divider />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        {/* <ReactMarkdown
                          source={formState.eventDetails["description"]}
                        /> */}
                        {ReactHtmlParser(formState.eventDetails["description"])}
                      </Grid>
                    </Grid>
                    <Grid>
                      {auth.getUserInfo().role.name === "Student" ? (
                        <Grid item md={12} xs={12}>
                          <CardActions className={classes.btnspace}>
                            <GreenButton
                              variant="contained"
                              color="primary"
                              disableElevation
                              onClick={register}
                              to={routeConstants.MANAGE_EVENT}
                              greenButtonChecker={formState.greenButtonChecker}
                            >
                              Register
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
    </Grid>
  );
};
export default ViewEvent;
