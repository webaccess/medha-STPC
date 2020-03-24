import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Auth as auth, Typography } from "../../../components";
import { Card, CardContent, CardActions, Grid } from "@material-ui/core";
import useStyles from "./EventDetailsStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import { YellowButton, GrayButton } from "../../../components";
import * as genericConstants from "../../../constants/GenericConstants";

const EVENTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;

const EventDetails = props => {
  const history = useHistory();
  const classes = useStyles();
  const [formState, setFormState] = useState({
    eventDetails: []
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
      console.log(
        "paramsForEvent",
        paramsForEvent,
        typeof paramsForEvent,
        props["location"]["dataForEdit"]
      );
      await serviceProviders
        .serviceProviderForGetOneRequest(EVENTS_URL, paramsForEvent)
        .then(res => {
          let viewData = res.data.result;
          console.log(viewData);
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

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Event
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Grid className={classes.root} variant="outlined">
          <CardContent>
            <Grid container spacing={3} className={classes.formgrid}>
              <Grid item md={12} xs={12}>
                {formState.collegeDetails ? (
                  <form>
                    <Card>
                      <CardContent
                        className={classes.Cardtheming}
                      ></CardContent>
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
                    </Card>
                  </form>
                ) : null}
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default EventDetails;
