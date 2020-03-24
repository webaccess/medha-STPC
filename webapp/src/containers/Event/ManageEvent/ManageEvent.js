import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
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

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import useStyles from "./ManageEventStyles";
import { GrayButton, YellowButton, GreenButton } from "../../../components";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as serviceProviders from "../../../api/Axios";
import DatePickers from "../../../components/Date/Date";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";

const EVENT_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;
// http://104.236.28.24:1338/events
// page: 1, pageSize: 10, _sort: "title:asc"

const SORT_FIELD_KEY = "_sort";

const ViewEvents = props => {
  const history = useHistory();
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    events: "",
    greenButtonChecker: true,
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
        [SORT_FIELD_KEY]: "title:asc"
      };
      Object.keys(paramsForevents).map(key => {
        defaultParams[key] = paramsForevents[key];
      });
      paramsForevents = defaultParams;
    } else {
      paramsForevents = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "title:asc"
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
        eventIndividualData["title"] = data[i]["title"];
        eventIndividualData["start_date_time"] = data[i]["start_date_time"];
        eventIndividualData["streams"] = data[i]["streams"]
          ? data[i]["streams"]["name"]
          : "";
        //eventIndividualData["rpc"] = data[i]["rpc"];
        // eventIndividualData["zone"] = data[i]["zone"] ? data[i]["zone"]["name"] : "";
        // eventIndividualData["rpc"] = data[i]["rpc"] ? data[i]["rpc"]["name"] : "";
        // eventIndividualData["college"] = data[i]["college"] ? data[i]["college"]["name"] : "";
        x.push(eventIndividualData);
      }
      return x;
    }
  };

  const handleDateChange = date => {
    setSelectedDate(date);
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
    { name: "Stream", sortable: true, selector: "streams" },
    //{ name: "Location", sortable: true, selector: "rpc" },
    { name: "Date", sortable: true, selector: "start_date_time" },
    // { name: "RPC", sortable: true, selector: "rpc" },
    // { name: "IPC", sortable: true, selector: "college" },
    /** Columns for edit and delete */

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
            //onClick={deleteCell}
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
          color="primary"
          //onClick={clearFilter}
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
                <Autocomplete
                  id="combo-box-demo"
                  //name={USER_FILTER}
                  //options={formState.users}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.username}
                  //   onChange={(event, value) =>
                  //     handleChangeAutoComplete(USER_FILTER, event, value)
                  //   }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Event"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  //name={USER_FILTER}
                  //options={formState.users}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.username}
                  //   onChange={(event, value) =>
                  //     handleChangeAutoComplete(USER_FILTER, event, value)
                  //   }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Stream"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  //name={USER_FILTER}
                  //options={formState.users}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.username}
                  //   onChange={(event, value) =>
                  //     handleChangeAutoComplete(USER_FILTER, event, value)
                  //   }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Location"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />{" "}
              </Grid>
              <Grid item>
                <DatePickers label="End Date" />
              </Grid>
              <Grid item>
                <DatePickers label="End Date" />
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <YellowButton
                  variant="contained"
                  color="primary"
                  disableElevation
                  // onClick={event => {
                  //   event.persist();
                  //   searchFilter();
                  // }}
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
                //onSelectedRowsChange={handleRowSelected}
                // deleteEvent={deleteCell}
                defaultSortField="title"
                defaultSortAsc={formState.sortAscending}
                progressPending={formState.isDataLoading}
                paginationTotalRows={formState.totalRows}
                paginationRowsPerPageOptions={[10, 20, 50]}
                // onChangeRowsPerPage={handlePerRowsChange}
                // onChangePage={handlePageChange}
              />
            ) : (
              <Spinner />
            )
          ) : (
            <div className={classes.noDataMargin}>No data to show</div>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ViewEvents;
