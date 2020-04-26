import React from "react";
import UseStyle from "../NotFoundPage/Styles.js";
import { Grid, Typography, Link } from "@material-ui/core";
import Layout from "../../hoc/Layout/Layout.js";
import * as routeConstants from "../../constants/RouteConstants";
import * as authPageConstants from "../../constants/AuthPageConstants";

const RequiredErrorPage = () => {
  const classes = UseStyle();
  return (
    <div className={classes.root}>
      <Layout>
        <Grid container justify="center" spacing={4}>
          <Grid item lg={6} xs={12}>
            <div className={classes.content}>
              <Typography variant="h1">
                Sorry, something went wrong. Please contact system
                administration.
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
};

export default RequiredErrorPage;
