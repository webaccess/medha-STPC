import React, { useState, useEffect, useCallback } from "react";
import useStyles from "../ContainerStyles/ManagePageStyles";
import * as serviceProviders from "../../api/Axios";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import { Table, Spinner, Alert } from "../../components";
import { CustomRouterLink } from "../../components";
import ApprovedStudents from "./ApprovedStudents";
import DeleteStudents from "./DeleteStudents";
import { GrayButton, YellowButton, GreenButton } from "../../components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as formUtilities from "../../Utilities/FormUtilities";
import DeleteIcon from "@material-ui/icons/Delete";
import * as genericConstants from "../../constants/GenericConstants";
import * as routeConstants from "../../constants/RouteConstants";

import CloseIcon from "@material-ui/icons/Close";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Collapse,
  IconButton,
  Tooltip,
  CircularProgress
} from "@material-ui/core";
import { serviceProviderForGetRequest } from "../../api/Axios";
import auth from "../../components/Auth";
import { useHistory } from "react-router-dom";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";

const STREAMS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;
const USERS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;
const USER_FILTER = "user.first_name_contains";
const STREAM_FILTER = "stream.id";
const SORT_FIELD_KEY = "_sort";
const COLLEGEID = "college.id";
const VERIFIEDBYCOLLEGE = "verifiedByCollege";

