import React, { useState, useEffect } from "react";
import { Card, Grid, Typography } from "@material-ui/core";
import UseStyle from "../../components/NotFoundPage/Styles.js";

const Registered = props => {
  const { layout: Layout } = props;
  const classes = UseStyle();
  return (
    <div className={classes.root}>
      <Layout>
        <Grid container justify="center" spacing={4}>
          <Grid item lg={6} xs={12}>
            <div className={classes.content}>
              <Typography variant="h1">Thank you for registration</Typography>
              <Typography variant="h1">
                Your verification is pending from College.
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Layout>
    </div>
  );
};
export default Registered;
