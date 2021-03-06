import React, { useState, useEffect, useCallback, useContext } from "react";
import moment from "moment";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Collapse,
  IconButton,
  Typography
} from "@material-ui/core";
import {
  Table,
  Spinner,
  Alert,
  FeedBack,
  ToolTipComponent
} from "../../../components";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import {
  GrayButton,
  YellowButton,
  InlineDatePicker
} from "../../../components";
import * as formUtilities from "../../../utilities/FormUtilities";
import * as serviceProviders from "../../../api/Axios";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import auth from "../../../components/Auth";
import LoaderContext from "../../../context/LoaderContext";
import ViewFeedBack from "../../Feedback/ViewFeedback/ViewFeedback";
import NoFeedback from "../../Feedback/NoFeedback/NoFeedback";
import AddEditFeedBack from "../../Feedback/AddFeedback/AddFeedback";

const ACTIVITY_FILTER = "title_contains";
const ACTIVITY_COLLEGE_FILTER = "contact.name_contains";
const START_DATE_FILTER = "start_date_time_gte";
const END_DATE_FILTER = "end_date_time_lt";
const SORT_FIELD_KEY = "_sort";

const ActivityFeedback = props => {
  const [open, setOpen] = React.useState(true);
  const history = useHistory();
  const classes = useStyles();
  const [setSelectedRows] = useState([]);
  const { setLoaderStatus } = useContext(LoaderContext);

  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    activities: [],
    greenButtonChecker: true,
    /** Filters */
    eventFilterData: [],
    selectedRowFilter: true,
    filterDataParameters: {},
    isClearResetFilter: false,
    isFilterSearch: false,
    startDate: null,
    endDate: null,
    texttvalue: "",
    toggleCleared: false,
    isEventCleared: "",
    /** Pagination and sortinig data */
    resetPagination: false,
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true,
    errors: {}
  });

  /** Special feedbackState state variable to set parameters for feedback  */
  const [feedbackState, setFeedbackState] = useState({
    /** Feedback */
    /**  showModalFeedback is used to enable the popup of modal for view/add/edit feedback.*/
    showModalFeedback: false,
    ActivityTitle: null,
    activityId: null,
    /** feedBackGiven , fromFeedBackModal this two flags are used to set the success and error messages*/
    feedBackGiven: false,
    fromFeedBackModal: false,
    successErrorMessage: "",

    /** showErrorModalFeedback this flag sets the error feedback modal ehich is used to dispaly the popup for error */
    showErrorModalFeedback: false,
    /** errorMessage is used to display what error needs to be shown for popup */
    errorHeading: "",
    errorMessage: "",

    ratings: [],
    /** showAddEditModalFeedback this flags enables the add/edit feedback modal. */
    showAddEditModalFeedback: false,
    /** Below three flags are used to identify whether to give, edit or to view feedback. */
    isGiveFeedback: false,
    isEditFeedback: false,
    isViewFeedback: false,

    /** This has the question set for adding feedback and also for editing feedback with answers also (for editing) */
    entityQuestionSet: [],
    /** questionSetId is while adding/editng */
    questionSetId: null,
    /** feedbackSetId is used while editing to identify where to store data against which feedback. */
    feedbackSetId: null,
    dataFor: "",
    result: {}
  });

  useEffect(() => {
    if (auth.getUserInfo() !== null) {
      getActivityData(10, 1);
    } else {
      auth.clearAppStorage();
      history.push({
        pathname: routeConstants.SIGN_IN_URL
      });
    }
  }, []);

  const getActivityData = async (
    pageSize,
    page,
    paramsForActivities = null
  ) => {
    if (
      paramsForActivities !== null &&
      !formUtilities.checkEmpty(paramsForActivities)
    ) {
      let defaultParams = {};
      if (paramsForActivities.hasOwnProperty(SORT_FIELD_KEY)) {
        defaultParams = {
          page: page,
          pageSize: pageSize
        };
      } else {
        defaultParams = {
          page: page,
          pageSize: pageSize,
          [SORT_FIELD_KEY]: "title:asc"
        };
      }
      Object.keys(paramsForActivities).map(key => {
        defaultParams[key] = paramsForActivities[key];
      });
      paramsForActivities = defaultParams;
    } else {
      paramsForActivities = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "title:asc"
      };
    }
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));
    if (auth.getUserInfo().role !== null) {
      if (
        auth.getUserInfo().role.name === roleConstants.RPCADMIN ||
        (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
          auth.getUserInfo().studentInfo.organization.contact.id ===
            auth.getUserInfo().rpc.main_college)
      ) {
        const ACTIVITIES_FOR_RPC_ADMIN =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_CONTACTS +
          "/" +
          auth.getUserInfo().rpc.id +
          "/get-activites/for/rpc";
        await serviceProviders
          .serviceProviderForGetRequest(
            ACTIVITIES_FOR_RPC_ADMIN,
            paramsForActivities
          )
          .then(res => {
            formState.dataToShow = [];
            formState.tempData = [];
            let eventData = [];
            eventData = convertEventData(res.data.result);
            setFormState(formState => ({
              ...formState,
              activities: res.data.result,
              pageSize: res.data.pageSize,
              totalRows: res.data.rowCount,
              page: res.data.page,
              pageCount: res.data.pageCount,
              dataToShow: eventData,
              tempData: eventData,
              isDataLoading: false
            }));
          })
          .catch(error => {
            console.log("error", error);
          });
      } else if (auth.getUserInfo().role.name === roleConstants.ZONALADMIN) {
        const EVENTS_FOR_ZONAL_ADMIN =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_CONTACTS +
          "/" +
          auth.getUserInfo().zone.id +
          "/get-activites/for/zone";
        await serviceProviders
          .serviceProviderForGetRequest(
            EVENTS_FOR_ZONAL_ADMIN,
            paramsForActivities
          )
          .then(res => {
            formState.dataToShow = [];
            formState.tempData = [];
            let eventData = [];
            eventData = convertEventData(res.data.result);
            setFormState(formState => ({
              ...formState,
              activities: res.data.result,
              pageSize: res.data.pageSize,
              totalRows: res.data.rowCount,
              page: res.data.page,
              pageCount: res.data.pageCount,
              dataToShow: eventData,
              tempData: eventData,
              isDataLoading: false
            }));
          })
          .catch(error => {
            console.log("error", error);
          });
      }
    } else {
      auth.clearAppStorage();
      history.push({
        pathname: routeConstants.SIGN_IN_URL
      });
    }
  };

  const convertEventData = data => {
    let x = [];
    if (data.length > 0) {
      for (let i in data) {
        var eventIndividualData = {};
        let startDate = new Date(data[i]["start_date_time"]);
        let endDate = new Date(data[i]["end_date_time"]);
        eventIndividualData["id"] = data[i]["id"];

        eventIndividualData["title"] = data[i]["title"] ? data[i]["title"] : "";
        eventIndividualData["collegeName"] =
          data[i]["contact"]["organization"]["name"];
        eventIndividualData["activityType"] = data[i]["activitytype"]["name"];

        eventIndividualData["start_date_time"] = startDate.toDateString();
        eventIndividualData["end_date_time"] = endDate.toDateString();

        /**  */
        eventIndividualData["question_set"] = data[i]["question_set"]
          ? true
          : false;
        eventIndividualData["giveFeedback"] = false;
        eventIndividualData["editFeedback"] = false;
        eventIndividualData["cannotGiveFeedback"] = false;
        eventIndividualData["feedbackId"] = data[i]["feedbackSetId"];

        if (
          auth.getUserInfo().role.name === roleConstants.RPCADMIN ||
          (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
            auth.getUserInfo().studentInfo.organization.contact.id ===
              auth.getUserInfo().rpc.main_college)
        ) {
          /** Can college admin view feedback */
          eventIndividualData["isFeedbackFromCollegePresent"] =
            data[i]["isFeedbackFromCollegePresent"];

          if (data[i]["question_set"] && !data[i]["isFeedbackProvidedbyRPC"]) {
            eventIndividualData["giveFeedback"] = true;
          } else if (
            data[i]["question_set"] &&
            data[i]["isFeedbackProvidedbyRPC"]
          ) {
            eventIndividualData["editFeedback"] = true;
          } else if (!data[i]["question_set"]) {
            eventIndividualData["cannotGiveFeedback"] = true;
          } else {
            eventIndividualData["cannotGiveFeedback"] = true;
          }
        } else {
          if (data[i]["question_set"] && !data[i]["isFeedbackProvidedbyZone"]) {
            eventIndividualData["giveFeedback"] = true;
          } else if (
            data[i]["question_set"] &&
            data[i]["isFeedbackProvidedbyZone"]
          ) {
            eventIndividualData["editFeedback"] = true;
          } else if (!data[i]["question_set"]) {
            eventIndividualData["cannotGiveFeedback"] = true;
          } else {
            eventIndividualData["cannotGiveFeedback"] = true;
          }
        }

        x.push(eventIndividualData);
      }
      return x;
    }
  };

  /** Pagination */
  const handlePerRowsChange = async (perPage, page) => {
    /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getActivityData(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getActivityData(perPage, page, formState.filterDataParameters);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getActivityData(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getActivityData(
          formState.pageSize,
          page,
          formState.filterDataParameters
        );
      }
    }
  };

  const handleRowSelected = useCallback(state => {
    if (state.selectedCount >= 1) {
      setFormState(formState => ({
        ...formState,
        selectedRowFilter: false,
        toggleCleared: false
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        selectedRowFilter: true
      }));
    }
    setSelectedRows(state.selectedRows);
  }, []);

  const selectedRowCleared = data => {
    formState.toggleCleared = data;
    setTimeout(() => {
      setFormState(formState => ({
        ...formState,
        toggleCleared: false
      }));
    }, 2000);
  };

  /** For Adding feedback */
  const viewFeedback = async cell => {
    setLoaderStatus(true);

    let result = {};
    if (
      auth.getUserInfo().role.name === roleConstants.RPCADMIN ||
      (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
        auth.getUserInfo().studentInfo.organization.contact.id ===
          auth.getUserInfo().rpc.main_college)
    ) {
      result = {
        [roleConstants.COLLEGEADMIN]: null
      };
    }

    const QUESTION_SET_URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY +
      "/" +
      cell.id +
      "/" +
      strapiConstants.STRAPI_RPC +
      "/" +
      auth.getUserInfo().rpc.id +
      "/getRpcFeedback/rating";

    await serviceProviders
      .serviceProviderForGetRequest(QUESTION_SET_URL)
      .then(res => {
        result[roleConstants.COLLEGEADMIN] = res.data.result;
        setLoaderStatus(false);
      })
      .catch(error => {
        result[roleConstants.COLLEGEADMIN] = [];
        setLoaderStatus(false);
      });

    setFeedbackState(feedbackState => ({
      ...feedbackState,
      isViewFeedback: true,
      isEditFeedback: false,
      isGiveFeedback: false,
      showModalFeedback: true,
      ActivityTitle: cell.title,
      activityId: cell.id,
      feedBackGiven: false,
      fromFeedBackModal: false,
      successErrorMessage: "",
      result: result,
      showErrorModalFeedback: false
    }));
  };

  /** For Viewing feedback for Zonal Admin feedback */
  const viewZoneFeedback = async cell => {
    setLoaderStatus(true);
    const COLLEGE_FEEDBACK =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY +
      "/" +
      cell.id +
      "/getFeedbackForZone/" +
      auth.getUserInfo().zone.id +
      "/DataFor/college/FeedbackType/rating";

    const ZONE_FEEDBACK =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY +
      "/" +
      cell.id +
      "/getFeedbackForZone/" +
      auth.getUserInfo().zone.id +
      "/DataFor/rpc/FeedbackType/rating";

    let result = {};
    if (auth.getUserInfo().role.name === roleConstants.ZONALADMIN) {
      result = {
        [roleConstants.RPCADMIN]: null,
        [roleConstants.COLLEGEADMIN]: null
      };
    }

    await serviceProviders
      .serviceProviderForGetRequest(COLLEGE_FEEDBACK)
      .then(res => {
        result[roleConstants.COLLEGEADMIN] = res.data.result;
      })
      .catch(error => {
        result[roleConstants.COLLEGEADMIN] = [];
      });

    await serviceProviders
      .serviceProviderForGetRequest(ZONE_FEEDBACK)
      .then(res => {
        setLoaderStatus(false);
        result[roleConstants.RPCADMIN] = res.data.result;
      })
      .catch(error => {
        setLoaderStatus(false);
        result[roleConstants.RPCADMIN] = [];
      });

    setFeedbackState(feedbackState => ({
      ...feedbackState,
      isViewFeedback: true,
      isEditFeedback: false,
      isGiveFeedback: false,
      showModalFeedback: true,
      ActivityTitle: cell.title,
      activityId: cell.id,
      feedBackGiven: false,
      fromFeedBackModal: false,
      successErrorMessage: "",
      result: result,
      showErrorModalFeedback: false,
      dataFor: "college"
    }));
  };

  /** Give feedback */
  const giveFeedback = async event => {
    setLoaderStatus(true);
    const QUESTION_SET_URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY +
      "/" +
      event.id +
      "/" +
      strapiConstants.STRAPI_QUESTION_SET;
    await serviceProviders
      .serviceProviderForGetRequest(QUESTION_SET_URL)
      .then(res => {
        setFeedbackState(feedbackState => ({
          ...feedbackState,
          showModalFeedback: true,
          ActivityTitle: event.title,
          activityId: event.id,
          isGiveFeedback: true,
          isEditFeedback: false,
          isViewFeedback: false,
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
        setFeedbackState(feedbackState => ({
          ...feedbackState,
          showModalFeedback: false,
          showErrorModalFeedback: true,
          ActivityTitle: event.title,
          isEditFeedback: false,
          isGiveFeedback: false,
          isViewFeedback: false,
          feedBackGiven: false,
          fromFeedBackModal: false,
          successErrorMessage: "",
          errorHeading: "Add Feedback",
          errorMessage: "Cannot add feedback"
        }));
        setLoaderStatus(false);
        console.log("error giving feedback");
      });
  };

  /** ------ */
  /** Edit feedback */
  const editFeedback = async event => {
    setLoaderStatus(true);
    let FEEDBACK_SET_URL = "";
    if (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) {
      FEEDBACK_SET_URL =
        strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_FEEDBACK_SETS +
        "/role/" +
        auth.getUserInfo().rpcAdminRole.id;
    } else {
      FEEDBACK_SET_URL =
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_FEEDBACK_SETS;
    }

    await serviceProviders
      .serviceProviderForGetOneRequest(FEEDBACK_SET_URL, event.feedbackId)
      .then(res => {
        setFeedbackState(feedbackState => ({
          ...feedbackState,
          ActivityTitle: event.eventName,
          activityId: event.id,
          isGiveFeedback: false,
          isEditFeedback: true,
          isViewFeedback: false,
          showModalFeedback: true,
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
        setFeedbackState(feedbackState => ({
          ...feedbackState,
          showModalFeedback: false,
          showErrorModalFeedback: true,
          ActivityTitle: event.eventName,
          isGiveFeedback: false,
          isEditFeedback: false,
          isViewFeedback: false,
          feedBackGiven: false,
          fromFeedBackModal: false,
          successErrorMessage: "",
          errorHeading: "Edit Feedback",
          errorMessage: "Cannot edit feedback"
        }));
        setLoaderStatus(false);
        console.log("error giving feedback");
      });
  };

  /** ---------------------------------------------------- */

  /** Used for restoring data */
  const restoreData = () => {
    getActivityData(formState.pageSize, 1);
  };

  /** Filter methods and functions */
  /** This restores all the data when we clear the filters*/

  const clearFilter = () => {
    selectedRowCleared(true);

    setFormState(formState => ({
      ...formState,
      isFilterSearch: false,
      /** Clear all filters */
      filterDataParameters: {},
      /** Turns on the spinner */
      isClearResetFilter: true,
      isDataLoading: true,
      texttvalue: "",
      startDate: null,
      endDate: null,
      eventFilterData: [],
      errors: {}
    }));
    restoreData();
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

  const handleFilterChangeForActivityField = (event, entity) => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [entity]: event.target.value
      }
    }));
    event.persist();
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getActivityData(perPage, page, formState.filterDataParameters);
    } else {
      await getActivityData(perPage, page);
    }
  };

  const handleSort = (
    column,
    sortDirection,
    perPage = formState.pageSize,
    page = 1
  ) => {
    if (column.selector === "title") {
      column.selector = "title";
    } else if (column.selector === "collegeName") {
      column.selector = "contact.organization.name";
    } else if (column.selector === "activityType") {
      column.selector = "activitytype.name";
    } else if (column.selector === "start_date_time") {
      column.selector = "start_date_time";
    } else if (column.selector === "end_date_time") {
      column.selector = "end_date_time";
    }

    formState.filterDataParameters[SORT_FIELD_KEY] =
      column.selector + ":" + sortDirection;
    getActivityData(perPage, page, formState.filterDataParameters);
  };

  const hasError = field => (formState.errors[field] ? true : false);

  /**Handle Closed model */
  const handleCloseFeedBackModal = (
    status,
    message,
    isModalClosedWithoutGivingFeedbach
  ) => {
    if (isModalClosedWithoutGivingFeedbach) {
      setFeedbackState(feedbackState => ({
        ...feedbackState,
        showAddEditModalFeedback: false,
        isGiveFeedback: false,
        isEditFeedback: false,
        isViewFeedback: false,
        showModalFeedback: false,
        ActivityTitle: null,
        activityId: null,
        feedBackGiven: false,
        fromFeedBackModal: false,
        successErrorMessage: ""
      }));
    } else {
      if (status) {
        setOpen(true);
        setFeedbackState(feedbackState => ({
          ...feedbackState,
          showAddEditModalFeedback: false,
          isGiveFeedback: false,
          isEditFeedback: false,
          isViewFeedback: false,
          showModalFeedback: false,
          ActivityTitle: null,
          activityId: null,
          feedBackGiven: true,
          fromFeedBackModal: true,
          successErrorMessage: message
        }));
        getActivityData(
          formState.pageSize,
          formState.page,
          formState.filterDataParameters
        );
      } else {
        setFeedbackState(feedbackState => ({
          ...feedbackState,
          showAddEditModalFeedback: false,
          isGiveFeedback: false,
          isEditFeedback: false,
          isViewFeedback: false,
          showModalFeedback: false,
          ActivityTitle: null,
          activityId: null,
          feedBackGiven: false,
          fromFeedBackModal: true,
          successErrorMessage: message
        }));
      }
    }
  };

  const handleCloseModal = () => {
    setFeedbackState(feedbackState => ({
      ...feedbackState,
      showModalFeedback: false,
      showErrorModalFeedback: false,
      showAddEditModalFeedback: false,
      isGiveFeedback: false,
      isEditFeedback: false,
      isViewFeedback: false,
      feedBackGiven: false,
      fromFeedBackModal: false,
      dataFor: ""
    }));
  };

  /** Table Data */
  const column = [
    {
      name: "Activity/Training Name",
      sortable: true,
      selector: "title",
      cell: row => <ToolTipComponent data={row.title} />
    },
    {
      name: "College Name",
      sortable: true,
      selector: "collegeName",
      cell: row => <ToolTipComponent data={row.collegeName} />
    },
    {
      name: "Activity Type",
      sortable: true,
      selector: "activityType",
      cell: row => <ToolTipComponent data={row.activityType} />
    },
    {
      name: "Start Date",
      sortable: true,
      selector: "start_date_time",
      cell: row => <ToolTipComponent data={row.start_date_time} />
    },
    {
      name: "End Date",
      sortable: true,
      selector: "end_date_time",
      cell: row => <ToolTipComponent data={row.end_date_time} />
    },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          {/** For RPC */}
          {auth.getUserInfo().role.name === roleConstants.RPCADMIN ||
          (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
            auth.getUserInfo().studentInfo.organization.contact.id ===
              auth.getUserInfo().rpc.main_college) ? (
            cell.isFeedbackFromCollegePresent ? (
              <div className={classes.PaddingActionButton}>
                <FeedBack
                  message={"View college feedback"}
                  id={cell.id}
                  isViewFeedback={true}
                  value={cell.title}
                  onClick={() => viewFeedback(cell)}
                />
              </div>
            ) : !cell.question_set ? (
              <div className={classes.PaddingActionButton}>
                <FeedBack
                  feedbackNotAvailable={true}
                  message={"No question set with this event"}
                  id={cell.id}
                  isViewFeedback={true}
                  value={cell.title}
                  onClick={() => {}}
                />
              </div>
            ) : (
              <div className={classes.PaddingActionButton}>
                <FeedBack
                  feedbackNotAvailable={true}
                  message={"No college feedback available"}
                  id={cell.id}
                  isViewFeedback={true}
                  value={cell.title}
                  onClick={() => {}}
                />
              </div>
            )
          ) : null}

          {/** For Zone */}
          {auth.getUserInfo().role.name === roleConstants.ZONALADMIN ? (
            <React.Fragment>
              <div className={classes.PaddingActionButton}>
                <FeedBack
                  message={"View feedback"}
                  id={cell.id}
                  isViewFeedback={true}
                  value={cell.title}
                  onClick={() => viewZoneFeedback(cell)}
                />
              </div>
            </React.Fragment>
          ) : null}

          {auth.getUserInfo().role.name === roleConstants.RPCADMIN ||
          auth.getUserInfo().role.name === roleConstants.ZONALADMIN ||
          (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
            auth.getUserInfo().studentInfo.organization.contact.id ===
              auth.getUserInfo().rpc.main_college) ? (
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
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Activity Feedback
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        {feedbackState.fromFeedBackModal && feedbackState.feedBackGiven ? (
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
              {feedbackState.successErrorMessage}
            </Alert>
          </Collapse>
        ) : null}

        {feedbackState.fromFeedBackModal && !feedbackState.feedBackGiven ? (
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
              {feedbackState.successErrorMessage}
            </Alert>
          </Collapse>
        ) : null}

        <Card>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <TextField
                  label="Activity/Training Name"
                  margin="normal"
                  variant="outlined"
                  value={formState.filterDataParameters[ACTIVITY_FILTER] || ""}
                  placeholder="Activity/Training Name"
                  className={classes.autoCompleteField}
                  onChange={event => {
                    handleFilterChangeForActivityField(event, ACTIVITY_FILTER);
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="College Name"
                  margin="normal"
                  variant="outlined"
                  value={
                    formState.filterDataParameters[ACTIVITY_COLLEGE_FILTER] ||
                    ""
                  }
                  placeholder="College Name"
                  className={classes.autoCompleteField}
                  onChange={event => {
                    handleFilterChangeForActivityField(
                      event,
                      ACTIVITY_COLLEGE_FILTER
                    );
                  }}
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
                  Search
                </YellowButton>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <GrayButton
                  variant="contained"
                  color="primary"
                  onClick={clearFilter}
                  disableElevation
                >
                  Reset
                </GrayButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card className={classes.tabledata} variant="outlined">
          {formState.dataToShow ? (
            formState.dataToShow.length ? (
              <Table
                data={formState.dataToShow}
                column={column}
                defaultSortField="title"
                defaultSortAsc={formState.sortAscending}
                paginationResetDefaultPage={formState.resetPagination}
                onSelectedRowsChange={handleRowSelected}
                onSort={handleSort}
                sortServer={true}
                paginationDefaultPage={formState.page}
                paginationPerPage={formState.pageSize}
                progressPending={formState.isDataLoading}
                paginationTotalRows={formState.totalRows}
                paginationRowsPerPageOptions={[10, 20, 50]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                clearSelectedRows={formState.toggleCleared}
              />
            ) : (
              <Spinner />
            )
          ) : (
            <div className={classes.noDataMargin}>No data to show</div>
          )}
          {/** Feedback modal calling */}
          {feedbackState.isViewFeedback ? (
            <ViewFeedBack
              showModal={feedbackState.showModalFeedback}
              modalClose={handleCloseModal}
              Title={feedbackState.ActivityTitle}
              id={feedbackState.activityId}
              fromEvent={false}
              fromActivity={true}
              fromRPC={
                auth.getUserInfo().role.name === roleConstants.RPCADMIN ||
                (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
                  auth.getUserInfo().studentInfo.organization.contact.id ===
                    auth.getUserInfo().rpc.main_college)
                  ? true
                  : false
              }
              fromZone={
                auth.getUserInfo().role.name === roleConstants.ZONALADMIN
                  ? true
                  : false
              }
              result={feedbackState.result}
              dataFor={feedbackState.dataFor}
              dataToShow={feedbackState.ratings}
            />
          ) : null}
          {feedbackState.isGiveFeedback ? (
            <AddEditFeedBack
              isAddFeedback={true}
              showModal={feedbackState.showModalFeedback}
              modalClose={handleCloseFeedBackModal}
              Title={feedbackState.ActivityTitle}
              id={feedbackState.activityId}
              entityQuestionSet={feedbackState.entityQuestionSet}
              questionSetId={feedbackState.questionSetId}
              fromEvent={false}
              fromActivity={true}
              formMainCollege={
                auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
                auth.getUserInfo().studentInfo.organization.contact.id ===
                  auth.getUserInfo().rpc.main_college
                  ? true
                  : false
              }
            />
          ) : feedbackState.isEditFeedback ? (
            <AddEditFeedBack
              isEditFeedback={true}
              showModal={feedbackState.showModalFeedback}
              modalClose={handleCloseFeedBackModal}
              Title={feedbackState.ActivityTitle}
              id={feedbackState.activityId}
              entityQuestionSet={feedbackState.entityQuestionSet}
              questionSetId={feedbackState.questionSetId}
              feedbackSetId={feedbackState.feedbackSetId}
              fromEvent={false}
              fromActivity={true}
              formMainCollege={
                auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
                auth.getUserInfo().studentInfo.organization.contact.id ===
                  auth.getUserInfo().rpc.main_college
                  ? true
                  : false
              }
            />
          ) : null}
          {!feedbackState.isGiveFeedback &&
          !feedbackState.isEditFeedback &&
          !feedbackState.showModalFeedback &&
          feedbackState.showErrorModalFeedback ? (
            <NoFeedback
              showModal={feedbackState.showErrorModalFeedback}
              modalClose={handleCloseModal}
              Title={feedbackState.ActivityTitle}
              errorHeading={"View Feedback"}
              errorMessage={feedbackState.errorMessage}
            />
          ) : null}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ActivityFeedback;
