import React from "react";
import UseStyle from "../NotFoundPage/Styles.js";
import { Grid, Typography } from "@material-ui/core";
import Layout from "../../hoc/Layout/Layout.js";

const RequiredConformation = () => {
  const classes = UseStyle();
  return (
    <div className={classes.root}>
      <Layout>
        <Grid container justify="center" spacing={4}>
          <Grid item lg={6} xs={12}>
            <div className={classes.content}>
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

export default RequiredConformation;
