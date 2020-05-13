import React, { useState, useEffect, useCallback, useContext } from "react";
import useStyles from "../../../ContainerStyles/ManagePageStyles";
import * as serviceProviders from "../../../../api/Axios";
import * as strapiConstants from "../../../../constants/StrapiApiConstants";
import {
  Table,
  Spinner,
  Alert,
  ApproveUnapprove,
  GrayButton,
  YellowButton,
  GreenButton,
  EditGridIcon,
  DeleteGridIcon,
  AlertMessage
} from "../../../../components";
import ApprovedStudents from "./ApprovedStudents";
import DeleteStudents from "./DeleteStudents";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as formUtilities from "../../../../Utilities/FormUtilities";
import DeleteIcon from "@material-ui/icons/Delete";
import * as genericConstants from "../../../../constants/GenericConstants";
import * as routeConstants from "../../../../constants/RouteConstants";

import CloseIcon from "@material-ui/icons/Close";
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
import auth from "../../../../components/Auth";
import { useHistory } from "react-router-dom";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import LoaderContext from "../../../../context/LoaderContext";

const STREAMS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;
const USERS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;
const USER_FILTER = "user.first_name_contains";
const STREAM_FILTER = "stream.id";
const VERIFIEDBYCOLLEGE = "verifiedByCollege";
const SORT_FIELD_KEY = "_sort";

