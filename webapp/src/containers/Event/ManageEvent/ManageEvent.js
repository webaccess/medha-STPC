import React, { useState, useEffect, useCallback } from "react";
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
  CircularProgress
} from "@material-ui/core";
import { Table, Spinner, Alert } from "../../../components";
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
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as serviceProviders from "../../../api/Axios";
import DeleteUser from "./DeleteEvent";
import * as genericConstants from "../../../constants/GenericConstants";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import auth from "../../../components/Auth";
import Autocomplete from "@material-ui/lab/Autocomplete";

const EVENT_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;
const EVENT_FILTER = "title_contains";
const START_DATE_FILTER = "start_date_time_gte";
const END_DATE_FILTER = "end_date_time_lte";
const SORT_FIELD_KEY = "_sort";

const ManageEvent = props => {
  const [open, setOpen] = React.useState(true);
  const history = useHistory();
  const classes = useStyles();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  /** Value to set for event filter */
  const [value, setValue] = React.useState(null);
  const [typingTimeout, setTypingTimeout] = React.useState(null);

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
    isEventCleared: "",
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true,
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
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddEvent"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddEvent"]
      ? props["location"]["addedData"]
      : {},
    fromAddEvent: props["location"]["fromAddEvent"]
      ? props["location"]["fromAddEvent"]
      : false
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

  const getEventData = async (pageSize, page, paramsForevents = null) => {
    if (
      paramsForevents !== null &&
      !formUtilities.checkEmpty(paramsForevents)
    ) {
      let defaultParams = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "start_date_time:asc"
      };
      Object.keys(paramsForevents).map(key => {
        defaultParams[key] = paramsForevents[key];
      });
      paramsForevents = defaultParams;
    } else {
      paramsForevents = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "start_date_time:asc"
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
          strapiConstants.STRAPI_COLLEGES +
          "/" +
          auth.getUserInfo().college.id +
          "/event";
        await serviceProviders
          .serviceProviderForGetRequest(
            EVENTS_FOR_COLLEGE_ADMIN,
            paramsForevents
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
          .serviceProviderForGetRequest(EVENT_URL, paramsForevents)
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
        eventIndividualData["id"] = data[i]["id"];
        eventIndividualData["title"] = data[i]["title"] ? data[i]["title"] : "";
        eventIndividualData["start_date_time"] = startDate.toDateString();
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
        await getEventData(perPage, page);
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
        await getEventData(formState.pageSize, page);
      }
    }
  };

  const handleRowSelected = useCallback(state => {
    if (state.selectedCount >= 1) {
      setFormState(formState => ({
        ...formState,
        selectedRowFilter: false
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
  const handleCloseDeleteModal = () => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setFormState(formState => ({
      ...formState,
      showEditModal: false,
      isDataDeleted: false,
      showModalDelete: false
    }));
    if (formState.isDataDeleted) {
      getEventData();
    }
  };

  const isDeleteCellCompleted = status => {
    formState.isDataDeleted = status;
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalBlock: false,
      showModalDelete: false
    }));
  };

  const deleteCell = event => {
    setFormState(formState => ({
      ...formState,
      dataToDelete: {
        id: event.target.id,
        name: event.target.getAttribute("value")
      },
      showEditModal: false,
      showModalDelete: true
    }));
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
      MultiDeleteID: arrayId
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
    history.push({
      pathname: routeConstants.EVENT_STUDENT_LIST,
      eventId: event.target.id,
      eventTitle: event.target.getAttribute("value")
    });
  };

  /** Edit -------------------------------------------------------*/
  const getDataForEdit = async id => {
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
  };

  const editCell = event => {
    getDataForEdit(event.target.id);
  };

  /** ------ */

  /** Table Data */
  const column = [
    { name: "Event", sortable: true, selector: "title" },
    { name: "Date", sortable: true, selector: "start_date_time" },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <ViewGridIcon id={cell.id} value={cell.name} onClick={viewCell} />
          </div>
          <div className={classes.PaddingActionButton}>
            <EditGridIcon id={cell.id} value={cell.name} onClick={editCell} />
          </div>
          <div className={classes.PaddingActionButton}>
            <ViewStudentGridIcon
              id={cell.id}
              value={cell.title}
              onClick={viewStudentList}
            />
          </div>
          <div className={classes.PaddingActionButton}>
            <DeleteGridIcon
              id={cell.id}
              value={cell.title}
              onClick={deleteCell}
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
      endDate: null
    }));

    restoreData();
  };

  /** Handle Start Date filter change */
  const handleStartDateChange = (START_DATE_FILTER, event) => {
    let startDate = moment(event).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    if (startDate === "Invalid date") {
      startDate = null;
    }
    formState.filterDataParameters[START_DATE_FILTER] = startDate;
    setFormState(formState => ({
      ...formState,
      startDate: event
    }));
  };

  /** Handle End Date filter change */
  const handleEndDateChange = (END_DATE_FILTER, event) => {
    let endDate = moment(event).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    if (endDate === "Invalid date") {
      endDate = null;
    }
    formState.filterDataParameters[END_DATE_FILTER] = endDate;
    setFormState(formState => ({
      ...formState,
      endDate: event
    }));
  };

  const handleFilterChangeForEventField = event => {
    getFilteredEventDataValueInDropDown(event.target.value);
    event.persist();
    // setRpcsFilter(event.target.value);
  };

  const getFilteredEventDataValueInDropDown = eventValue => {
    setIsLoading(true);
    setValue({
      title: eventValue
    });
    if (eventValue && eventValue !== null && eventValue !== "") {
      formState.filterDataParameters[EVENT_FILTER] = eventValue;
      let params = {
        [EVENT_FILTER]: eventValue
      };
      let filterEvents =
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;
      if (auth.getUserInfo().role.name === "College Admin") {
        filterEvents =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_COLLEGES +
          "/" +
          auth.getUserInfo().college.id +
          "/event";
      }
      serviceProviders
        .serviceProviderForGetAsyncRequest(filterEvents, params)
        .then(res => {
          if (res.data.result.length !== 0) {
          }
          setIsLoading(false);
          setFormState(formState => ({
            ...formState,
            eventFilterData: res.data.result,
            isClearResetFilter: false,
            isEventCleared: eventValue
          }));
        })
        .catch(error => {
          setIsLoading(false);
          console.log("error", error);
        });
    } else {
      delete formState.filterDataParameters[EVENT_FILTER];
      setIsLoading(false);
      setFormState(formState => ({
        ...formState,
        eventFilterData: [],
        isClearResetFilter: false,
        isEventCleared: ""
      }));
    }
  };

  const getEventSelectedValue = (event, value) => {
    if (value === null) {
      getFilteredEventDataValueInDropDown(null);
    } else {
      getFilteredEventDataValueInDropDown(
        value.title
      ); /** value.title will give you name of the event */
    }
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

  const clearEventFilter = () => {
    delete formState.filterDataParameters[EVENT_FILTER];
    setFormState(formState => ({
      ...formState,
      eventFilterData: []
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
          onClick={clearFilter}
          disableElevation
          to={routeConstants.ADD_EVENT}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          Add Event
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        {/** Error/Success messages to be shown for add */}
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
              {genericConstants.ALERT_SUCCESS_DATA_ADDED_MESSAGE}
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
              {genericConstants.ALERT_ERROR_DATA_EDITED_MESSAGE}
            </Alert>
          </Collapse>
        ) : null}
        <Card>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="event-text-filter"
                  freeSolo
                  autoHighlight
                  autoComplete
                  loading={isLoading}
                  options={formState.eventFilterData}
                  includeInputInList
                  getOptionLabel={option => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    return option.title;
                  }}
                  renderOption={option => option.title}
                  onChange={getEventSelectedValue}
                  value={formState.isClearResetFilter ? null : value}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Event Name"
                      margin="normal"
                      variant="outlined"
                      placeholder="Search Event's"
                      className={classes.autoCompleteField}
                      onChange={handleFilterChangeForEventField}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {isLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <InlineDatePicker
                  id="date"
                  label="Start Date"
                  value={formState.startDate}
                  name={START_DATE_FILTER}
                  onChange={event =>
                    handleStartDateChange(START_DATE_FILTER, event)
                  }
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <InlineDatePicker
                  id="date"
                  label="End Date"
                  value={formState.endDate}
                  name={END_DATE_FILTER}
                  onChange={event =>
                    handleEndDateChange(END_DATE_FILTER, event)
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
                onSelectedRowsChange={handleRowSelected}
                deleteEvent={deleteCell}
                defaultSortField="start_date_time"
                defaultSortAsc={formState.sortAscending}
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
          {formState.isMultiDelete ? (
            <DeleteUser
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              deleteEvent={isDeleteCellCompleted}
              id={formState.MultiDeleteID}
              isMultiDelete={formState.isMultiDelete}
              modalClose={modalClose}
              seletedUser={selectedRows.length}
            />
          ) : (
            <DeleteUser
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              id={formState.dataToDelete["id"]}
              deleteEvent={isDeleteCellCompleted}
              modalClose={modalClose}
              userName={formState.userNameDelete}
              dataToDelete={formState.dataToDelete}
            />
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ManageEvent;
