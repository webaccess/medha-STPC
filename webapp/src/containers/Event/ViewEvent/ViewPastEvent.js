import React, { useState, useEffect } from "react";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Typography,
  Collapse,
  IconButton
} from "@material-ui/core";
import {
  Table,
  Spinner,
  GrayButton,
  YellowButton,
  InlineDatePicker,
  PastEventStatus,
  FeedBack,
  Alert
} from "../../../components";
import * as formUtilities from "../../../utilities/FormUtilities";
import auth from "../../../components/Auth";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import * as serviceProviders from "../../../api/Axios";
import moment from "moment";
import * as genericConstants from "../../../constants/GenericConstants";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddEditFeedBack from "../../Feedback/AddFeedback/AddFeedback";
import LoaderContext from "../../../context/LoaderContext";
import { useContext } from "react";
import NoFeedback from "../../Feedback/NoFeedback/NoFeedback";
import CloseIcon from "@material-ui/icons/Close";

const EVENT_FILTER = "title_contains";
const START_DATE_FILTER = "start_date_time_gte";
const END_DATE_FILTER = "end_date_time_lt";
const STATUS_FILTER = "hasAttended";
const SORT_FIELD_KEY = "_sort";

const ViewPastEvent = props => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const { setLoaderStatus } = useContext(LoaderContext);
  const [statusFilter, setStatusFilter] = useState([]);
  const [formState, setFormState] = useState({
    PastEvent: [],
    /** Pagination and sorting data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    messageToShow: "",
    sortAscending: true,
    /**Filter */
    filterDataParameters: {},
    startDate: null,
    endDate: null,
    errors: {},
    showModalFeedback: false,
    showErrorModalFeedback: false,
    EventTitle: null,
    eventId: null,
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

  useEffect(() => {
    getStatusFilterData();

    getPastEvent(10, 1);
  }, []);

  const getStatusFilterData = () => {
    setStatusFilter(genericConstants.EVENT_STATUS);
  };

  const getPastEvent = async (pageSize, page, paramsForEvents = null) => {
    if (
      paramsForEvents !== null &&
      !formUtilities.checkEmpty(paramsForEvents)
    ) {
      let defaultParams = {};
      if (paramsForEvents.hasOwnProperty(SORT_FIELD_KEY)) {
        defaultParams = {
          page: page,
          pageSize: pageSize,
          isRegistered: true
        };
      } else {
        defaultParams = {
          page: page,
          pageSize: pageSize,
          isRegistered: true,
          [SORT_FIELD_KEY]: "start_date_time:desc"
        };
      }
      Object.keys(paramsForEvents).map(key => {
        defaultParams[key] = paramsForEvents[key];
      });
      paramsForEvents = defaultParams;
    } else {
      paramsForEvents = {
        page: page,
        pageSize: pageSize,
        isRegistered: true,
        _sort: "start_date_time:desc"
      };
    }

    const studentInfo =
      auth.getUserInfo() !== null &&
      auth.getUserInfo().role.name === roleConstants.STUDENT
        ? auth.getUserInfo().studentInfo.contact.id
        : auth.getStudentIdFromCollegeAdmin();

    const PASTEVENT_URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_INDIVIDUAL_URL +
      "/" +
      studentInfo +
      "/" +
      strapiConstants.STRAPI_PAST_EVENTS;

    if (
      (auth.getUserInfo() !== null &&
        auth.getUserInfo().role !== null &&
        auth.getUserInfo().role.name !== null &&
        auth.getUserInfo().role.name === roleConstants.STUDENT) ||
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
    ) {
      setFormState(formState => ({
        ...formState,
        isDataLoading: true
      }));

      serviceProviders
        .serviceProviderForGetRequest(PASTEVENT_URL, paramsForEvents)
        .then(res => {
          let currentPage = res.data.page;
          let totalRows = res.data.rowCount;
          let currentPageSize = res.data.pageSize;
          let pageCount = res.data.pageCount;

          if (res.data.result.length) {
            let tempPastEventData = [];
            let pastEventData = res.data.result;
            tempPastEventData = convertPastEventData(pastEventData);

            setFormState(formState => ({
              ...formState,
              PastEvent: tempPastEventData,
              pageSize: currentPageSize,
              totalRows: totalRows,
              page: currentPage,
              pageCount: pageCount,
              isDataLoading: false
            }));
          } else {
            setFormState(formState => ({
              ...formState,
              PastEvent: res.data.length
            }));
          }
        })
        .catch(error => {
          console.log("Error_event", error);
        });
    }
  };

  const convertPastEventData = data => {
    let pastEventDataArray = [];
    if (data) {
      for (let i in data) {
        var tempIndividualPastEventData = {};
        tempIndividualPastEventData["id"] = data[i]["id"];
        let startDate = new Date(data[i]["start_date_time"]);
        let endDate = new Date(data[i]["end_date_time"]);

        tempIndividualPastEventData["eventName"] = data[i]["title"];
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

  /** Handle Start Date filter change */
  const handleStartDateChange = (START_DATE_FILTER, event) => {
    let startDate = moment(event).format("YYYY-MM-DDT00:00:00.000Z");
    if (startDate === "Invalid date") {
      startDate = null;
      delete formState.filterDataParameters[START_DATE_FILTER];
    } else {
      formState.filterDataParameters[START_DATE_FILTER] = new Date(
        startDate
      ).toISOString();
      if (
        formState.filterDataParameters.hasOwnProperty(END_DATE_FILTER) &&
        formState.filterDataParameters[START_DATE_FILTER] >
          formState.filterDataParameters[END_DATE_FILTER]
      ) {
        formState.errors["dateFrom"] = [
          "Start date cannot be greater than end date"
        ];
      } else {
        delete formState.errors["dateTo"];
        delete formState.errors["dateFrom"];
      }
    }

    setFormState(formState => ({
      ...formState,
      startDate: event
    }));
  };

  /** Handle End Date filter change */
  const handleEndDateChange = (END_DATE_FILTER, event) => {
    let endDate = moment(event)
      .add(1, "days")
      .format("YYYY-MM-DDT00:00:00.000Z");
    if (endDate === "Invalid date") {
      endDate = null;
      delete formState.filterDataParameters[END_DATE_FILTER];
    } else {
      formState.filterDataParameters[END_DATE_FILTER] = new Date(
        endDate
      ).toISOString();
      if (
        formState.filterDataParameters.hasOwnProperty(START_DATE_FILTER) &&
        formState.filterDataParameters[END_DATE_FILTER] <
          formState.filterDataParameters[START_DATE_FILTER]
      ) {
        formState.errors["dateTo"] = [
          "End date cannot be less than start date"
        ];
      } else {
        delete formState.errors["dateFrom"];
        delete formState.errors["dateTo"];
      }
    }

    setFormState(formState => ({
      ...formState,
      endDate: event
    }));
  };

  const checkEmpty = obj => {
    return !Object.keys(obj).length ? true : false;
  };

  const hasError = field => (formState.errors[field] ? true : false);

  const handleFilterChangeForEventField = event => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [EVENT_FILTER]: event.target.value
      }
    }));
    event.persist();
  };

  /** Pagination */
  const handlePerRowsChange = async (perPage, page) => {
    /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getPastEvent(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getPastEvent(perPage, page, formState.filterDataParameters);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getPastEvent(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getPastEvent(
          formState.pageSize,
          page,
          formState.filterDataParameters
        );
      }
    }
  };

  const handleChangeAutoCompleteStatus = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      setFormState(formState => ({
        ...formState,
        isClearResetFilter: false
      }));
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
      setFormState(formState => ({
        ...formState,
        isClearResetFilter: false
      }));
    }
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getPastEvent(perPage, page, formState.filterDataParameters);
    } else {
      await getPastEvent(perPage, page);
    }
  };

  const handleSort = (
    column,
    sortDirection,
    perPage = formState.pageSize,
    page = 1
  ) => {
    formState.filterDataParameters[SORT_FIELD_KEY] =
      column.selector + ":" + sortDirection;
    getPastEvent(perPage, page, formState.filterDataParameters);
  };

  /** Filter methods and functions */
  /** This restores all the data when we clear the filters*/

  const clearFilter = () => {
    setFormState(formState => ({
      ...formState,
      isFilterSearch: false,
      /** Clear all filters */
      filterDataParameters: {},
      /** Turns on the spinner */
      isDataLoading: true,
      startDate: null,
      endDate: null,
      errors: {}
    }));
    setStatusFilter([]);
    restoreData();
  };

  /** Used for restoring data */
  const restoreData = () => {
    getPastEvent(formState.pageSize, 1);
    getStatusFilterData();
  };

  /** Give feedback */
  const giveFeedback = async event => {
    setLoaderStatus(true);
    const QUESTION_SET_URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_EVENTS +
      "/" +
      event.id +
      "/" +
      strapiConstants.STRAPI_QUESTION_SET;
    await serviceProviders
      .serviceProviderForGetRequest(QUESTION_SET_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          showModalFeedback: true,
          EventTitle: event.eventName,
          eventId: event.id,
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
          EventTitle: event.eventName,
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
  const editFeedback = async event => {
    setLoaderStatus(true);
    const FEEDBACK_SET_URL =
      strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_FEEDBACK_SETS;
    await serviceProviders
      .serviceProviderForGetOneRequest(FEEDBACK_SET_URL, event.feedbackId)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          showModalFeedback: true,
          EventTitle: event.eventName,
          eventId: event.id,
          isGiveFeedback: false,
          isEditFeedback: true,
          showErrorModalFeedback: false,
          feedbackSetId: event.feedbackId,
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
          EventTitle: event.eventName,
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

  /** Columns to show in table */
  const column = [
    {
      name: "Name",
      sortable: true,
      selector: "title",
      cell: row => (
        <Tooltip
          title={
            <React.Fragment>
              <Typography color="inherit">{`${row.eventName}`}</Typography>
            </React.Fragment>
          }
          placement="top"
        >
          <div>{`${row.eventName}`}</div>
        </Tooltip>
      )
    },
    { name: "Start Date", sortable: true, selector: "start_date_time" },
    { name: "End Date", sortable: true, selector: "end_date_time" },
    {
      name: "Status",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <PastEventStatus style={cell.hasAttended} />
          </div>
          {cell.giveFeedback ? (
            <div className={classes.PaddingActionButton}>
              <FeedBack
                isGiveFeedback={true}
                isEditFeedback={false}
                cannotGiveFeedback={false}
                id={cell.id}
                value={cell.eventName}
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
                value={cell.eventName}
                onClick={() => editFeedback(cell)}
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
                value={cell.eventName}
                onClick={() => {}}
              />
            </div>
          ) : null}
        </div>
      )
    }
  ];

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
        EventTitle: null,
        eventId: null,
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
          EventTitle: null,
          eventId: null,
          isGiveFeedback: false,
          isEditFeedback: false,
          fromFeedBackModal: true,
          feedBackGiven: true,
          successErrorMessage: message
        }));
        getPastEvent(
          formState.pageSize,
          formState.page,
          formState.filterDataParameters
        );
      } else {
        setFormState(formState => ({
          ...formState,
          showModalFeedback: false,
          showErrorModalFeedback: false,
          EventTitle: null,
          eventId: null,
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

  return (
    <Grid>
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
        <Card>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <TextField
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={formState.filterDataParameters[EVENT_FILTER] || ""}
                  placeholder="Name"
                  className={classes.autoCompleteField}
                  onChange={handleFilterChangeForEventField}
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <InlineDatePicker
                  id="startDate"
                  label="Start Date"
                  placeholder="Start Date"
                  value={formState.startDate}
                  name={START_DATE_FILTER}
                  onChange={event =>
                    handleStartDateChange(START_DATE_FILTER, event)
                  }
                  error={hasError("dateFrom")}
                  helperText={
                    hasError("dateFrom")
                      ? formState.errors["dateFrom"].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <InlineDatePicker
                  id="endDate"
                  label="End Date"
                  placeholder="End Date"
                  value={formState.endDate}
                  name={END_DATE_FILTER}
                  onChange={event =>
                    handleEndDateChange(END_DATE_FILTER, event)
                  }
                  error={hasError("dateTo")}
                  helperText={
                    hasError("dateTo")
                      ? formState.errors["dateTo"].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <Autocomplete
                  id="status-filter"
                  name={"Status-filter"}
                  options={statusFilter}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  value={
                    formState.isClearResetFilter
                      ? null
                      : statusFilter[
                          statusFilter.findIndex(function (item, i) {
                            return (
                              item.id ===
                              formState.filterDataParameters[STATUS_FILTER]
                            );
                          })
                        ] || null
                  }
                  onChange={(event, value) =>
                    handleChangeAutoCompleteStatus(STATUS_FILTER, event, value)
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Status"
                      placeholder="Status"
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
                  disabled={checkEmpty(formState.errors) ? false : true}
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
        <Card className={classes.tabledata} variant="outlined">
          {formState.PastEvent ? (
            formState.PastEvent.length ? (
              <Table
                data={formState.PastEvent}
                column={column}
                defaultSortField="start_date_time"
                onSort={handleSort}
                sortServer={true}
                defaultSortAsc={false}
                progressPending={formState.isDataLoading}
                paginationTotalRows={formState.totalRows}
                paginationDefaultPage={formState.page}
                paginationPerPage={formState.pageSize}
                paginationRowsPerPageOptions={[10, 20, 50]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
              />
            ) : (
              <Spinner />
            )
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
              Title={formState.EventTitle}
              id={formState.eventId}
              entityQuestionSet={formState.entityQuestionSet}
              questionSetId={formState.questionSetId}
              fromEvent={true}
              fromActivity={false}
            />
          ) : formState.isEditFeedback ? (
            <AddEditFeedBack
              isEditFeedback={true}
              showModal={formState.showModalFeedback}
              modalClose={handleCloseFeedBackModal}
              Title={formState.EventTitle}
              id={formState.eventId}
              entityQuestionSet={formState.entityQuestionSet}
              questionSetId={formState.questionSetId}
              feedbackSetId={formState.feedbackSetId}
              fromEvent={true}
              fromActivity={false}
            />
          ) : null}
          {!formState.isGiveFeedback &&
          !formState.isEditFeedback &&
          !formState.showModalFeedback &&
          formState.showErrorModalFeedback ? (
            <NoFeedback
              showModal={formState.showErrorModalFeedback}
              modalClose={handleCloseModal}
              Title={formState.EventTitle}
              errorMessage={formState.errorMessage}
            />
          ) : null}
          {/* Action button component */}
        </Card>
      </Grid>
    </Grid>
  );
};
export default ViewPastEvent;