const ManageStudents = props => {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [streams, setStreams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /** Value to set for event filter */
  const [value, setValue] = React.useState(null);

  const [formState, setFormState] = useState({
    student: [],
    studentNameFilterData: [],
    approvedId: 0,
    approvedData: false,
    showModalBlock: false,
    dataToDelete: {},
    filterDataParameters: {},
    isMultiDelete: false,
    selectedRowFilter: true,
    greenButtonChecker: true,
    isMulBlocked: false,
    isMulUnBlocked: false,
    MultiBlockUser: {},
    isUserBlocked: false,
    cellName: "",
    bottonBlockUnblock: "Approve Selected User",
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
    isDataEdited: props["location"]["fromeditStudent"]
      ? props["location"]["isDataEdited"]
      : false,
    fromeditCollege: props["location"]["fromeditStudent"]
      ? props["location"]["fromeditStudent"]
      : false,
    editedCollegeName: props["location"]["fromeditStudent"]
      ? props["location"]["editedStudentName"]
      : null,
    toggleCleared: false
  });

  useEffect(() => {
    getStudentData(10, 1);
    getStreamData();
  }, []);

  const getStudentData = async (pageSize, page, paramsForUsers = null) => {
    if (paramsForUsers !== null && !formUtilities.checkEmpty(paramsForUsers)) {
      let defaultParams = {
        page: page,
        pageSize: pageSize
      };
      Object.keys(paramsForUsers).map(key => {
        defaultParams[key] = paramsForUsers[key];
      });
      paramsForUsers = defaultParams;
    } else {
      paramsForUsers = {
        page: page,
        pageSize: pageSize
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
              // studentNameFilterData: tempStudentData,
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
        studentDataArray.push(tempIndividualStudentData);
        tempIndividualStudentData["Approved"] = data[i]["verifiedByCollege"];
      }

      return studentDataArray;
    }
  };

  const editCell = event => {
    console.log("editcell", event.target);
    setFormState(formState => ({
      ...formState,
      editedCollegeName: event.target.getAttribute("value")
    }));
    getEditStudentData(event.target.getAttribute("userId"));
  };

  const getEditStudentData = userId => {
    serviceProviders
      .serviceProviderForGetOneRequest(USERS_URL, userId)
      .then(res => {
        history.push({
          pathname: routeConstants.EDIT_STUDENT_FROM_COLLEGE_ADMIN,
          editStudent: true,
          dataForEdit: res.data.result
        });
      })
      .catch(error => {
        console.log("erroredit student", error);
      });
  };

  const approveCell = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      cellName: event.target.getAttribute("value")
    }));

    formState.approvedId = event.target.id;
    for (var k = 0; k < formState.student.length; k++) {
      if (parseInt(event.target.id) === parseInt(formState.student[k]["id"])) {
        if (formState.student[k]["Approved"] === true) {
          approveCellData(event.target.id, true);
        } else {
          approveCellData(event.target.id, false);
        }
      }
    }
  };

  const approveCellData = async id => {
    /** Get student data for edit */
    let paramsForStudent = {
      id: id
    };
    var STUDENTAPPROVEDATA =
      strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENTS;
    await serviceProviders
      .serviceProviderForGetRequest(STUDENTAPPROVEDATA, paramsForStudent)
      .then(res => {
        /** This we will use as final data for edit we send to modal */
        let editData = res.data[0];
        setFormState(formState => ({
          ...formState,
          dataToBlockUnblock: editData,
          dataVerifiedByCollege: res.data[0].verifiedByCollege,
          isMulBlocked: false,
          isMulUnBlocked: false,
          showModalBlock: true,
          multiBlockCollegeIds: [],
          fromDeleteModal: false,
          fromAddCollege: false,
          fromeditCollege: false,
          fromBlockModal: false
        }));
      })
      .catch(error => {
        console.log("studentspproveerror", error);
      });
  };

  const handleCloseBlockModal = () => {
    /** This restores all the data when we close the modal */
    setFormState(formState => ({
      ...formState,
      showModalBlock: false
    }));
    if (formState.isUserBlocked) {
      //getUserData();
      setFormState(formState => ({
        ...formState,
        showModalBlock: false,
        showModalDelete: false,
        isMultiDelete: false,
        selectedRowFilter: true,
        greenButtonChecker: true,
        isMulBlocked: false,
        isMulUnBlocked: false,
        MultiBlockUser: {},
        isUserBlocked: false
      }));
      getStudentData();
      // window.location.reload(false);
    }
  };

  const isUserBlockCompleted = (status, statusToShow = "") => {
    if (status) {
      formState.showAlert = status;
    } else {
      formState.showAlert = status;
    }

    setOpen(true);
    setFormState(formState => ({
      ...formState,
      isDataBlockUnblock: status,
      showModalBlock: false,
      // fromBlockModal: true,
      isMulBlocked: false,
      isMulUnBlocked: false,
      // multiBlockCollegeIds: [],
      MultiBlockUser: {},
      messageToShow: statusToShow
    }));

    formState.isUserBlocked = status;
  };
  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalBlock: false,
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
      fromAddCollege: false,
      fromeditCollege: false,
      fromBlockModal: false
    }));
  };

  /** This is used to handle the close modal event */
  const handleCloseDeleteModal = (status, statusToShow = "") => {
    /** This restores all the data when we close the modal */
    //restoreData();
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
      getStudentData(formState.pageSize, 1);
    }
  };

  const isDeleteCellCompleted = (status, statusToShow = "") => {
    if (status) {
      formState.showDeleteAlert = status;
    } else {
      formState.showDeleteAlert = status;
    }
    // formState.isDataDeleted = status;

    setOpen(true);
    setFormState(formState => ({
      ...formState,
      isDataDeleted: status,
      showModalDelete: false,
      // fromDeleteModal: true,
      // isMultiDelete: false,
      messageToShow: statusToShow
    }));
  };

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["userId"];
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
      checked: event.target.checked
    }));
    if (event.target.checked) {
      formState.filterDataParameters[VERIFIEDBYCOLLEGE] = false;
    } else {
      delete formState.filterDataParameters[VERIFIEDBYCOLLEGE];
    }
  };

  const handleFilterChange = event => {
    formState.filterDataParameters[event.target.name] = event.target.value;
  };

  const getStudentSelectedValue = (event, value) => {
    if (value === null) {
      getFilteredStudentDataValueInDropDown(null);
    } else {
      getFilteredStudentDataValueInDropDown(
        value.first_name
      ); /** value.title will give you name of the student */
    }
  };

  const handleFilterChangeForStudentField = event => {
    getFilteredStudentDataValueInDropDown(event.target.value);
    event.persist();
    // setRpcsFilter(event.target.value);
  };

  const getFilteredStudentDataValueInDropDown = async studentName => {
    setIsLoading(true);
    setValue({
      first_name: studentName
    });
    if (studentName && studentName !== null && studentName !== "") {
      formState.filterDataParameters[USER_FILTER] = studentName;
      let params = {
        [USER_FILTER]: studentName
      };
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

        serviceProviders
          .serviceProviderForGetRequest(STUDENTS_URL, params)
          .then(res => {
            setIsLoading(false);
            let tempData = [];
            if (res.data.result.length !== 0) {
              tempData = convertStudentData(res.data.result);
            }
            setFormState(formState => ({
              ...formState,
              studentNameFilterData: tempData,
              isClearResetFilter: false
            }));
          })
          .catch(error => {
            console.log("errFilter", error);
          });
      }
    } else {
      delete formState.filterDataParameters[USER_FILTER];
      setIsLoading(false);
      setFormState(formState => ({
        ...formState,
        studentNameFilterData: [],
        isClearResetFilter: false
      }));
    }
  };

  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getStudentData(perPage, page, formState.filterDataParameters);
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
        await getStudentData(perPage, page);
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
        await getStudentData(formState.pageSize, page);
      }
    }
  };

  /** To reset search filter */
  const refreshPage = () => {
    formState.filterDataParameters = {};
    setFormState(formState => ({
      ...formState,
      isFilterSearch: false,
      isClearResetFilter: true,
      isStateClearFilter: true,
      /** Clear all filters */
      filterDataParameters: {},
      isDataLoading: true,
      checked: false,
      studentNameFilterData: []
    }));
    formState.filterDataParameters[USER_FILTER] = "";
    // formState.filterDataParameters[STREAM_FILTER] = "";
    setStreams([]);
    getStudentData(10, 1);
    getStreamData();
    // window.location.reload(false);
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
      fromAddCollege: false,
      fromeditCollege: false,
      fromBlockModal: false
    }));
  };

  const isBlockUnblockCellCompleted = status => {
    formState.isDataBlockUnblock = status;
  };

  /** This is used to handle the close modal event */
  const handleCloseBlockUnblockModal = (status, statusToShow = "") => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setOpen(true);

    setFormState(formState => ({
      ...formState,
      isDataBlockUnblock: status,
      showModalBlock: false,
      fromBlockModal: true,
      isMulBlocked: false,
      isMulUnBlocked: false,
      multiBlockCollegeIds: [],
      dataToBlockUnblock: {},
      messageToShow: statusToShow
    }));
    if (status) {
      getStudentData(formState.pageSize, 1);
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
          bottonBlockUnblock: "Approve Selected User"
        }));
      } else {
        setFormState(formState => ({
          ...formState,
          bottonBlockUnblock: "Unapprove Selected User"
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

  const blockMulUserById = () => {
    let arrayId = [];
    for (var k = 0; k < selectedRows.length; k++) {
      arrayId.push(selectedRows[k]["id"]);
    }
    if (formState.bottonBlockUnblock === "Approve Selected User") {
      setFormState(formState => ({
        ...formState,
        isMulBlocked: true,
        isMulUnBlocked: false,
        showModalBlock: true,
        MultiBlockUser: arrayId,
        fromDeleteModal: false,
        fromAddCollege: false,
        fromeditCollege: false,
        fromBlockModal: false
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        isMulBlocked: false,
        isMulUnBlocked: true,
        showModalBlock: true,
        MultiBlockUser: arrayId,
        fromDeleteModal: false,
        fromAddCollege: false,
        fromeditCollege: false,
        fromBlockModal: false
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
      selector: "name",
      cell: row => <CustomLink row={row} />
    },
    { name: "Stream", sortable: true, selector: "stream" },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <Tooltip
              title={cell.Approved ? "UNapprove" : "Approve"}
              placement="top"
            >
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                onClick={approveCell}
                style={cell.Approved ? { color: "green" } : { color: "red" }}
              >
                done
              </i>
            </Tooltip>
          </div>
          <div className={classes.PaddingActionButton}>
            <Tooltip title="Edit" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                userId={cell.userId}
                onClick={editCell}
                style={{ color: "green", fontSize: "21px" }}
              >
                edit
              </i>
            </Tooltip>
          </div>
          <div className={classes.PaddingActionButton}>
            <Tooltip title="Delete" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                userId={cell.userId}
                onClick={deleteCell}
                style={{ color: "red", fontSize: "23px" }}
              >
                delete_outline
              </i>
            </Tooltip>
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
          onClick={() => blockMulUserById()}
          // startIcon={<BlockIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          {formState.bottonBlockUnblock}
          {/* Approved Selected User */}
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
          component={CustomRouterLink}
          to={routeConstants.ADD_STUDENT_FROM_COLLEGE_ADMIN}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          {genericConstants.ADD_STUDENT_BUTTON_TEXT}
        </GreenButton>
      </Grid>
      {/** Error/Success messages to be shown for student */}

      <Grid item xs={12} className={classes.formgrid}>
        {formState.fromeditCollege && formState.isDataEdited ? (
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
              Student {formState.editedCollegeName} has been updated
              successfully.
            </Alert>
          </Collapse>
        ) : null}
        {formState.fromeditCollege && !formState.isDataEdited ? (
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
              An error has occured while updating student. Kindly, try again.
            </Alert>
          </Collapse>
        ) : null}

        {formState.fromDeleteModal &&
        formState.isDataDeleted &&
        formState.messageToShow !== "" ? (
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
              {formState.messageToShow}
              {/* {genericConstants.ALERT_SUCCESS_DATA_EDITED_MESSAGE} */}
            </Alert>
          </Collapse>
        ) : null}

        {formState.fromDeleteModal &&
        !formState.isDataDeleted &&
        formState.messageToShow !== "" ? (
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
              {formState.messageToShow}
            </Alert>
          </Collapse>
        ) : null}

        {formState.fromBlockModal &&
        formState.isDataBlockUnblock &&
        formState.messageToShow !== "" ? (
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
              {formState.messageToShow}
            </Alert>
          </Collapse>
        ) : null}

        {formState.fromBlockModal &&
        !formState.isDataBlockUnblock &&
        formState.messageToShow !== "" ? (
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
              {formState.messageToShow}
            </Alert>
          </Collapse>
        ) : null}
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="event-text-filter"
                  freeSolo
                  autoHighlight
                  autoComplete
                  loading={isLoading}
                  options={formState.studentNameFilterData}
                  includeInputInList
                  getOptionLabel={option => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    return option.first_name;
                  }}
                  renderOption={option => option.first_name}
                  onChange={getStudentSelectedValue}
                  value={formState.isClearResetFilter ? null : value}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Student Name"
                      margin="normal"
                      variant="outlined"
                      placeholder="Search Students"
                      className={classes.autoCompleteField}
                      onChange={handleFilterChangeForStudentField}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {isLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <Autocomplete
                  id="combo-box-demo"
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
                      className={classes.autoCompleteField}
                      variant="outlined"
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
        {/* table */}

        <Card className={classes.tabledata} variant="outlined">
          {formState.student ? (
            formState.student.length ? (
              <Table
                data={formState.student}
                column={column}
                defaultSortField="name"
                defaultSortAsc={formState.sortAscending}
                editEvent={editCell}
                onSelectedRowsChange={handleRowSelected}
                deleteEvent={deleteCell}
                progressPending={formState.isDataLoading}
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
            cellName={formState.cellName}
            showModal={formState.showModalBlock}
            closeModal={handleCloseBlockUnblockModal}
            dataToBlockUnblock={formState.dataToBlockUnblock}
            verifiedByCollege={formState.dataVerifiedByCollege}
            blockUnblockEvent={isBlockUnblockCellCompleted}
            isMultiBlock={formState.isMulBlocked ? true : false}
            isMultiUnblock={formState.isMulUnBlocked ? true : false}
            multiBlockCollegeIds={formState.MultiBlockUser}
            modalClose={modalClose}
            clearSelectedRow={selectedRowCleared}
          />
        </Card>
      </Grid>
    </Grid>
  );
};
export default ManageStudents;
