import React, { useState, useContext } from "react";
import Rating from "@material-ui/lab/Rating";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
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
  TextField,
  CardActions,
  IconButton,
  makeStyles,
  Divider,
  TextareaAutosize
} from "@material-ui/core";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton, GrayButton } from "../../../components";
import auth from "../../../components/Auth";
import LoaderContext from "../../../context/LoaderContext";

const AddEditFeedBack = props => {
  const { setLoaderStatus } = useContext(LoaderContext);
  const useStyles1 = makeStyles({
    root: {
      width: "100%"
    },
    container: {
      maxHeight: 440
    }
  });

  const classes = useStyles();
  const [formState, setFormState] = useState({
    isFeedBackAdded: false,
    isFormValid: false,
    stateCounter: 0,
    question_answers: {},
    entityId: null,
    entityName: null,
    entityQuestionSet: null,
    questionSetId: null,
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
            formState.question_answers[question["id"]] = 0;
          } else if (question.type === "Comment") {
            formState.question_answers[question["id"]] = "";
          }
        }
      });
    }
    formState.fromEvent = props.fromEvent;
    formState.fromActivity = props.fromActivity;
    formState.questionSetId = props.questionSetId;
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

    giveFeedback(postData);
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
                      {props.Title}
                    </Typography>
                  </Grid>
                  {formState.entityQuestionSet === null ||
                  !formState.entityQuestionSet.length ? (
                    "No feedback for this event"
                  ) : (
                    <Card>
                      <form
                        autoComplete="off"
                        noValidate
                        onSubmit={handleSubmit}
                      >
                        <CardContent>
                          <Grid item xs={12} md={12}>
                            <div style={{ overflow: "auto" }}>
                              <TableContainer
                                className={classes.container}
                                component={Paper}
                              >
                                <Table
                                  className={classes.table}
                                  stickyHeader
                                  aria-label="feedback table"
                                >
                                  <TableHead>
                                    <TableRow
                                      style={{
                                        backgroundColor: "#f5f5f5",
                                        height: "35px"
                                      }}
                                    >
                                      <TableCell>Questions</TableCell>
                                      <TableCell align="right">
                                        Ratings
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                </Table>
                                <div
                                  style={{ overflow: "auto", height: "200px" }}
                                >
                                  <Table>
                                    <TableBody>
                                      {formState.entityQuestionSet.map(row => (
                                        <TableRow key={row.id}>
                                          {row.type === "Rating" &&
                                          row.role.name ===
                                            auth.getUserInfo().role.name ? (
                                            <React.Fragment>
                                              <TableCell
                                                component="th"
                                                scope="row"
                                              >
                                                {row.title}
                                              </TableCell>
                                              <TableCell align="right">
                                                <Rating
                                                  name={row.id}
                                                  precision={1}
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
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TableContainer>
                            </div>
                          </Grid>
                        </CardContent>
                        <Grid item xs={12} md={12}>
                          <Divider />
                          <div className={classes.paddingDiv}>
                            {formState.entityQuestionSet.map(row => (
                              <div key={row.id}>
                                {row.type === "Comment" &&
                                row.role.name ===
                                  auth.getUserInfo().role.name ? (
                                  <React.Fragment>
                                    <TextareaAutosize
                                      rowsMin={4}
                                      label={row.title}
                                      id={row.id}
                                      placeholder={row.title}
                                      variant="outlined"
                                      multiline
                                      fullWidth
                                      onChange={handleCommentChange}
                                    />
                                  </React.Fragment>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </Grid>
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