const ManageStudents = props => {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [streams, setStreams] = useState([]);
  const { setLoaderStatus } = useContext(LoaderContext);

  const [formState, setFormState] = useState({
    student: [],
    studentNameFilterData: [],
    approvedId: 0,
    approvedData: false,
    dataToDelete: {},
    filterDataParameters: {},
    isMultiDelete: false,
    selectedRowFilter: true,
    greenButtonChecker: true,
    isMultiApprove: false,
    isMultiUnapprove: false,
    multiApproveUnapproveStudentIds: {},
    isUserBlocked: false,
    studentName: "",
    buttonToApproveUnapprove: "Approve Selected Student",
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    messageToShow: "",
    sortAscending: true,
    dataVerifiedByCollege: false,
    isClearResetFilter: false,
    checked: false,
    /** This is when we return from edit page */
    isStudentEdited: props["location"]["fromEditStudent"]
      ? props["location"]["isStudentEdited"]
      : false,
    fromEditStudent: props["location"]["fromEditStudent"]
      ? props["location"]["fromEditStudent"]
      : false,
    messageForEditStudent: props["location"]["fromEditStudent"]
      ? props["location"]["messageForEditStudent"]
      : "",
    editedStudentName: props["location"]["fromEditStudent"]
      ? props["location"]["editedStudentName"]
      : null,
    fromAddStudent: props["location"]["fromAddStudent"]
      ? props["location"]["fromAddStudent"]
      : false,
    isStudentAdded: props["location"]["fromAddStudent"]
      ? props["location"]["isStudentAdded"]
      : false,
    messageForAddStudent: props["location"]["fromAddStudent"]
      ? props["location"]["messageForAddStudent"]
      : "",
    toggleCleared: false
  });

  useEffect(() => {
    getStudentData(10, 1);
    getStreamData();
  }, []);

  const getStudentData = async (pageSize, page, paramsForUsers = null) => {
    if (paramsForUsers !== null && !formUtilities.checkEmpty(paramsForUsers)) {
      let defaultParams = {};
      if (paramsForUsers.hasOwnProperty(SORT_FIELD_KEY)) {
        defaultParams = {
          page: page,
          pageSize: pageSize
        };
      } else {
        defaultParams = {
          page: page,
          pageSize: pageSize,
          [SORT_FIELD_KEY]: "user.first_name:asc"
        };
      }
      Object.keys(paramsForUsers).map(key => {
        defaultParams[key] = paramsForUsers[key];
      });
      paramsForUsers = defaultParams;
    } else {
      paramsForUsers = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "user.first_name:asc"
      };
    }
    if (
      auth.getUserInfo().role.name === "College Admin" &&
      auth.getUserInfo().college !== null &&
      auth.getUserInfo().college.id !== null
    ) {
      const STUDENTS_URL =
        strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_COLLEGES +
        "/" +
        auth.getUserInfo().college.id +
        "/" +
        strapiConstants.STRAPI_STUDENTS;

      setFormState(formState => ({
        ...formState,
        isDataLoading: true
      }));

      serviceProviders
        .serviceProviderForGetRequest(STUDENTS_URL, paramsForUsers)
        .then(res => {
          let currentPage = res.data.page;
          let totalRows = res.data.rowCount;
          let currentPageSize = res.data.pageSize;
          let pageCount = res.data.pageCount;
          if (res.data.result.length) {
            let tempStudentData = [];
            let student_data = res.data.result;
            tempStudentData = convertStudentData(student_data);
            setFormState(formState => ({
              ...formState,
              student: tempStudentData,
              pageSize: currentPageSize,
              totalRows: totalRows,
              page: currentPage,
              pageCount: pageCount,
              isDataLoading: false
            }));
          } else {
            setFormState(formState => ({
              ...formState,
              student: res.data.length
            }));
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    } else {
      history.push({
        pathname: routeConstants.NOT_FOUND_URL
      });
    }
  };

  const getStreamData = () => {
    serviceProviders
      .serviceProviderForGetRequest(STREAMS_URL)
      .then(res => {
        setStreams(res.data.result);
      })
      .catch(error => {
        console.log("streamError", error);
      });
  };

  const convertStudentData = data => {
    let studentDataArray = [];
    if (data) {
      for (let i in data) {
        var tempIndividualStudentData = {};
        let educationYear = [];
        tempIndividualStudentData["id"] = data[i]["id"];
        tempIndividualStudentData["userId"] = data[i]["user"]["id"];
        tempIndividualStudentData["name"] =
          data[i]["user"]["first_name"] +
          " " +
          data[i]["father_first_name"] +
          " " +
          data[i]["user"]["last_name"];
        tempIndividualStudentData["first_name"] = data[i]["user"]["first_name"];
        tempIndividualStudentData["streamId"] = data[i]["stream"]["id"];
        tempIndividualStudentData["stream"] = data[i]["stream"]["name"];
        if (data[i]["qualifications"]) {
          for (let j in data[i]["qualifications"]) {
            educationYear.push(data[i]["qualifications"][j]["education_year"]);
          }
          tempIndividualStudentData["qualifications"] = educationYear;
        } else {
          tempIndividualStudentData["qualifications"] = [];
        }
        studentDataArray.push(tempIndividualStudentData);
        tempIndividualStudentData["Approved"] = data[i]["verifiedByCollege"];
      }
      return studentDataArray;
    }
  };

  /** Edit Student */
  const editCell = event => {
    setFormState(formState => ({
      ...formState,
      editedStudentName: event.target.getAttribute("value")
    }));
    getEditStudentData(event.target.getAttribute("userId"));
  };

  const getEditStudentData = async userId => {
    setLoaderStatus(true);
    await serviceProviders
      .serviceProviderForGetOneRequest(USERS_URL, userId)
      .then(res => {
        setLoaderStatus(false);
        history.push({
          pathname: routeConstants.EDIT_STUDENT_FROM_COLLEGE_ADMIN,
          dataForEdit: res.data.result,
          editStudent: true
        });
      })
      .catch(error => {
        setLoaderStatus(false);
        console.log("erroredit student", error);
      });
  };

  /** Add Student */
  const addStudentsToCollege = () => {
    history.push({
      pathname: routeConstants.ADD_STUDENT_FROM_COLLEGE_ADMIN,
      addStudent: true
    });
  };

  const setApproveCell = id => {
    setLoaderStatus(true);
    formState.approvedId = id;
    for (var k = 0; k < formState.student.length; k++) {
      if (parseInt(id) === parseInt(formState.student[k]["id"])) {
        if (formState.student[k]["Approved"] === true) {
          approveCellData(id, true);
        } else {
          approveCellData(id, false);
        }
      }
    }
  };

  const approveCell = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      studentName: event.target.getAttribute("value")
    }));
    setApproveCell(event.target.id);
  };

  const approveCellData = async id => {
    setLoaderStatus(true);
    /** Get student data for edit */
    let paramsForStudent = {
      id: id
    };
    var STUDENTAPPROVEDATA =
      strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENTS;
    await serviceProviders
      .serviceProviderForGetRequest(STUDENTAPPROVEDATA, paramsForStudent)
      .then(res => {
        setLoaderStatus(false);
        /** This we will use as final data for edit we send to modal */
        let editData = res.data[0];
        setFormState(formState => ({
          ...formState,
          dataToApproveUnapprove: editData,
          dataVerifiedByCollege: res.data[0].verifiedByCollege,
          isMultiApprove: false,
          isMultiUnapprove: false,
          showModalApproveUnapprove: true,
          multiBlockCollegeIds: [],
          fromDeleteModal: false,
          fromAddStudent: false,
          fromEditStudent: false,
          fromApproveUnapproveModal: false
        }));
      })
      .catch(error => {
        setLoaderStatus(false);
        console.log("studentspproveerror", error);
      });
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalApproveUnapprove: false,
      showModalDelete: false
    }));
  };

  const deleteCell = event => {
    setFormState(formState => ({
      ...formState,
      dataToDelete: {
        id: event.target.id,
        name: event.target.getAttribute("value"),
        userId: event.target.getAttribute("userId")
      },
      MultiDeleteUserId: [],
      showModalDelete: true,
      isDataDeleted: false,
      messageToShow: "",
      fromDeleteModal: false,
      fromAddStudent: false,
      fromEditStudent: false,
      fromApproveUnapproveModal: false
    }));
  };

  /** This is used to handle the close modal event */
  const handleCloseDeleteModal = (status, statusToShow = "") => {
    /** This restores all the data when we close the modal */
    setOpen(true);
    setFormState(formState => ({
      ...formState,
      isDataDeleted: status,
      showModalDelete: false,
      fromDeleteModal: true,
      isMultiDelete: false,
      messageToShow: statusToShow
    }));
    if (status) {
      getStudentData(formState.pageSize, 1, formState.filterDataParameters);
    }
  };

  const handleChangeAutoCompleteStream = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
      setFormState(formState => ({
        ...formState,
        isClearResetFilter: false
      }));
    }
  };

  const handleCheckedChange = event => {
    setFormState(formState => ({
      ...formState,
      checked: event.target.checked,
      isClearResetFilter: false
    }));
    if (event.target.checked) {
      formState.filterDataParameters[VERIFIEDBYCOLLEGE] = false;
    } else {
      delete formState.filterDataParameters[VERIFIEDBYCOLLEGE];
    }
  };

  const handleFilterChangeForStudentField = event => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [USER_FILTER]: event.target.value
      },
      isClearResetFilter: false
    }));
    event.persist();
  };

  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getStudentData(perPage, page, formState.filterDataParameters);
    } else {
      await getStudentData(perPage, page);
    }
  };

  /** Pagination */
  const handlePerRowsChange = async (perPage, page) => {
    /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getStudentData(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getStudentData(perPage, page, formState.filterDataParameters);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getStudentData(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getStudentData(
          formState.pageSize,
          page,
          formState.filterDataParameters
        );
      }
    }
  };

  const handleSort = (
    column,
    sortDirection,
    perPage = formState.pageSize,
    page = 1
  ) => {
    if (column.selector === "stream") {
      column.selector = "stream.name";
    }
    formState.filterDataParameters[SORT_FIELD_KEY] =
      column.selector + ":" + sortDirection;
    getStudentData(perPage, page, formState.filterDataParameters);
  };

  /** To reset search filter */
  const refreshPage = () => {
    formState.filterDataParameters = {};
    selectedRowCleared(true);
    setFormState(formState => ({
      ...formState,
      isFilterSearch: false,
      isClearResetFilter: true,
      isStateClearFilter: true,
      filterDataParameters: {},
      isDataLoading: true,
      checked: false,
      studentNameFilterData: []
    }));
    getStudentData(10, 1);
  };

  const deleteMulUserById = () => {
    let arrayId = [];
    let arrayUserId = [];
    selectedRows.forEach(d => {
      arrayId.push(d.id);
      arrayUserId.push(d.userId);
    });

    setFormState(formState => ({
      ...formState,
      showEditModal: false,
      showModalDelete: true,
      isMultiDelete: true,
      MultiDeleteID: arrayId,
      MultiDeleteUserId: arrayUserId,
      isDataDeleted: false,
      fromDeleteModal: false,
      fromAddStudent: false,
      fromEditStudent: false,
      fromApproveUnapproveModal: false
    }));
  };

  const isApproveUnapproveCellCompleted = status => {
    formState.isDataApproveUnapprove = status;
  };

  /** This is used to handle the close modal event */
  const handleCloseApproveUnapproveModal = (status, statusToShow = "") => {
    /** This restores all the data when we close the modal */
    setOpen(true);
    setFormState(formState => ({
      ...formState,
      isDataApproveUnapprove: status,
      showModalApproveUnapprove: false,
      fromApproveUnapproveModal: true,
      isMultiApprove: false,
      isMultiUnapprove: false,
      multiBlockCollegeIds: [],
      dataToApproveUnapprove: {},
      messageToShow: statusToShow
    }));
    if (status) {
      getStudentData(
        formState.pageSize,
        formState.page,
        formState.filterDataParameters
      );
    }
  };

  const handleRowSelected = useCallback(state => {
    let blockData = [];
    let unblockData = [];

    if (state.selectedCount >= 1) {
      setFormState(formState => ({
        ...formState,
        selectedRowFilter: false,
        toggleCleared: false
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        selectedRowFilter: true
      }));
    }

    state.selectedRows.forEach(data => {
      if (data.Approved === false) {
        blockData.push(data);
      } else {
        unblockData.push(data);
      }
      if (blockData.length > 0) {
        setFormState(formState => ({
          ...formState,
          buttonToApproveUnapprove: "Approve Selected Student"
        }));
      } else {
        setFormState(formState => ({
          ...formState,
          buttonToApproveUnapprove: "Unapprove Selected Student"
        }));
      }
    });
    setSelectedRows(state.selectedRows);
  }, []);

  const selectedRowCleared = data => {
    formState.toggleCleared = data;
    setTimeout(() => {
      setFormState(formState => ({
        ...formState,
        toggleCleared: false
      }));
    }, 2000);
  };

  const approveUnapproveMultiStudent = () => {
    let arrayId = [];
    for (var k = 0; k < selectedRows.length; k++) {
      arrayId.push(selectedRows[k]["id"]);
    }
    if (formState.buttonToApproveUnapprove === "Approve Selected Student") {
      setFormState(formState => ({
        ...formState,
        isMultiApprove: true,
        isMultiUnapprove: false,
        showModalApproveUnapprove: true,
        multiApproveUnapproveStudentIds: arrayId,
        fromDeleteModal: false,
        fromAddStudent: false,
        fromEditStudent: false,
        fromApproveUnapproveModal: false
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        isMultiApprove: false,
        isMultiUnapprove: true,
        showModalApproveUnapprove: true,
        multiApproveUnapproveStudentIds: arrayId,
        fromDeleteModal: false,
        fromAddStudent: false,
        fromEditStudent: false,
        fromApproveUnapproveModal: false
      }));
    }
  };

  const CustomLink = ({ row }) => (
    <div>
      {}
      <div>
        <a href="#" id={row.userId} onClick={handleClickViewStudent}>
          {row.name}
        </a>
      </div>
    </div>
  );

  const handleClickViewStudent = event => {
    history.push({
      pathname: routeConstants.VIEW_STUDENT_PROFILE,
      dataForStudent: event.target.id,
      fromAddStudentToRecruitmentDrive: false,
      fromEventStudentList: false,
      fromManageStudentList: true
    });
  };

  /** Columns to show in table */
  const column = [
    {
      name: "Name",
      sortable: true,
      selector: "user.first_name",
      cell: row => <CustomLink row={row} />
    },
    { name: "Stream", sortable: true, selector: "stream" },
    {
      name: "Education year",
      cell: row => (
        <Tooltip
          title={
            <React.Fragment>
              <Typography color="inherit">{`${row.qualifications}`}</Typography>
            </React.Fragment>
          }
          placement="top"
        >
          <div>{`${row.qualifications}`}</div>
        </Tooltip>
      )
    },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <ApproveUnapprove
              id={cell.id}
              value={cell.name}
              onClick={approveCell}
              isApproved={cell.Approved}
            />
          </div>
          <div className={classes.PaddingActionButton}>
            <EditGridIcon
              id={cell.id}
              userId={cell.userId}
              value={cell.name}
              onClick={editCell}
            />
          </div>
          <div className={classes.PaddingActionButton}>
            <DeleteGridIcon
              userId={cell.userId}
              id={cell.id}
              value={cell.name}
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

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.MANAGE_STUDENTS}
        </Typography>

        <GreenButton
          variant="contained"
          color="secondary"
          to={"/"}
          onClick={() => approveUnapproveMultiStudent()}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          {formState.buttonToApproveUnapprove}
        </GreenButton>

        <GreenButton
          variant="contained"
          color="secondary"
          onClick={() => deleteMulUserById()}
          startIcon={<DeleteIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          {genericConstants.DELETE_SELECTED_STUDENT}
        </GreenButton>
        <GreenButton
          variant="contained"
          color="primary"
          disableElevation
          greenButtonChecker={formState.greenButtonChecker}
          onClick={() => addStudentsToCollege()}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          {genericConstants.ADD_STUDENT_BUTTON_TEXT}
        </GreenButton>
      </Grid>
      {/** Error/Success messages to be shown for student */}

      <Grid item xs={12} className={classes.formgrid}>
        {formState.fromEditStudent && formState.isStudentEdited ? (
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
              {formState.messageForEditStudent}
            </Alert>
          </Collapse>
        ) : null}
        {formState.fromEditStudent && !formState.isStudentEdited ? (
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
              {formState.messageForEditStudent}
            </Alert>
          </Collapse>
        ) : null}

        {formState.fromAddStudent && formState.isStudentAdded ? (
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
              {formState.messageForAddStudent}
            </Alert>
          </Collapse>
        ) : null}
        {formState.fromAddStudent && !formState.isStudentAdded ? (
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
              {formState.messageForAddStudent}
            </Alert>
          </Collapse>
        ) : null}

        {formState.fromDeleteModal &&
        formState.isDataDeleted &&
        formState.messageToShow !== "" ? (
          <AlertMessage
            variant="filled"
            openAlert={open}
            alertTitle="success"
            arialabel="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            {formState.messageToShow}
          </AlertMessage>
        ) : null}

        {formState.fromDeleteModal &&
        !formState.isDataDeleted &&
        formState.messageToShow !== "" ? (
          <AlertMessage
            variant="filled"
            openAlert={open}
            alertTitle="error"
            arialabel="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            {formState.messageToShow}
          </AlertMessage>
        ) : null}

        {formState.fromApproveUnapproveModal &&
        formState.isDataApproveUnapprove &&
        formState.messageToShow !== "" ? (
          <AlertMessage
            variant="filled"
            openAlert={open}
            alertTitle="success"
            arialabel="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            {formState.messageToShow}
          </AlertMessage>
        ) : null}

        {formState.fromApproveUnapproveModal &&
        !formState.isDataApproveUnapprove &&
        formState.messageToShow !== "" ? (
          <AlertMessage
            variant="filled"
            openAlert={open}
            alertTitle="error"
            arialabel="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            {formState.messageToShow}
          </AlertMessage>
        ) : null}
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
                  value={formState.filterDataParameters[USER_FILTER] || ""}
                  placeholder="Name"
                  className={classes.autoCompleteField}
                  onChange={handleFilterChangeForStudentField}
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <Autocomplete
                  id="stream-filter"
                  name={STREAM_FILTER}
                  options={streams}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  value={
                    formState.isClearResetFilter
                      ? null
                      : streams[
                          streams.findIndex(function (item, i) {
                            return (
                              item.id ===
                              formState.filterDataParameters[STREAM_FILTER]
                            );
                          })
                        ] || null
                  }
                  onChange={(event, value) =>
                    handleChangeAutoCompleteStream(STREAM_FILTER, event, value)
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Stream"
                      placeholder="Stream"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <Autocomplete
                  id="education-year-list"
                  options={genericConstants.EDUCATIONYEARLIST}
                  getOptionLabel={option => option.name}
                  value={null}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Education Year"
                      variant="outlined"
                      name="education-year"
                      placeholder="Education Year"
                      className={classes.autoCompleteField}
                    />
                  )}
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formState.checked}
                        onChange={handleCheckedChange}
                        name={VERIFIEDBYCOLLEGE}
                        color="primary"
                      />
                    }
                    label="Awaiting For Approval"
                  />
                </FormGroup>
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
                  onClick={refreshPage}
                  disableElevation
                >
                  {genericConstants.RESET_BUTTON_TEXT}
                </GrayButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card className={classes.tabledata} variant="outlined">
          {formState.student ? (
            formState.student.length ? (
              <Table
                data={formState.student}
                column={column}
                defaultSortField="user.first_name"
                defaultSortAsc={formState.sortAscending}
                editEvent={editCell}
                onSelectedRowsChange={handleRowSelected}
                deleteEvent={deleteCell}
                progressPending={formState.isDataLoading}
                onSort={handleSort}
                sortServer={true}
                paginationDefaultPage={formState.page}
                paginationPerPage={formState.pageSize}
                paginationTotalRows={formState.totalRows}
                paginationRowsPerPageOptions={[10, 20, 50]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                clearSelectedRows={formState.toggleCleared}
              />
            ) : (
              <Spinner />
            )
          ) : (
            <div className={classes.noDataMargin}>
              {genericConstants.NO_DATA_TO_SHOW_TEXT}
            </div>
          )}

          <DeleteStudents
            showModal={formState.showModalDelete}
            closeModal={handleCloseDeleteModal}
            id={
              formState.isMultiDelete
                ? formState.MultiDeleteID
                : formState.dataToDelete["id"]
            }
            UserID={formState.MultiDeleteUserId}
            modalClose={modalClose}
            isMultiDelete={formState.isMultiDelete ? true : false}
            dataToDelete={formState.dataToDelete}
            clearSelectedRow={selectedRowCleared}
          />

          <ApprovedStudents
            studentName={formState.studentName}
            showModal={formState.showModalApproveUnapprove}
            closeModal={handleCloseApproveUnapproveModal}
            dataToApproveUnapprove={formState.dataToApproveUnapprove}
            verifiedByCollege={formState.dataVerifiedByCollege}
            approveUnapproveEvent={isApproveUnapproveCellCompleted}
            isMultiApprove={formState.isMultiApprove ? true : false}
            isMultiUnapprove={formState.isMultiUnapprove ? true : false}
            multiApproveUnapproveStudentIds={
              formState.multiApproveUnapproveStudentIds
            }
            modalClose={modalClose}
            clearSelectedRow={selectedRowCleared}
          />
        </Card>
      </Grid>
    </Grid>
  );
};
export default ManageStudents;
