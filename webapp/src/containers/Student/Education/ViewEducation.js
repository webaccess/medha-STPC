import React, { useState, useEffect, useContext } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Collapse,
  IconButton
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import _ from "lodash";
import styles from "./Education.module.css";
import useStyles from "../CommonStyles/ViewStyles.js";
import * as serviceProviders from "../../../api/Axios";
import * as routeConstants from "../../../constants/RouteConstants";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import * as formUtilities from "../../../utilities/FormUtilities";
import {
  Table,
  Spinner,
  GreenButton,
  YellowButton,
  GrayButton,
  Alert,
  Auth,
  EditGridIcon,
  DeleteGridIcon
} from "../../../components";
import DeleteEducation from "./DeleteEducation";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import LoaderContext from "../../../context/LoaderContext";

const ViewEducation = props => {
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
    responseError: props["location"]["error"] ? props["location"]["error"] : "",
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
    sortAscending: true
  });
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);

  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: ""
  });

  const studentInfo =
    Auth.getUserInfo() !== null &&
    Auth.getUserInfo().role.name === roleConstants.STUDENT
      ? Auth.getUserInfo().studentInfo.contact.id
      : Auth.getStudentIdFromCollegeAdmin();
  const STUDENT_EDUCATION_URL =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_STUDENTS_INDIVIDUAL_URL +
    `/${studentInfo}/` +
    strapiConstants.STRAPI_STUDENT_EDUCATION;
  const EDUCATION_FILTER = "qualification_contains";

  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(STUDENT_EDUCATION_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          educationFilter: res.data.result
        }));
      })
      .catch(error => {
        console.log("error", error);
      });

    getEducationData(10, 1);
  }, []);

  /** This seperate function is used to get the education data*/
  const getEducationData = async (pageSize, page, params = null) => {
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
      .serviceProviderForGetRequest(STUDENT_EDUCATION_URL, params)
      .then(res => {
        res.data.result.filter(education => {
          genericConstants.QUALIFICATION_LIST.filter(qualification => {
            if (qualification.id === education.qualification) {
              education.qualification = qualification.name;
            }
            return qualification;
          });
          return education;
        });
        formState.dataToShow = [];
        setFormState(formState => ({
          ...formState,
          educations: res.data.result,
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
      await getEducationData(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getEducationData(perPage, page);
      }
    }
  };

  const handlePageChange = async page => {
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
    getEducationData(formState.pageSize, 1);
  };

  const editCell = data => {
    history.push({
      pathname: routeConstants.EDIT_EDUCATION,
      editEducation: true,
      dataForEdit: data
    });
  };

  const isDeleteCellCompleted = (status, message) => {
    formState.isDataDeleted = status;
    if (typeof message === typeof "") {
      if (status) {
        setAlert(() => ({
          isOpen: true,
          message: "Education " + message + " is deleted",
          severity: "success"
        }));
      } else {
        setAlert(() => ({
          isOpen: true,
          message: message,
          severity: "error"
        }));
      }
    }
  };

  const deleteCell = event => {
    setLoaderStatus(true);
    setFormState(formState => ({
      ...formState,
      dataToDelete: {
        id: event.target.id,
        education: event.target.getAttribute("value")
      },
      showModalDelete: true
    }));
    setLoaderStatus(false);
  };

  const handleFilterChangeForQualificationField = event => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [EDUCATION_FILTER]: event.target.value
      }
    }));
    event.persist();
  };

  /** This is used to handle the close modal event */
  const handleCloseDeleteModal = () => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setFormState(formState => ({
      ...formState,
      isDataDeleted: false,
      showModalDelete: false
    }));
    if (formState.isDataDeleted) {
      getEducationData(formState.pageSize, formState.page);
    }
  };

  /** Columns to show in table */
  const column = [
    {
      name: "Year Of Passing",
      sortable: true,
      selector: "year_of_passing.name"
    },
    {
      name: "Qualification",
      sortable: true,
      cell: cell =>
        cell.qualification == "other"
          ? cell.other_qualification
          : cell.qualification
    },
    {
      name: "Board",
      sortable: true,
      cell: cell =>
        cell.board
          ? cell.board.name === "Other"
            ? cell.other_board
            : cell.board.name
          : "-"
    },
    { name: "Percentage", sortable: true, selector: "percentage" },
    {
      name: "Pursuing",
      sortable: true,
      selector: "pursuing",
      cell: cell => (cell.pursuing ? "Yes" : "No")
    },
    {
      name: "Institute",
      sortable: true,
      cell: cell => (cell.institute ? cell.institute : "-")
    },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <EditGridIcon
              id={cell.id}
              value={cell.name}
              onClick={() => editCell(cell)}
            />
          </div>
          <div className={classes.PaddingActionButton}>
            <DeleteGridIcon
              id={cell.id}
              value={cell.qualification}
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

  const handleAddEducationClick = () => {
    history.push({
      pathname: routeConstants.ADD_EDUCATION
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
                  Education edited successfully.
                  {/* {genericConstants.ALERT_SUCCESS_DATA_EDITED_MESSAGE} */}
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
                  {formState.responseError}
                  {/* {genericConstants.ALERT_ERROR_DATA_EDITED_MESSAGE} */}
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
                  Education added successfully.
                  {/* {genericConstants.ALERT_SUCCESS_DATA_ADDED_MESSAGE} */}
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
                  {formState.responseError}
                  {/* {genericConstants.ALERT_ERROR_DATA_ADDED_MESSAGE} */}
                </Alert>
              </Collapse>
            ) : null}
            <AlertAPIResponseMessage />
            <Card className={styles.filterButton}>
              <CardContent className={classes.Cardtheming}>
                <Grid className={classes.filterOptions} container spacing={1}>
                  <Grid item>
                    <TextField
                      label="Qualification"
                      margin="normal"
                      variant="outlined"
                      value={
                        formState.filterDataParameters[EDUCATION_FILTER] || ""
                      }
                      placeholder="Qualification"
                      className={classes.autoCompleteField}
                      onChange={handleFilterChangeForQualificationField}
                    />
                    {/* <Autocomplete
                      id="combo-box-demo"
                      options={formState.educationFilter}
                      className={classes.autoCompleteField}
                      getOptionLabel={option => option.qualification}
                      onChange={(event, value) =>
                        handleChangeAutoComplete(EDUCATION_FILTER, event, value)
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Qualification"
                          className={classes.autoCompleteField}
                          variant="outlined"
                        />
                      )}
                    /> */}
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
              editEvent={editCell}
              deleteEvent={deleteCell}
              progressPending={formState.isDataLoading}
              paginationTotalRows={formState.totalRows}
              paginationRowsPerPageOptions={[10, 20, 50]}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              noDataComponent="No education details found"
            />
            <DeleteEducation
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              data={formState.dataToDelete}
              deleteEvent={isDeleteCellCompleted}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ViewEducation;
