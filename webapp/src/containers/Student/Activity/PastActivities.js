import React, { useState, useEffect, useContext } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Collapse,
  IconButton
} from "@material-ui/core";

import styles from "./Activity.module.css";
import useStyles from "../CommonStyles/ViewStyles.js";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import * as formUtilities from "../../../utilities/FormUtilities";
import CloseIcon from "@material-ui/icons/Close";
import {
  Table,
  YellowButton,
  GrayButton,
  Auth,
  FeedBack,
  PastEventStatus
} from "../../../components";
import { useHistory } from "react-router-dom";
import LoaderContext from "../../../context/LoaderContext";
import AddEditFeedBack from "../../Feedback/AddFeedback/AddFeedback";
import Alert from "@material-ui/lab/Alert";
import NoFeedback from "../../Feedback/NoFeedback/NoFeedback";
import auth from "../../../components/Auth";

const PastActivities = props => {
  const [open, setOpen] = React.useState(true);
  const { setLoaderStatus } = useContext(LoaderContext);
  const [statusFilter, setStatusFilter] = useState([]);
  const classes = useStyles();
  const history = useHistory();
  const [formState, setFormState] = useState({
    dataToShow: [],
    activities: [],
    activitiesFilter: [],
    filterDataParameters: {},
    isFilterSearch: false,
    showModalDelete: false,
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true,
    activityTitle: null,
    activityID: null,
    showModalFeedback: false,
    showErrorModalFeedback: false,
    isGiveFeedback: false,
    isEditFeedback: false,
    entityQuestionSet: [],
    questionSetId: null,
    feedbackSetId: null,
    feedBackGiven: false,
    fromFeedBackModal: false,
    successErrorMessage: "",
    errorMessage: ""
  });

  const studentInfo =
    Auth.getUserInfo() !== null &&
    Auth.getUserInfo().role.name === roleConstants.STUDENT
      ? Auth.getUserInfo().studentInfo.contact.id
      : Auth.getStudentIdFromCollegeAdmin();
  const STUDENT_ACTIVITY_URL =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_STUDENTS_INDIVIDUAL_ACTIVITY_URL +
    `/${studentInfo}/` +
    strapiConstants.STRAPI_PAST_ACTIVITIES;
  const ACTIVITY_FILTER = "title_contains";
  const ACTIVITY_STATUS = "status";
  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(STUDENT_ACTIVITY_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          activitiesFilter: res.data.result
        }));
      })
      .catch(error => {
        console.log("error-->>", error);
      });

    getPastActivities(10, 1);
  }, []);

  /** This seperate function is used to get the activity data*/
  const getPastActivities = async (pageSize, page, params = null) => {
    if (params !== null && !formUtilities.checkEmpty(params)) {
      let defaultParams = {
        page: page,
        pageSize: pageSize,
        _sort: "start_date_time:desc"
      };
      Object.keys(params).map(key => {
        defaultParams[key] = params[key];
      });
      params = defaultParams;
    } else {
      params = {
        page: page,
        pageSize: pageSize,
        _sort: "start_date_time:desc"
      };
    }
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));

    await serviceProviders
      .serviceProviderForGetRequest(STUDENT_ACTIVITY_URL, params)
      .then(res => {
        formState.dataToShow = [];
        let tempPAstActivityData = [];
        let pastActivity = res.data.result;
        tempPAstActivityData = convertPastActivityData(pastActivity);
        setFormState(formState => ({
          ...formState,
          activities: tempPAstActivityData,
          dataToShow: tempPAstActivityData,
          pageSize: res.data.pageSize,
          totalRows: res.data.rowCount,
          page: res.data.page,
          pageCount: res.data.pageCount,
          isDataLoading: false
        }));
      })
      .catch(error => {
        console.log("error-->>", error);
      });
  };

  const convertPastActivityData = data => {
    let pastEventDataArray = [];
    if (data) {
      for (let i in data) {
        var tempIndividualPastEventData = {};
        tempIndividualPastEventData["id"] = data[i]["id"];
        let startDate = new Date(data[i]["start_date_time"]);
        let endDate = new Date(data[i]["end_date_time"]);

        tempIndividualPastEventData["title"] = data[i]["title"];
        tempIndividualPastEventData["activityType"] =
          data[i]["activitytype"]["name"];
        tempIndividualPastEventData["activityBatch"] =
          data[i]["activity_batch"]["name"];

        tempIndividualPastEventData[
          "start_date_time"
        ] = startDate.toDateString();
        tempIndividualPastEventData["end_date_time"] = endDate.toDateString();
        tempIndividualPastEventData["hasAttended"] = data[i]["hasAttended"];

        tempIndividualPastEventData["giveFeedback"] = false;
        tempIndividualPastEventData["editFeedback"] = false;
        tempIndividualPastEventData["cannotGiveFeedback"] = false;
        tempIndividualPastEventData["feedbackId"] = data[i]["feedbackSetId"];

        if (
          data[i]["hasAttended"] &&
          data[i]["question_set"] &&
          !data[i]["isFeedbackProvided"]
        ) {
          tempIndividualPastEventData["giveFeedback"] = true;
        } else if (
          data[i]["hasAttended"] &&
          data[i]["question_set"] &&
          data[i]["isFeedbackProvided"]
        ) {
          tempIndividualPastEventData["editFeedback"] = true;
        } else if (!data[i]["hasAttended"] || !data[i]["question_set"]) {
          tempIndividualPastEventData["cannotGiveFeedback"] = true;
        } else {
          tempIndividualPastEventData["cannotGiveFeedback"] = true;
        }
        pastEventDataArray.push(tempIndividualPastEventData);
      }
      return pastEventDataArray;
    }
  };

  /** Pagination */
  const handlePerRowsChange = async (perPage, page) => {
    /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getPastActivities(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getPastActivities(perPage, page);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getPastActivities(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getPastActivities(formState.pageSize, page);
      }
    }
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getPastActivities(perPage, page, formState.filterDataParameters);
    }
  };

  const clearFilter = () => {
    setFormState(formState => ({
      ...formState,
      isFilterSearch: false,
      /** Clear all filters */
      filterDataParameters: {},
      /** Turns on the spinner */
      isDataLoading: true
    }));
    /**Need to confirm this thing for resetting the data */
    restoreData();
  };

  const restoreData = () => {
    getPastActivities(formState.pageSize, 1);
  };

  const handleFilterChangeForTitleField = event => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [ACTIVITY_FILTER]: event.target.value
      }
    }));
    event.persist();
  };

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
    }
  };

  // const handleSort = (
  //   column,
  //   sortDirection,
  //   perPage = formState.pageSize,
  //   page = 1
  // ) => {
  //   formState.filterDataParameters[SORT_FIELD_KEY] =
  //     column.selector + ":" + sortDirection;
  //   getPastActivities(perPage, page, formState.filterDataParameters);
  // };

  /** Give feedback */
  const giveFeedback = async activity => {
    setLoaderStatus(true);
    const QUESTION_SET_URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY +
      "/" +
      activity.id +
      "/" +
      strapiConstants.STRAPI_QUESTION_SET;
    await serviceProviders
      .serviceProviderForGetRequest(QUESTION_SET_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          showModalFeedback: true,
          activityTitle: activity.title,
          activityID: activity.id,
          isGiveFeedback: true,
          isEditFeedback: false,
          showErrorModalFeedback: false,
          entityQuestionSet: res.data.result.questions,
          questionSetId: res.data.result.id,
          feedBackGiven: false,
          fromFeedBackModal: false,
          successErrorMessage: ""
        }));
        setLoaderStatus(false);
      })
      .catch(error => {
        setFormState(formState => ({
          ...formState,
          showModalFeedback: false,
          showErrorModalFeedback: true,
          activityTitle: activity.title,
          isEditFeedback: false,
          isGiveFeedback: false,
          feedBackGiven: false,
          fromFeedBackModal: false,
          successErrorMessage: "",
          errorMessage: "Cannot give feedback"
        }));
        setLoaderStatus(false);
        console.log("error giving feedback");
      });
  };

  /** Edit feedback */
  const editFeedback = async activity => {
    setLoaderStatus(true);
    const FEEDBACK_SET_URL =
      strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_FEEDBACK_SETS;
    await serviceProviders
      .serviceProviderForGetOneRequest(FEEDBACK_SET_URL, activity.feedbackId)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          showModalFeedback: true,
          activityTitle: activity.title,
          activityID: activity.id,
          isGiveFeedback: false,
          isEditFeedback: true,
          showErrorModalFeedback: false,
          feedbackSetId: activity.feedbackId,
          questionSetId: res.data.result.question_set.id,
          entityQuestionSet: res.data.result.questions,
          feedBackGiven: false,
          fromFeedBackModal: false,
          successErrorMessage: ""
        }));
        setLoaderStatus(false);
      })
      .catch(error => {
        setFormState(formState => ({
          ...formState,
          showModalFeedback: false,
          showErrorModalFeedback: true,
          activityTitle: activity.title,
          isGiveFeedback: false,
          isEditFeedback: false,
          feedBackGiven: false,
          fromFeedBackModal: false,
          successErrorMessage: "",
          errorMessage: "Cannot edit feedback"
        }));
        setLoaderStatus(false);
        console.log("error giving feedback");
      });
  };

  const handleCloseFeedBackModal = (
    status,
    message,
    isModalClosedWithoutGivingFeedbach
  ) => {
    setOpen(true);
    if (isModalClosedWithoutGivingFeedbach) {
      setFormState(formState => ({
        ...formState,
        showModalFeedback: false,
        showErrorModalFeedback: false,
        activityTitle: null,
        activityID: null,
        isGiveFeedback: false,
        isEditFeedback: false,
        fromFeedBackModal: false,
        feedBackGiven: false,
        successErrorMessage: ""
      }));
    } else {
      if (status) {
        setFormState(formState => ({
          ...formState,
          showModalFeedback: false,
          showErrorModalFeedback: false,
          activityTitle: null,
          activityID: null,
          isGiveFeedback: false,
          isEditFeedback: false,
          fromFeedBackModal: true,
          feedBackGiven: true,
          successErrorMessage: message
        }));
        getPastActivities(
          formState.pageSize,
          formState.page,
          formState.filterDataParameters
        );
      } else {
        setFormState(formState => ({
          ...formState,
          showModalFeedback: false,
          showErrorModalFeedback: false,
          activityTitle: null,
          activityID: null,
          isGiveFeedback: false,
          isEditFeedback: false,
          fromFeedBackModal: true,
          feedBackGiven: false,
          successErrorMessage: message
        }));
      }
    }
  };

  const handleCloseModal = () => {
    setFormState(formState => ({
      ...formState,
      showErrorModalFeedback: false
    }));
  };

  /** Columns to show in table */
  const column = [
    { name: "Training & Activity", sortable: true, selector: "title" },
    { name: "Type", sortable: true, selector: "activityType" },
    { name: "Batch", sortable: true, selector: "activityBatch" },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <PastEventStatus style={cell.hasAttended} />
          </div>
          {auth.getUserInfo().role.name === roleConstants.STUDENT ? (
            cell.giveFeedback ? (
              <div className={classes.PaddingActionButton}>
                <FeedBack
                  isGiveFeedback={true}
                  isEditFeedback={false}
                  cannotGiveFeedback={false}
                  id={cell.id}
                  value={cell.title}
                  onClick={() => giveFeedback(cell)}
                />
              </div>
            ) : cell.editFeedback ? (
              <div className={classes.PaddingActionButton}>
                <FeedBack
                  isGiveFeedback={false}
                  isEditFeedback={true}
                  cannotGiveFeedback={false}
                  id={cell.id}
                  value={cell.title}
                  onClick={() => {
                    editFeedback(cell);
                  }}
                />
              </div>
            ) : cell.cannotGiveFeedback ? (
              <div className={classes.PaddingActionButton}>
                <FeedBack
                  isGiveFeedback={false}
                  isEditFeedback={false}
                  cannotGiveFeedback={true}
                  isdisabled={true}
                  id={cell.id}
                  value={cell.title}
                  onClick={() => {}}
                />
              </div>
            ) : null
          ) : null}
        </div>
      ),
      width: "20%",
      cellStyle: {
        width: "auto",
        maxWidth: "auto"
      }
    }
  ];

  return (
    <Card style={{ padding: "8px" }}>
      <CardContent className={classes.Cardtheming}>
        <Grid>
          {" "}
          <Grid item xs={12} className={classes.formgrid}>
            {formState.fromFeedBackModal && formState.feedBackGiven ? (
              <Collapse in={open}>
                <Alert
                  severity="success"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {formState.successErrorMessage}
                </Alert>
              </Collapse>
            ) : null}

            {formState.fromFeedBackModal && !formState.feedBackGiven ? (
              <Collapse in={open}>
                <Alert
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {formState.successErrorMessage}
                </Alert>
              </Collapse>
            ) : null}
          </Grid>
          <Grid item xs={12} className={classes.formgrid}>
            <Card className={styles.filterButton}>
              <CardContent className={classes.Cardtheming}>
                <Grid className={classes.filterOptions} container spacing={1}>
                  <Grid item>
                    <TextField
                      label="Name"
                      margin="normal"
                      variant="outlined"
                      value={
                        formState.filterDataParameters[ACTIVITY_FILTER] || ""
                      }
                      placeholder="Name"
                      className={classes.autoCompleteField}
                      style={{ marginTop: "0px", marginBottom: "0px" }}
                      onChange={handleFilterChangeForTitleField}
                    />
                  </Grid>
                  <Grid item>
                    <Autocomplete
                      id="activity-status-filter"
                      options={genericConstants.ACTIVITY_STATUS}
                      className={classes.autoCompleteField}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) =>
                        handleChangeAutoComplete(ACTIVITY_STATUS, event, value)
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Status"
                          className={classes.autoCompleteField}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item className={classes.filterButtonsMargin}>
                    <YellowButton
                      variant="contained"
                      color="primary"
                      disableElevation
                      onClick={event => {
                        event.persist();
                        searchFilter();
                      }}
                    >
                      {genericConstants.SEARCH_BUTTON_TEXT}
                    </YellowButton>
                  </Grid>
                  <Grid item className={classes.filterButtonsMargin}>
                    <GrayButton
                      variant="contained"
                      color="primary"
                      onClick={clearFilter}
                      disableElevation
                    >
                      {genericConstants.RESET_BUTTON_TEXT}
                    </GrayButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            {formState.dataToShow.length ? (
              <Table
                data={formState.dataToShow}
                column={column}
                defaultSortField="name"
                defaultSortAsc={formState.sortAscending}
                progressPending={formState.isDataLoading}
                paginationTotalRows={formState.totalRows}
                paginationRowsPerPageOptions={[10, 20, 50]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                noDataComponent="No Past Activities found"
              />
            ) : (
              <div className={classes.noDataMargin}>
                {genericConstants.NO_DATA_TO_SHOW_TEXT}
              </div>
            )}
            {formState.isGiveFeedback ? (
              <AddEditFeedBack
                isAddFeedback={true}
                showModal={formState.showModalFeedback}
                modalClose={handleCloseFeedBackModal}
                Title={formState.activityTitle}
                id={formState.activityID}
                entityQuestionSet={formState.entityQuestionSet}
                questionSetId={formState.questionSetId}
                fromEvent={false}
                fromActivity={true}
              />
            ) : formState.isEditFeedback ? (
              <AddEditFeedBack
                isEditFeedback={true}
                showModal={formState.showModalFeedback}
                modalClose={handleCloseFeedBackModal}
                Title={formState.activityTitle}
                id={formState.activityID}
                entityQuestionSet={formState.entityQuestionSet}
                questionSetId={formState.questionSetId}
                feedbackSetId={formState.feedbackSetId}
                fromEvent={false}
                fromActivity={true}
              />
            ) : null}
            {!formState.isGiveFeedback &&
            !formState.isEditFeedback &&
            !formState.showModalFeedback &&
            formState.showErrorModalFeedback ? (
              <NoFeedback
                showModal={formState.showErrorModalFeedback}
                modalClose={handleCloseModal}
                Title={formState.activityTitle}
                errorMessage={formState.errorMessage}
              />
            ) : null}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PastActivities;
