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
import useStyles from "./EventDetailsStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import { YellowButton, GrayButton } from "../../../components";
import * as genericConstants from "../../../constants/GenericConstants";
import Img from "react-image";

const EVENTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;

const EventDetails = props => {
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
    if (auth.getUserInfo().role.name === "College Admin") {
      paramsForEvent = auth.getUserInfo().college.id;
    } else if (auth.getUserInfo().role.name === "Medha Admin") {
      paramsForEvent = props["location"]["dataForEdit"];
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
      history.push({
        pathname: routeConstants.DASHBOARD_URL
      });
    }
  }

  const routeToManageEvent = () => {
    history.push({
      pathname: routeConstants.MANAGE_EVENT
    });
  };

  const getTime = () => {
    let startTime = new Date(formState.eventDetails["start_date_time"]);
    if (
      formState.eventDetails["start_date_time"] &&
      formState.eventDetails["end_date_time"]
    ) {
      let endTime = new Date(formState.eventDetails["end_date_time"]);
      return (
        startTime.toLocaleTimeString() + " - " + endTime.toLocaleTimeString()
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
      return startDate.toDateString() + " - " + endDate.toDateString();
    } else {
      startDate = new Date(formState.eventDetails["start_date_time"]);
      return startDate.toDateString();
    }
  };

  const getVenue = () => {
    return formState.eventDetails["address"];
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Event
        </Typography>
        <GreenButton
          variant="contained"
          color="primary"
          disableElevation
          onClick={routeToManageEvent}
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
                {formState.eventDetails !== null &&
                formState.eventDetails !== undefined &&
                formState.eventDetails !== {} ? (
                  <form>
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
                            <Img
                              src={
                                "http://104.236.28.24:1338" +
                                formState.eventDetails["upload_logo"]["url"]
                              }
                              loader={<Spinner />}
                              width="100%"
                              height="100%"
                            />
                          ) : null}
                        </Grid>
                        <Grid
                          item
                          className={classes.defaultMargin}
                          spacing={4}
                        >
                          Date :- {getDate()}
                        </Grid>
                        <Grid
                          item
                          className={classes.defaultMargin}
                          spacing={4}
                        >
                          Time :- {getTime()}
                        </Grid>
                        <Grid
                          item
                          className={classes.defaultMargin}
                          spacing={4}
                        >
                          Venue :- {getVenue()}
                        </Grid>
                        <Divider />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        {formState.eventDetails["description"]}
                      </Grid>
                    </Grid>
                    {/* <Grid item md={12} xs={12}>
                      <CardActions className={classes.btnspace}>
                        <YellowButton
                          type="submit"
                          color="primary"
                          variant="contained"
                          //onClick={editData}
                          className={classes.submitbtn}
                        >
                          {genericConstants.EDIT_TEXT}
                        </YellowButton>
                        {auth.getUserInfo().role.name !== "College Admin" ? (
                          <GrayButton
                            color="primary"
                            variant="contained"
                            to={routeConstants.VIEW_COLLEGE}
                            className={classes.resetbtn}
                          >
                            {genericConstants.CANCEL_BUTTON_TEXT}
                          </GrayButton>
                        ) : null}
                      </CardActions>
                    </Grid> */}
                  </form>
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
export default EventDetails;
