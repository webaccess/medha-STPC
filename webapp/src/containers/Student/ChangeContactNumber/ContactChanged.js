import React, { useState, useEffect } from "react";
import { Card, Grid, Typography, Link } from "@material-ui/core";
import UseStyle from "../../../components/NotFoundPage/Styles.js";
import * as routeConstants from "../../../constants/RouteConstants";
import * as authPageConstants from "../../../constants/AuthPageConstants";

const ContactChanged = props => {
  const { layout: Layout } = props;
  const classes = UseStyle();
  return (
    <div className={classes.root}>
      <Grid container justify="center" spacing={4}>
        <Grid item lg={6} xs={12}>
          <div className={classes.content}>
            <Typography variant="h1">
              Your Contact Number has been Changed
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Link
            href={routeConstants.LOGOUT_URL}
            variant="body2"
            style={{
              color: "#21abdc",
              fontSize: "0.8rem",
              textAlign: "right"
            }}
            //className={classes.linkColor}
          >
            {authPageConstants.BACK_TO_LOGIN_TEXT}
          </Link>
        </Grid>
      </Grid>
    </div>
  );
};
export default ContactChanged;
