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
  CardActions,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import styles from "../Activity.module.css";
import useStyles from "../ViewActivityStyles.js";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import {
  Table,
  Spinner,
  YellowButton,
  GrayButton,
  GreenButton,
  Alert,
} from "../../../components";
import { useHistory } from "react-router-dom";
import { uniqBy, get } from "lodash";
import AddActivityBatchSchema from "./AddActivityBatchSchema.js";
import AddStudentToActivityBatch from "./AddStudentToActivityBatch.js";
import DeleteActivityBatchStudents from "./DeleteActivityBatchStudents.js";
import DeleteIcon from "@material-ui/icons/Delete";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

const ACTIVITY_BATCH_STUDENT_FILTER = "student_id";
const ACTIVITY_BATCH_STREAM_FILTER = "stream_id";

const AddEditActivityBatches = (props) => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  let history = useHistory();

  const activityBatchName = "name";
  const [formState, setFormState] = useState({
    dataToShow: [],
    students: [],
    studentsFilter: [],
    filterDataParameters: {},
    isFilterSearch: false,
    isEditActivityBatch: props["editActivityBatch"]
      ? props["editActivityBatch"]
      : false,
    dataForEdit: props["editActivityBatch"] ? props["dataForEdit"] : {},

    /** This is for delete */
    isDataDeleted: false,
    dataToDelete: {},
    showModalDelete: false,
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true,
    isActivityExist: true,
    streams: [],
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  const [selectedStudents, setSeletedStudent] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);

  const { activity } = props.activity ? props : props.match.params;
  const ACTIVITY_URL =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_ACTIVITY +
    `/${activity}`;

  const ACTIVITY_BATCH_STUDENTS =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_ACTIVITY +
    `/${activity}/` +
    strapiConstants.STRAPI_STUDENTS;

  const ACTIVITY_CREATE_BATCH_URL =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_ACTIVITY +
    `/${activity}/` +
    strapiConstants.STRAPI_CREATE_ACTIVITY_BATCH_URL;

  const EDIT_ACTIVITY_BATCH_STUDENTS =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_ACTIVITY_BATCH_URL +
    `/${formState.dataForEdit.id}/` +
    strapiConstants.STRAPI_STUDENTS;

  const URL_TO_HIT = formState.isEditActivityBatch
    ? EDIT_ACTIVITY_BATCH_STUDENTS
    : ACTIVITY_BATCH_STUDENTS;

  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(ACTIVITY_URL)
      .then(({ data }) => {
        if (data.result == null) {
          history.push("/404");
        }
      })
      .catch(() => {
        history.push("/404");
      });
  }, []);

  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(URL_TO_HIT)
      .then((res) => {
        setFormState((formState) => ({
          ...formState,
          studentsFilter: res.data.result,
          streams: getStreams(res.data.result),
        }));
      })
      .catch((error) => {
        console.log("error", error);
      });

    getStudents(10, 1);
  }, []);

  /** This seperate function is used to get the Activity Batches data*/
  const getStudents = async (pageSize, page, params = null) => {
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
      .serviceProviderForGetRequest(URL_TO_HIT, params)
      .then((res) => {
        formState.dataToShow = [];
        setFormState((formState) => ({
          ...formState,
          students: res.data.result,
          dataToShow: res.data.result,
          pageSize: res.data.pageSize,
          totalRows: res.data.rowCount,
          page: res.data.page,
          pageCount: res.data.pageCount,
          isDataLoading: false,
          streams: getStreams(res.data.result),
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
      await getStudents(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getStudents(perPage, page);
      }
    }
  };

  const handlePageChange = async (page) => {
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

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getStudents(perPage, page, formState.filterDataParameters);
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
    getStudents(formState.pageSize, 1);
  };

  const getStreams = (data) => {
    const streams = data.map((student) => student.stream);
    return uniqBy(streams, (stream) => stream.id);
  };

  const isDeleteCellCompleted = (status) => {
    formState.isDataDeleted = status;
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
    setFormState((formState) => ({
      ...formState,
      isDataDeleted: false,
      showModalDelete: false,
    }));
    setSeletedStudent([]);
    setClearSelectedRows((val) => ({ clearSelectedRows: !val }));
    if (formState.isDataDeleted) {
      getStudents(formState.pageSize, formState.page);
    }
  };

  const handleDeleteActivityBatchStudent = (student) => {
    setFormState((formState) => ({
      ...formState,
      dataToDelete: [student.id],
      showModalDelete: true,
    }));
  };

  const handleDeleteMultipleStudents = () => {
    setFormState((formState) => ({
      ...formState,
      dataToDelete: selectedStudents,
      showModalDelete: true,
    }));
  };

  const handleVerifyMultipleStudents = (ids) => {
    const studentsToVerify = ids;
    const URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY_BATCH_URL +
      `/${formState.dataForEdit.id}/` +
      strapiConstants.STRAPI_VALIDATE_STUDENT_ACTIVITY_BATCH;

    const postData = {
      students: studentsToVerify,
    };

    serviceProviders
      .serviceProviderForPostRequest(URL, postData)
      .then(() => {
        setSeletedStudent([]);
        setClearSelectedRows((val) => ({ clearSelectedRows: !val }));
        getStudents(formState.pageSize, formState.page);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUnVerifyMultipleStudents = (ids) => {
    const studentsToVerify = ids;
    const URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY_BATCH_URL +
      `/${formState.dataForEdit.id}/` +
      strapiConstants.STRAPI_UNVALIDATE_STUDENT_ACTIVITY_BATCH;

    const postData = {
      students: studentsToVerify,
    };

    serviceProviders
      .serviceProviderForPostRequest(URL, postData)
      .then(() => {
        setSeletedStudent([]);
        setClearSelectedRows((val) => ({ clearSelectedRows: !val }));
        getStudents(formState.pageSize, formState.page);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /** This handle change is used to handle changes to text field */
  const handleChange = (event) => {
    /** TO SET VALUES IN FORMSTATE */
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));

    /** This is used to remove any existing errors if present in text field */
    if (formState.errors.hasOwnProperty(event.target.name)) {
      delete formState.errors[event.target.name];
    }
  };

  const handleRowChange = ({ selectedRows }) => {
    const studentIds = selectedRows.map((student) => student.id);
    setSeletedStudent(studentIds);
  };

  /** This checks if the corresponding field has errors */
  const hasError = (field) => (formState.errors[field] ? true : false);

  /** Handle submit handles the submit and performs all the validations */
  const handleSubmit = (event) => {
    let isValid = false;
    /** Checkif all fields are present in the submitted form */
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      AddActivityBatchSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        AddActivityBatchSchema
      );
      /** Checks if the form is empty */
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        AddActivityBatchSchema
      );
      /** This sets errors by comparing it with the json schema provided */
      formState.errors = formUtilities.setErrors(
        formState.values,
        AddActivityBatchSchema
      );
    }
    if (isValid) {
      /** CALL POST FUNCTION */
      postActivityBatchData();
    } else {
      setFormState((formState) => ({
        ...formState,
        isValid: false,
      }));
    }
    event.preventDefault();
  };

  const postActivityBatchData = async () => {
    let postData = databaseUtilities.addActivityBatch(
      formState.values[activityBatchName],
      selectedStudents
    );

    serviceProviders
      .serviceProviderForPostRequest(ACTIVITY_CREATE_BATCH_URL, postData)
      .then((res) => {
        history.push({
          pathname: `/manage-activity-batch/${activity}`,
          fromAddActivityBatch: true,
          isDataAdded: true,
          addResponseMessage: "",
          addedData: {},
        });
      })
      .catch((error) => {
        history.push({
          pathname: `/manage-activity-batch/${activity}`,
          fromAddActivityBatch: true,
          isDataAdded: false,
          addResponseMessage: "",
          addedData: {},
        });
      });
  };

  /** Columns to show in table */
  let column = [
    {
      name: "Student Name",
      sortable: true,
      cell: (row) => `${row.user.first_name} ${row.user.last_name}`,
    },
    { name: "Stream", sortable: true, selector: "stream.name" },
    { name: "Mobile No.", sortable: true, selector: "user.contact_number" },
  ];

  if (formState.isEditActivityBatch) {
    column.push({
      name: "Action",
      cell: (cell) => (
        <div style={{ display: "flex" }}>
          {!!cell.activityBatch.verified_by_college ? (
            <div style={{ marginLeft: "8px" }}>
              <Tooltip title="Verified Student" placement="top">
                <i
                  className="material-icons"
                  id={cell.id}
                  value={cell.name}
                  onClick={() => handleVerifyMultipleStudents([cell.id])}
                  style={{
                    color: "green",
                    fontSize: "19px",
                    cursor: "pointer",
                  }}
                >
                  check
                </i>
              </Tooltip>
            </div>
          ) : (
            <div style={{ marginLeft: "8px" }}>
              <Tooltip title="Verified Student" placement="top">
                <i
                  className="material-icons"
                  id={cell.id}
                  value={cell.name}
                  onClick={() => handleVerifyMultipleStudents([cell.id])}
                  style={{
                    color: "red",
                    fontSize: "19px",
                    cursor: "pointer",
                  }}
                >
                  check
                </i>
              </Tooltip>
            </div>
          )}
          {!!cell.activityBatch.verified_by_college ? (
            <div style={{ marginLeft: "8px" }}>
              <Tooltip title="Un-Verify Student" placement="top">
                <i
                  className="material-icons"
                  id={cell.id}
                  value={cell.name}
                  onClick={() => handleUnVerifyMultipleStudents([cell.id])}
                  style={{
                    color: "red",
                    fontSize: "19px",
                    cursor: "pointer",
                  }}
                >
                  clear
                </i>
              </Tooltip>
            </div>
          ) : null}

          <div style={{ marginLeft: "8px" }}>
            <Tooltip title="Remove Student" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                onClick={() => handleDeleteActivityBatchStudent(cell)}
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
      width: "200px",
    });
  }

  const AddStudentButton = () => {
    return (
      <div>
        {formState.isEditActivityBatch ? (
          <Card className={styles.noBorderNoShadow}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item className={classes.filterButtonsMargin}>
                  <YellowButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={() => setShowStudentModal(true)}
                  >
                    {genericConstants.ADD_STUDENT_TO_ACTIVITY_BATCH}
                  </YellowButton>
                </Grid>
                <Grid item className={classes.filterButtonsMargin}>
                  <GrayButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    to={`/manage-activity-batch/${activity}`}
                  >
                    {genericConstants.CANCEL_BUTTON_TEXT}
                  </GrayButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : null}
      </div>
    );
  };

  const MultiDeleteStudentButton = () => {
    return (
      <GreenButton
        type="submit"
        color="primary"
        variant="contained"
        onClick={handleDeleteMultipleStudents}
        startIcon={<DeleteIcon />}
        greenButtonChecker={true}
        buttonDisabled={selectedStudents.length <= 0}
      >
        {genericConstants.DELETE_STUDENT_TO_ACTIVITY_BATCH}
      </GreenButton>
    );
  };

  const MultiVerifyStudentButton = () => {
    return (
      <GreenButton
        type="submit"
        color="primary"
        variant="contained"
        onClick={() => handleVerifyMultipleStudents(selectedStudents)}
        startIcon={<VerifiedUserIcon />}
        greenButtonChecker={true}
        buttonDisabled={selectedStudents.length <= 0}
      >
        {genericConstants.VERIFY_STUDENT_TO_ACTIVITY_BATCH}
      </GreenButton>
    );
  };
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.VIEW_ACTIVITY_BATCHES}
        </Typography>
        {formState.isEditActivityBatch ? (
          <>
            <MultiVerifyStudentButton />
            <MultiDeleteStudentButton />
          </>
        ) : null}
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
              {genericConstants.ALERT_SUCCESS_DATA_EDITED_MESSAGE}
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
              {genericConstants.ALERT_ERROR_DATA_EDITED_MESSAGE}
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
              {genericConstants.ALERT_SUCCESS_DATA_ADDED_MESSAGE}
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
              {genericConstants.ALERT_ERROR_DATA_ADDED_MESSAGE}
            </Alert>
          </Collapse>
        ) : null}

        <Card className={styles.filterButton}>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="student-dropdown"
                  options={formState.studentsFilter}
                  className={classes.autoCompleteField}
                  getOptionLabel={(option) =>
                    `${option.user.first_name} ${option.user.last_name}`
                  }
                  onChange={(event, value) =>
                    handleChangeAutoComplete(
                      ACTIVITY_BATCH_STUDENT_FILTER,
                      event,
                      value
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Student Name"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="stream-dropdown"
                  options={formState.streams}
                  className={classes.autoCompleteField}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(
                      ACTIVITY_BATCH_STREAM_FILTER,
                      event,
                      value
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Stream"
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
            <div>
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
                noDataComponent="No Student Details found"
                clearSelectedRows={clearSelectedRows}
              />
            </div>
          ) : (
            <div className={classes.noDataMargin}>No Student details found</div>
          )
        ) : (
          <Spinner />
        )}

        {/* 
          Create Activity Batch UI
        */}
        {!formState.isEditActivityBatch ? (
          <Card className={styles.noBorderNoShadow}>
            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item md={3} xs={4}>
                    <TextField
                      fullWidth
                      id={get(AddActivityBatchSchema[activityBatchName], "id")}
                      label={get(
                        AddActivityBatchSchema[activityBatchName],
                        "label"
                      )}
                      margin="normal"
                      name={activityBatchName}
                      onChange={handleChange}
                      required
                      type={get(
                        AddActivityBatchSchema[activityBatchName],
                        "type"
                      )}
                      value={formState.values[activityBatchName] || ""}
                      error={hasError(activityBatchName)}
                      helperText={
                        hasError(activityBatchName)
                          ? formState.errors[activityBatchName].map((error) => {
                              return error + " ";
                            })
                          : null
                      }
                      variant="outlined"
                      className={classes.elementroot}
                    />
                  </Grid>
                  <Grid item className={classes.filterButtonsMargin}>
                    <YellowButton
                      type="submit"
                      color="primary"
                      variant="contained"
                    >
                      {genericConstants.SAVE_BUTTON_TEXT}
                    </YellowButton>
                  </Grid>
                  <Grid item className={classes.filterButtonsMargin}>
                    <GrayButton
                      type="submit"
                      color="primary"
                      variant="contained"
                      to={`/manage-activity-batch/${activity}`}
                    >
                      {genericConstants.CANCEL_BUTTON_TEXT}
                    </GrayButton>
                  </Grid>
                </Grid>
              </CardContent>
            </form>
          </Card>
        ) : null}

        {/* 
          Add Student Button for edit activity batch
         */}
        <AddStudentButton />
        {showStudentModal ? (
          <AddStudentToActivityBatch
            showModal={showStudentModal}
            closeModal={() => setShowStudentModal(false)}
            activity={activity}
            activityBatch={formState.dataForEdit.id}
            getLatestData={() =>
              getStudents(formState.pageSize, formState.page)
            }
          />
        ) : null}
        <DeleteActivityBatchStudents
          showModal={formState.showModalDelete}
          closeModal={handleCloseDeleteModal}
          id={formState.dataForEdit.id}
          students={formState.dataToDelete}
          deleteEvent={isDeleteCellCompleted}
        />
      </Grid>
    </Grid>
  );
};

export default AddEditActivityBatches;