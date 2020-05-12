import React, { useState } from "react";
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

import useStyles from "../../ContainerStyles/ModalPopUpStyles";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  CardActions,
  IconButton,
  Divider,
  makeStyles
} from "@material-ui/core";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton, GrayButton } from "../../../components";

const AddEditFeedBack = props => {
  const useStyles1 = makeStyles({
    root: {
      width: "100%"
    },
    container: {
      maxHeight: 440
    }
  });

  const classes = useStyles();
  const classesTable = useStyles1();

  const [formState, setFormState] = useState({
    ratings: {}
  });

  const handleSubmit = event => {
    event.preventDefault();
  };

  const handleChangeRating = star => {
    star.preventDefault();
  };

  const handleCommentChange = data => {};

  const handleClose = () => {
    props.modalClose();
  };

  const data = [
    { id: 1, question: "The objective of the training were meet" },
    { id: 2, question: "The presentation material were relevent" },
    {
      id: 3,
      question:
        "The trainers were well prepared and able to answer any questions"
    },
    {
      id: 4,
      question:
        "The pace of the course was appropriate to the content and pace of the attendees"
    },
    { id: 5, question: "The venue was appropriate for the event" }
  ];

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
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
                  <Card>
                    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
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
                                    <TableCell align="right">Ratings</TableCell>
                                  </TableRow>
                                </TableHead>
                              </Table>
                              <div
                                style={{ overflow: "auto", height: "200px" }}
                              >
                                <Table>
                                  <TableBody>
                                    {data.map(row => (
                                      <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                          {row.question}
                                        </TableCell>
                                        <TableCell align="right">
                                          <Rating
                                            name={row.id}
                                            precision={1}
                                            onChange={handleChangeRating}
                                          />
                                        </TableCell>
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
                        <TextField
                          label="Comment"
                          id="comment"
                          placeholder="Add Comment"
                          variant="outlined"
                          multiline
                          fullWidth
                          onChange={handleCommentChange}
                        />
                      </Grid>
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
