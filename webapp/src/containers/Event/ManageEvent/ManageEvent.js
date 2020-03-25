import React, { useState, useEffect, useCallback } from "react";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import {
  TextField,
  Card,
  CardContent,
  Tooltip,
  Grid,
  Collapse,
  IconButton,
  Typography
} from "@material-ui/core";
import { Table, Spinner, Alert } from "../../../components";
import DeleteIcon from "@material-ui/icons/Delete";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import useStyles from "./ManageEventStyles";
import { GrayButton, YellowButton, GreenButton } from "../../../components";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as serviceProviders from "../../../api/Axios";
import DatePickers from "../../../components/Date/Date";
import DeleteUser from "./DeleteEvent";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";

const EVENT_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;
const EVENT_FILTER = "title_contains";
const START_DATE_FILTER = "start_date_time_gte";
const END_DATE_FILTER = "end_date_time_lte";
const SORT_FIELD_KEY = "_sort";

const ViewEvents = props => {
  const history = useHistory();
  const classes = useStyles();
  const [selectedRows, setSelectedRows] = useState([]);

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
    selectedRowFilter: true,
    MultiDeleteID: [],
    filterDataParameters: {},
    isFilterSearch: false,
    startDate: new Date(),
    endDate: new Date(),
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true
  });

  useEffect(() => {
    getEventData(10, 1);
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

    await serviceProviders
      .serviceProviderForGetRequest(EVENT_URL, paramsForevents)
      .then(res => {
        formState.dataToShow = [];
        formState.tempData = [];
        let eventData = [];
        eventData = convertUserData(res.data.result);
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
  };

  const convertUserData = data => {
    let x = [];
    if (data.length > 0) {
      for (let i in data) {
        var eventIndividualData = {};
        eventIndividualData["id"] = data[i]["id"];
        eventIndividualData["title"] = data[i]["title"];
        eventIndividualData["start_date_time"] = data[i]["start_date_time"];
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

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getEventData(perPage, page, formState.filterDataParameters);
    }
  };

  /** This restores all the data when we clear the filters*/

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

  /** Restoring the data basically resets all te data i.e it gets all the data in view zones
   * i.e the nested zones data and also resets the data to []
   */

  const restoreData = () => {
    getEventData(formState.pageSize, 1);
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

  const handleFilterChange = event => {
    formState.filterDataParameters[event.target.name] = event.target.value;
  };

  const handleStartDateChange = date => {
    formState.filterDataParameters[date.target.name] = date.target.value;
    setFormState(formState => ({
      ...formState,
      startDate: date.target.value
      //filterDataParameters: date.target.value
    }));
  };

  const handleEndDateChange = date => {
    formState.filterDataParameters[date.target.name] = date.target.value;
    setFormState(formState => ({
      ...formState,
      endDate: date.target.value
    }));
  };

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
    let dataId = event.target.id;
    setFormState(formState => ({
      ...formState,
      dataToDelete: { id: dataId },
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
      dataForEdit: event.target.id
    });
  };

  /** ------ */

  /** Table Data */
  const column = [
    { name: "Event", sortable: true, selector: "title" },
    { name: "Date", sortable: true, selector: "start_date_time" },
    {
      cell: cell => (
        <Tooltip title="View" placement="top">
          <i
            className="material-icons"
            id={cell.id}
            onClick={viewCell}
            style={{ color: "green", fontSize: "19px" }}
          >
            view_list
          </i>
        </Tooltip>
      ),
      button: true,
      conditionalCellStyles: []
    },
    {
      cell: cell => (
        <Tooltip title="Edit" placement="top">
          <i
            className="material-icons"
            id={cell.id}
            value={cell.name}
            // onClick={editCell}
            style={{ color: "green" }}
          >
            edit
          </i>
        </Tooltip>
      ),
      button: true,
      conditionalCellStyles: []
    },
    {
      cell: cell => (
        <Tooltip title="View Student List" placement="top">
          <i
            className="material-icons"
            id={cell.id}
            value={cell.name}
            style={{ color: "blue" }}
            // onClick={blockedCell}
          >
            group
          </i>
        </Tooltip>
      ),
      button: true,
      conditionalCellStyles: [
        {
          when: row => row.blocked === true,
          style: {
            color: "red"
          }
        },
        {
          when: row => row.blocked === false,
          style: {
            color: "green"
          }
        }
      ]
    },
    {
      cell: cell => (
        <Tooltip title="Delete" placement="top">
          <i
            className="material-icons"
            id={cell.id}
            onClick={deleteCell}
            style={{ color: "red" }}
          >
            delete_outline
          </i>
        </Tooltip>
      ),
      button: true,
      conditionalCellStyles: []
    }
  ];

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Manage Event
        </Typography>

        <GreenButton
          variant="contained"
          color="secondary"
          onClick={() => deleteMulUserById()}
          startIcon={<DeleteIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          Delete Selected User
        </GreenButton>

        <GreenButton
          variant="contained"
          color="primary"
          onClick={clearFilter}
          disableElevation
          //to={routeConstants.ADD_USER}
          startIcon={<AddCircleOutlineOutlinedIcon />}
          greenButtonChecker={formState.greenButtonChecker}
        >
          Add Event
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <TextField
                  label={"Event"}
                  placeholder="Event"
                  variant="outlined"
                  name={EVENT_FILTER}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item>
                <DatePickers
                  id="date"
                  label="Start Date"
                  placeholder="dd-mm-yyyy"
                  value={formState.startDate}
                  name={START_DATE_FILTER}
                  onChange={handleStartDateChange}
                />
              </Grid>
              <Grid item>
                <DatePickers
                  id="date"
                  label="End Date"
                  placeholder="dd-mm-yyyy"
                  value={formState.endDate}
                  name={END_DATE_FILTER}
                  onChange={handleEndDateChange}
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
                  //onClick={refreshPage}
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
                defaultSortField="title"
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
            />
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ViewEvents;
