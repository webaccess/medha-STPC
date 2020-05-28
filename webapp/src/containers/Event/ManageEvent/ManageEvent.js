import React, { useState, useEffect, useCallback, useContext } from "react";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import moment from "moment";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Collapse,
  IconButton,
  Typography,
  Tooltip
} from "@material-ui/core";
import { Table, Spinner, Alert, FeedBack } from "../../../components";
import DeleteIcon from "@material-ui/icons/Delete";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import {
  GrayButton,
  YellowButton,
  GreenButton,
  ViewGridIcon,
  EditGridIcon,
  ViewStudentGridIcon,
  DeleteGridIcon,
  InlineDatePicker
} from "../../../components";
import * as formUtilities from "../../../utilities/FormUtilities";
import * as serviceProviders from "../../../api/Axios";
import DeleteUser from "./DeleteEvent";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import auth from "../../../components/Auth";
import LoaderContext from "../../../context/LoaderContext";
import ViewFeedBack from "../../Feedback/ViewFeedback/ViewFeedback";
import NoFeedback from "../../Feedback/NoFeedback/NoFeedback";
const EVENT_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;
const EVENT_FILTER = "title_contains";
const START_DATE_FILTER = "start_date_time_gte";
const END_DATE_FILTER = "end_date_time_lt";
const SORT_FIELD_KEY = "_sort";

