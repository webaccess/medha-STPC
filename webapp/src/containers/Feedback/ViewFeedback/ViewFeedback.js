import React, { useState, useContext } from "react";
import Rating from "@material-ui/lab/Rating";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import GetAppIcon from "@material-ui/icons/GetApp";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import * as serviceProviders from "../../../api/Axios";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

import useStyles from "../../ContainerStyles/ModalPopUpStyles";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Dialog
} from "@material-ui/core";
import * as genericConstants from "../../../constants/GenericConstants";
import { GrayButton, GreenButton } from "../../../components";
import LoaderContext from "../../../context/LoaderContext";
import auth from "../../../components/Auth";

const dataToShowOnRoles = {
  [roleConstants.COLLEGEADMIN]: "College feedback",
  [roleConstants.RPCADMIN]: "RPC feedback",
  [roleConstants.STUDENT]: "Student feedback",
  [roleConstants.ZONALADMIN]: "Zone feedback"
};

const dataFor = {
  [roleConstants.COLLEGEADMIN]: "College(s)",
  [roleConstants.RPCADMIN]: "RPC(s)",
  [roleConstants.STUDENT]: "Student(s)",
  [roleConstants.ZONALADMIN]: "Zone(s)"
};

const ViewFeedBack = props => {
  const classes = useStyles();
  const { setLoaderStatus } = useContext(LoaderContext);
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const [formState, setFormState] = useState({
    ratings: 3,
    stateCounter: 0,
    dataToShow: [],
    greenButtonChecker: true,
    result: {},
    dataLength: 0
  });

  const [expanded, setExpanded] = React.useState(false);

  if (props.showModal && !formState.stateCounter) {
    formState.dataToShow = props.dataToShow;
    formState.dataLength = Object.keys(props.result).length;
    if (auth.getUserInfo().role.name === roleConstants.ZONALADMIN) {
      setExpanded(false);
    } else if (
      auth.getUserInfo().role.name === roleConstants.RPCADMIN ||
      (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
        auth.getUserInfo().studentInfo.organization.contact.id ===
          auth.getUserInfo().rpc.main_college &&
        props.fromRPC)
    ) {
      formState.dataToShow = props.result[roleConstants.COLLEGEADMIN];
    } else if (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) {
      formState.dataToShow = props.result[roleConstants.STUDENT];
    } else if (auth.getUserInfo().role.name === roleConstants.MEDHAADMIN) {
      setExpanded(false);
    }
    formState.stateCounter += 1;
  }

  const handleChangeExpansionPanel = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setFormState(formState => ({
      ...formState,
      dataToShow: props.result[panel]
    }));
  };

  const handleClose = () => {
    props.modalClose(false, "", true);
  };

  const getComments = async dataFor => {
    setLoaderStatus(true);
    let QUESTION_SET_URL = "";
    let sheetName = "";
    if (
      auth.getUserInfo().role.name === roleConstants.RPCADMIN ||
      (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
        auth.getUserInfo().studentInfo.organization.contact.id ===
          auth.getUserInfo().rpc.main_college &&
        props.fromRPC)
    ) {
      if (props.fromEvent) {
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
      } else if (props.fromActivity) {
        QUESTION_SET_URL =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_ACTIVITY +
          "/" +
          props.id +
          "/" +
          strapiConstants.STRAPI_RPC +
          "/" +
          auth.getUserInfo().rpc.id +
          "/getRpcFeedback/comment";
      }
      sheetName = "College Feedback";
      /** Gets comments for students depending on whether its for event or for activities */
    } else if (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) {
      if (props.fromEvent) {
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
      } else if (props.fromActivity) {
        QUESTION_SET_URL =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_ACTIVITY +
          "/" +
          props.id +
          "/" +
          strapiConstants.STRAPI_CONTACT_SOLO +
          "/" +
          auth.getUserInfo().studentInfo.organization.contact.id +
          "/getStudentsFeedbacks/comment";
        sheetName = "Student Feedback";
      }
    } else if (auth.getUserInfo().role.name === roleConstants.ZONALADMIN) {
      let entity = "";
      if (props.fromEvent) {
        entity = strapiConstants.STRAPI_EVENTS;
      } else if (props.fromActivity) {
        entity = strapiConstants.STRAPI_ACTIVITY;
      }
      if (dataFor === "College(s)") {
        QUESTION_SET_URL =
          strapiConstants.STRAPI_DB_URL +
          entity +
          "/" +
          props.id +
          "/getFeedbackForZone/" +
          auth.getUserInfo().zone.id +
          "/DataFor/college/FeedbackType/comment";
        sheetName = "College Feedback";
      } else if (dataFor === "RPC(s)") {
        QUESTION_SET_URL =
          strapiConstants.STRAPI_DB_URL +
          entity +
          "/" +
          props.id +
          "/getFeedbackForZone/" +
          auth.getUserInfo().zone.id +
          "/DataFor/rpc/FeedbackType/comment";
        sheetName = "RPC Feedback";
      }
    } else if (auth.getUserInfo().role.name === roleConstants.MEDHAADMIN) {
      let entity = "";
      if (props.fromEvent) {
        entity = strapiConstants.STRAPI_EVENTS;
      } else if (props.fromActivity) {
        entity = strapiConstants.STRAPI_ACTIVITY;
      }
      if (dataFor === "College(s)") {
        QUESTION_SET_URL =
          strapiConstants.STRAPI_DB_URL +
          entity +
          "/" +
          props.id +
          "/getSuperAdminFeedback/" +
          auth.getUserInfo().contact.id +
          "/DataFor/college/FeedbackType/comment";

        sheetName = "College Feedback";
      } else if (dataFor === "RPC(s)") {
        QUESTION_SET_URL =
          strapiConstants.STRAPI_DB_URL +
          entity +
          "/" +
          props.id +
          "/getSuperAdminFeedback/" +
          auth.getUserInfo().contact.id +
          "/DataFor/rpc/FeedbackType/comment";

        sheetName = "RPC Feedback";
      } else if (dataFor === "Zone(s)") {
        QUESTION_SET_URL =
          strapiConstants.STRAPI_DB_URL +
          entity +
          "/" +
          props.id +
          "/getSuperAdminFeedback/" +
          auth.getUserInfo().contact.id +
          "/DataFor/zone/FeedbackType/comment";
        sheetName = "Zone Feedback";
      }
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
        FileSaver.saveAs(data, props.Title + fileExtension);
        setLoaderStatus(false);
      })
      .catch(error => {
        setLoaderStatus(false);
        console.log("error downloading comments");
      });
  };

  const noDataToShow = () => {
    return (
      <>
        <div className={classes.edit_dialog}>
          <CardContent>
            <Grid item xs={12} md={12}>
              <Typography variant="h5" gutterBottom color="textSecondary">
                No feedback available
              </Typography>
            </Grid>
          </CardContent>
        </div>
      </>
    );
  };

  const functionTest = dataFor => {
    return (
      <React.Fragment>
        {formState.dataToShow !== undefined &&
        formState.dataToShow !== null &&
        formState.dataToShow.length !== 0 ? (
          <div className={classes.edit_dialog}>
            <CardContent>
              <Grid item xs={12} md={12}>
                <Typography variant="h5" gutterBottom color="textSecondary">
                  {props.fromCollegeAdmin
                    ? `Feedback given by ${formState.dataToShow.total} student(s)`
                    : null}
                  {props.fromRPC
                    ? `Feedback given by ${formState.dataToShow.total} college(s)`
                    : null}
                  {props.fromZone || props.formSuperAdmin
                    ? `Feedback given by ${formState.dataToShow.total} ${dataFor}`
                    : null}
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
                                overflow: "auto"
                              }}
                            >
                              {formState.dataToShow.ratings.map(row => (
                                <TableRow key={row.id}>
                                  <React.Fragment>
                                    <TableCell component="th" scope="row">
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
                              ))}
                            </div>
                          </TableContainer>
                        </div>
                      </Grid>
                    </CardContent>
                  ) : null}
                </div>
              </Grid>
            </CardContent>
            <Grid item xs={12} className={classes.edit_dialog}>
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
                    onClick={e => getComments(dataFor)}
                    greenButtonChecker={formState.greenButtonChecker}
                  >
                    Download
                  </GreenButton>
                </Grid>
                {formState.dataLength === 1 ? (
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
                ) : null}
              </Grid>
            </Grid>
          </div>
        ) : (
          noDataToShow()
        )}
      </React.Fragment>
    );
  };

  return (
    <Dialog
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
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
                    {formState.dataLength > 1
                      ? Object.keys(props.result).map(data => (
                          <>
                            <ExpansionPanel
                              expanded={expanded === data}
                              onChange={(event, isExpanded) => {
                                handleChangeExpansionPanel(data, isExpanded);
                              }}
                            >
                              <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                              >
                                <Typography>
                                  {dataToShowOnRoles[data]}
                                </Typography>
                              </ExpansionPanelSummary>
                              <ExpansionPanelDetails>
                                {functionTest(dataFor[data])}
                              </ExpansionPanelDetails>
                            </ExpansionPanel>
                          </>
                        ))
                      : formState.dataToShow !== undefined &&
                        formState.dataToShow !== null &&
                        formState.dataToShow.length !== 0
                      ? functionTest(props.dataFor)
                      : noDataToShow()}
                  </Card>
                  {formState.dataLength === 1 ? null : (
                    <Grid item xs={12} className={classes.edit_dialog}>
                      <Grid
                        container
                        direction="row"
                        justify="flex-end"
                        alignItems="center"
                        spacing={2}
                      >
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
                  )}
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Fade>
    </Dialog>
  );
};
export default ViewFeedBack;
