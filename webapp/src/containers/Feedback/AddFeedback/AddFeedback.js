import React, { useState, useContext } from "react";
import Rating from "@material-ui/lab/Rating";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as serviceProviders from "../../../api/Axios";

import useStyles from "../../ContainerStyles/ModalPopUpStyles";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  CardActions,
  IconButton,
  Divider,
  TextareaAutosize,
  TextField,
  Table,
  TableBody,
  Dialog
} from "@material-ui/core";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton, GrayButton } from "../../../components";
import auth from "../../../components/Auth";
import LoaderContext from "../../../context/LoaderContext";

const AddEditFeedBack = props => {
  const { setLoaderStatus } = useContext(LoaderContext);

  const classes = useStyles();
  const [formState, setFormState] = useState({
    isAddFeedback: props.isAddFeedback ? true : false,
    isEditFeedback: props.isEditFeedback ? true : false,
    isFeedBackAdded: false,
    isFormValid: false,
    stateCounter: 0,
    question_answers: {},
    entityId: null,
    entityName: null,
    isRatingAvailable: false,
    isCommentAvailable: false,
    entityQuestionSet: null,
    questionSetId: null,
    feedbackSetId: null,
    fromEvent: false,
    fromActivity: false
  });

  if (props.showModal && !formState.stateCounter) {
    formState.isDataBlockUnblock = false;
    formState.entityId = props.id;
    formState.entityName = props.Title;
    if (
      props.entityQuestionSet === null ||
      props.entityQuestionSet.length === 0
    ) {
      formState.entityQuestionSet = null;
    } else {
      formState.entityQuestionSet = props.entityQuestionSet;
      formState.question_answers = {};

      props.entityQuestionSet.map(question => {
        if (question.role.name === auth.getUserInfo().role.name) {
          if (question.type === "Rating") {
            formState.isRatingAvailable = true;
            if (formState.isAddFeedback) {
              formState.question_answers[question["id"]] = 0;
            } else if (formState.isEditFeedback) {
              formState.question_answers[question["id"]] =
                question["answer_int"];
            }
          } else if (question.type === "Comment") {
            formState.isCommentAvailable = true;
            if (formState.isAddFeedback) {
              formState.question_answers[question["id"]] = "";
            } else if (formState.isEditFeedback) {
              formState.question_answers[question["id"]] =
                question["answer_text"];
            }
          }
        }
      });
    }
    formState.fromEvent = props.fromEvent;
    formState.fromActivity = props.fromActivity;
    formState.questionSetId = props.questionSetId;
    formState.feedbackSetId = props.feedbackSetId;
    formState.stateCounter += 1;
  }

  const handleSubmit = event => {
    event.preventDefault();

    const questions_answers = formState.entityQuestionSet
      .map(question => {
        if (
          question.type === "Rating" &&
          question.role.name === auth.getUserInfo().role.name
        ) {
          return {
            question_id: question.id,
            type: question.type,
            answer_int: formState.question_answers[question["id"]],
            answer_text: null
          };
        } else if (
          question.type === "Comment" &&
          question.role.name === auth.getUserInfo().role.name
        )
          return {
            question_id: question.id,
            type: question.type,
            answer_int: null,
            answer_text: formState.question_answers[question["id"]]
          };
      })
      .filter(data => {
        return data !== undefined;
      });

    const postData = {
      activity: formState.fromActivity ? formState.entityId : null,
      event: formState.fromEvent ? formState.entityId : null,
      contact: auth.getUserInfo().contact.id,
      question_set: formState.questionSetId,
      questions_answers: questions_answers
    };
    if (formState.isAddFeedback) {
      giveFeedback(postData);
    } else if (formState.isEditFeedback) {
      editFeedback(postData);
    }
  };

  const giveFeedback = async postData => {
    setLoaderStatus(true);
    const POSTFEEDBACK =
      strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_FEEDBACK_SETS;
    await serviceProviders
      .serviceProviderForPostRequest(POSTFEEDBACK, postData)
      .then(res => {
        props.modalClose(true, "Feedback added successfully", false);
        setLoaderStatus(false);
      })
      .catch(error => {
        props.modalClose(false, " Error adding feedback", false);
        setLoaderStatus(false);
        console.log("error giving feedback");
      });
  };

  const editFeedback = async postData => {
    setLoaderStatus(true);
    const EDITFEEDBACK =
      strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_FEEDBACK_SETS;
    await serviceProviders
      .serviceProviderForPutRequest(
        EDITFEEDBACK,
        formState.feedbackSetId,
        postData
      )
      .then(res => {
        props.modalClose(true, "Feedback edited successfully", false);
        setLoaderStatus(false);
      })
      .catch(error => {
        props.modalClose(false, " Error editing feedback", false);
        setLoaderStatus(false);
        console.log("error giving feedback");
      });
  };

  const handleChangeRating = (id, type, value) => {
    value = parseInt(value, 10);
    setFormState(formState => ({
      ...formState,
      question_answers: {
        ...formState.question_answers,
        [id]: value
      }
    }));
  };

  const handleCommentChange = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      question_answers: {
        ...formState.question_answers,
        [event.target.id]: event.target.value
      }
    }));
  };

  const handleClose = () => {
    formState.stateCounter = 0;
    props.modalClose(false, "", true);
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      onClose={handleClose}
      open={props.showModal}
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
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className={classes.edit_dialog}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} className={classes.fullWidth}>
                  <Grid item xs={12} className={classes.formgrid}>
                    <Typography variant="h5" gutterBottom color="textSecondary">
                      {props.Title}
                    </Typography>
                  </Grid>
                  {formState.entityQuestionSet === null ||
                  !formState.entityQuestionSet.length ? (
                    "Cannot give feedback for this event"
                  ) : (
                    <Card>
                      {formState.isRatingAvailable ||
                      formState.isCommentAvailable ? (
                        <form
                          autoComplete="off"
                          noValidate
                          onSubmit={handleSubmit}
                        >
                          <Divider />
                          {formState.isRatingAvailable ? (
                            <CardContent>
                              <Grid item xs={12} md={12}>
                                <div style={{ overflow: "auto" }}>
                                  <TableContainer
                                    className={classes.container}
                                    component={Paper}
                                  >
                                    <div
                                      style={{
                                        overflow: "auto",
                                        height: "200px"
                                      }}
                                    >
                                      <Table>
                                        <TableBody>
                                          {formState.entityQuestionSet.map(
                                            row => (
                                              <TableRow key={row.id}>
                                                {row.type === "Rating" &&
                                                row.role.name ===
                                                  auth.getUserInfo().role
                                                    .name ? (
                                                  <React.Fragment>
                                                    <TableCell
                                                      component="th"
                                                      scope="row"
                                                    >
                                                      {row.title}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                      <Rating
                                                        name={row.id + ""}
                                                        precision={1}
                                                        value={
                                                          formState
                                                            .question_answers[
                                                            row.id
                                                          ] || null
                                                        }
                                                        onChange={event => {
                                                          event.preventDefault();
                                                          handleChangeRating(
                                                            row.id,
                                                            row.type,
                                                            event.target.value
                                                          );
                                                        }}
                                                      />
                                                    </TableCell>
                                                  </React.Fragment>
                                                ) : null}
                                              </TableRow>
                                            )
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </TableContainer>
                                </div>
                              </Grid>
                            </CardContent>
                          ) : null}
                          <Divider />
                          {formState.isCommentAvailable ? (
                            <Grid item xs={12} md={12}>
                              <div className={classes.paddingDiv}>
                                {formState.entityQuestionSet.map(row => (
                                  <div key={row.id}>
                                    {row.type === "Comment" &&
                                    row.role.name ===
                                      auth.getUserInfo().role.name ? (
                                      <React.Fragment>
                                        <TextField
                                          placeholder={row.title}
                                          fullWidth
                                          multiline
                                          margin="normal"
                                          style={{
                                            margin: 8,
                                            width: "fit-content"
                                          }}
                                          label={row.title}
                                          id={row.id + ""}
                                          rows={2}
                                          rowsMax={4}
                                          value={
                                            formState.question_answers[
                                              row.id
                                            ] || ""
                                          }
                                          variant="outlined"
                                          onChange={handleCommentChange}
                                        />
                                      </React.Fragment>
                                    ) : null}
                                  </div>
                                ))}{" "}
                              </div>
                            </Grid>
                          ) : null}

                          <Grid item xs={12} md={12}>
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
                      ) : (
                        <Grid item xs={12} className={classes.edit_dialog}>
                          <Grid item xs={12} md={12}>
                            <CardActions justify="flex-end">
                              No feedback questions available for your login
                            </CardActions>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={12}
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            spacing={2}
                          >
                            <CardActions justify="flex-end">
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
                        </Grid>
                      )}
                    </Card>
                  )}
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
