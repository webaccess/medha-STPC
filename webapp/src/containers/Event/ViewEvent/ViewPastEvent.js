import React, { useState, useEffect } from "react";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Typography
} from "@material-ui/core";
import {
  Table,
  Spinner,
  GrayButton,
  YellowButton,
  InlineDatePicker,
  PastEventStatus
} from "../../../components";
import * as formUtilities from "../../../Utilities/FormUtilities";
import auth from "../../../components/Auth";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as serviceProviders from "../../../api/Axios";
import moment from "moment";
import * as genericConstants from "../../../constants/GenericConstants";
import Autocomplete from "@material-ui/lab/Autocomplete";

const EVENT_FILTER = "title_contains";
const START_DATE_FILTER = "start_date_time_gte";
const END_DATE_FILTER = "end_date_time_lt";
const STATUS_FILTER = "hasAttended";

const ViewPastEvent = props => {
  const classes = useStyles();
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
    errors: {}
  });

  useEffect(() => {
    getStatusFilterData();

    getPastEvent(10, 1);
  }, []);

  const getStatusFilterData = () => {
    setStatusFilter(genericConstants.EVENT_STATUS);
  };

  const getPastEvent = async (pageSize, page, paramsForUsers = null) => {
    if (paramsForUsers !== null && !formUtilities.checkEmpty(paramsForUsers)) {
      let defaultParams = {
        page: page,
        pageSize: pageSize,
        isRegistered: true,
        _sort: "start_date_time:desc"
      };
      Object.keys(paramsForUsers).map(key => {
        defaultParams[key] = paramsForUsers[key];
      });
      paramsForUsers = defaultParams;
    } else {
      paramsForUsers = {
        page: page,
        pageSize: pageSize,
        isRegistered: true,
        _sort: "start_date_time:desc"
      };
    }

    if (
      auth.getUserInfo().role.name === "Student" &&
      auth.getUserInfo().studentInfo !== null &&
      auth.getUserInfo().studentInfo.id !== null
    ) {
      const PASTEVENT_URL =
        strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_STUDENTS +
        "/" +
        auth.getUserInfo().studentInfo.id +
        "/" +
        strapiConstants.STRAPI_PAST_EVENTS;

      setFormState(formState => ({
        ...formState,
        isDataLoading: true
      }));

      serviceProviders
        .serviceProviderForGetRequest(PASTEVENT_URL, paramsForUsers)
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

        let startDate = new Date(data[i]["start_date_time"]);
        let endDate = new Date(data[i]["end_date_time"]);

        tempIndividualPastEventData["eventName"] = data[i]["title"];
        tempIndividualPastEventData[
          "start_date_time"
        ] = startDate.toDateString();
        tempIndividualPastEventData["end_date_time"] = endDate.toDateString();
        tempIndividualPastEventData["status"] = data[i]["hasAttended"];
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
        await getPastEvent(perPage, page);
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
        await getPastEvent(formState.pageSize, page);
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

  /** Columns to show in table */
  const column = [
    {
      name: "Name",
      sortable: true,
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
            <PastEventStatus style={cell.status} />
          </div>
        </div>
      )
    }
  ];

  return (
    <Grid>
      <Grid item xs={12} className={classes.formgrid}>
        {/** Error/Success messages to be shown for student */}
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
              <Grid item>
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
              <Grid item>
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
            <div className={classes.noDataMargin}>
              {genericConstants.NO_DATA_TO_SHOW_TEXT}
            </div>
          )}

          {/* Action button component */}
        </Card>
      </Grid>
    </Grid>
  );
};
export default ViewPastEvent;