const ManageEvent = props => {
  const [open, setOpen] = React.useState(true);
  const history = useHistory();
  const classes = useStyles();
  const [selectedRows, setSelectedRows] = useState([]);
  const { setLoaderStatus } = useContext(LoaderContext);

  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    events: [],
    greenButtonChecker: true,
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showEditModal: false,
    showModalDelete: false,
    isMultiDelete: false,
    MultiDeleteID: [],
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
    errors: {},
    /** Feedback */
    showModalFeedback: false,
    EventTitle: null,
    eventId: null,
    feedBackGiven: false,
    fromFeedBackModal: false,
    successErrorMessage: "",
    showErrorModalFeedback: false,
    ratings: [],
    /** This is when we return from edit page */
    isDataEdited: props["location"]["fromeditEvent"]
      ? props["location"]["isDataEdited"]
      : false,
    editedData: props["location"]["fromeditEvent"]
      ? props["location"]["editedData"]
      : {},
    fromeditEvent: props["location"]["fromeditEvent"]
      ? props["location"]["fromeditEvent"]
      : false,
    editedEventName: props["location"]["editedEventData"]
      ? props["location"]["editedEventData"]["title"]
      : "",
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddEvent"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddEvent"]
      ? props["location"]["addedData"]
      : {},
    fromAddEvent: props["location"]["fromAddEvent"]
      ? props["location"]["fromAddEvent"]
      : false,
    addedEventName: props["location"]["addedEventData"]
      ? props["location"]["addedEventData"]["title"]
      : ""
  });

  useEffect(() => {
    if (auth.getUserInfo() !== null) {
      getEventData(10, 1);
    } else {
      auth.clearAppStorage();
      history.push({
        pathname: routeConstants.SIGN_IN_URL
      });
    }
  }, []);

  const getEventData = async (pageSize, page, paramsForEvents = null) => {
    if (
      paramsForEvents !== null &&
      !formUtilities.checkEmpty(paramsForEvents)
    ) {
      let defaultParams = {};
      if (paramsForEvents.hasOwnProperty(SORT_FIELD_KEY)) {
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
      Object.keys(paramsForEvents).map(key => {
        defaultParams[key] = paramsForEvents[key];
      });
      paramsForEvents = defaultParams;
    } else {
      paramsForEvents = {
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
      if (auth.getUserInfo().role.name === "College Admin") {
        const EVENTS_FOR_COLLEGE_ADMIN =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_CONTACTS +
          "/" +
          auth.getUserInfo().studentInfo.organization.contact.id +
          "/get-organization-events";
        await serviceProviders
          .serviceProviderForGetRequest(
            EVENTS_FOR_COLLEGE_ADMIN,
            paramsForEvents
          )
          .then(res => {
            formState.dataToShow = [];
            formState.tempData = [];
            let eventData = [];
            eventData = convertEventData(res.data.result);
            setFormState(formState => ({
              ...formState,
              events: res.data.result,
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
      } else if (auth.getUserInfo().role.name === "Medha Admin") {
        await serviceProviders
          .serviceProviderForGetRequest(EVENT_URL, paramsForEvents)
          .then(res => {
            formState.dataToShow = [];
            formState.tempData = [];
            let eventData = [];
            eventData = convertEventData(res.data.result);
            setFormState(formState => ({
              ...formState,
              events: res.data.result,
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
        eventIndividualData["isFeedbackProvided"] =
          data[i]["isFeedbackProvided"];
        eventIndividualData["title"] = data[i]["title"] ? data[i]["title"] : "";
        eventIndividualData["start_date_time"] = startDate.toDateString();
        eventIndividualData["end_date_time"] = endDate.toDateString();
        let currentDate = new Date();
        if (endDate < currentDate) {
          eventIndividualData["eligibleForFeedback"] = true;
        } else {
          eventIndividualData["eligibleForFeedback"] = false;
        }
        eventIndividualData["IsEditable"] = false;
        if (auth.getUserInfo().role.name === "College Admin") {
          let state = false;
          if (
            data[i]["state"] &&
            data[i]["state"]["id"] &&
            auth.getUserInfo().state.id === data[i]["state"]["id"]
          ) {
            state = true;
          }
          let rpc = false;
          if (
            data[i]["rpc"] &&
            data[i]["rpc"]["id"] &&
            auth.getUserInfo().rpc.id === data[i]["rpc"]["id"]
          ) {
            rpc = true;
          }
          let zone = false;
          if (
            data[i]["zone"] &&
            data[i]["zone"]["id"] &&
            auth.getUserInfo().zone.id === data[i]["zone"]["id"]
          ) {
            zone = true;
          }
          let colleges = false;
          if (
            data[i]["contacts"] &&
            data[i]["contacts"].length === 1 &&
            data[i]["contacts"][0]["id"] ===
              auth.getUserInfo().studentInfo.organization.contact.id
          ) {
            colleges = true;
          }
          if (state && rpc && zone && colleges) {
            eventIndividualData["IsEditable"] = true;
          } else {
            eventIndividualData["IsEditable"] = false;
          }
        } else if (auth.getUserInfo().role.name === "Medha Admin") {
          eventIndividualData["IsEditable"] = true;
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
      await getEventData(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getEventData(perPage, page, formState.filterDataParameters);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getEventData(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getEventData(
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

  /** This is used to handle the close modal event */
  const handleCloseDeleteModal = (status, statusToShow = "") => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setOpen(true);
    setFormState(formState => ({
      ...formState,
      isDataDeleted: status,
      showModalDelete: false,
      fromDeleteModal: true,
      isMultiDelete: false,
      fromAddEvent: false,
      messageToShow: statusToShow
    }));
    if (status) {
      getEventData(formState.pageSize, 1, formState.filterDataParameters);
    }
  };

  // const isDeleteCellCompleted = status => {
  //   formState.isDataDeleted = status;
  // };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalBlock: false,
      showModalDelete: false
    }));
  };

  const deleteCell = event => {
    setLoaderStatus(true);
    setFormState(formState => ({
      ...formState,
      dataToDelete: {
        id: event.target.id,
        name: event.target.getAttribute("value")
      },
      showEditModal: false,
      showModalDelete: true,
      messageToShow: "",
      fromDeleteModal: false,
      fromeditCollege: false,
      fromBlockModal: false,
      fromAddEvent: false,
      fromeditEvent: false
    }));
    setLoaderStatus(false);
  };

  /** Get multiple user id for delete */
  const deleteMulUserById = () => {
    let arrayId = [];

    selectedRows.forEach(d => {
      arrayId.push(d.id);
    });

    setFormState(formState => ({
      ...formState,
      showEditModal: false,
      showModalDelete: true,
      isMultiDelete: true,
      MultiDeleteID: arrayId,
      fromAddEvent: false,
      fromeditEvent: false
    }));
  };

  /** View Event */
  const viewCell = event => {
    history.push({
      pathname: routeConstants.VIEW_EVENT,
      dataForView: event.target.id
    });
  };

  /** View Student List */
  const viewStudentList = event => {
    setLoaderStatus(true);
    history.push({
      pathname: routeConstants.EVENT_STUDENT_LIST,
      eventId: event.target.id,
      eventTitle: event.target.getAttribute("value")
    });
    setLoaderStatus(false);
  };

  /** Edit -------------------------------------------------------*/
  const getDataForEdit = async id => {
    setLoaderStatus(true);
    await serviceProviders
      .serviceProviderForGetOneRequest(EVENT_URL, id)
      .then(res => {
        let editData = res.data.result;
        /** move to edit page */
        history.push({
          pathname: routeConstants.EDIT_EVENT,
          editEvent: true,
          dataForEdit: editData
        });
      })
      .catch(error => {
        console.log("error");
      });
    setLoaderStatus(false);
  };

  const editCell = event => {
    getDataForEdit(event.target.id);
  };

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
  const giveFeedback = async cell => {
    setOpen(true);
    setLoaderStatus(true);
    const QUESTION_SET_URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_EVENTS +
      "/" +
      cell.id +
      "/" +
      strapiConstants.STRAPI_CONTACT_SOLO +
      "/" +
      auth.getUserInfo().studentInfo.organization.contact.id +
      "/getStudentsFeedbacks";
    await serviceProviders
      .serviceProviderForGetRequest(QUESTION_SET_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          showModalFeedback: true,
          EventTitle: cell.title,
          eventId: cell.id,
          feedBackGiven: false,
          fromFeedBackModal: false,
          successErrorMessage: "",
          ratings: res.data.result,
          showErrorModalFeedback: false
        }));
        setLoaderStatus(false);
      })
      .catch(error => {
        setFormState(formState => ({
          ...formState,
          EventTitle: cell.title,
          showModalFeedback: false,
          feedBackGiven: false,
          fromFeedBackModal: false,
          successErrorMessage: "",
          showErrorModalFeedback: true
        }));
        setLoaderStatus(false);
        console.log("error giving feedback");
      });
  };

  /** ------ */

  /** Table Data */
  const column = [
    {
      name: "Name",
      sortable: true,
      selector: "title",
      cell: row => (
        <Tooltip
          title={
            <React.Fragment>
              <Typography color="inherit">{`${row.title}`}</Typography>
            </React.Fragment>
          }
          placement="top"
        >
          <div>{`${row.title}`}</div>
        </Tooltip>
      )
    },
    { name: "Start Date", sortable: true, selector: "start_date_time" },
    { name: "End Date", sortable: true, selector: "end_date_time" },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <ViewGridIcon id={cell.id} value={cell.name} onClick={viewCell} />
          </div>
          <div className={classes.PaddingActionButton}>
            <EditGridIcon
              id={cell.id}
              value={cell.name}
              onClick={editCell}
              disabled={!cell.IsEditable}
            />
          </div>
          <div className={classes.PaddingActionButton}>
            <ViewStudentGridIcon
              id={cell.id}
              value={cell.title}
              onClick={viewStudentList}
            />
          </div>
          {auth.getUserInfo().role.name === "College Admin" ? (
            cell.isFeedbackProvided ? (
              <div className={classes.PaddingActionButton}>
                <FeedBack
                  id={cell.id}
                  isViewFeedback={true}
                  value={cell.title}
                  onClick={() => giveFeedback(cell)}
                />
              </div>
            ) : (
              <div className={classes.PaddingActionButton}>
                <FeedBack
                  isdisabled={true}
                  id={cell.id}
                  isViewFeedback={true}
                  value={cell.title}
                  onClick={() => {}}
                />
              </div>
            )
          ) : null}

          <div className={classes.PaddingActionButton}>
            <DeleteGridIcon
              id={cell.id}
              value={cell.title}
              onClick={deleteCell}
              disabled={!cell.IsEditable}
            />
          </div>
        </div>
      ),
      width: "18%",
      cellStyle: {
        width: "18%",
        maxWidth: "18%"
      }
    }
  ];

  /** Used for restoring data */
  const restoreData = () => {
    getEventData(formState.pageSize, 1);
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

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getEventData(perPage, page, formState.filterDataParameters);
    } else {
      await getEventData(perPage, page);
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
    getEventData(perPage, page, formState.filterDataParameters);
  };

  const hasError = field => (formState.errors[field] ? true : false);

  /**Handle Closed model */
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
        EventTitle: null,
        eventId: null,
        feedBackGiven: false,
        fromFeedBackModal: false,
        successErrorMessage: ""
      }));
    } else {
      if (status) {
        setFormState(formState => ({
          ...formState,
          showModalFeedback: false,
          EventTitle: null,
          eventId: null,
          feedBackGiven: true,
          fromFeedBackModal: true,
          successErrorMessage: message
        }));
        getEventData(
          formState.pageSize,
          formState.page,
          formState.filterDataParameters
        );
      } else {
        setFormState(formState => ({
          ...formState,
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
    setFormState(formState => ({
      ...formState,
      showModalFeedback: false,
      showErrorModalFeedback: false
    }));
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Manage Events
        </Typography>

        <GreenButton
          variant="contained"
          color="secondary"
          onClick={() => deleteMulUserById()}
          startIcon={<DeleteIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          Delete Selected Event
        </GreenButton>

        <GreenButton
          variant="contained"
          color="primary"
          onClick={() => {}}
          disableElevation
          to={routeConstants.ADD_EVENT}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          Add Event
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        {/** Error/Success messages to be shown for event */}
        {formState.fromeditEvent && formState.isDataEdited ? (
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
              Event {formState.editedEventName} has been updated successfully.
            </Alert>
          </Collapse>
        ) : null}
        {formState.fromeditEvent && !formState.isDataEdited ? (
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
              An error has occured while updating event. Kindly, try again.
            </Alert>
          </Collapse>
        ) : null}
        {formState.fromAddEvent && formState.isDataAdded ? (
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
              Event {formState.addedEventName} has been added successfully.
            </Alert>
          </Collapse>
        ) : null}

        {formState.fromAddEvent && !formState.isDataAdded ? (
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
              An error has occured while adding event. Kindly, try again.
            </Alert>
          </Collapse>
        ) : null}

        {formState.fromDeleteModal &&
        formState.isDataDeleted &&
        formState.messageToShow !== "" ? (
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
              {formState.messageToShow}
            </Alert>
          </Collapse>
        ) : null}

        {formState.fromDeleteModal &&
        !formState.isDataDeleted &&
        formState.messageToShow !== "" ? (
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
              {formState.messageToShow}
            </Alert>
          </Collapse>
        ) : null}

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
                deleteEvent={deleteCell}
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
          {formState.showModalFeedback ? (
            <ViewFeedBack
              showModal={formState.showModalFeedback}
              modalClose={handleCloseFeedBackModal}
              Title={formState.EventTitle}
              id={formState.eventId}
              fromEvent={true}
              fromActivity={false}
              dataToShow={formState.ratings}
            />
          ) : null}
          {!formState.showModalFeedback && formState.showErrorModalFeedback ? (
            <NoFeedback
              showModal={formState.showErrorModalFeedback}
              modalClose={handleCloseModal}
              Title={formState.EventTitle}
              forView={true}
            />
          ) : null}
          {formState.isMultiDelete ? (
            <DeleteUser
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              //deleteEvent={isDeleteCellCompleted}
              id={formState.MultiDeleteID}
              isMultiDelete={formState.isMultiDelete}
              modalClose={modalClose}
              seletedUser={selectedRows.length}
              clearSelectedRow={selectedRowCleared}
            />
          ) : (
            <DeleteUser
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              id={formState.dataToDelete["id"]}
              //deleteEvent={isDeleteCellCompleted}
              modalClose={modalClose}
              userName={formState.userNameDelete}
              dataToDelete={formState.dataToDelete}
              clearSelectedRow={selectedRowCleared}
            />
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ManageEvent;
