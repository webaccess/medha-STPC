import React, { useEffect, useState, useCallback } from "react";
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
  Tooltip
} from "@material-ui/core";
import * as routeConstants from "../../../constants/RouteConstants";
import * as formUtilities from "../../../utilities/FormUtilities";
import {
  Spinner,
  GreenButton,
  YellowButton,
  GrayButton,
  Table,
  Auth as auth,
  Alert,
  AddStudentIcon,
  ToolTipComponent
} from "../../../components";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as serviceProvider from "../../../api/Axios";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import RegisterEvent from "../EventRegistration/EventRegistration";
import CloseIcon from "@material-ui/icons/Close";
import * as genericConstants from "../../../constants/GenericConstants";

const REGISTRATION_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENT_REGISTRATION;
const STREAMS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;
const SORT_FIELD_KEY = "_sort";
const USER_FILTER = "name_contains";
const STREAM_FILTER = "individual.stream.id";

const AddStudentToRecruitmentDrive = props => {
  const history = useHistory();
  const classes = useStyles();
  const [streams, setStreams] = useState([]);
  const [open, setOpen] = React.useState(true);

  const [selectedRows, setSelectedRows] = useState({
    selectedRows: [],
    selectedRowsCount: null,
    selectedRowsIds: []
  });
  const [formState, setFormState] = useState({
    streams: [],
    alreadyRegisteredStudentsId: [],
    greenButtonChecker: true,
    dataToShow: [],
    eventTitle: props["location"]["eventTitle"],
    eventId: props["location"]["eventId"],
    year: new Date(),
    filterDataParameters: {},
    isClearResetFilter: false,
    isFilterSearch: false,
    texttvalue: "",
    collegeId: auth.getUserInfo()["studentInfo"]["organization"]["id"],
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
    sortAscending: true,
    /** Selected rows */
    selectedRowFilter: true,
    /** Registration */
    showRegisterModel: false,
    fromModal: false,
    message: "",
    fromAddStudentToRecruitmentDrive: true,
    status: null,
    isSingleReg: false,
    regUserId: null,
    isRegButtonClicked: false,
    regStudentName: "",
    toggleCleared: false
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
      let defaultParams = {};
      if (paramsForStudent.hasOwnProperty(SORT_FIELD_KEY)) {
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
      Object.keys(paramsForStudent).map(key => {
        defaultParams[key] = paramsForStudent[key];
      });
      paramsForStudent = defaultParams;
    } else {
      paramsForStudent = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "name:asc"
      };
    }
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));

    if (formState.eventId !== undefined && formState.eventId !== null) {
      /** Url which gives eligible students for an event */
      let get_student_list =
        strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_EVENTS +
        "/" +
        formState.eventId +
        "/" +
        strapiConstants.STRAPI_ORGANIZATION +
        "/" +
        formState.collegeId +
        "/" +
        strapiConstants.STRAPI_INDIVIDUALS;
      await serviceProvider
        .serviceProviderForGetRequest(get_student_list, paramsForStudent)
        .then(res => {
          formState.dataToShow = [];
          let eventData = [];
          eventData = convertStudentData(res.data.result);
          setFormState(formState => ({
            ...formState,
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
        let educationYear = [];
        individualStudentData["id"] = data[i]["id"];
        individualStudentData["studentid"] = data[i]["individual"]["id"];
        individualStudentData["user"] = data[i]["user"]
          ? data[i]["user"]["username"]
          : "";
        individualStudentData["name"] = data[i]["name"];
        individualStudentData["stream"] =
          data[i]["individual"] &&
          data[i]["individual"]["stream"] &&
          data[i]["individual"]["stream"]["name"]
            ? data[i]["individual"]["stream"]["name"]
            : "";
        individualStudentData["mobile"] = data[i]["phone"]
          ? data[i]["phone"]
          : "";
        if (data[i]["qualifications"]) {
          for (let j in data[i]["qualifications"]) {
            educationYear.push(data[i]["qualifications"][j]["education_year"]);
          }
          individualStudentData["qualifications"] = educationYear;
        } else {
          individualStudentData["qualifications"] = [];
        }
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
    selectedRowCleared(true);
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
    getStudentList(10, 1);
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
      eventId: formState.eventId,
      eventTitle: formState.eventTitle
    });
  };

  const handleRowSelected = useCallback(state => {
    setSelectedRows(selectedRows => ({
      ...selectedRows,
      selectedRows: state.selectedRows,
      selectedRowsCount: state.selectedCount
    }));
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
  }, []);

  const addStudentsToEvent = async () => {
    setFormState(formState => ({
      ...formState,
      showRegisterModel: true,
      isSingleReg: false,
      isRegButtonClicked: true
    }));
  };

  const addSingleStudentToRegistration = event => {
    formState.regStudentName = event.target.getAttribute("value");
    setFormState(formState => ({
      ...formState,
      showRegisterModel: true,
      isSingleReg: true,
      isRegButtonClicked: true,
      regUserId: event.target.id
    }));
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showRegisterModel: false,
      isSingleReg: false,
      isRegButtonClicked: false,
      regUserId: null
    }));
  };

  const setStatusDataWhileClosingModal = (status, messsage, fromModal) => {
    selectedRowCleared(true);
    setFormState(formState => ({
      ...formState,
      status: status,
      isSingleReg: false,
      message: messsage,
      fromModal: fromModal
    }));
    getStudentList(formState.pageSize, 1);
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
    {
      name: "Stream",
      selector: "stream",
      cell: row => <ToolTipComponent data={row.stream} />
    },
    {
      name: "Education year",
      cell: row => <ToolTipComponent data={`${row.qualifications}`} />
    },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <AddStudentIcon
              id={cell.id}
              value={cell.name}
              onClick={addSingleStudentToRegistration}
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

  const selectedRowCleared = data => {
    formState.toggleCleared = data;
    setTimeout(() => {
      setFormState(formState => ({
        ...formState,
        toggleCleared: false
      }));
    }, 2000);
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Add Student
        </Typography>

        <GreenButton
          variant="contained"
          color="secondary"
          onClick={() => addStudentsToEvent()}
          buttonDisabled={formState.selectedRowFilter}
          greenButtonChecker={formState.greenButtonChecker}
        >
          Add Selected Student's
        </GreenButton>
        <GreenButton
          variant="contained"
          color="secondary"
          onClick={() => backToStudentList()}
          greenButtonChecker={formState.greenButtonChecker}
        >
          Back
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Typography variant="h5" gutterBottom>
          {formState.eventTitle}
        </Typography>
      </Grid>

      {/** Error/Success messages to be shown for add */}
      {formState.fromModal && formState.status ? (
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
            {formState.message}
          </Alert>
        </Collapse>
      ) : null}
      {formState.fromModal && !formState.status ? (
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
            {formState.message}
          </Alert>
        </Collapse>
      ) : null}

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
                defaultSortField="user.first_name"
                defaultSortAsc={formState.sortAscending}
                onSelectedRowsChange={handleRowSelected}
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
            <div className={classes.noDataMargin}>No data to show</div>
          )}
        </Card>
      </Grid>
      {formState.isRegButtonClicked ? (
        <RegisterEvent
          showModal={formState.showRegisterModel}
          modalClose={modalClose}
          eventId={formState.eventId}
          multipleUserIds={formState.isSingleReg ? false : true}
          userCount={formState.isSingleReg ? 1 : selectedRows.selectedRowsCount}
          userId={
            formState.isSingleReg
              ? formState.regUserId
              : selectedRows.selectedRows
          }
          eventTitle={formState.eventTitle}
          setStatusDataWhileClosingModal={setStatusDataWhileClosingModal}
          fromAddStudentToRecruitmentDrive={
            formState.fromAddStudentToRecruitmentDrive
          }
          name={formState.regStudentName}
          clearSelectedRow={selectedRowCleared}
        />
      ) : null}
    </Grid>
  );
};

export default AddStudentToRecruitmentDrive;
