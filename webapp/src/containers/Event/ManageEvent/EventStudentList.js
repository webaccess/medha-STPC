import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbIcon from "../../../components/ThumbGridIcon/ThumbGridIcon";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Link } from "react-router-dom";

import {
  TextField,
  Card,
  CardContent,
  Tooltip,
  Grid,
  Collapse,
  IconButton,
  Typography
} from "@material-ui/core";
import * as routeConstants from "../../../constants/RouteConstants";
import * as formUtilities from "../../../Utilities/FormUtilities";
import {
  Auth as auth,
  Spinner,
  GreenButton,
  YellowButton,
  GrayButton,
  Table,
  YearMonthPicker
} from "../../../components";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as serviceProvider from "../../../api/Axios";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import HireStudent from "./HireStudent";

const EVENT_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;
const REGISTRATION_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENT_REGISTRATION;
const STUDENT_URL = strapiConstants.STRAPI_STUDENTS;
const SORT_FIELD_KEY = "_sort";
const NAME_FILTER = "username_contains";
const EVENT_FILTER = "event.id";
const STUDENT_FILTER = "student.id";

const StudentList = props => {
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const classes = useStyles();

  const [formState, setFormState] = useState({
    students: [],
    registration: [],
    greenButtonChecker: true,
    dataToShow: [],
    tempData: [],
    eventTitle: props["location"]["eventTitle"],
    year: new Date(),
    filterDataParameters: {},
    isClearResetFilter: false,
    isFilterSearch: false,
    texttvalue: "",
    selectedRowFilter: true,

    /*** Hire */
    dataToHire: {},
    isHired: false,
    isUnHired: false,
    showModalHire: false,
    isStudentHired: false,

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
      EVENT_ID = props["location"]["eventIdStudent"];
      regStudent_url = EVENT_URL + "/" + EVENT_ID + "/" + STUDENT_URL;
    }
    if (EVENT_ID !== null && regStudent_url !== null) {
      await serviceProvider
        .serviceProviderForGetRequest(regStudent_url, paramsForevents)
        .then(res => {
          formState.dataToShow = [];
          formState.tempData = [];
          let eventData = [];
          eventData = convertEventData(res.data.result);
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
        .catch(error => {
          console.log("error", error);
        });
    } else {
      if (auth.getUserInfo().role.name === "Medha Admin") {
        history.push({
          pathname: routeConstants.MANAGE_EVENT
        });
      } else if (auth.getUserInfo().role.name === "Student") {
        history.push({
          pathname: routeConstants.ELIGIBLE_EVENT
        });
      } else {
        history.push({
          pathname: routeConstants.DASHBOARD_URL
        });
      }
    }
  };

  const convertEventData = data => {
    let x = [];
    if (data.length > 0) {
      for (let i in data) {
        var eventIndividualData = {};
        eventIndividualData["id"] = data[i]["id"];
        eventIndividualData["user"] = data[i]["user"]
          ? data[i]["user"]["username"]
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
        x.push(eventIndividualData);
      }
      return x;
    }
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

  const isStudentHiredCompleted = status => {
    formState.isStudentHired = status;
  };

  const hiredCell = event => {
    getEventRegistrationData(event.target.id);
  };

  const getEventRegistrationData = async id => {
    let paramsForHire = {
      "student.id": id,
      "event.id": props["location"]["eventIdStudent"]
    };
    serviceProvider
      .serviceProviderForGetRequest(REGISTRATION_URL, paramsForHire)
      .then(res => {
        let registerData = res.data.result[0];
        let regUserID = registerData.id;
        if (registerData.hired_at_event) {
          registerCellData(regUserID, false);
        } else {
          registerCellData(regUserID, true);
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  const registerCellData = (id, isHired = false) => {
    if (isHired === true) {
      setFormState(formState => ({
        ...formState,
        dataToHire: id,
        isHired: true,
        isUnHired: false,
        showModalHire: true
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        dataToHire: id,
        isHired: false,
        isUnHired: true,
        showModalHire: true
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
      isDataLoading: true,
      texttvalue: ""
    }));

    /**Need to confirm this thing for resetting the data */
    restoreData();
  };

  const restoreData = () => {
    getStudentList(formState.pageSize, 1);
  };

  const handleRowSelected = useCallback(state => {
    if (state.selectedCount >= 1) {
      setFormState(formState => ({
        ...formState,
        selectedRowFilter: false
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        selectedRowFilter: true
      }));
    }
    setSelectedRows(state.selectedRows);
  }, []);

  const handleYearChange = date => {
    //formState.filterDataParameters[date.target.name] = date.target.value;
    setFormState(formState => ({
      ...formState,
      year: date
    }));
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
      dataForStudent: event.target.id
    });
  };

  const CustomLink = ({ row }) => (
    <div>
      {}
      <div id={row.id}>
        <Link id={row.id} onClick={handleClick}>
          {" "}
          {row.user}{" "}
        </Link>
        {/* <a href="#" id={row.id} onClick={handleClick}>
          {row.user}
        </a> */}
      </div>
    </div>
  );

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
            {/* <Tooltip title="Hire" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                onClick={hiredCell}
                style={{ color: "green" }}
              >
                thumb_up
              </i>
            </Tooltip> */}
            <ThumbIcon id={cell.id} value={cell.name} onClick={hiredCell} />
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
          Event Students List
        </Typography>

        <GreenButton
          variant="contained"
          color="secondary"
          // onClick={() => deleteMulUserById()}
          startIcon={<GetAppIcon />}
          greenButtonChecker={formState.greenButtonChecker}
        >
          Download List
        </GreenButton>

        <GreenButton
          variant="contained"
          color="primary"
          //onClick={clearFilter}
          disableElevation
          startIcon={<ThumbUpIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          Mark as Hire
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Typography variant="h3" gutterBottom>
          {formState.eventTitle}
        </Typography>
      </Grid>

      <Grid item xs={12} className={classes.formgrid}>
        <Card>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <TextField
                  label={"Student Name"}
                  placeholder="Student Name"
                  variant="outlined"
                  name={NAME_FILTER}
                  value={formState.texttvalue}
                  onChange={(event, value) => handleFilterChange(event, value)}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  //name={ROLE_FILTER}
                  options={[]}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  // onChange={(event, value) =>
                  //   handleChangeAutoComplete(ROLE_FILTER, event, value)
                  // }
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
                <YearMonthPicker
                  label="Academic Year"
                  value={formState.year}
                  onChange={handleYearChange}
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
                  //onClick={clearFilter}
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
                onSelectedRowsChange={handleRowSelected}
                // deleteEvent={deleteCell}
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
