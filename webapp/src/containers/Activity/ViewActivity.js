import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Tooltip,
  Collapse,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import styles from "./Activity.module.css";
import useStyles from "./ViewActivityStyles.js";
import * as serviceProviders from "../../api/Axios";
import * as routeConstants from "../../constants/RouteConstants";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import * as genericConstants from "../../constants/GenericConstants";
import * as formUtilities from "../../Utilities/FormUtilities";
import {
  Table,
  Spinner,
  GreenButton,
  YellowButton,
  GrayButton,
  Alert,
  Auth,
} from "../../components";
// import DeleteActivity from "./DeleteActivity";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import moment from "moment";
import XLSX from "xlsx";

const ACTIVITY_FILTER = "id";

const url = () => {
  const user = Auth.getUserInfo() ? Auth.getUserInfo() : null;
  const role = user ? user.role : null;
  const roleName = role ? role.name : null;
  let url;
  if (roleName === "Medha Admin") {
    url = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY;
  }

  if (roleName === "College Admin") {
    const college = user ? user.college : null;
    const collegeId = college ? college.id : null;
    url =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_COLLEGES +
      `/${collegeId}/` +
      strapiConstants.STRAPI_COLLEGE_ACTIVITY;
  }
  return url;
};

const ViewActivity = (props) => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  let history = useHistory();
  const [formState, setFormState] = useState({
    dataToShow: [],
    activities: [],
    activityFilter: [],
    filterDataParameters: {},
    isFilterSearch: false,
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
  });

  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    const URL = url();
    serviceProviders
      .serviceProviderForGetRequest(URL)
      .then((res) => {
        setFormState((formState) => ({
          ...formState,
          activityFilter: res.data.result,
        }));
      })
      .catch((error) => {
        console.log("error", error);
      });

    getActivityData(10, 1);
  }, []);

  /** This seperate function is used to get the Activity data*/
  const getActivityData = async (pageSize, page, params = null) => {
    const URL = url();
    if (params !== null && !formUtilities.checkEmpty(params)) {
      let defaultParams = {
        page: page,
        pageSize: pageSize,
      };
      Object.keys(params).map((key) => {
        defaultParams[key] = params[key];
      });
      params = defaultParams;
    } else {
      params = {
        page: page,
        pageSize: pageSize,
      };
    }
    setFormState((formState) => ({
      ...formState,
      isDataLoading: true,
    }));

    await serviceProviders
      .serviceProviderForGetRequest(URL, params)
      .then((res) => {
        formState.dataToShow = [];
        setFormState((formState) => ({
          ...formState,
          activities: res.data.result,
          dataToShow: res.data.result,
          pageSize: res.data.pageSize,
          totalRows: res.data.rowCount,
          page: res.data.page,
          pageCount: res.data.pageCount,
          isDataLoading: false,
        }));
      })
      .catch((error) => {
        console.log("error", error);
      });
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

  const handlePageChange = async (page) => {
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
    setFormState((formState) => ({
      ...formState,
      isFilterSearch: false,
      /** Clear all filters */
      filterDataParameters: {},
      /** Turns on the spinner */
      isDataLoading: true,
    }));
    /**Need to confirm this thing for resetting the data */
    restoreData();
  };

  const restoreData = () => {
    getActivityData(formState.pageSize, 1);
  };

  const editCell = (data) => {
    history.push({
      pathname: routeConstants.EDIT_ACTIVITY,
      editActivity: true,
      dataForEdit: data,
    });
  };

  const isDeleteCellCompleted = (status) => {
    formState.isDataDeleted = status;
  };

  const deleteCell = (event) => {
    setFormState((formState) => ({
      ...formState,
      dataToDelete: { id: event.target.id },
      showModalDelete: true,
    }));
  };

  const viewCell = (data) => {
    history.push({
      pathname: routeConstants.VIEW_ACTIVITY,
      dataForView: data.id,
    });
  };

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
    }
  };

  /** This is used to handle the close modal event */
  const handleCloseDeleteModal = () => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setFormState((formState) => ({
      ...formState,
      isDataDeleted: false,
      showModalDelete: false,
    }));
    if (formState.isDataDeleted) {
      getActivityData(formState.pageSize, formState.page);
    }
  };

  /**
   * Redirect to Activity batch UI for given activity
   */
  const handleManageActivityBatchClick = (activity) => {
    const manageActivityBatchURL = `/manage-activity-batch/${activity.id}`;
    history.push(manageActivityBatchURL);
  };

  const handleClickDownloadStudents = (activity) => {
    const URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY +
      `/${activity.id}/download`;
    serviceProviders
      .serviceProviderForGetRequest(URL)
      .then(({ data }) => {
        let wb = XLSX.utils.book_new();

        /**
         * Create worksheet for every batch
         * Add students list for respective batch
         */
        const headers = ["Roll Number", "Student Name", "Stream"];
        data.result.forEach((d) => {
          const { workSheetName, workSheetData } = d;
          let ws = XLSX.utils.json_to_sheet(workSheetData, ...headers);
          wb.SheetNames.push(workSheetName);
          wb.Sheets[workSheetName] = ws;
        });

        XLSX.writeFile(wb, "students.xlsx");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteActivity = (activity) => {
    const url = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY;
    const activityId = activity.id;
    serviceProviders
      .serviceProviderForDeleteRequest(url, activityId)
      .then(() => {
        setAlert(() => ({
          isOpen: true,
          message: "Success",
          severity: "success",
        }));
        getActivityData(10, 1);
      })
      .catch(({ response }) => {
        setAlert(() => ({
          isOpen: true,
          message: response.data.message,
          severity: "error",
        }));
      });
  };

  /** Columns to show in table */
  const column = [
    { name: "Training and Activities", sortable: true, selector: "title" },
    { name: "Activity Type", sortable: true, selector: "activity_type" },
    {
      name: "Streams",
      sortable: true,
      selector: (row) => `${row.streams.map((s) => ` ${s.name}`)}`,
    },
    { name: "College", sortable: true, selector: "college.name" },
    {
      name: "Date",
      sortable: true,
      selector: (row) => `${moment(row.start_date_time).format("DD MMM YYYY")}`,
    },
    {
      name: "Action",
      cell: (cell) => (
        <div style={{ display: "flex", direction: "flex-row" }}>
          <div style={{ marginLeft: "8px" }}>
            <Tooltip title="Manage Activity Batch" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                onClick={() => handleManageActivityBatchClick(cell)}
                style={{
                  color: "green",
                  fontSize: "19px",
                  cursor: "pointer",
                }}
              >
                group
              </i>
            </Tooltip>
          </div>
          <div style={{ marginLeft: "8px" }}>
            <Tooltip title="Edit" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                onClick={() => editCell(cell)}
                style={{
                  color: "green",
                  fontSize: "19px",
                  cursor: "pointer",
                }}
              >
                edit
              </i>
            </Tooltip>
          </div>
          <div style={{ marginLeft: "8px" }}>
            <Tooltip title="View" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                onClick={() => viewCell(cell)}
                style={{
                  color: "green",
                  fontSize: "19px",
                  cursor: "pointer",
                }}
              >
                view_headline
              </i>
            </Tooltip>
          </div>
          <div style={{ marginLeft: "8px" }}>
            <Tooltip title="Download Students" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                onClick={() => handleClickDownloadStudents(cell)}
                style={{
                  color: "green",
                  fontSize: "19px",
                  cursor: "pointer",
                }}
              >
                get_app
              </i>
            </Tooltip>
          </div>
          <div style={{ marginLeft: "8px" }}>
            <Tooltip title="Delete" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                onClick={() => handleDeleteActivity(cell)}
                style={{
                  color: "red",
                  fontSize: "19px",
                  cursor: "pointer",
                }}
              >
                delete_outline
              </i>
            </Tooltip>
          </div>
        </div>
      ),
      button: true,
      conditionalCellStyles: [],
      width: "20%",
    },
  ];

  const handleAddActivityClick = () => {
    history.push({
      pathname: routeConstants.ADD_ACTIVITY,
      addActivity: true,
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
      </Grid>

      <Grid item xs={12} className={classes.formgrid}>
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
              {genericConstants.ALERT_SUCCESS_DATA_EDITED_MESSAGE}
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
              {genericConstants.ALERT_ERROR_DATA_EDITED_MESSAGE}
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
              {genericConstants.ALERT_SUCCESS_DATA_ADDED_MESSAGE}
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
              {genericConstants.ALERT_ERROR_DATA_ADDED_MESSAGE}
            </Alert>
          </Collapse>
        ) : null}
        <AlertAPIResponseMessage />
        <Card className={styles.filterButton}>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  options={formState.activityFilter}
                  className={classes.autoCompleteField}
                  getOptionLabel={(option) => option.title}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(ACTIVITY_FILTER, event, value)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Activity Title"
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
                  onClick={(event) => {
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
              noDataComponent="No Activity details found"
              style={{ overflowX: "hidden !important" }}
            />
          ) : (
            <div className={classes.noDataMargin}>
              No Activity details found
            </div>
          )
        ) : (
          <Spinner />
        )}
        {/* <DeleteActivity
          showModal={formState.showModalDelete}
          closeModal={handleCloseDeleteModal}
          id={formState.dataToDelete["id"]}
          deleteEvent={isDeleteCellCompleted}
        /> */}
      </Grid>
    </Grid>
  );
};

export default ViewActivity;
