import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, Card, CardContent, Grid } from "@material-ui/core";

import styles from "./Activity.module.css";
import useStyles from "../CommonStyles/ViewStyles.js";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as formUtilities from "../../../Utilities/FormUtilities";
import {
  Table,
  Spinner,
  YellowButton,
  GrayButton,
  Auth,
  ViewGridIcon
} from "../../../components";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";

const PastActivities = props => {
  const [open, setOpen] = React.useState(true);
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
    sortAscending: true
  });

  const studentInfo = Auth.getUserInfo()
    ? Auth.getUserInfo().studentInfo
    : null;
  const studentId = studentInfo ? studentInfo.id : null;
  const STUDENT_ACTIVITY_URL =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_STUDENTS +
    `/${studentId}/past-activities`;
  const ACTIVITY_FILTER = "id";
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
        console.log("error", error);
      });

    getPastActivities(10, 1);
  }, []);

  /** This seperate function is used to get the activity data*/
  const getPastActivities = async (pageSize, page, params = null) => {
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
      .serviceProviderForGetRequest(STUDENT_ACTIVITY_URL, params)
      .then(res => {
        formState.dataToShow = [];
        setFormState(formState => ({
          ...formState,
          activities: res.data.result,
          dataToShow: res.data.result,
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

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
    }
  };

  /** Columns to show in table */
  const column = [
    { name: "Training & Activity", sortable: true, selector: "title" },
    { name: "Type", sortable: true, selector: "activity_type" },
    { name: "Education Year", sortable: true, selector: "education_year" }
  ];

  return (
    <Card style={{ padding: "8px" }}>
      <CardContent className={classes.Cardtheming}>
        <Grid>
          <Grid item xs={12} className={classes.formgrid}>
            <Card className={styles.filterButton}>
              <CardContent className={classes.Cardtheming}>
                <Grid className={classes.filterOptions} container spacing={1}>
                  <Grid item>
                    <Autocomplete
                      id="activity-title-filter"
                      options={formState.activitiesFilter}
                      className={classes.autoCompleteField}
                      getOptionLabel={option => option.title}
                      onChange={(event, value) =>
                        handleChangeAutoComplete(ACTIVITY_FILTER, event, value)
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Activity"
                          className={classes.autoCompleteField}
                          variant="outlined"
                        />
                      )}
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
            {formState.dataToShow ? (
              formState.dataToShow.length ? (
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
                  noDataComponent="No education details found"
                />
              ) : (
                <div className={classes.noDataMargin}>
                  No activity details found
                </div>
              )
            ) : (
              <Spinner />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PastActivities;
