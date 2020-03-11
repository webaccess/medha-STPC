import React from "react";
import { Grid, Typography } from "@material-ui/core";
import useStyles from "./Styles";
import Layout from "../../hoc/Layout/Layout";

const NotFoundPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Layout>
        <Grid container justify="center" spacing={4}>
          <Grid item lg={6} xs={12}>
            <div className={classes.content}>
              <Typography variant="h1">
                404: The page you are looking for isn’t here
              </Typography>
              <Typography variant="subtitle2">
                You either tried some shady route or you came here by mistake.
                Whichever it is, try using the navigation
              </Typography>
              <img
                alt="Not Found"
                className={classes.image}
                src="/images/notFound.svg"
              />
            </div>
          </Grid>
        </Grid>
      </Layout>
    </div>
  );
};

export default NotFoundPage;
