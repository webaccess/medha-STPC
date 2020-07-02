import React, { useState, useEffect, useContext } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Collapse,
  IconButton
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteActivity from "./DeleteActivity";
import styles from "./Activity.module.css";
import useStyles from "../ContainerStyles/ManagePageStyles.js";
import * as serviceProviders from "../../api/Axios";
import * as routeConstants from "../../constants/RouteConstants";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import * as genericConstants from "../../constants/GenericConstants";
import * as roleConstants from "../../constants/RoleConstants";
import * as formUtilities from "../../utilities/FormUtilities";
import {
  Table,
  GreenButton,
  YellowButton,
  GrayButton,
  Alert,
  Auth,
  ViewGridIcon,
  EditGridIcon,
  ViewStudentGridIcon,
  DeleteGridIcon,
  DownloadIcon,
  Spinner,
  FeedBack,
  InlineDatePicker,
  ToolTipComponent
} from "../../components";
// import DeleteActivity from "./DeleteActivity";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import moment from "moment";
import XLSX from "xlsx";
import LoaderContext from "../../context/LoaderContext";
import ViewFeedBack from "../../containers/Feedback/ViewFeedback/ViewFeedback";
import auth from "../../components/Auth";
import AddEditFeedBack from "../Feedback/AddFeedback/AddFeedback";
import NoFeedback from "../Feedback/NoFeedback/NoFeedback";

