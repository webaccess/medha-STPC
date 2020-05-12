import React, { useState } from "react";
import Rating from "@material-ui/lab/Rating";
import { useHistory } from "react-router-dom";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";

import useStyles from "../../ContainerStyles/ModalPopUpStyles";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  CardActions,
  IconButton
} from "@material-ui/core";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton, GrayButton } from "../../../components";

const AddEditFeedBack = props => {
  const classes = useStyles();

  const [formState, setFormState] = useState({
    ratings: {}
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

  const handleClose = () => {
    props.modalClose();
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.showModal}
      // onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={props.showModal}>
        <div className={classes.paper}>
          <div className={classes.blockpanel}>
            <Typography variant={"h2"} className={classes.textMargin}>
              {genericConstants.ADD_FEEDBACK}
            </Typography>
            <div className={classes.crossbtn}>
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={props.modalClose}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className={classes.edit_dialog}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item lg className={classes.deletemessage}>
                  <Grid item xs={12} className={classes.formgrid}>
                    <Typography variant="h5" gutterBottom color="textSecondary">
                      {props.activityTitle}
                    </Typography>
                  </Grid>
                  <Card>
                    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                      <CardContent>
                        <Grid item xs={12} md={6}>
                          <Grid
                            container
                            spacing={3}
                            className={classes.formgrid}
                          >
                            <Typography variant="h5" gutterBottom>
                              How satisfied were you with:*
                            </Typography>
                          </Grid>

                          <Grid
                            container
                            spacing={3}
                            className={classes.formgrid}
                          >
                            <Grid item lg>
                              <Typography variant="h5" gutterBottom>
                                The objective of the training were meet
                              </Typography>
                            </Grid>
                            <Grid item lg>
                              <Rating
                                name="question1"
                                //defaultValue={2.5}
                                //value={formState.rating1}
                                precision={0.5}
                                onChange={handleChangeRating}
                              />
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            spacing={3}
                            className={classes.formgrid}
                          >
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
                          <Grid
                            container
                            spacing={3}
                            className={classes.formgrid}
                          >
                            <Grid item md={6} xs={12}>
                              <Typography variant="h5" gutterBottom>
                                The trainers were well prepared and able to
                                answer any question
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
                          <Grid
                            container
                            spacing={3}
                            className={classes.formgrid}
                          >
                            <Grid item md={6} xs={12}>
                              <Typography variant="h5" gutterBottom>
                                The pace of the course was appropriate to the
                                content and attendees{" "}
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
                          <Grid
                            container
                            spacing={3}
                            className={classes.formgrid}
                          >
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
                          <Grid
                            container
                            spacing={3}
                            className={classes.MarginBottom}
                          >
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
                      <Grid item xs={12}>
                        <CardActions justify="flex-end">
                          <YellowButton
                            type="submit"
                            color="primary"
                            variant="contained"
                            onClick={handleSubmit}
                          >
                            {genericConstants.SAVE_BUTTON_TEXT}
                          </YellowButton>
                          <GrayButton
                            type="submit"
                            color="primary"
                            variant="contained"
                            onClick={handleClose}
                          >
                            CLOSE
                          </GrayButton>
                        </CardActions>
                      </Grid>
                    </form>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};
export default AddEditFeedBack;
