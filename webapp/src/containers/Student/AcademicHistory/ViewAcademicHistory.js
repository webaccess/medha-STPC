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

import styles from "./AcademicHistory.module.css";
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
import DeleteAcademicHistory from "./DeleteAcademicHistory";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import LoaderContext from "../../../context/LoaderContext";
import { string } from "prop-types";
import auth from "../../../components/Auth";

const ViewAcademicHistory = props => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  const history = useHistory();
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);

  const [formState, setFormState] = useState({
    dataToShow: [],
    academicHistory: [],
    academicHistoryFilters: [],
    filterDataParameters: {},
    isFilterSearch: false,
    /** This is when we return from edit page */
    isDataEdited: props["location"]["fromEditAcademicHistory"]
      ? props["location"]["isDataEdited"]
      : false,
    editedData: props["location"]["fromEditAcademicHistory"]
      ? props["location"]["editedData"]
      : {},
    fromEditAcademicHistory: props["location"]["fromEditAcademicHistory"]
      ? props["location"]["fromEditAcademicHistory"]
      : false,
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddAcademicHistory"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddAcademicHistory"]
      ? props["location"]["addedData"]
      : {},
    fromAddAcademicHistory: props["location"]["fromAddAcademicHistory"]
      ? props["location"]["fromAddAcademicHistory"]
      : false,
    /** This is for delete */
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showModalDelete: false,
    /** Pagination and sortinig data */
    isDataLoading: false,
    sortAscending: true
  });

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

  const STUDENT_ACADEMIC_YEAR_URL =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_STUDENTS_INDIVIDUAL_URL +
    `/${studentInfo}/` +
    strapiConstants.STRAPI_STUDENT_ACADEMIC_HISTORY;

  const ACADEMIC_YEAR_FILTER = "academic_year.name_contains";

  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(STUDENT_ACADEMIC_YEAR_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          academicHistoryFilters: res.data.result
        }));
      })
      .catch(error => {
        console.log("error", error);
      });

    getAcademicHistory();
  }, []);

  /** This seperate function is used to get the Academic history data*/
  const getAcademicHistory = async (params = null) => {
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));

    await serviceProviders
      .serviceProviderForGetRequest(STUDENT_ACADEMIC_YEAR_URL, params)
      .then(res => {
        formState.dataToShow = [];
        setFormState(formState => ({
          ...formState,
          academicHistory: res.data.result,
          dataToShow: res.data.result,
          isDataLoading: false
        }));
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async () => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getAcademicHistory(formState.filterDataParameters);
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
    getAcademicHistory();
  };

  const editCell = data => {
    history.push({
      pathname: routeConstants.EDIT_ACADEMIC_HISTORY,
      editAcademicHistory: true,
      dataForEdit: data
    });
  };

  const isDeleteCellCompleted = (status, message) => {
    formState.isDataDeleted = status;
    if (typeof message === typeof "") {
      if (status) {
        setAlert(() => ({
          isOpen: true,
          message: "Academic History " + message + " is deleted",
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
        academicYear: event.target.getAttribute("value")
      },
      showModalDelete: true
    }));
    setLoaderStatus(false);
  };

  const handleFilterChangeForAcademicHistoryField = event => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [ACADEMIC_YEAR_FILTER]: event.target.value
      }
    }));
    event.persist();
  };

  // const handleChangeAutoComplete = (filterName, event, value) => {
  //   if (value === null) {
  //     delete formState.filterDataParameters[filterName];
  //     //restoreData();
  //   } else {
  //     formState.filterDataParameters[filterName] = value["id"];
  //   }
  // };

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
      getAcademicHistory();
    }
  };

  /** Columns to show in table */
  const column = [
    { name: "Academic Year", sortable: true, selector: "academic_year.name" },
    { name: "Education Year", sortable: true, selector: "education_year" },
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
              value={cell.academic_year.name}
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

  const handleAddAcademicHistoryClick = () => {
    history.push({
      pathname: routeConstants.ADD_ACADEMIC_HISTORY
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
              onClick={handleAddAcademicHistoryClick}
              disableElevation
              to={routeConstants.ADD_ACADEMIC_HISTORY}
              startIcon={<AddCircleOutlineOutlinedIcon />}
            >
              {genericConstants.ADD_ACADEMIC_HISTORY_TEXT}
            </GreenButton>
          </Grid>

          <Grid item xs={12} className={classes.formgrid}>
            {/** Error/Success messages to be shown for edit */}
            {formState.fromEditAcademicHistory && formState.isDataEdited ? (
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
                  Academic History edited successfully.
                  {/* {genericConstants.ALERT_SUCCESS_DATA_EDITED_MESSAGE} */}
                </Alert>
              </Collapse>
            ) : null}
            {formState.fromEditAcademicHistory && !formState.isDataEdited ? (
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
                  Error in editing Academic History .
                  {/* {genericConstants.ALERT_ERROR_DATA_EDITED_MESSAGE} */}
                </Alert>
              </Collapse>
            ) : null}

            {/** Error/Success messages to be shown for add */}
            {formState.fromAddAcademicHistory && formState.isDataAdded ? (
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
                  Academic History added successfully.
                  {/* {genericConstants.ALERT_SUCCESS_DATA_ADDED_MESSAGE} */}
                </Alert>
              </Collapse>
            ) : null}
            {formState.fromAddAcademicHistory && !formState.isDataAdded ? (
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
                  Error in adding Academic History.
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
                      label="Academic Year"
                      margin="normal"
                      variant="outlined"
                      value={
                        formState.filterDataParameters[ACADEMIC_YEAR_FILTER] ||
                        ""
                      }
                      placeholder="Academic Year"
                      className={classes.autoCompleteField}
                      onChange={handleFilterChangeForAcademicHistoryField}
                    />
                    {/* <Autocomplete
                      id="combo-box-demo"
                      options={formState.academicHistoryFilters}
                      className={classes.autoCompleteField}
                      getOptionLabel={option => option.academic_year.name}
                      onChange={(event, value) =>
                        handleChangeAutoComplete(
                          ACADEMIC_YEAR_FILTER,
                          event,
                          value
                        )
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Academic Year"
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
              pagination={false}
              selectableRows={false}
              noDataComponent="No Academic History found"
            />
            <DeleteAcademicHistory
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

export default ViewAcademicHistory;
