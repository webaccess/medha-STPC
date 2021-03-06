import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  IconButton
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import styles from "../Activity.module.css";
import useStyles from "../ViewActivityStyles.js";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as formUtilities from "../../../utilities/FormUtilities";
import { Table, Spinner, YellowButton, GrayButton } from "../../../components";
import { uniqBy } from "lodash";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import "./AddStudentToActivityBatch.css";

const ACTIVITY_BATCH_STUDENT_FILTER = "name_contains";
const ACTIVITY_BATCH_STREAM_FILTER = "individual.stream.id";
const ACTIVITY_BATCH_MOBILE_FILTER = "phone_contains";

const AddEditActivityBatches = props => {
  const classes = useStyles();

  const [formState, setFormState] = useState({
    dataToShow: [],
    students: [],
    studentsFilter: [],
    filterDataParameters: {},
    isFilterSearch: false,

    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true,
    streams: []
  });

  const [selectedStudents, setSeletedStudent] = useState([]);

  const { activity, activityBatch } = props;

  const ACTIVITY_BATCH_STUDENTS =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_ACTIVITY +
    `/${activity}/` +
    strapiConstants.STRAPI_STUDENTS;

  const ACTIVITY_CREATE_BATCH_URL =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_ACTIVITY_BATCH_URL +
    `/${activityBatch}/` +
    strapiConstants.STRAPI_ADD_STUDENTS;

  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(ACTIVITY_BATCH_STUDENTS)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          studentsFilter: res.data.result,
          streams: getStreams(res.data.result)
        }));
      })
      .catch(error => {
        console.log("error", error);
      });

    getStudents(10, 1);
  }, []);

  /** This seperate function is used to get the Activity Batches data*/
  const getStudents = async (pageSize, page, params = null) => {
    if (params !== null && !formUtilities.checkEmpty(params)) {
      let defaultParams = {
        page: page,
        pageSize: pageSize
      };
      Object.keys(params).map(key => {
        return (defaultParams[key] = params[key]);
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
      .serviceProviderForGetRequest(ACTIVITY_BATCH_STUDENTS, params)
      .then(res => {
        formState.dataToShow = [];
        setFormState(formState => ({
          ...formState,
          students: res.data.result,
          dataToShow: res.data.result,
          pageSize: res.data.pageSize,
          totalRows: res.data.rowCount,
          page: res.data.page,
          pageCount: res.data.pageCount,
          isDataLoading: false,
          streams: getStreams(res.data.result)
        }));
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  const getStreams = data => {
    const streams = data.map(student => student.individual.stream);
    return uniqBy(streams, stream => stream.id);
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getStudents(perPage, page, formState.filterDataParameters);
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
    getStudents(formState.pageSize, 1);
  };

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
    }
  };

  const handleRowChange = ({ selectedRows }) => {
    const studentIds = selectedRows.map(student => student.id);
    setSeletedStudent(studentIds);
  };

  /** Pagination */
  const handlePerRowsChange = async (perPage, page) => {
    /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getStudents(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getStudents(perPage, page);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getStudents(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getStudents(formState.pageSize, page);
      }
    }
  };

  const handleAddStudent = () => {
    let postData = {
      students: selectedStudents
    };

    serviceProviders
      .serviceProviderForPostRequest(ACTIVITY_CREATE_BATCH_URL, postData)
      .then(res => {
        setSeletedStudent([]);
        props.getLatestData();
        props.closeModal();
      })
      .catch(error => {
        setSeletedStudent([]);
        props.closeModal();
      });
  };

  const handleFilterChange = event => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [event.target.name]: event.target.value
      }
    }));
    event.persist();
  };

  /** Columns to show in table */
  const column = [
    {
      name: "Student Name",
      sortable: true,
      cell: row => `${row.individual.first_name} ${row.individual.last_name}`
    },
    { name: "Stream", sortable: true, selector: "individual.stream.name" },
    { name: "Mobile No.", sortable: true, selector: "phone" }
  ];

  return (
    <Dialog
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.showModal}
      onClose={() => props.closeModal()}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={props.showModal}>
        <div className={classes.paper}>
          <Typography variant={"h2"} className={classes.textMargin}>
            {genericConstants.ADD_STUDENT_TO_ACTIVITY_BATCH}
          </Typography>
          <div className={classes.editDialogue}>
            <Grid item xs={12}>
              <Grid>
                <Grid item xs={12} className={classes.formgrid}>
                  <Card className={styles.filterButton}>
                    <CardContent className={classes.Cardtheming}>
                      <Grid
                        className={classes.filterOptions}
                        container
                        spacing={1}
                      >
                        <Grid item className={classes.paddingDate}>
                          <Autocomplete
                            id="stream-dropdown"
                            options={formState.streams}
                            className={classes.autoCompleteField}
                            getOptionLabel={option => option.name}
                            onChange={(event, value) =>
                              handleChangeAutoComplete(
                                ACTIVITY_BATCH_STREAM_FILTER,
                                event,
                                value
                              )
                            }
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
                        <Grid item className={classes.paddingDate}>
                          <TextField
                            label="Student Name"
                            placeholder="Student Name"
                            variant="outlined"
                            value={
                              formState.filterDataParameters[
                                ACTIVITY_BATCH_STUDENT_FILTER
                              ] || ""
                            }
                            name={ACTIVITY_BATCH_STUDENT_FILTER}
                            className={classes.autoCompleteField}
                            onChange={handleFilterChange}
                          />
                        </Grid>
                        <Grid item className={classes.paddingDate}>
                          <TextField
                            label="Mobile Number"
                            placeholder="Mobile Number"
                            variant="outlined"
                            value={
                              formState.filterDataParameters[
                                ACTIVITY_BATCH_MOBILE_FILTER
                              ] || ""
                            }
                            name={ACTIVITY_BATCH_MOBILE_FILTER}
                            className={classes.autoCompleteField}
                            onChange={handleFilterChange}
                          />
                        </Grid>
                        {/* </Grid> */}
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
                      onSelectedRowsChange={handleRowChange}
                      noDataComponent="No eligible student data found"
                    />
                  ) : (
                    <Spinner />
                  )}
                  <Card className={styles.noBorderNoShadow}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item className={classes.filterButtonsMargin}>
                          <YellowButton
                            type="submit"
                            color="primary"
                            variant="contained"
                            onClick={handleAddStudent}
                            disabled={selectedStudents.length <= 0}
                          >
                            {genericConstants.ADD_STUDENT_TO_ACTIVITY_BATCH}
                          </YellowButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Fade>
    </Dialog>
  );
};

export default AddEditActivityBatches;
