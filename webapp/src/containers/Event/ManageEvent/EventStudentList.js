import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
import * as routeConstants from "../../../constants/RouteConstants";
import * as formUtilities from "../../../Utilities/FormUtilities";
import {
  Auth as auth,
  Spinner,
  GreenButton,
  YellowButton,
  GrayButton,
  Table,
  ThumbIcon,
  Alert
} from "../../../components";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as serviceProvider from "../../../api/Axios";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import HireStudent from "./HireStudent";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ExportCSV from "./ExportCSV";

const EVENT_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;
const STREAM_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;

const REGISTRATION_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENT_REGISTRATION;
const STUDENT_URL = strapiConstants.STRAPI_STUDENTS;
const SORT_FIELD_KEY = "_sort";
const NAME_FILTER = "user.first_name_contains";
const EVENT_FILTER = "event.id";
const STUDENT_FILTER = "student.id";
const educationYear = "educationYear";
const STREAM_FILTER = "stream.id";

const educationYearList = [
  { name: "First", id: "First" },
  { name: "Second", id: "Second" },
  { name: "Third", id: "Third" },
  { name: "Fourth", id: "Fourth" }
];

const StudentList = props => {
  const [open, setOpen] = React.useState(true);
  const history = useHistory();
  const classes = useStyles();
  const [streams, setStreams] = useState([]);
  const [formState, setFormState] = useState({
    students: [],
    registration: [],
    hireColor: {},
    greenButtonChecker: true,
    dataToShow: [],
    tempData: [],
    eventTitle: props["location"]["eventTitle"],
    eventId: props["location"]["eventId"],
    year: new Date(),
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
    isStudentHired: false,
    studentName: "",
    fromHiredModal: false,

    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true
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
      let defaultParams = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "father_first_name:asc"
      };
      Object.keys(paramsForevents).map(key => {
        defaultParams[key] = paramsForevents[key];
      });
      paramsForevents = defaultParams;
    } else {
      paramsForevents = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "father_first_name:asc"
      };
    }
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));
    let EVENT_ID = null;
    let regStudent_url = null;
    if (
      auth.getUserInfo().role.name === "Medha Admin" ||
      auth.getUserInfo().role.name === "College Admin"
    ) {
      EVENT_ID = formState.eventId;
      regStudent_url = EVENT_URL + "/" + EVENT_ID + "/" + STUDENT_URL;
      if (auth.getUserInfo().role.name === "College Admin") {
        paramsForevents["user.college"] = auth.getUserInfo()["college"]["id"];
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
              console.log("res1", res1);
              eventData = convertEventData(res.data.result, res1);
              console.log("eventData", eventData);
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
        auth.getUserInfo().role.name === "Medha Admin" ||
        auth.getUserInfo().role.name === "College Admin"
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
    let ids = [];
    for (let data in studentData) {
      let paramsForHire = {
        "event.id": props["location"]["eventId"],
        "student.id": studentData[data]["id"],
        hired_at_event: true
      };
      await serviceProvider
        .serviceProviderForGetRequest(REGISTRATION_URL, paramsForHire)
        .then(res => {
          if (res.data.result.length !== 0) {
            ids.push(studentData[data]["id"]);
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    }
    return ids;
  };

  const convertEventData = (data, hiredIds) => {
    let x = [];
    if (data.length > 0) {
      for (let i in data) {
        var eventIndividualData = {};
        eventIndividualData["id"] = data[i]["id"];
        eventIndividualData["studentid"] = data[i]["user"]
          ? data[i]["user"]["id"]
          : "";
        eventIndividualData["user"] = data[i]["user"]
          ? data[i]["user"]["username"]
          : "";
        eventIndividualData["name"] = data[i]["user"]
          ? data[i]["user"]["first_name"] +
            " " +
            data[i]["father_first_name"] +
            " " +
            data[i]["user"]["last_name"]
          : "";
        eventIndividualData["stream"] = data[i]["stream"]
          ? data[i]["stream"]["name"]
          : "";
        eventIndividualData["educations"] = data[i]["educations"][0]
          ? data[i]["educations"][0]["year_of_passing"]
          : "";
        eventIndividualData["mobile"] = data[i]["user"]
          ? data[i]["user"]["contact_number"]
          : "";
        if (hiredIds.includes(data[i]["id"])) {
          eventIndividualData["hired"] = true;
        } else {
          eventIndividualData["hired"] = false;
        }
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
      showModalHire: false
    }));
  };

  const handleCloseHireModal = () => {
    /** This restores all the data when we close the modal */
    setFormState(formState => ({
      ...formState,
      showModalHire: false
    }));
    if (formState.isStudentHired) {
      restoreData();
    }
  };

  const isStudentHiredCompleted = (
    status,
    fromHiredModal,
    isHired,
    isUnHired
  ) => {
    formState.isStudentHired = status;
    formState.fromHiredModal = fromHiredModal;
  };

  const hiredCell = event => {
    getEventRegistrationData(event.target.id);
  };

  const getEventRegistrationData = async id => {
    let paramsForHire = {
      "student.id": id,
      "event.id": formState.eventId
    };
    serviceProvider
      .serviceProviderForGetRequest(REGISTRATION_URL, paramsForHire)
      .then(res => {
        let registerData = res.data.result[0];
        let regUserID = registerData.id;
        if (registerData.hired_at_event) {
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
        studentName: studentName
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        dataToHire: id,
        isHired: false,
        isUnHired: true,
        showModalHire: true,
        studentName: studentName
      }));
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
        await getStudentList(perPage, page);
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
        await getStudentList(formState.pageSize, page);
      }
    }
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getStudentList(perPage, page, formState.filterDataParameters);
    }
  };
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
      texttvalue: ""
    }));

    /**Need to confirm this thing for resetting the data */
    restoreData();
  };

  const restoreData = () => {
    getStudentList(formState.pageSize, 1);
  };

  const handleChangeAutoComplete = (filterName, event, value) => {
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

  const handleFilterChange = (event, value) => {
    if (value != null) {
      formState.filterDataParameters[event.target.name] = event.target.value;

      setFormState(formState => ({
        ...formState,
        texttvalue: event.target.value
      }));
    } else {
      formState.filterDataParameters[event.target.name] = event.target.value;
      setFormState(formState => ({
        ...formState,
        texttvalue: null
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
      eventIndividualData["Stream"] = value[i]["stream"];
      eventIndividualData["Academic Year"] = value[i]["educations"];
      eventIndividualData["Mobile"] = value[i]["mobile"];

      data.push(eventIndividualData);
    }
    return data;
  };

  /** Table Data */
  const column = [
    {
      name: "Students",
      sortable: true,
      cell: row => <CustomLink row={row} />
    },
    { name: "Stream", sortable: true, selector: "stream" },
    { name: "Academic Year", sortable: true, selector: "educations" },
    { name: "Mobile", sortable: true, selector: "mobile" },

    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <ThumbIcon
              id={cell.id}
              value={cell.name}
              onClick={hiredCell}
              style={cell.hired}
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

  console.log(formState);
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Event Students List
        </Typography>
        <GreenButton
          variant="contained"
          color="secondary"
          onClick={() => backToManageEvent()}
          greenButtonChecker={formState.greenButtonChecker}
        >
          Back
        </GreenButton>
        {auth.getUserInfo().role.name === "College Admin" ? (
          <GreenButton
            variant="contained"
            color="secondary"
            startIcon={<PersonAddIcon />}
            onClick={() => toAddStudents()}
            greenButtonChecker={formState.greenButtonChecker}
          >
            Add Student
          </GreenButton>
        ) : null}

        <ExportCSV
          csvData={handleClickDownloadStudents(formState.dataToShow)}
          fileName="StudentList"
        />
      </Grid>

      {/** Error/Success messages to be shown for add */}
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
              ? "Student hired successfully"
              : "Student DeHired successfully"}
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
            Error hiring student
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
                  label={"Students"}
                  placeholder="Search Students"
                  variant="outlined"
                  name={NAME_FILTER}
                  value={formState.texttvalue}
                  onChange={(event, value) =>
                    handleFilterChange(event, event.target.value)
                  }
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
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
              <Grid item>
                <Autocomplete
                  id="education-year-list"
                  options={educationYearList}
                  getOptionLabel={option => option.name}
                  // onChange={(event, value) => {
                  //   handleChangeAutoComplete(educationYear, event, value);
                  // }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Academic Year"
                      variant="outlined"
                      name="tester"
                      className={classes.autoCompleteField}
                    />
                  )}
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
                  Search
                </YellowButton>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <GrayButton
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
                //defaultSortField="username"
                defaultSortAsc={formState.sortAscending}
                progressPending={formState.isDataLoading}
                paginationTotalRows={formState.totalRows}
                paginationRowsPerPageOptions={[10, 20, 50]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
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
            hiredSuccessfully={isStudentHiredCompleted}
            closeHireModal={handleCloseHireModal}
            modalClose={modalClose}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default StudentList;
