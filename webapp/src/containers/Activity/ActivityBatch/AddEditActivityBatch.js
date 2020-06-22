import React, { useState, useEffect, useContext } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Collapse,
  IconButton,
  Tooltip
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import styles from "../Activity.module.css";
import useStyles from "../ViewActivityStyles.js";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import * as formUtilities from "../../../utilities/FormUtilities";
import * as databaseUtilities from "../../../utilities/StrapiUtilities";
import {
  Table,
  YellowButton,
  GrayButton,
  GreenButton,
  Alert,
  CustomDateTimePicker,
  DeleteGridIcon,
  Breadcrumbs,
  Spinner
} from "../../../components";
import { useHistory } from "react-router-dom";
import { uniqBy, get } from "lodash";
import AddActivityBatchSchema from "./AddActivityBatchSchema.js";
import AddStudentToActivityBatch from "./AddStudentToActivityBatch.js";
import DeleteActivityBatchStudents from "./DeleteActivityBatchStudents.js";
import DeleteIcon from "@material-ui/icons/Delete";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import TickGridIcon from "../../../components/TickGridIcon";
import CrossGridIcon from "../../../components/CrossGridIcon";
import LoaderContext from "../../../context/LoaderContext";
import moment from "moment";
import auth from "../../../components/Auth";
import { CompassCalibrationOutlined } from "@material-ui/icons";

const ACTIVITY_BATCH_STUDENT_FILTER = "name_contains";
const ACTIVITY_BATCH_STREAM_FILTER = "individual.stream.id";

