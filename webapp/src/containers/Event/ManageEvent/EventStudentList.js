import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
  Table
} from "../../../components";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as serviceProvider from "../../../api/Axios";
import useStyles from "../../ContainerStyles/ManagePageStyles";

const EVENT_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;

const STUDENT_URL = strapiConstants.STRAPI_STUDENTS;
const SORT_FIELD_KEY = "_sort";

const StudentList = props => {
  const history = useHistory();

  const classes = useStyles();

  const [formState, setFormState] = useState({
    students: [],
    greenButtonChecker: true,
    dataToShow: [],
    tempData: [],

    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true
  });

  console.log("studentDATA", formState.students);

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
    let zones_url = null;
    if (auth.getUserInfo().role.name === "Medha Admin") {
      EVENT_ID = props["location"]["eventIdStudent"];
      zones_url = EVENT_URL + "/" + EVENT_ID + "/" + STUDENT_URL;
    }

    if (EVENT_ID !== null && zones_url !== null) {
      await serviceProvider
        .serviceProviderForGetRequest(zones_url, paramsForevents)
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
        console.log("data", data[i]["educations"][0]);
        var eventIndividualData = {};
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
  /** Table Data */
  const column = [
    { name: "Students", sortable: true, selector: "user" },
    { name: "Stream", sortable: true, selector: "stream" },
    { name: "Year Of Passing", sortable: true, selector: "educations" },
    { name: "Mobile", sortable: true, selector: "mobile" },

    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <Tooltip title="Hire" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                //onClick={viewCell}
                style={{ color: "green" }}
              >
                thumb_up
              </i>
            </Tooltip>
          </div>
          <div className={classes.PaddingActionButton}>
            <Tooltip title="View" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                //onClick={editCell}
                style={{ color: "green" }}
              >
                view_list
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
          Event Students List
        </Typography>

        <GreenButton
          variant="contained"
          color="secondary"
          // onClick={() => deleteMulUserById()}
          // startIcon={<DeleteIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          Download List
        </GreenButton>

        <GreenButton
          variant="contained"
          color="primary"
          //onClick={clearFilter}
          disableElevation
          //to={routeConstants.ADD_EVENT}
          // startIcon={<AddCircleOutlineOutlinedIcon />}
          greenButtonChecker={formState.greenButtonChecker}
        >
          Mark as Hired
        </GreenButton>
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
                  //name={EVENT_FILTER}
                  value={formState.texttvalue}
                  //onChange={(event, value) => handleFilterChange(event, value)}
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
                      label="Year Of Passing"
                      placeholder="Year Of Passing"
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
                  //   onClick={event => {
                  //     event.persist();
                  //     searchFilter();
                  //   }}
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
                // onSelectedRowsChange={handleRowSelected}
                // deleteEvent={deleteCell}
                defaultSortField="username"
                defaultSortAsc={formState.sortAscending}
                progressPending={formState.isDataLoading}
                paginationTotalRows={formState.totalRows}
                paginationRowsPerPageOptions={[10, 20, 50]}
                // onChangeRowsPerPage={handlePerRowsChange}
                // onChangePage={handlePageChange}
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

export default StudentList;
