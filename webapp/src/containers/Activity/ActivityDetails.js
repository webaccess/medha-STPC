import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../api/Axios";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import { Auth as auth } from "../../components";
import Spinner from "../../components/Spinner/Spinner.js";
import GreenButton from "../../components/GreenButton/GreenButton.js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Icon,
  Typography
} from "@material-ui/core";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from "react-html-parser";
import useStyles from "./ActivityDetailsStyle.js";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../constants/RouteConstants";
import * as genericConstants from "../../constants/GenericConstants";
import Img from "react-image";
import * as formUtilities from "../../Utilities/FormUtilities.js";
const ReactMarkdown = require("react-markdown");

const ACTIVITIES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY;

const ActivityDetails = props => {
  const history = useHistory();
  const classes = useStyles();
  const [formState, setFormState] = useState({
    activityDetails: {},
    greenButtonChecker: true
  });
  useEffect(() => {
    getactivityDetails();
  }, []);

  async function getactivityDetails() {
    let paramsForEvent = null;
    if (auth.getUserInfo().role.name === "Medha Admin") {
      paramsForEvent = props["location"]["dataForView"];
    } else if (auth.getUserInfo().role.name === "Student") {
      paramsForEvent = props["location"]["dataForView"];
    }
    if (paramsForEvent !== null && paramsForEvent !== undefined) {
      await serviceProviders
        .serviceProviderForGetOneRequest(ACTIVITIES_URL, paramsForEvent)
        .then(res => {
          let viewData = res.data.result;
          setFormState(formState => ({
            ...formState,
            activityDetails: viewData
          }));
        })
        .catch(error => {
          console.log("error", error);
        });
    } else {
      if (auth.getUserInfo().role.name === "Medha Admin") {
        history.push({
          pathname: routeConstants.MANAGE_ACTIVITY
        });
      } else if (auth.getUserInfo().role.name === "Student") {
        history.push({
          pathname: routeConstants.ELIGIBLE_ACTIVITY
        });
      } else {
        history.push({
          pathname: routeConstants.DASHBOARD_URL
        });
      }
    }
  }

  const route = () => {
    if (auth.getUserInfo().role.name === "Student") {
      history.push({
        pathname: routeConstants.ELIGIBLE_ACTIVITY
      });
    } else if (
      auth.getUserInfo().role.name === "Medha Admin" ||
      auth.getUserInfo().role.name === "College Admin"
    ) {
      history.push({
        pathname: routeConstants.MANAGE_ACTIVITY
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
    let startTime = new Date(formState.activityDetails["start_date_time"]);
    if (
      formState.activityDetails["start_date_time"] &&
      formState.activityDetails["end_date_time"]
    ) {
      let endTime = new Date(formState.activityDetails["end_date_time"]);
      return (
        startTime.toLocaleTimeString() + " to " + endTime.toLocaleTimeString()
      );
    } else {
      startTime = new Date(formState.activityDetails["start_date_time"]);
      return startTime.toLocaleTimeString();
    }
  };

  const getDate = () => {
    let startDate = new Date(formState.activityDetails["start_date_time"]);
    if (
      formState.activityDetails["start_date_time"] &&
      formState.activityDetails["end_date_time"]
    ) {
      let endDate = new Date(formState.activityDetails["end_date_time"]);
      return startDate.toDateString() + " to " + endDate.toDateString();
    } else {
      startDate = new Date(formState.activityDetails["start_date_time"]);
      return startDate.toDateString();
    }
  };

  const getVenue = () => {
    return formState.activityDetails["address"];
  };

  const register = () => {
    console.log("Register");
  };
  return (
    <Grid>
      {console.log(formState)}
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Activity
        </Typography>
        <GreenButton
          variant="contained"
          color="primary"
          disableElevation
          onClick={route}
          to={routeConstants.MANAGE_ACTIVITY}
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
                {!formUtilities.checkEmpty(formState.activityDetails) ? (
                  <React.Fragment>
                    <Grid item md={12} xs={12} className={classes.title}>
                      <Typography variant="h4" gutterBottom>
                        {formState.activityDetails["title"]}
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
                          {formState.activityDetails["upload_logo"] !== null &&
                          formState.activityDetails["upload_logo"] !==
                            undefined &&
                          formState.activityDetails["upload_logo"] !== {} ? (
                            <Img
                              src={
                                strapiConstants.STRAPI_DB_URL_WITHOUT_HASH +
                                formState.activityDetails["upload_logo"]["url"]
                              }
                              loader={<Spinner />}
                              width="100%"
                              height="100%"
                            />
                          ) : (
                            <Img
                              src="/images/noImage.png"
                              loader={<Spinner />}
                              width="100%"
                              height="100%"
                            />
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
                        {ReactHtmlParser(
                          formState.activityDetails["description"]
                        )}
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
                              to={routeConstants.ELIGIBLE_ACTIVITY}
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
export default ActivityDetails;
