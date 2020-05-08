import React, { useState } from "react";
import Rating from "@material-ui/lab/Rating";
import { useHistory } from "react-router-dom";

import useStyles from "../../ContainerStyles/ManagePageStyles";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  CardActions
} from "@material-ui/core";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import {
  YellowButton,
  GrayButton,
  ReadOnlyTextField
} from "../../../components";

const AddEditFeedBack = props => {
  const classes = useStyles();
  const history = useHistory();

  const [formState, setFormState] = useState({
    ratings: {},
    eventTitle: props["location"]["eventTitle"],
    eventId: props["location"]["eventId"]
  });

  const handleSubmit = event => {
    event.preventDefault();
    console.log("--------------------");
    console.log("dataSubmited", event);
    console.log("--------------------");
  };

  const handleChangeRating = star => {
    star.preventDefault();
    console.log("starRating", star.target.value);
  };

  const handleCommentChange = data => {
    console.log("comment");
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.ADD_FEEDBACK}
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          {formState.eventTitle}
        </Typography>
      </Grid>
      <Card>
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <CardContent>
            <Grid item xs={12} md={6}>
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
                  <Rating
                    name="question1"
                    //defaultValue={2.5}
                    //value={formState.rating1}
                    precision={0.5}
                    onChange={handleChangeRating}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <Typography variant="h5" gutterBottom>
                    The presentation material were relevant
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Rating
                    name="question2"
                    //defaultValue={2.5}
                    //value={formState.rating2}
                    precision={0.5}
                    onChange={handleChangeRating}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <Typography variant="h5" gutterBottom>
                    The trainers were well prepared and able to answer any
                    question
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Rating
                    name="question3"
                    //defaultValue={2.5}
                    //value={formState.rating3}
                    precision={0.5}
                    onChange={handleChangeRating}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <Typography variant="h5" gutterBottom>
                    The pace of the course was appropriate to the content and
                    attendees{" "}
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Rating
                    name="question4"
                    //defaultValue={2.5}
                    // value={formState.rating4}
                    precision={0.5}
                    onChange={handleChangeRating}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <Typography variant="h5" gutterBottom>
                    The venue was appropriate for the event{" "}
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Rating
                    name="question5"
                    //defaultValue={2.5}
                    //value={formState.rating5}
                    precision={0.5}
                    onChange={handleChangeRating}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={12} xs={12}>
                  <TextField
                    label="Comment"
                    id="comment"
                    placeholder="Add Comment"
                    //value={[]}
                    variant="outlined"
                    //required
                    multiline
                    fullWidth
                    onChange={handleCommentChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <Grid item xs={12} className={classes.CardActionGrid}>
            <CardActions className={classes.btnspace}>
              <YellowButton type="submit" color="primary" variant="contained">
                {genericConstants.SAVE_BUTTON_TEXT}
              </YellowButton>
              <GrayButton
                type="submit"
                color="primary"
                variant="contained"
                to={routeConstants.MANAGE_ACTIVITY}
              >
                {genericConstants.CANCEL_BUTTON_TEXT}
              </GrayButton>
            </CardActions>
          </Grid>
        </form>
      </Card>
    </Grid>
  );
};
export default AddEditFeedBack;
