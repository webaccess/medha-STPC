import React from "react";
import UseStyle from "../NotFoundPage/Styles.js";
import { Grid, Typography, Link } from "@material-ui/core";
import Layout from "../../hoc/Layout/Layout.js";
import * as routeConstants from "../../constants/RouteConstants";
import * as authPageConstants from "../../constants/AuthPageConstants";
import { Redirect } from "react-router-dom";

const RequiredErrorPage = props => {
  const classes = UseStyle();
  if (
    props.location !== undefined &&
    props.location.from !== undefined &&
    props.location.from === "login"
  ) {
    return (
      <div className={classes.root}>
        <Layout>
          <Grid container justify="center" spacing={4}>
            <Grid item lg={6} xs={12}>
              <div className={classes.content}>
                <Typography variant="h1">
                  Sorry, something went wrong. Please check if you are blocked
                  by the administrator. For further information please contact
                  your system administration.
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Link
                href={routeConstants.SIGN_IN_URL}
                variant="body2"
                style={{
                  color: "#21abdc",
                  fontSize: "0.8rem",
                  textAlign: "right"
                }}
              >
                {authPageConstants.BACK_TO_LOGIN_TEXT}
              </Link>
            </Grid>
          </Grid>
        </Layout>
      </div>
    );
  } else {
    return (
      <Redirect
        to={{
          pathname: routeConstants.SIGN_IN_URL,
          state: { from: props.location }
        }}
      />
    );
  }
};

export default RequiredErrorPage;
