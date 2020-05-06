import React from "react";
import Rating from "@material-ui/lab/Rating";

import useStyles from "../../ContainerStyles/ManagePageStyles";
import { Card, CardContent, Grid, Typography, Button } from "@material-ui/core";
import * as genericConstants from "../../../constants/GenericConstants";
import {
  YellowButton,
  GrayButton,
  ReadOnlyTextField
} from "../../../components";

const AddEditFeedBack = props => {
  const classes = useStyles();

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.ADD_FEEDBACK}
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          Activity Tile or Name Here
        </Typography>
      </Grid>
      <Card>
        <CardContent>
          <Grid item xs={12} md={6} xl={3}>
            <Grid container spacing={3} className={classes.formgrid}>
              <Typography variant="h5" gutterBottom>
                How satisfied were you with:*
              </Typography>
            </Grid>

            <Grid container spacing={3} className={classes.formgrid}>
              <Grid item md={6} xs={12}>
                <Typography variant="h5" gutterBottom>
                  The objective of the training were meet
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
              </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.formgrid}>
              <Grid item md={6} xs={12}>
                <Typography variant="h5" gutterBottom>
                  The presentation material were relevant
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
export default AddEditFeedBack;