const AddEditActivityBatches = props => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  const [streams, setStreams] = React.useState([]);
  let history = useHistory();
  const { setLoaderStatus } = useContext(LoaderContext);

  const activityBatchName = "name";
  const dateFrom = "dateFrom";
  const dateTo = "dateTo";
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
    counter: 0
  });

  if (formState.isEditActivityBatch && !formState.counter) {
    if (formState.dataForEdit && formState.dataForEdit[activityBatchName]) {
      formState.values[activityBatchName] =
        formState.dataForEdit[activityBatchName];
    }

    if (formState.dataForEdit && formState.dataForEdit["start_date_time"]) {
      formState.values[dateFrom] = moment(
        formState.dataForEdit["start_date_time"]
      );
    }

    if (formState.dataForEdit && formState.dataForEdit["end_date_time"]) {
      formState.values[dateTo] = moment(formState.dataForEdit["end_date_time"]);
    }
    formState.counter += 1;
  }

  const [selectedStudents, setSeletedStudent] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [activityDetails, setActivityDetails] = useState(null);

  const { activity } = props.activity ? props : props.match.params;
  const STREAMS_URL =
    strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;
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
    `crm-plugin/activity/${activity}/create-activity-batch`;

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
        setActivityDetails(data.result);
      })
      .catch(error => {
        console.log("Error", error);
        history.push("/404");
      });
  }, []);

  useEffect(() => {
    getStreams();
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
      .serviceProviderForGetRequest(URL_TO_HIT, params)
      .then(res => {
        formState.dataToShow = [];
        setFormState(formState => ({
          ...formState,
          students: res.data.result,
          dataToShow: convertStudentData(res.data.result),
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

  const convertStudentData = data => {
    let studentDataArray = [];
    if (data) {
      for (let i in data) {
        var tempIndividualStudentData = {};
        tempIndividualStudentData["id"] = data[i]["id"];
        tempIndividualStudentData["name"] = data[i]["name"];
        tempIndividualStudentData["activityBatch"] = data[i]["activityBatch"];
        tempIndividualStudentData["stream"] =
          data[i]["individual"]["stream"]["name"];
        tempIndividualStudentData["contact_number"] = data[i]["phone"];

        studentDataArray.push(tempIndividualStudentData);
      }
      return studentDataArray;
    }
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

  const getStreams = async data => {
    if (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) {
      let streams = [];
      streams = auth
        .getUserInfo()
        .studentInfo.organization.stream_strength.map(stream => stream.stream);
      return streams;
    } else if (auth.getUserInfo().role.name === roleConstants.MEDHAADMIN) {
      await serviceProviders
        .serviceProviderForGetRequest(STREAMS_URL)
        .then(res => {
          setStreams(res.data.result);
          return res.data.result;
        });
    }
  };

  const isDeleteCellCompleted = status => {
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
    setFormState(formState => ({
      ...formState,
      isDataDeleted: false,
      showModalDelete: false
    }));
    setSeletedStudent([]);
    setClearSelectedRows(val => ({ clearSelectedRows: !val }));
    if (formState.isDataDeleted) {
      getStudents(formState.pageSize, formState.page);
    }
  };

  const handleDeleteActivityBatchStudent = student => {
    setFormState(formState => ({
      ...formState,
      dataToDelete: [student.id],
      showModalDelete: true
    }));
  };

  const handleDeleteMultipleStudents = () => {
    setFormState(formState => ({
      ...formState,
      dataToDelete: selectedStudents,
      showModalDelete: true
    }));
  };

  const handleVerifyMultipleStudents = ids => {
    setLoaderStatus(true);
    const studentsToVerify = ids;
    const URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY_BATCH_URL +
      `/${formState.dataForEdit.id}/` +
      strapiConstants.STRAPI_VALIDATE_STUDENT_ACTIVITY_BATCH;

    const postData = {
      students: studentsToVerify
    };

    serviceProviders
      .serviceProviderForPostRequest(URL, postData)
      .then(() => {
        setSeletedStudent([]);
        setClearSelectedRows(val => ({ clearSelectedRows: !val }));
        getStudents(formState.pageSize, formState.page);
        setLoaderStatus(false);
      })
      .catch(error => {
        console.log(error);
        setLoaderStatus(false);
      });
  };

  const handleUnVerifyMultipleStudents = ids => {
    setLoaderStatus(true);
    const studentsToVerify = ids;
    const URL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_ACTIVITY_BATCH_URL +
      `/${formState.dataForEdit.id}/` +
      strapiConstants.STRAPI_UNVALIDATE_STUDENT_ACTIVITY_BATCH;

    const postData = {
      students: studentsToVerify
    };

    serviceProviders
      .serviceProviderForPostRequest(URL, postData)
      .then(() => {
        setSeletedStudent([]);
        setClearSelectedRows(val => ({ clearSelectedRows: !val }));
        getStudents(formState.pageSize, formState.page);
        setLoaderStatus(false);
      })
      .catch(error => {
        console.log(error);
        setLoaderStatus(false);
      });
  };

  /** This handle change is used to handle changes to text field */
  const handleChange = event => {
    /** TO SET VALUES IN FORMSTATE */
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));

    /** This is used to remove any existing errors if present in text field */
    if (formState.errors.hasOwnProperty(event.target.name)) {
      delete formState.errors[event.target.name];
    }
  };

  const handleRowChange = ({ selectedRows }) => {
    const studentIds = selectedRows.map(student => student.id);
    setSeletedStudent(studentIds);
  };

  /** This checks if the corresponding field has errors */
  const hasError = field => (formState.errors[field] ? true : false);

  /** Handle submit handles the submit and performs all the validations */
  const handleSubmit = event => {
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
        AddActivityBatchSchema,
        true,
        dateFrom,
        dateTo
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
        AddActivityBatchSchema,
        true,
        dateFrom,
        dateTo
      );
    }
    if (isValid) {
      /** CALL POST FUNCTION */
      postActivityBatchData();
    } else {
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
    event.preventDefault();
  };

  const handleDateChange = (datefrom, event) => {
    if (formState.errors.hasOwnProperty(datefrom)) {
      delete formState.errors[datefrom];
    }
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [datefrom]: event
      },
      touched: {
        ...formState.touched,
        [datefrom]: true
      }
    }));
  };

  const postActivityBatchData = async () => {
    setLoaderStatus(true);
    let postData = databaseUtilities.addActivityBatch(
      formState.values[activityBatchName],
      selectedStudents,
      formState.values[dateFrom],
      formState.values[dateTo]
    );

    if (formState.isEditActivityBatch) {
      const activityBatchId = formState.dataForEdit.id;
      const URL =
        strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_ACTIVITY_BATCH_URL;

      serviceProviders
        .serviceProviderForPutRequest(URL, activityBatchId, postData)
        .then(({ data }) => {
          history.push({
            pathname: `/manage-activity-batch/${activity}`,
            fromEditActivityBatch: true,
            isDataEdited: true,
            addResponseMessage: "",
            editedData: data
          });
          setLoaderStatus(false);
        })
        .catch(error => {
          history.push({
            pathname: `/manage-activity-batch/${activity}`,
            fromEditActivityBatch: true,
            isDataEdited: false,
            addResponseMessage: "",
            editedData: {}
          });
          setLoaderStatus(false);
        });
    } else {
      serviceProviders
        .serviceProviderForPostRequest(ACTIVITY_CREATE_BATCH_URL, postData)
        .then(({ data }) => {
          history.push({
            pathname: `/manage-activity-batch/${activity}`,
            fromAddActivityBatch: true,
            isDataAdded: true,
            addResponseMessage: "",
            addedData: data.result
          });
          setLoaderStatus(false);
        })
        .catch(error => {
          history.push({
            pathname: `/manage-activity-batch/${activity}`,
            fromAddActivityBatch: true,
            isDataAdded: false,
            addResponseMessage: "",
            addedData: {}
          });
          setLoaderStatus(false);
        });
    }
  };

  /** Columns to show in table */
  let column = [
    {
      name: "Student Name",
      sortable: true,
      selector: "name",
      cell: row => (
        <Tooltip
          title={
            <React.Fragment>
              <Typography color="inherit">{`${row.name}`}</Typography>
            </React.Fragment>
          }
          placement="top"
        >
          <div>{`${row.name}`}</div>
        </Tooltip>
      )
    },
    {
      name: "Stream",
      sortable: true,
      selector: "stream",
      cell: row => (
        <Tooltip
          title={
            <React.Fragment>
              <Typography color="inherit">{`${row.stream}`}</Typography>
            </React.Fragment>
          }
          placement="top"
        >
          <div>{`${row.stream}`}</div>
        </Tooltip>
      )
    },
    {
      name: "Phone",
      sortable: true,
      selector: "contact_number",
      cell: row => (
        <Tooltip
          title={
            <React.Fragment>
              <Typography color="inherit">{`${row.contact_number}`}</Typography>
            </React.Fragment>
          }
          placement="top"
        >
          <div>{`${row.contact_number}`}</div>
        </Tooltip>
      )
    }
  ];

  if (formState.isEditActivityBatch) {
    column.push({
      name: "Action",
      cell: cell => (
        <div style={{ display: "flex" }}>
          {!!cell.activityBatch.is_verified_by_college ? (
            <div style={{ marginLeft: "8px" }}>
              <TickGridIcon
                id={cell.id}
                value={cell.name}
                tooltip={"Un-Mark attendance"}
                onClick={() => handleUnVerifyMultipleStudents([cell.id])}
                style={{ color: "green" }}
              />
            </div>
          ) : (
            <div style={{ marginLeft: "8px" }}>
              <TickGridIcon
                id={cell.id}
                value={cell.name}
                tooltip={"Mark attendance"}
                onClick={() => handleVerifyMultipleStudents([cell.id])}
                style={{ color: "grey" }}
              />
            </div>
          )}
          {/* {!!cell.activityBatch.verified_by_college ? (
            <div style={{ marginLeft: "8px" }}>
              <CrossGridIcon
                id={cell.id}
                value={cell.name}
                onClick={() => handleUnVerifyMultipleStudents([cell.id])}
              />
            </div>
          ) : null} */}

          <div style={{ marginLeft: "8px" }}>
            <DeleteGridIcon
              id={cell.id}
              value={cell.name}
              onClick={() => handleDeleteActivityBatchStudent(cell)}
            />
          </div>
        </div>
      ),
      button: true,
      conditionalCellStyles: [],
      width: "200px"
    });
  }

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

  const breadcrumbs = [
    { title: "Activity", href: "/manage-activity" },
    {
      title: `${activityDetails ? activityDetails.title : null} Batches`,
      href: `/manage-activity-batch/${activity}`
    },
    {
      title: formState.isEditActivityBatch
        ? formState.dataForEdit[activityBatchName]
        : "New Batch",
      href: "/"
    }
  ];

  const handleFilterChnageActivityField = event => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [ACTIVITY_BATCH_STUDENT_FILTER]: event.target.value
      }
    }));
    event.persist();
  };

  return (
    <Grid>
      <div className={classes.breadCrumbs}>
        {activityDetails ? <Breadcrumbs list={breadcrumbs} /> : null}
      </div>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {formState.isEditActivityBatch
            ? formState.dataForEdit[activityBatchName]
            : "New Batch"}
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
              <Grid item className={classes.paddingDate}>
                <Autocomplete
                  id="stream-dropdown"
                  options={streams}
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
              <Grid item>
                <TextField
                  label="Student Name"
                  margin="normal"
                  variant="outlined"
                  value={
                    formState.filterDataParameters[
                      ACTIVITY_BATCH_STUDENT_FILTER
                    ] || ""
                  }
                  placeholder="Student Name"
                  className={classes.autoCompleteField}
                  onChange={handleFilterChnageActivityField}
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

        <Card className={styles.filterButton}>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
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
                    onSelectedRowsChange={handleRowChange}
                    clearSelectedRows={clearSelectedRows}
                  />
                ) : (
                  <Spinner />
                )
              ) : (
                <div className={classes.noDataMargin}>No data to show</div>
              )}
            </Grid>
          </CardContent>
        </Card>

        <Card className={styles.noBorderNoShadow}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
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
                  type={get(AddActivityBatchSchema[activityBatchName], "type")}
                  value={formState.values[activityBatchName] || ""}
                  error={hasError(activityBatchName)}
                  helperText={
                    hasError(activityBatchName)
                      ? formState.errors[activityBatchName].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                  variant="outlined"
                  className={classes.elementroot}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <CustomDateTimePicker
                  onChange={event => {
                    handleDateChange(dateFrom, event);
                  }}
                  value={formState.values[dateFrom]}
                  name={dateFrom}
                  label={get(AddActivityBatchSchema[dateFrom], "label")}
                  minDate={
                    activityDetails
                      ? new Date(activityDetails.start_date_time)
                      : null
                  }
                  maxDate={
                    activityDetails
                      ? new Date(activityDetails.end_date_time)
                      : null
                  }
                  error={hasError(dateFrom)}
                  helperText={
                    hasError(dateFrom)
                      ? formState.errors[dateFrom].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                  className={classes.elementroot}
                />
              </Grid>
              <Grid item md={12} xs={12} className={classes.marginTop}>
                <CustomDateTimePicker
                  onChange={event => {
                    handleDateChange(dateTo, event);
                  }}
                  value={formState.values[dateTo]}
                  name={dateTo}
                  label={get(AddActivityBatchSchema[dateTo], "label")}
                  minDate={
                    formState.values[dateTo]
                      ? moment(formState.values[dateTo])
                      : null
                  }
                  maxDate={
                    activityDetails
                      ? moment(activityDetails.end_date_time)
                      : null
                  }
                  error={hasError(dateTo)}
                  helperText={
                    hasError(dateTo)
                      ? formState.errors[dateTo].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                  className={classes.elementroot}
                />
              </Grid>
              <Grid container spacing={2} style={{ marginLeft: "2px" }}>
                <Grid item className={classes.marginTop}>
                  <YellowButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    {genericConstants.SAVE_BUTTON_TEXT}
                  </YellowButton>
                </Grid>
                {formState.isEditActivityBatch ? (
                  <Grid item className={classes.marginTop}>
                    <YellowButton
                      type="submit"
                      color="primary"
                      variant="contained"
                      onClick={() => setShowStudentModal(true)}
                    >
                      {genericConstants.ADD_STUDENT_TO_ACTIVITY_BATCH}
                    </YellowButton>
                  </Grid>
                ) : null}
                <Grid item className={classes.marginTop}>
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
            </Grid>
          </CardContent>
        </Card>
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
