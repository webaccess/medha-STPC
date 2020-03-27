import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Auth as auth, Spinner, GreenButton } from "../../../components";
import {
  Card,
  CardContent,
  Grid,
  Divider,
  Icon,
  Typography,
  withStyles,
  Paper
} from "@material-ui/core";
import useStyles from "./EventDetailsStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import { YellowButton, GrayButton } from "../../../components";
import * as genericConstants from "../../../constants/GenericConstants";
import Img from "react-image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Image } from "@material-ui/icons";
import spinner from "../../../components/Spinner";

const EligibleEvents = props => {
  const history = useHistory();
  const classes = useStyles();
  const [formState, setFormState] = useState({
    eventDetails: {},
    galleryItems: [1, 2, 3, 4, 5],
    greenButtonChecker: true
  });
  useEffect(() => {
    getEventDetails();
  }, []);

  async function getEventDetails() {
    let paramsForCollege = null;
    if (
      auth.getUserInfo().role.name === "Student" &&
      auth.getUserInfo().college !== null
    ) {
      paramsForCollege = auth.getUserInfo().college.id;
    } else {
      localStorage.clear();
      history.push({
        pathname: routeConstants.SIGN_IN_URL
      });
    }
    if (paramsForCollege !== null && paramsForCollege !== undefined) {
      const COLLEGES_URL =
        strapiConstants.STRAPI_DB_URL +
        "colleges/" +
        paramsForCollege +
        "/event";
      let params = {
        pageSize: -1
      };
      await serviceProviders
        .serviceProviderForGetRequest(COLLEGES_URL, params)
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
      if (auth.getUserInfo().role.name === "Student") {
        history.push({
          pathname: routeConstants.DASHBOARD_URL
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
          Eligible Events
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={3}>
          {formState.eventDetails.length ? (
            formState.eventDetails.map(data => {
              return (
                <Grid key={data.id} item md={4} xs={12}>
                  <Card className={classes.cardHeight}>
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
                                loader={<Spinner />}
                                width="100%"
                                height="100%"
                                object-fit="contain"
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
                                src="/images/noImage.png"
                                loader={<Spinner />}
                                width="100%"
                                height="100%"
                                object-fit="contain"
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
                              //onClick={routeToManageEvent}
                              to={routeConstants.MANAGE_EVENT}
                              greenButtonChecker={formState.greenButtonChecker}
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
      </Grid>
    </Grid>
  );
};
export default EligibleEvents;