const ViewActivity = props => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  let history = useHistory();
  const [formState, setFormState] = useState({
    dataToShow: [],
    activities: [],
    activityFilter: [],
    errors: {},
    filterDataParameters: {},
    isClearResetFilter: false,
    isFilterSearch: false,
    startDate: null,
    endDate: null,
    /** This is when we return from edit page */
    isDataEdited: props["location"]["fromEditActivity"]
      ? props["location"]["isDataEdited"]
      : false,
    editedData: props["location"]["fromEditActivity"]
      ? props["location"]["editedData"]
      : {},
    fromEditActivity: props["location"]["fromEditActivity"]
      ? props["location"]["fromEditActivity"]
      : false,
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddActivity"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddActivity"]
      ? props["location"]["addedData"]
      : {},
    fromAddActivity: props["location"]["fromAddActivity"]
      ? props["location"]["fromAddActivity"]
      : false,
    /** This is for delete */
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showModalDelete: false,
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true,
    /** FeedBack */
    activityTitle: "",
    activityID: "",
    showViewFeedbackModal: false
  });
  const [activityType, setActivityType] = useState([]);
  const educationyearlist = [
    { name: "First", id: "First" },
    { name: "Second", id: "Second" },
    { name: "Third", id: "Third" }
  ];
  /** Special feedbackState state variable to set parameters for feedback  */
  const [feedbackState, setFeedbackState] = useState({
    /** Feedback */
    /**  showModalFeedback is used to enable the popup of modal for view/add/edit feedback.*/
    showModalFeedback: false,
    EventTitle: null,
    eventId: null,
    /** feedBackGiven , fromFeedBackModal this two flags are used to set the success and error messages*/
    feedBackGiven: false,
    fromFeedBackModal: false,
    successErrorMessage: "",

    /** showErrorModalFeedback this flag sets the error feedback modal ehich is used to dispaly the popup for error */
    showErrorModalFeedback: false,
    /** errorMessage is used to display what error needs to be shown for popup */
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
    result: {}
  });

  const { setLoaderStatus } = useContext(LoaderContext);

  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: ""
  });

  const ACTIVITY_FILTER = "title_contains";
  const ACTIVITY_TYPE_FILTER = "activitytype.id";
  const EDUCATION_YEAR_FILTER = "education_year";
  const START_DATE_FILTER = "start_date_time_gte";
  const user = Auth.getUserInfo() ? Auth.getUserInfo() : null;
  const role = user ? user.role : null;
  const roleName = role ? role.name : null;

  const url = () => {
    let url;
    if (roleName === roleConstants.MEDHAADMIN) {
      url = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY;
    }

    if (roleName === roleConstants.COLLEGEADMIN) {
      const college = user ? user.studentInfo : null;
      const collegeId = college ? college.organization.contact.id : null;

      url =
        strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_CONTACTS +
        `/${collegeId}/` +
        strapiConstants.STRAPI_COLLEGE_ACTIVITY;
    }
    return url;
  };

  useEffect(() => {
    const URL = url();
    serviceProviders
      .serviceProviderForGetRequest(URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          activityFilter: res.data.result
        }));
      })
      .catch(error => {
        console.log("error", error);
      });
    getActivityTypes();
    getActivityData(10, 1);
  }, []);

  const getActivityTypes = async () => {
    const activityTypeUrl =
      strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY_TYPE;
    await serviceProviders
      .serviceProviderForGetRequest(activityTypeUrl)
      .then(res => {
        setActivityType(res.data);
      })
      .catch(error => {
        console.log("error while getting activity type");
      });
  };

  /** This seperate function is used to get the Activity data*/
  const getActivityData = async (pageSize, page, params = null) => {
    const URL = url();
    if (params !== null && !formUtilities.checkEmpty(params)) {
      let defaultParams = {
        page: page,
        pageSize: pageSize
      };
      Object.keys(params).map(key => {
        defaultParams[key] = params[key];
      });
      params = defaultParams;
    } else {
      params = {
        page: page,
        pageSize: pageSize
      };
    }
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));
    await serviceProviders
      .serviceProviderForGetRequest(URL, params)
      .then(res => {
        formState.dataToShow = [];
        formState.dataToShow = [];
        formState.tempData = [];
        let activityData = [];
        activityData = convertactivityData(res.data.result);
        setFormState(formState => ({
          ...formState,
          activities: res.data.result,
          dataToShow: activityData,
          pageSize: res.data.pageSize,
          totalRows: res.data.rowCount,
          page: res.data.page,
          pageCount: res.data.pageCount,
          isDataLoading: false
        }));
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  const getStatus = (start_date, end_date) => {
    let current_date = new Date().toISOString();
    if (current_date >= start_date && current_date <= end_date) {
      return "Ongoing";
    } else if (current_date > end_date) {
      return "Completed";
    } else if (current_date < start_date) {
      return "Upcoming";
    }
  };

  const convertactivityData = data => {
    let x = [];
    if (data.length > 0) {
      for (let i in data) {
        var eventIndividualData = {};
        eventIndividualData["id"] = data[i]["id"];

        eventIndividualData["status"] = data[i]["activity_status"];
        // data[i]["cancelled"] === true
        //   ? "Cancelled"
        //   : getStatus(data[i]["start_date_time"], data[i]["end_date_time"]);
        eventIndividualData["title"] = data[i]["title"] ? data[i]["title"] : "";
        eventIndividualData["activityType"] = data[i].activitytype.name;
        eventIndividualData["streams"] = data[i].streams;
        eventIndividualData["educationYear"] = data[i]["education_year"]
          ? data[i]["education_year"]
          : "";
        eventIndividualData["collegeName"] = data[i].contact.name;

        eventIndividualData["start_date_time"] = data[i]["start_date_time"];

        /** Several feedback flags are taken form the response itself  */
        /** Can college admin view feedback */
        eventIndividualData["isFeedbackProvidedbyStudents"] =
          data[i]["isFeedbackProvidedbyStudents"];

        /** can a college admin add/edit/cannot give feedback */

        /**  */
        eventIndividualData["question_set"] = data[i]["question_set"]
          ? true
          : false;
        eventIndividualData["giveFeedback"] = false;
        eventIndividualData["editFeedback"] = false;
        eventIndividualData["cannotGiveFeedback"] = false;
        eventIndividualData["feedbackId"] = data[i]["feedbackSetId"];

        if (
          data[i]["question_set"] &&
          !data[i]["isFeedbackProvidedbyCollege"]
        ) {
          eventIndividualData["giveFeedback"] = true;
        } else if (
          data[i]["question_set"] &&
          data[i]["isFeedbackProvidedbyCollege"]
        ) {
          eventIndividualData["editFeedback"] = true;
        } else if (!data[i]["question_set"]) {
          eventIndividualData["cannotGiveFeedback"] = true;
        } else {
          eventIndividualData["cannotGiveFeedback"] = true;
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
        await getActivityData(perPage, page);
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
        await getActivityData(formState.pageSize, page);
      }
    }
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getActivityData(perPage, page, formState.filterDataParameters);
    }
  };

  const clearFilter = () => {
    setFormState(formState => ({
      ...formState,
      isFilterSearch: false,
      /** Clear all filters */
      filterDataParameters: {},
      /** Turns on the spinner */
      isDataLoading: true,
      isClearResetFilter: true,
      startDate: null
    }));
    /**Need to confirm this thing for resetting the data */
    restoreData();
  };

  const restoreData = () => {
    getActivityData(formState.pageSize, 1);
  };

  const handleStartDateChange = (START_DATE_FILTER, event) => {
    let startDate = moment(event).format("YYYY-MM-DDT00:00:00.000Z");
    if (startDate === "Invalid date") {
      startDate = null;
      formState.errors["dateFrom"] = ["Selected Date is Invalid"];
      delete formState.filterDataParameters[START_DATE_FILTER];
    } else {
      formState.filterDataParameters[START_DATE_FILTER] = new Date(
        startDate
      ).toISOString();
    }

    setFormState(formState => ({
      ...formState,
      startDate: event
    }));
  };

  const hasError = field => (formState.errors[field] ? true : false);

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      setFormState(formState => ({
        ...formState,
        isClearResetFilter: true
      }));
    } else {
      formState.filterDataParameters[filterName] = value["id"];
      setFormState(formState => ({
        ...formState,
        isClearResetFilter: false
      }));
    }
  };

  const editCell = data => {
    setLoaderStatus(true);
    getDataForEdit(data.id);
  };

  /** Edit -------------------------------------------------------*/
  const getDataForEdit = async id => {
    setLoaderStatus(true);
    let ACTIVITY_URL =
      strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY;
    await serviceProviders
      .serviceProviderForGetOneRequest(ACTIVITY_URL, id)
      .then(res => {
        setLoaderStatus(false);

        let editData = res.data.result;
        /** move to edit page */
        history.push({
          pathname: routeConstants.EDIT_ACTIVITY,
          editActivity: true,
          dataForEdit: editData
        });
      })
      .catch(error => {
        setLoaderStatus(false);

        console.log("error");
      });
  };

  const deleteCell = event => {
    setLoaderStatus(true);
    setFormState(formState => ({
      ...formState,
      dataToDelete: { id: event.target.id },
      showModalDelete: true
    }));
    setLoaderStatus(false);
  };

  const viewCell = data => {
    history.push({
      pathname: routeConstants.VIEW_ACTIVITY,
      dataForView: data.id
    });
  };

  const handleFilterChangeForActivityField = event => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [ACTIVITY_FILTER]: event.target.value
      }
    }));
    event.persist();
  };

  /**
   * Redirect to Activity batch UI for given activity
   */
  const handleManageActivityBatchClick = activity => {
    setLoaderStatus(true);
    const manageActivityBatchURL = `/manage-activity-batch/${activity.id}`;
    history.push({
      pathname: manageActivityBatchURL
    });
    setLoaderStatus(false);
  };

  const handleClickDownloadStudents = activity => {
    setLoaderStatus(true);
    const URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_INDIVIDUAL_ACTIVITY +
      `/${activity.id}/` +
      strapiConstants.STRAPI_DOWNLOAD;

    serviceProviders
      .serviceProviderForGetRequest(URL)
      .then(({ data }) => {
        let wb = XLSX.utils.book_new();

        /**
         * Create worksheet for every batch
         * Add students list for respective batch
         */
        const headers = [
          "Enrollment Number",
          "Name",
          "College",
          "Stream",
          "Attended?",
          "Trainer",
          "Activity Date"
        ];
        data.result.forEach(d => {
          const { workSheetName, workSheetData } = d;
          let ws = XLSX.utils.json_to_sheet(workSheetData, ...headers);
          wb.SheetNames.push(workSheetName);
          wb.Sheets[workSheetName] = ws;
        });

        XLSX.writeFile(wb, "students.xlsx");
      })
      .catch(error => {
        console.log(error);
      });
    setLoaderStatus(false);
  };

  const handleCloseDeleteModal = () => {
    /** This restores all the data when we close the modal */
    setFormState(formState => ({
      ...formState,
      isDataDeleted: false,
      showModalDelete: false
    }));
    if (formState.isDataDeleted) {
      getActivityData(formState.pageSize, formState.page);
    } else {
    }
  };
  const isDeleteCellCompleted = (status, activity) => {
    formState.isDataDeleted = status;
    if (status === true) {
      setAlert(() => ({
        isOpen: true,
        message: `Activity ${activity.title} Deleted Successfully`,
        severity: "success"
      }));
    } else if (status === false) {
      setAlert(() => ({
        isOpen: true,
        message: activity.response.data.message,
        severity: "error"
      }));
    }
  };

  const handleDeleteActivity = activity => {
    setFormState(formState => ({
      ...formState,
      dataToDelete: { ...activity },
      showModalDelete: true
    }));
  };

  // const handleDeleteActivity = activity => {
  //   setLoaderStatus(true);
  //   const url = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY;
  //   const activityId = activity.id;
  //   serviceProviders
  //     .serviceProviderForDeleteRequest(url, activityId)
  //     .then(() => {
  //       setAlert(() => ({
  //         isOpen: true,
  //         message: `Activity ${activity.title} Deleted Successfully`,
  //         severity: "success"
  //       }));
  //       getActivityData(10, 1);
  //       setLoaderStatus(false);
  //     })
  //     .catch(({ response }) => {
  //       setAlert(() => ({
  //         isOpen: true,
  //         message: response.data.message,
  //         severity: "error"
  //       }));
  //       setLoaderStatus(false);
  //     });
  // };
  /** Feedback */

  /** For viewing feedback for student */
  const viewFeedback = async cell => {
    setLoaderStatus(true);
    const QUESTION_SET_URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY +
      "/" +
      cell.id +
      "/" +
      strapiConstants.STRAPI_CONTACT_SOLO +
      "/" +
      auth.getUserInfo().studentInfo.organization.contact.id +
      "/getStudentsFeedbacks/rating";

    let result = {};
    if (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) {
      result = {
        [roleConstants.STUDENT]: null
      };
    }

    await serviceProviders
      .serviceProviderForGetRequest(QUESTION_SET_URL)
      .then(res => {
        result[roleConstants.STUDENT] = res.data.result;
        setLoaderStatus(false);
      })
      .catch(error => {
        result[roleConstants.STUDENT] = [];
        setLoaderStatus(false);
      });

    setFeedbackState(feedbackState => ({
      ...feedbackState,
      isViewFeedback: true,
      isEditFeedback: false,
      isGiveFeedback: false,
      showModalFeedback: true,
      EventTitle: cell.title,
      eventId: cell.id,
      feedBackGiven: false,
      fromFeedBackModal: false,
      successErrorMessage: "",
      result: result,
      showErrorModalFeedback: false
    }));
  };

  /** For viewung feedback for superadmin */
  const viewFeedbackSuperAdmin = async cell => {
    setLoaderStatus(true);
    const COLLEGE_FEEDBACK =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY +
      "/" +
      cell.id +
      "/getSuperAdminFeedback/" +
      auth.getUserInfo().contact.id +
      "/DataFor/college/FeedbackType/rating";

    const RPC_FEEDBACK =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY +
      "/" +
      cell.id +
      "/getSuperAdminFeedback/" +
      auth.getUserInfo().contact.id +
      "/DataFor/rpc/FeedbackType/rating";

    const ZONE_FEEDBACK =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY +
      "/" +
      cell.id +
      "/getSuperAdminFeedback/" +
      auth.getUserInfo().contact.id +
      "/DataFor/zone/FeedbackType/rating";

    let result = {};
    if (auth.getUserInfo().role.name === roleConstants.MEDHAADMIN) {
      result = {
        [roleConstants.ZONALADMIN]: null,
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
        result[roleConstants.ZONALADMIN] = res.data.result;
      })
      .catch(error => {
        result[roleConstants.ZONALADMIN] = [];
      });
    await serviceProviders
      .serviceProviderForGetRequest(RPC_FEEDBACK)
      .then(res => {
        result[roleConstants.RPCADMIN] = res.data.result;
        setLoaderStatus(false);
      })
      .catch(error => {
        result[roleConstants.RPCADMIN] = [];
        setLoaderStatus(false);
      });

    setFeedbackState(feedbackState => ({
      ...feedbackState,
      isViewFeedback: true,
      isEditFeedback: false,
      isGiveFeedback: false,
      showModalFeedback: true,
      EventTitle: cell.title,
      eventId: cell.id,
      feedBackGiven: false,
      fromFeedBackModal: false,
      successErrorMessage: "",
      result: result,
      showErrorModalFeedback: false
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
          EventTitle: event.title,
          eventId: event.id,
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
          EventTitle: event.title,
          isEditFeedback: false,
          isGiveFeedback: false,
          isViewFeedback: false,
          feedBackGiven: false,
          fromFeedBackModal: false,
          successErrorMessage: "",
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
    const FEEDBACK_SET_URL =
      strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_FEEDBACK_SETS;
    await serviceProviders
      .serviceProviderForGetOneRequest(FEEDBACK_SET_URL, event.feedbackId)
      .then(res => {
        setFeedbackState(feedbackState => ({
          ...feedbackState,
          EventTitle: event.eventName,
          eventId: event.id,
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
          EventTitle: event.eventName,
          isGiveFeedback: false,
          isEditFeedback: false,
          isViewFeedback: false,
          feedBackGiven: false,
          fromFeedBackModal: false,
          successErrorMessage: "",
          errorMessage: "Cannot edit feedback"
        }));
        setLoaderStatus(false);
        console.log("error giving feedback");
      });
  };

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
        EventTitle: null,
        eventId: null,
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
          EventTitle: null,
          eventId: null,
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
          EventTitle: null,
          eventId: null,
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
      result: {}
    }));
  };

  /** Columns to show in table */
  const column = [
    {
      name: "Activity Name",
      sortable: true,
      selector: "title",
      cell: row => <ToolTipComponent data={row.title} />
    },
    {
      name: "Activity Type",
      sortable: true,
      selector: "activityType",
      cell: row => <ToolTipComponent data={row.activityType} />
    },
    {
      name: "Streams",
      sortable: true,
      selector: row => `${row.streams.map(s => ` ${s.name}`)}`,
      cell: row => (
        <ToolTipComponent data={`${row.streams.map(s => ` ${s.name}`)}`} />
      )
    },
    {
      name: "College",
      sortable: true,
      selector: "collegeName",
      cell: row => <ToolTipComponent data={row.collegeName} />
    },
    {
      name: "Education Year",
      sortable: true,
      selector: "educationYear",
      cell: row => <ToolTipComponent data={row.educationYear} />
    },
    {
      name: "Date",
      sortable: true,
      selector: row => `${moment(row.start_date_time).format("DD MMM YYYY")}`,
      cell: row => (
        <ToolTipComponent
          data={`${moment(row.start_date_time).format("DD MMM YYYY")}`}
        />
      )
    },
    {
      name: "Status",
      sortable: true,
      selector: "status",
      cell: row => <ToolTipComponent data={row.status} />
    },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <ViewStudentGridIcon
              id={cell.id}
              value={cell.name}
              onClick={() => handleManageActivityBatchClick(cell)}
              title="Manage Activity Batch"
            />
          </div>
          {roleName === roleConstants.MEDHAADMIN ? (
            <div className={classes.PaddingActionButton}>
              <EditGridIcon
                id={cell.id}
                value={cell.name}
                onClick={() => editCell(cell)}
              />
            </div>
          ) : null}

          <div className={classes.PaddingActionButton}>
            <ViewGridIcon
              id={cell.id}
              value={cell.name}
              onClick={() => viewCell(cell)}
            />
          </div>
          <div className={classes.PaddingActionButton}>
            <DownloadIcon
              id={cell.id}
              value={cell.name}
              title="Download Students"
              onClick={() => handleClickDownloadStudents(cell)}
            />
          </div>
          {auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN ? (
            cell.isFeedbackProvidedbyStudents ? (
              <div className={classes.PaddingActionButton}>
                <FeedBack
                  message={"View student feedback"}
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
                  message={"No student feedback available"}
                  id={cell.id}
                  isViewFeedback={true}
                  value={cell.title}
                  onClick={() => {}}
                />
              </div>
            )
          ) : null}

          {auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ? (
            <React.Fragment>
              <div className={classes.PaddingActionButton}>
                <FeedBack
                  message={"View feedback"}
                  id={cell.id}
                  isViewFeedback={true}
                  value={cell.title}
                  onClick={() => viewFeedbackSuperAdmin(cell)}
                />
              </div>
            </React.Fragment>
          ) : null}

          {auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN ? (
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

          {roleName === roleConstants.MEDHAADMIN ? (
            <div className={classes.PaddingActionButton}>
              <DeleteGridIcon
                id={cell.id}
                value={cell.title}
                onClick={() => handleDeleteActivity(cell)}
              />
            </div>
          ) : null}
        </div>
      ),
      width: "20%",
      cellStyle: {
        width: "18%",
        maxWidth: "18%"
      }
    }
  ];

  const handleAddActivityClick = () => {
    history.push({
      pathname: routeConstants.ADD_ACTIVITY,
      addActivity: true
    });
  };

  const AlertAPIResponseMessage = () => {
    return (
      <Collapse in={alert.isOpen}>
        <Alert
          severity={alert.severity || "warning"}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(() => ({ isOpen: false }));
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alert.message}
        </Alert>
      </Collapse>
    );
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.VIEW_ACTIVITY_TEXT}
        </Typography>

        {auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ? (
          <GreenButton
            variant="contained"
            color="primary"
            onClick={handleAddActivityClick}
            disableElevation
            greenButtonChecker
            to={routeConstants.ADD_ACTIVITY}
            startIcon={<AddCircleOutlineOutlinedIcon />}
          >
            {genericConstants.ADD_ACTIVITY_TEXT}
          </GreenButton>
        ) : null}
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

        {/** Error/Success messages to be shown for edit */}
        {formState.fromEditActivity && formState.isDataEdited ? (
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
              Activity{" "}
              {formState.editedData ? `${formState.editedData.title} ` : ""}
              has been updated successfully.
            </Alert>
          </Collapse>
        ) : null}
        {formState.fromEditActivity && !formState.isDataEdited ? (
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
              An error has occured while updating activity. Kindly, try again.
            </Alert>
          </Collapse>
        ) : null}

        {/** Error/Success messages to be shown for add */}
        {formState.fromAddActivity && formState.isDataAdded ? (
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
              Activity{" "}
              {formState.addedData ? `${formState.addedData.title} ` : ""}
              has been added successfully.
            </Alert>
          </Collapse>
        ) : null}
        {formState.fromAddActivity && !formState.isDataAdded ? (
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
              An error has occured while adding activity. Kindly, try again.
            </Alert>
          </Collapse>
        ) : null}
        <AlertAPIResponseMessage />
        <Card className={styles.filterButton}>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <TextField
                  label="Activity Name"
                  margin="normal"
                  variant="outlined"
                  value={formState.filterDataParameters[ACTIVITY_FILTER] || ""}
                  placeholder="Activity Title"
                  className={classes.autoCompleteField}
                  onChange={handleFilterChangeForActivityField}
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <Autocomplete
                  id="activity_filter"
                  name={"activityType"}
                  options={activityType}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(ACTIVITY_TYPE_FILTER, event, value)
                  }
                  value={
                    formState.isClearResetFilter
                      ? null
                      : activityType[
                          activityType.findIndex(function (item, i) {
                            return (
                              item.id ===
                              formState.filterDataParameters[
                                ACTIVITY_TYPE_FILTER
                              ]
                            );
                          })
                        ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Activity Type"
                      placeholder="Activity Type"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <Autocomplete
                  id="Education Year"
                  className={classes.root}
                  options={educationyearlist}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete(
                      EDUCATION_YEAR_FILTER,
                      event,
                      value
                    );
                  }}
                  value={
                    formState.isClearResetFilter
                      ? null
                      : educationyearlist[
                          educationyearlist.findIndex(function (item, i) {
                            return (
                              item.id ===
                              formState.filterDataParameters[
                                EDUCATION_YEAR_FILTER
                              ]
                            );
                          })
                        ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Education Year"
                      variant="outlined"
                      className={classes.autoCompleteField}
                      name="Education Year"
                    />
                  )}
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <InlineDatePicker
                  id="Date"
                  label="Date"
                  placeholder="Date"
                  value={formState.startDate}
                  name={"START_DATE_FILTER"}
                  onChange={event => {
                    formState.errors["dateFrom"] = false;
                    handleStartDateChange(START_DATE_FILTER, event);
                  }}
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
        {formState.dataToShow ? (
          formState.dataToShow.length ? (
            <Table
              data={formState.dataToShow}
              column={column}
              defaultSortField="name"
              defaultSortAsc={formState.sortAscending}
              editEvent={editCell}
              deleteEvent={deleteCell}
              progressPending={formState.isDataLoading}
              paginationTotalRows={formState.totalRows}
              paginationRowsPerPageOptions={[10, 20, 50]}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
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
            Title={feedbackState.EventTitle}
            id={feedbackState.eventId}
            fromEvent={false}
            fromActivity={true}
            fromRPC={false}
            fromZone={false}
            fromCollegeAdmin={
              auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
                ? true
                : false
            }
            formSuperAdmin={
              auth.getUserInfo().role.name === roleConstants.MEDHAADMIN
                ? true
                : false
            }
            result={feedbackState.result}
            dataToShow={feedbackState.ratings}
          />
        ) : null}
        {feedbackState.isGiveFeedback ? (
          <AddEditFeedBack
            isAddFeedback={true}
            showModal={feedbackState.showModalFeedback}
            modalClose={handleCloseFeedBackModal}
            Title={feedbackState.EventTitle}
            id={feedbackState.eventId}
            entityQuestionSet={feedbackState.entityQuestionSet}
            questionSetId={feedbackState.questionSetId}
            fromEvent={false}
            fromActivity={true}
          />
        ) : feedbackState.isEditFeedback ? (
          <AddEditFeedBack
            isEditFeedback={true}
            showModal={feedbackState.showModalFeedback}
            modalClose={handleCloseFeedBackModal}
            Title={feedbackState.EventTitle}
            id={feedbackState.eventId}
            entityQuestionSet={feedbackState.entityQuestionSet}
            questionSetId={feedbackState.questionSetId}
            feedbackSetId={feedbackState.feedbackSetId}
            fromEvent={false}
            fromActivity={true}
          />
        ) : null}
        {!feedbackState.isGiveFeedback &&
        !feedbackState.isEditFeedback &&
        !feedbackState.showModalFeedback &&
        feedbackState.showErrorModalFeedback ? (
          <NoFeedback
            showModal={feedbackState.showErrorModalFeedback}
            modalClose={handleCloseModal}
            Title={feedbackState.EventTitle}
            errorMessage={feedbackState.errorMessage}
          />
        ) : null}
        <DeleteActivity
          showModal={formState.showModalDelete}
          closeModal={handleCloseDeleteModal}
          activity={formState.dataToDelete}
          deleteEvent={isDeleteCellCompleted}
        />
      </Grid>
    </Grid>
  );
};

export default ViewActivity;
