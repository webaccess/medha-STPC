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
import GetAppIcon from "@material-ui/icons/GetApp";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import * as serviceProviders from "../../../api/Axios";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import useStyles from "../../ContainerStyles/ModalPopUpStyles";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  CardActions,
  IconButton
} from "@material-ui/core";
import * as genericConstants from "../../../constants/GenericConstants";
import { GrayButton, GreenButton } from "../../../components";
import LoaderContext from "../../../context/LoaderContext";
import auth from "../../../components/Auth";

const ViewFeedBack = props => {
  const classes = useStyles();
  const { setLoaderStatus } = useContext(LoaderContext);
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const [formState] = useState({
    ratings: 3,
    stateCounter: 0,
    dataToShow: [],
    greenButtonChecker: true
  });

  if (props.showModal && !formState.stateCounter) {
    formState.dataToShow = props.dataToShow;
    formState.stateCounter += 1;
  }

  const handleClose = () => {
    props.modalClose(false, "", true);
  };

  const getComments = async () => {
    setLoaderStatus(true);
    let QUESTION_SET_URL = "";
    let sheetName = "";
    if (auth.getUserInfo().role.name === "RPC Admin") {
      QUESTION_SET_URL =
        strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_EVENTS +
        "/" +
        props.id +
        "/" +
        strapiConstants.STRAPI_RPC +
        "/" +
        auth.getUserInfo().rpc.id +
        "/getCollegeCommentFeedbackForRPC";
      sheetName = "College Feedback";
    } else if (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) {
      QUESTION_SET_URL =
        strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_EVENTS +
        "/" +
        props.id +
        "/" +
        strapiConstants.STRAPI_CONTACT_SOLO +
        "/" +
        auth.getUserInfo().studentInfo.organization.contact.id +
        "/getStudentsCommentsForFeedbacks";
      sheetName = "Student Feedback";
    }
    await serviceProviders
      .serviceProviderForGetRequest(QUESTION_SET_URL)
      .then(res => {
        const ws = XLSX.utils.json_to_sheet(res.data.result);
        const wb = {
          Sheets: { [sheetName]: ws },
          SheetNames: [sheetName]
        };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, "Feedback" + fileExtension);
        setLoaderStatus(false);
      })
      .catch(error => {
        setLoaderStatus(false);
        console.log("error downloading comments");
      });
  };

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
              {genericConstants.VIEW_FEEDBACK}
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
                <Grid item lg className={classes.deletemessage}>
                  <Grid item xs={12} className={classes.formgrid}>
                    <Typography variant="h5" gutterBottom color="textSecondary">
                      {props.Title}
                    </Typography>
                  </Grid>
                  <Card>
                    <div className={classes.edit_dialog}>
                      <CardContent>
                        <Grid item xs={12} md={12}>
                          <Typography
                            variant="h5"
                            gutterBottom
                            color="textSecondary"
                          >
                            {props.fromRPC
                              ? `Feedback given by ${formState.dataToShow.total} colleges`
                              : `Feedback given by ${formState.dataToShow.total} students`}
                          </Typography>
                          <div style={{ overflow: "auto" }}>
                            {formState.dataToShow.ratings.length !== 0 ? (
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
                                        {formState.dataToShow.ratings.map(
                                          row => (
                                            <TableRow key={row.id}>
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
                                                    value={row.result}
                                                    readOnly
                                                  />
                                                </TableCell>
                                              </React.Fragment>
                                            </TableRow>
                                          )
                                        )}
                                      </div>
                                    </TableContainer>
                                  </div>
                                </Grid>
                              </CardContent>
                            ) : null}
                          </div>
                        </Grid>
                      </CardContent>
                      <Grid item xs={12}>
                        <Grid
                          container
                          direction="row"
                          justify="flex-end"
                          alignItems="center"
                          spacing={2}
                        >
                          <Grid item>
                            <GreenButton
                              variant="contained"
                              color="secondary"
                              startIcon={<GetAppIcon />}
                              onClick={e => getComments()}
                              greenButtonChecker={formState.greenButtonChecker}
                            >
                              Download
                            </GreenButton>
                          </Grid>
                          <Grid item>
                            <GrayButton
                              type="submit"
                              color="primary"
                              variant="contained"
                              onClick={handleClose}
                            >
                              CLOSE
                            </GrayButton>
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
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
export default ViewFeedBack;
