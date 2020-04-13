import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import GetAppIcon from "@material-ui/icons/GetApp";

import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";
import * as routeConstants from "../../../constants/RouteConstants";
import * as formUtilities from "../../../Utilities/FormUtilities";
import {
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
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const REGISTRATION_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENT_REGISTRATION;
const STREAMS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;
const SORT_FIELD_KEY = "_sort";
const NAME_FILTER = "username_contains";
const STREAMS_FILTER = "stream.id";

const AddStudentToRecruitmentDrive = props => {
  const history = useHistory();
  const classes = useStyles();
  const [streams, setStreams] = useState([]);

  const [formState, setFormState] = useState({
    streams: [],
    students: [],
    greenButtonChecker: true,
    dataToShow: [],
    eventTitle: props["location"]["eventTitle"],
    eventId: props["location"]["eventId"],
    year: new Date(),
    filterDataParameters: {},
    isClearResetFilter: false,
    isFilterSearch: false,
    texttvalue: "",

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
    getFilterData();
  }, []);

  const getFilterData = () => {
    let params = {
      pageSize: -1
    };
    serviceProvider
      .serviceProviderForGetRequest(STREAMS_URL, params)
      .then(res => {
        setStreams(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  const getStudentList = async (pageSize, page, paramsForStudent = null) => {
    if (
      paramsForStudent !== null &&
      !formUtilities.checkEmpty(paramsForStudent)
    ) {
      let defaultParams = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "father_first_name:asc"
      };
      Object.keys(paramsForStudent).map(key => {
        defaultParams[key] = paramsForStudent[key];
      });
      paramsForStudent = defaultParams;
    } else {
      paramsForStudent = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "father_first_name:asc"
      };
    }
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));
    let Get_student_list =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_COLLEGES +
      "/" +
      formState.eventId +
      "/" +
      strapiConstants.STRAPI_STUDENTS;
    if (formState.eventId !== undefined && formState.eventId !== null) {
      await serviceProvider
        .serviceProviderForGetRequest(Get_student_list, paramsForStudent)
        .then(res => {
          formState.dataToShow = [];
          let eventData = [];
          eventData = convertStudentData(res.data.result);
          setFormState(formState => ({
            ...formState,
            students: res.data.result,
            pageSize: res.data.pageSize,
            totalRows: res.data.rowCount,
            page: res.data.page,
            pageCount: res.data.pageCount,
            dataToShow: eventData,
            isDataLoading: false
          }));
        })
        .catch(error => {
          console.log("error", error);
        });
    } else {
      history.push({
        pathname: routeConstants.MANAGE_EVENT
      });
    }
  };

  const convertStudentData = data => {
    let x = [];
    if (data.length > 0) {
      for (let i in data) {
        var individualStudentData = {};
        individualStudentData["id"] = data[i]["id"];
        individualStudentData["studentid"] = data[i]["user"]
          ? data[i]["user"]["id"]
          : "";
        individualStudentData["user"] = data[i]["user"]
          ? data[i]["user"]["username"]
          : "";
        individualStudentData["name"] = data[i]["user"]
          ? data[i]["user"]["first_name"] +
            " " +
            data[i]["father_first_name"] +
            " " +
            data[i]["user"]["last_name"]
          : "";
        individualStudentData["stream"] = data[i]["stream"]
          ? data[i]["stream"]["name"]
          : "";
        individualStudentData["educations"] = data[i]["educations"][0]
          ? data[i]["educations"][0]["year_of_passing"]
          : "";
        individualStudentData["mobile"] = data[i]["user"]
          ? data[i]["user"]["contact_number"]
          : "";
        x.push(individualStudentData);
      }
      return x;
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
    } else {
      await getStudentList(perPage, page);
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
      dataForStudent: event.target.id,
      fromAddStudentToRecruitmentDrive: true,
      fromEventStudentList: false,
      eventId: formState.eventId,
      eventTitle: formState.eventTitle
    });
  };

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

  const backToStudentList = () => {
    history.push({
      pathname: routeConstants.EVENT_STUDENT_LIST,
      eventIdStudent: formState.eventId,
      eventTitle: formState.eventTitle
    });
  };

  /** Table Data */
  const column = [
    {
      name: "Student Name",
      sortable: true,
      cell: row => <CustomLink row={row} />
    },
    { name: "Stream", sortable: true, selector: "stream" },
    { name: "Academic Year", sortable: true, selector: "educations" }
  ];

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Add Student
        </Typography>

        <GreenButton
          variant="contained"
          color="secondary"
          onClick={() => backToStudentList()}
          startIcon={<ArrowBackIosIcon />}
          greenButtonChecker={formState.greenButtonChecker}
        >
          Back
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Typography variant="h4" gutterBottom>
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
                  placeholder="Search by student's name"
                  variant="outlined"
                  name={NAME_FILTER}
                  value={formState.texttvalue}
                  onChange={(event, value) => handleFilterChange(event, value)}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  name={STREAMS_FILTER}
                  options={streams}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
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
        </Card>
      </Grid>
    </Grid>
  );
};

export default AddStudentToRecruitmentDrive;
