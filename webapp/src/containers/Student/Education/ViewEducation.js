import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Collapse,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import styles from "./Education.module.css";
import useStyles from "./ViewEducationStyles";
import * as serviceProviders from "../../../api/Axios";
import * as routeConstants from "../../../constants/RouteConstants";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as formUtilities from "../../../Utilities/FormUtilities";
import {
  Table,
  Spinner,
  GreenButton,
  YellowButton,
  GrayButton,
  Alert,
  Auth,
} from "../../../components";
import DeleteEducation from "./DeleteEducation";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";

const studentInfo = Auth.getUserInfo() ? Auth.getUserInfo().studentInfo : null;
const studentId = studentInfo ? studentInfo.id : null;
console.log(studentId);
const STUDENT_EDUCATION_URL =
  strapiConstants.STRAPI_DB_URL +
  strapiConstants.STRAPI_STUDENTS +
  `/${studentId}/education`;
const EDUCATION_FILTER = "id";

const ViewEducation = (props) => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  const history = useHistory();
  const [formState, setFormState] = useState({
    dataToShow: [],
    educations: [],
    educationFilter: [],
    filterDataParameters: {},
    isFilterSearch: false,
    /** This is when we return from edit page */
    isDataEdited: props["location"]["fromEditEducation"]
      ? props["location"]["isDataEdited"]
      : false,
    editedData: props["location"]["fromEditEducation"]
      ? props["location"]["editedData"]
      : {},
    fromEditEducation: props["location"]["fromEditEducation"]
      ? props["location"]["fromEditEducation"]
      : false,
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddEducation"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddEducation"]
      ? props["location"]["addedData"]
      : {},
    fromAddEducation: props["location"]["fromAddEducation"]
      ? props["location"]["fromAddEducation"]
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

  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(STUDENT_EDUCATION_URL)
      .then((res) => {
        setFormState((formState) => ({
          ...formState,
          educationFilter: res.data.result,
        }));
      })
      .catch((error) => {
        console.log("error", error);
      });

    getEducationData(10, 1);
  }, []);

  /** This seperate function is used to get the education data*/
  const getEducationData = async (pageSize, page, params = null) => {
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
      .serviceProviderForGetRequest(STUDENT_EDUCATION_URL, params)
      .then((res) => {
        formState.dataToShow = [];
        setFormState((formState) => ({
          ...formState,
          educations: res.data.result,
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
      await getEducationData(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getEducationData(perPage, page);
      }
    }
  };

  const handlePageChange = async (page) => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getEducationData(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getEducationData(formState.pageSize, page);
      }
    }
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getEducationData(perPage, page, formState.filterDataParameters);
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
    getEducationData(formState.pageSize, 1);
  };

  const editCell = (data) => {
    history.push({
      pathname: routeConstants.EDIT_EDUCATION,
      editEducation: true,
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
      getEducationData(formState.pageSize, formState.page);
    }
  };

  /** Columns to show in table */
  const column = [
    { name: "Qualification", sortable: true, selector: "qualification" },
    { name: "Board", sortable: true, selector: "board" },
    { name: "Percentage", sortable: true, selector: "percentage" },
    { name: "Year Of Passing", sortable: true, selector: "year_of_passing" },
    /** Columns for edit and delete */
    {
      cell: (cell) => (
        <Tooltip title="Edit" placement="top">
          <i
            className="material-icons"
            id={cell.id}
            value={cell.name}
            onClick={() => editCell(cell)}
            style={{ color: "green", fontSize: "19px" }}
          >
            edit
          </i>
        </Tooltip>
      ),
      button: true,
      conditionalCellStyles: [],
    },
    {
      cell: (cell) => (
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
      conditionalCellStyles: [],
    },
  ];

  const handleAddEducationClick = () => {
    history.push({
      pathname: routeConstants.ADD_EDUCATION,
    });
  };

  console.log(formState.dataToShow);
  return (
    <Card style={{ padding: "8px" }}>
      <CardContent className={classes.Cardtheming}>
        <Grid>
          <Grid item xs={12} className={classes.title}>
            <GreenButton
              variant="contained"
              color="primary"
              onClick={handleAddEducationClick}
              disableElevation
              startIcon={<AddCircleOutlineOutlinedIcon />}
              to={routeConstants.ADD_EDUCATION}
            >
              {genericConstants.ADD_EDUCATION_TEXT}
            </GreenButton>
          </Grid>

          <Grid item xs={12} className={classes.formgrid}>
            {/** Error/Success messages to be shown for edit */}
            {formState.fromEditEducation && formState.isDataEdited ? (
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
            {formState.fromEditEducation && !formState.isDataEdited ? (
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
            {formState.fromAddEducation && formState.isDataAdded ? (
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
            {formState.fromAddEducation && !formState.isDataAdded ? (
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

            <Card className={styles.filterButton}>
              <CardContent className={classes.Cardtheming}>
                <Grid className={classes.filterOptions} container spacing={1}>
                  <Grid item>
                    <Autocomplete
                      id="combo-box-demo"
                      options={formState.educationFilter}
                      className={classes.autoCompleteField}
                      getOptionLabel={(option) => option.qualification}
                      onChange={(event, value) =>
                        handleChangeAutoComplete(EDUCATION_FILTER, event, value)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Qualification"
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
                  noDataComponent="No education details found"
                />
              ) : (
                <div className={classes.noDataMargin}>
                  No education details found
                </div>
              )
            ) : (
              <Spinner />
            )}
            <DeleteEducation
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              id={formState.dataToDelete["id"]}
              deleteEvent={isDeleteCellCompleted}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ViewEducation;
