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
import DeleteActivityBatch from "./DeleteActivityBatch";
import styles from "../Activity.module.css";
import useStyles from "../ViewActivityStyles.js";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as formUtilities from "../../../utilities/FormUtilities";
import {
  Table,
  Spinner,
  GreenButton,
  YellowButton,
  GrayButton,
  Alert,
  DeleteGridIcon,
  EditGridIcon,
  Breadcrumbs
} from "../../../components";
// import DeleteActivityBatch from "./DeleteActivityBatch";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import LoaderContext from "../../../context/LoaderContext";

const ACTIVITY_BATCH_FILTER = "name_contains";

const ViewActivityBatches = props => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  let history = useHistory();

  const [formState, setFormState] = useState({
    dataToShow: [],
    batches: [],
    batchesFilter: [],
    filterDataParameters: {},
    isFilterSearch: false,
    /** This is when we return from edit page */
    isDataEdited: props["location"]["fromEditActivityBatch"]
      ? props["location"]["isDataEdited"]
      : false,
    editedData: props["location"]["fromEditActivityBatch"]
      ? props["location"]["editedData"]
      : {},
    fromEditActivityBatch: props["location"]["fromEditActivityBatch"]
      ? props["location"]["fromEditActivityBatch"]
      : false,
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddActivityBatch"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddActivityBatch"]
      ? props["location"]["addedData"]
      : {},
    fromAddActivityBatch: props["location"]["fromAddActivityBatch"]
      ? props["location"]["fromAddActivityBatch"]
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
    isActivityExist: true
  });

  const { activity } = props.match.params;
  const [activityDetails, setActivityDetails] = useState(null);

  const ACTIVITY_URL =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_ACTIVITY +
    `/${activity}`;

  const ACTIVITY_BATCH_URL =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_INDIVIDUAL_ACTIVITY +
    `/${activity}/` +
    strapiConstants.STRAPI_ACTIVITIES_BATCHES_URL;

  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(ACTIVITY_URL)
      .then(({ data }) => {
        if (data.result == null) {
          history.push("/404");
        } else {
          setActivityDetails(data.result);
        }
      })
      .catch(() => {
        history.push("/404");
      });
  }, []);

  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(ACTIVITY_BATCH_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          batchesFilter: res.data.result
        }));
      })
      .catch(error => {
        console.log("error", error);
      });

    getActivityBatches(10, 1);
  }, []);

  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: ""
  });

  /** This seperate function is used to get the Activity Batches data*/
  const getActivityBatches = async (pageSize, page, params = null) => {
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
      .serviceProviderForGetRequest(ACTIVITY_BATCH_URL, params)
      .then(res => {
        formState.dataToShow = [];
        setFormState(formState => ({
          ...formState,
          batches: res.data.result,
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
      await getActivityBatches(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getActivityBatches(perPage, page);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getActivityBatches(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getActivityBatches(formState.pageSize, page);
      }
    }
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getActivityBatches(perPage, page, formState.filterDataParameters);
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
    getActivityBatches(formState.pageSize, 1);
  };

  /**
   * Redirect to Activity batch UI for given activity
   */
  const handleEditActivityBatch = activityBatch => {
    const url = `/edit-activity-batch/${activity}`;
    history.push({
      pathname: url,
      editActivityBatch: true,
      dataForEdit: activityBatch
    });
  };

  const handleCloseDeleteModal = () => {
    /** This restores all the data when we close the modal */
    setFormState(formState => ({
      ...formState,
      isDataDeleted: false,
      showModalDelete: false
    }));
    if (formState.isDataDeleted) {
      getActivityBatches(formState.pageSize, formState.page);
    } else {
    }
  };
  const isDeleteCellCompleted = (status, activityBatch) => {
    formState.isDataDeleted = status;
    if (status === true) {
      setAlert(() => ({
        isOpen: true,
        message: `Activity Batch ${activityBatch.name} Deleted Successfully`,
        severity: "success"
      }));
    } else if (status === false) {
      setAlert(() => ({
        isOpen: true,
        message: activityBatch.response.data.message,
        severity: "error"
      }));
    }
  };

  const handleDeleteActivityBatch = activityBatch => {
    setFormState(formState => ({
      ...formState,
      dataToDelete: { ...activityBatch },
      showModalDelete: true
    }));
  };

  // const handleDeleteActivityBatch = activityBatch => {
  //   const url =
  //     strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACTIVITY_BATCH_URL;
  //   const activityBatchId = activityBatch.id;
  //   serviceProviders
  //     .serviceProviderForDeleteRequest(url, activityBatchId)
  //     .then(() => {
  //       setAlert(() => ({
  //         isOpen: true,
  //         message: `Batch ${activityBatch.name} deleted successfully`,
  //         severity: "success"
  //       }));
  //       getActivityBatches(10, 1);
  //     })
  //     .catch(({ response }) => {
  //       setAlert(() => ({
  //         isOpen: true,
  //         message: response.data.message,
  //         severity: "error"
  //       }));
  //     });
  // };

  const handleFilterChange = event => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [ACTIVITY_BATCH_FILTER]: event.target.value
      }
    }));
    event.persist();
  };
  /** Columns to show in table */
  const column = [
    { name: "Batch", sortable: true, selector: "name" },
    { name: "Activity", sortable: true, selector: "activity.title" },
    {
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <EditGridIcon
              id={cell.id}
              value={cell.name}
              onClick={() => {
                handleEditActivityBatch(cell);
              }}
              title="Manage Batch"
            />
          </div>
          <div className={classes.PaddingActionButton}>
            <DeleteGridIcon
              id={cell.id}
              value={cell.title}
              onClick={() => handleDeleteActivityBatch(cell)}
            />
          </div>
        </div>
      ),
      button: true,
      conditionalCellStyles: [],
      width: "200px"
    }
  ];

  const handleAddActivityClick = () => {
    const addActivityBatchURL = `/add-activity-batch/${activity}`;
    history.push({
      pathname: addActivityBatchURL,
      editActivityBatch: false,
      dataForEdit: null
    });
  };

  const breadcrumbs = [
    { title: "Activity", href: "/manage-activity" },
    {
      title: `${activityDetails ? activityDetails.title : ""} Batches`,
      href: "/"
    }
  ];

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
      <div className={classes.breadCrumbs}>
        {activityDetails ? <Breadcrumbs list={breadcrumbs} /> : null}
      </div>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {`${activityDetails ? activityDetails.title : ""} batches`}
        </Typography>

        <GreenButton
          variant="contained"
          color="primary"
          onClick={handleAddActivityClick}
          disableElevation
          to={`/add-activity-batch/${activity}`}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          {genericConstants.ADD_ACTIVITY_BATCHES}
        </GreenButton>
      </Grid>

      <Grid item xs={12} className={classes.formgrid}>
        {/** Error/Success messages to be shown for edit */}
        {formState.fromEditActivityBatch && formState.isDataEdited ? (
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
              Batch
              {formState.editedData ? ` ${formState.editedData.name} ` : " "}
              has been updated successfully.
            </Alert>
          </Collapse>
        ) : null}
        {formState.fromEditActivityBatch && !formState.isDataEdited ? (
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
              An error has occured while updating activity batch. Kindly, try
              again.
            </Alert>
          </Collapse>
        ) : null}

        {/** Error/Success messages to be shown for add */}
        {formState.fromAddActivityBatch && formState.isDataAdded ? (
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
              Batch {formState.addedData ? `${formState.addedData.name} ` : " "}
              has been added successfully.
            </Alert>
          </Collapse>
        ) : null}
        {formState.fromAddActivityBatch && !formState.isDataAdded ? (
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
              An error has occured while adding activity batch. Kindly, try
              again.
            </Alert>
          </Collapse>
        ) : null}

        {/* If there is error from any api show here */}
        <AlertAPIResponseMessage />

        <Card className={styles.filterButton}>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <TextField
                  label="Batch Name"
                  placeholder="Batch Name"
                  variant="outlined"
                  value={
                    formState.filterDataParameters[ACTIVITY_BATCH_FILTER] || ""
                  }
                  name={ACTIVITY_BATCH_FILTER}
                  className={classes.autoCompleteField}
                  onChange={handleFilterChange}
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
          noDataComponent="No Activity Batch details found"
        />
      </Grid>
      <DeleteActivityBatch
        showModal={formState.showModalDelete}
        closeModal={handleCloseDeleteModal}
        activityBatch={formState.dataToDelete}
        deleteEvent={isDeleteCellCompleted}
      />
    </Grid>
  );
};

export default ViewActivityBatches;
