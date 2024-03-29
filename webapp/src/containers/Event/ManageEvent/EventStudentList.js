import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Collapse,
  IconButton,
  Icon,
  CircularProgress,
  Tooltip
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import * as routeConstants from "../../../constants/RouteConstants";
import * as formUtilities from "../../../utilities/FormUtilities";
import {
  Auth as auth,
  Spinner,
  GreenButton,
  YellowButton,
  GrayButton,
  Table,
  ThumbIcon,
  Alert,
  HowToReg
} from "../../../components";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import * as serviceProvider from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import HireStudent from "./HireStudent";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ExportCSV from "./ExportCSV";
import LoaderContext from "../../../context/LoaderContext";
import MarkAttaindance from "./MarkAttaindance";

const EVENT_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;
const STREAM_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;

const REGISTRATION_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENT_REGISTRATION;
const STUDENT_URL = strapiConstants.STRAPI_CONTACT_INDIVIDUAL;
const SORT_FIELD_KEY = "_sort";
const STUDENT_FILTER = "name_contains";
const MOBILE_NUMBER_FILTER = "phone_contains";
const STREAM_FILTER = "individual.stream.id";

const StudentList = props => {
  const [open, setOpen] = React.useState(true);
  const history = useHistory();
  const classes = useStyles();
  const [streams, setStreams] = useState([]);
  const { setLoaderStatus } = useContext(LoaderContext);
  /** Value to set for event filter */
  const [value, setValue] = React.useState(null);

  const [formState, setFormState] = useState({
    students: [],
    registration: [],
    hireColor: {},
    greenButtonChecker: true,
    dataToShow: props.testDataToShow ? props.testDataToShow : [],
    tempData: [],
    eventTitle: props["location"]["eventTitle"],
    eventId: props["location"]["eventId"],
    year: new Date(),

    studentFilterData: [],
    filterDataParameters: {},
    isClearResetFilter: false,
    isFilterSearch: false,
    texttvalue: "",
    hireStudentData: [],

    /*** Hire */
    dataToHire: {},
    isHired: false,
    isUnHired: false,
    showModalHire: false,
    studentName: "",
    hireStudent: "",

    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true,

    /** Attaindance */
    markAttaindance: "",
    dataToMarkAttaindance: {},
    isPresent: false,
    isAbsent: false,
    showModalAttaindance: false
  });

  useEffect(() => {
    getStudentList(10, 1);
    getFilterData();
  }, []);

  const getStudentList = async (pageSize, page, paramsForevents = null) => {
    if (
      paramsForevents !== null &&
      !formUtilities.checkEmpty(paramsForevents)
    ) {
      let defaultParams = {};
      if (paramsForevents.hasOwnProperty(SORT_FIELD_KEY)) {
        defaultParams = {
          page: page,
          pageSize: pageSize
        };
      } else {
        defaultParams = {
          page: page,
          pageSize: pageSize,
          [SORT_FIELD_KEY]: "name:asc"
        };
      }
      Object.keys(paramsForevents).map(key => {
        defaultParams[key] = paramsForevents[key];
      });
      paramsForevents = defaultParams;
    } else {
      paramsForevents = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "name:asc"
      };
    }
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));
    let EVENT_ID = null;
    let regStudent_url = null;
    if (
      auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
    ) {
      EVENT_ID = formState.eventId;
      regStudent_url = EVENT_URL + "/" + EVENT_ID + "/" + STUDENT_URL;
      if (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) {
        paramsForevents["individual.organization"] = auth.getUserInfo()[
          "studentInfo"
        ]["organization"]["id"];
      }
    }
    if (
      EVENT_ID !== undefined &&
      EVENT_ID !== null &&
      regStudent_url !== null
    ) {
      await serviceProvider
        .serviceProviderForGetRequest(regStudent_url, paramsForevents)
        .then(res => {
          formState.dataToShow = [];
          formState.tempData = [];
          let eventData = [];
          getHiredIds(res.data.result)
            .then(res1 => {
              eventData = convertEventData(res.data.result, res1);

              setFormState(formState => ({
                ...formState,
                students: res.data.result,
                pageSize: res.data.pageSize,
                totalRows: res.data.rowCount,
                page: res.data.page,
                pageCount: res.data.pageCount,
                dataToShow: eventData,
                tempData: eventData,
                isDataLoading: false
              }));
            })
            .catch(error => {});
        })
        .catch(error => {
          console.log("error", error);
        });
    } else {
      if (
        auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
        auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
      ) {
        history.push({
          pathname: routeConstants.MANAGE_EVENT
        });
      } else {
        history.push({
          pathname: routeConstants.DASHBOARD_URL
        });
      }
    }
  };

  const getHiredIds = async studentData => {
    let studentEventData = [];
    for (let data in studentData) {
      let paramsForHire = {
        "event.id": props["location"]["eventId"],
        "contact.id": studentData[data]["id"]
      };
      await serviceProvider
        .serviceProviderForGetRequest(REGISTRATION_URL, paramsForHire)
        .then(res => {
          for (let i in res.data.result) {
            var attaindandeAndHire = {};
            attaindandeAndHire["Attaindance"] =
              res.data.result[i]["is_attendance_verified"];
            attaindandeAndHire["HireDehire"] =
              res.data.result[i]["is_hired_at_event"];
            studentEventData.push(attaindandeAndHire);
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    }
    return studentEventData;
  };

  const convertEventData = (data, hiredIds) => {
    let x = [];
    if (data.length > 0) {
      for (let i in (data, hiredIds)) {
        var eventIndividualData = {};
        let educationYear = [];
        eventIndividualData["id"] = data[i]["id"];
        eventIndividualData["studentid"] = data[i]["individual"]["id"];
        eventIndividualData["user"] = data[i]["user"]
          ? data[i]["user"]["username"]
          : "";
        eventIndividualData["name"] = data[i]["name"];
        if (data[i]["individual"]) {
        } else {
          eventIndividualData["stream"] = "";
        }
        eventIndividualData["college"] =
          data[i]["individual"] &&
          data[i]["individual"]["organization"] &&
          data[i]["individual"]["organization"]["name"]
            ? data[i]["individual"]["organization"]["name"]
            : "";

        eventIndividualData["stream"] =
          data[i]["individual"] &&
          data[i]["individual"]["stream"] &&
          data[i]["individual"]["stream"]["name"]
            ? data[i]["individual"]["stream"]["name"]
            : "";
        if (data[i]["qualifications"]) {
          for (let j in data[i]["qualifications"]) {
            if (
              data[i]["qualifications"][j]["pursuing"] &&
              data[i]["qualifications"][j]["education_year"] !== null
            ) {
              educationYear.push(
                data[i]["qualifications"][j]["education_year"]
              );
            }
          }
          eventIndividualData["educations"] = educationYear;
        } else {
          eventIndividualData["educations"] = [];
        }
        eventIndividualData["mobile"] = data[i]["phone"]
          ? data[i]["phone"]
          : "";

        eventIndividualData["attaindance"] = hiredIds[i]["Attaindance"];
        eventIndividualData["hired"] = hiredIds[i]["HireDehire"];
        x.push(eventIndividualData);
      }
      return x;
    }
  };

  const getFilterData = () => {
    let params = {
      pageSize: -1
    };

    serviceProvider
      .serviceProviderForGetRequest(STREAM_URL, params)
      .then(res => {
        setStreams(res.data.result);
      })
      .catch(error => {
        console.log("error");
      });
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalHire: false,
      showModalAttaindance: false
    }));
  };

  const handleCloseHireModal = status => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setOpen(true);
    setFormState(formState => ({
      ...formState,
      isStudentHired: status,
      showModalHire: false,
      fromHiredModal: true,
      isAttaindanceMarked: false,
      fromAttaindanceModal: false
    }));
    if (status) {
      getStudentList(
        formState.pageSize,
        formState.page,
        formState.filterDataParameters
      );
    }
  };

  const hiredCell = event => {
    setLoaderStatus(true);
    setFormState(formState => ({
      ...formState,
      hireStudent: event.target.getAttribute("value")
    }));
    getEventRegistrationData(event.target.id);
  };

  const getEventRegistrationData = async id => {
    let paramsForHire = {
      "contact.id": id,
      "event.id": formState.eventId
    };
    serviceProvider
      .serviceProviderForGetRequest(REGISTRATION_URL, paramsForHire)
      .then(res => {
        let registerData = res.data.result[0];
        let regUserID = registerData.id;
        if (registerData.is_hired_at_event) {
          registerCellData(regUserID, false, "");
        } else {
          registerCellData(regUserID, true, "");
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  const registerCellData = (id, isHired = false, studentName) => {
    if (isHired === true) {
      setFormState(formState => ({
        ...formState,
        dataToHire: id,
        isHired: true,
        isUnHired: false,
        showModalHire: true,
        fromHiredModal: false,
        isStudentHired: false
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        dataToHire: id,
        isHired: false,
        isUnHired: true,
        showModalHire: true,
        messageToShow: "",
        fromHiredModal: false,
        isStudentHired: false
      }));
    }
    setLoaderStatus(false);
  };

  const handleAttaindance = event => {
    setLoaderStatus(true);
    setFormState(formState => ({
      ...formState,
      markAttaindance: event.target.getAttribute("value")
    }));
    markStudentAttaindance(event.target.id);
  };

  const markStudentAttaindance = async id => {
    let paramsForHire = {
      "contact.id": id,
      "event.id": formState.eventId
    };
    serviceProvider
      .serviceProviderForGetRequest(REGISTRATION_URL, paramsForHire)
      .then(res => {
        let registerData = res.data.result[0];
        let regUserID = registerData.id;
        if (registerData.is_attendance_verified) {
          attaindanceCellData(regUserID, false, "");
        } else {
          attaindanceCellData(regUserID, true, "");
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  const attaindanceCellData = (id, isPresent = false, studentName) => {
    if (isPresent === true) {
      setFormState(formState => ({
        ...formState,
        dataToMarkAttaindance: id,
        isPresent: true,
        isAbsent: false,
        showModalAttaindance: true,
        studentName: studentName
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        dataToMarkAttaindance: id,
        isPresent: false,
        isAbsent: true,
        showModalAttaindance: true,
        studentName: studentName
      }));
    }
    setLoaderStatus(false);
  };

  const handleCloseAttaindanceModal = status => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setOpen(true);
    setFormState(formState => ({
      ...formState,
      isAttaindanceMarked: status,
      showModalAttaindance: false,
      fromAttaindanceModal: true,
      isStudentHired: false,
      fromHiredModal: false
    }));
    if (status) {
      getStudentList(
        formState.pageSize,
        formState.page,
        formState.filterDataParameters
      );
    }
  };

  /** Pagination */
  const handlePerRowsChange = async (perPage, page) => {
    /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getStudentList(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getStudentList(perPage, page, formState.filterDataParameters);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getStudentList(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getStudentList(
          formState.pageSize,
          page,
          formState.filterDataParameters
        );
      }
    }
  };

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
    } else {
      formState.filterDataParameters[filterName] = value["id"];
      setFormState(formState => ({
        ...formState,
        isClearResetFilter: false
      }));
    }
  };

  const handleClick = event => {
    history.push({
      pathname: routeConstants.VIEW_STUDENT_PROFILE,
      dataForStudent: event.target.id,
      fromAddStudentToRecruitmentDrive: false,
      fromEventStudentList: true,
      eventId: formState.eventId,
      eventTitle: formState.eventTitle
    });
  };

  /** To make cell data hypertext */
  const CustomLink = ({ row }) => (
    <div>
      {}
      <div>
        <a href="#" id={row.studentid} onClick={handleClick}>
          {row.name}
        </a>
      </div>
    </div>
  );

  const backToManageEvent = () => {
    history.push({
      pathname: routeConstants.MANAGE_EVENT
    });
  };

  const toAddStudents = () => {
    history.push({
      pathname: routeConstants.ADD_STUDENT_DRIVE,
      eventId: formState.eventId,
      eventTitle: formState.eventTitle
    });
  };

  /** Data Export Functionality */
  const handleClickDownloadStudents = value => {
    let data = [];
    for (let i in value) {
      var eventIndividualData = {};
      eventIndividualData["Name"] = value[i]["name"];
      eventIndividualData["Mobile"] = value[i]["mobile"];
      eventIndividualData["College Name"] = value[i]["college"];
      eventIndividualData["Stream"] = value[i]["stream"];
      if (value[i]["attaindance"]) {
        eventIndividualData["Attended"] = "Yes";
      } else {
        eventIndividualData["Attended"] = "No";
      }
      if (value[i]["hired"]) {
        eventIndividualData["Hired"] = "Yes";
      } else {
        eventIndividualData["Hired"] = "No";
      }

      data.push(eventIndividualData);
    }
    return data;
  };

  /** Used for restoring data */
  const restoreData = () => {
    getStudentList(formState.pageSize, 1);
  };

  /** Filter methods and functions */
  /** This restores all the data when we clear the filters*/

  const clearFilter = () => {
    setFormState(formState => ({
      ...formState,
      isFilterSearch: false,
      /** Clear all filters */
      filterDataParameters: {},
      /** Turns on the spinner */
      isClearResetFilter: true,
      isStateClearFilter: true,
      isDataLoading: true,
      studentFilterData: []
    }));
    formState.filterDataParameters[STUDENT_FILTER] = "";
    /**Need to confirm this thing for resetting the data */
    restoreData();
  };

  const handleFilterChangeForStudentField = event => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [event.target.name]: event.target.value
      }
    }));
    event.persist();
    // setRpcsFilter(event.target.value);
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getStudentList(perPage, page, formState.filterDataParameters);
    } else {
      await getStudentList(perPage, page);
    }
  };

  const handleSort = (
    column,
    sortDirection,
    perPage = formState.pageSize,
    page = 1
  ) => {
    if (column.selector === "stream") {
      column.selector = "individual.stream.name";
    }
    formState.filterDataParameters[SORT_FIELD_KEY] =
      column.selector + ":" + sortDirection;
    getStudentList(perPage, page, formState.filterDataParameters);
  };

  /** Table Data */
  const column = [
    {
      name: "Name",
      sortable: true,
      selector: "name",
      cell: row => <CustomLink row={row} />
    },
    { name: "Stream", sortable: true, selector: "stream" },
    {
      name: "Education year",
      sortable: true,
      cell: row => (
        <Tooltip
          title={
            <React.Fragment>
              <Typography color="inherit">{`${row.educations}`}</Typography>
            </React.Fragment>
          }
          placement="top"
        >
          <div>{`${row.educations}`}</div>
        </Tooltip>
      )
    },
    { name: "Mobile", selector: "mobile" },

    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingSomeActionButton}>
            <HowToReg
              id={cell.id}
              value={cell.name}
              onClick={handleAttaindance}
              style={cell.attaindance}
            />
          </div>
          {cell.attaindance === true ? (
            <div className={classes.PaddingActionButton}>
              <ThumbIcon
                id={cell.id}
                value={cell.name}
                onClick={hiredCell}
                style={cell.hired}
              />
            </div>
          ) : null}
        </div>
      ),
      width: "20%",
      cellStyle: {
        width: "auto",
        maxWidth: "auto"
      }
    }
  ];

  return (
    <Grid>
      <Grid
        container
        spacing={3}
        justify="space-between"
        className={classes.title}
      >
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Event Students List
          </Typography>
        </Grid>
        <Grid item>
          {auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN ? (
            <GreenButton
              id="addStudents"
              variant="contained"
              color="secondary"
              startIcon={<PersonAddIcon />}
              onClick={() => toAddStudents()}
              greenButtonChecker={formState.greenButtonChecker}
              style={{ margin: "2px", marginRight: "15px" }}
            >
              Add Student
            </GreenButton>
          ) : null}

          <ExportCSV
            id="exportCsv"
            csvData={handleClickDownloadStudents(formState.dataToShow)}
            fileName={formState.eventTitle}
          />
          <GreenButton
            id="backToManageEvent"
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => backToManageEvent()}
            startIcon={<Icon>keyboard_arrow_left</Icon>}
            greenButtonChecker={formState.greenButtonChecker}
            style={{ margin: "2px" }}
          >
            Back to listing
          </GreenButton>
        </Grid>
      </Grid>

      {/** Error/Success messages to be shown for student */}
      {formState.fromAttaindanceModal && formState.isAttaindanceMarked ? (
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
            {formState.isPresent
              ? "The Student " +
                formState.markAttaindance +
                " has been marked as present."
              : "The Student " +
                formState.markAttaindance +
                " has been marked as absent."}
          </Alert>
        </Collapse>
      ) : null}
      {formState.fromAttaindanceModal && !formState.isAttaindanceMarked ? (
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
            {formState.isPresent
              ? "An error has occured while marking student " +
                formState.markAttaindance +
                " attaindance. Kindly, try again."
              : "An error has occured while removing student. " +
                formState.markAttaindance +
                " attaindance Kindly, try again."}
          </Alert>
        </Collapse>
      ) : null}

      {formState.fromHiredModal && formState.isStudentHired ? (
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
            {formState.isHired
              ? "The Student " +
                formState.hireStudent +
                " has been marked as hired."
              : "The Student " +
                formState.hireStudent +
                " has been marked as dehired."}
          </Alert>
        </Collapse>
      ) : null}
      {formState.fromHiredModal && !formState.isStudentHired ? (
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
            {formState.isHired
              ? "An error has occured while hiring student " +
                formState.hireStudent +
                " . Kindly, try again."
              : "An error has occured while dehiring student. " +
                formState.hireStudent +
                " Kindly, try again."}
          </Alert>
        </Collapse>
      ) : null}

      <Grid item xs={12} className={classes.formgrid}>
        <Typography variant="h5" gutterBottom color="textSecondary">
          {formState.eventTitle}
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <TextField
                  id="studentName"
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  name={STUDENT_FILTER}
                  value={formState.filterDataParameters[STUDENT_FILTER] || ""}
                  placeholder="Name"
                  className={classes.autoCompleteField}
                  onChange={handleFilterChangeForStudentField}
                />
              </Grid>
              <Grid item className={classes.paddingDate}>
                <Autocomplete
                  id="streams-filter"
                  name={STREAM_FILTER}
                  options={streams}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(STREAM_FILTER, event, value)
                  }
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
              <Grid item>
                <TextField
                  id="mobileNumberFilter"
                  label="Mobile Number"
                  margin="normal"
                  variant="outlined"
                  name={MOBILE_NUMBER_FILTER}
                  value={
                    formState.filterDataParameters[MOBILE_NUMBER_FILTER] || ""
                  }
                  placeholder="Mobile Number"
                  className={classes.autoCompleteField}
                  onChange={handleFilterChangeForStudentField}
                />
              </Grid>

              <Grid item className={classes.filterButtonsMargin}>
                <YellowButton
                  id="submitFiter"
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={event => {
                    event.persist();
                    searchFilter();
                  }}
                >
                  Search
                </YellowButton>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <GrayButton
                  id="clearFilter"
                  variant="contained"
                  color="primary"
                  onClick={clearFilter}
                  disableElevation
                >
                  Reset
                </GrayButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card className={classes.tabledata} variant="outlined">
          {formState.dataToShow ? (
            formState.dataToShow.length ? (
              <Table
                data={formState.dataToShow}
                column={column}
                selectableRows={false}
                defaultSortField="user.first_name"
                onSort={handleSort}
                sortServer={true}
                paginationDefaultPage={formState.page}
                paginationPerPage={formState.pageSize}
                defaultSortAsc={formState.sortAscending}
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
            <div className={classes.noDataMargin}>No data to show</div>
          )}
          <HireStudent
            id={formState.dataToHire}
            showModal={formState.showModalHire}
            isHired={formState.isHired}
            isUnHired={formState.isUnHired}
            //hiredSuccessfully={isStudentHiredCompleted}
            closeHireModal={handleCloseHireModal}
            modalClose={modalClose}
            studentName={formState.hireStudent}
          />
          <MarkAttaindance
            id={formState.dataToMarkAttaindance}
            showModal={formState.showModalAttaindance}
            isPresent={formState.isPresent}
            isAbsent={formState.isAbsent}
            closeAttaindanceModal={handleCloseAttaindanceModal}
            modalClose={modalClose}
            studentName={formState.markAttaindance}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default StudentList;
