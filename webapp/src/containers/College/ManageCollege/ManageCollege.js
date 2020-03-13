import React, { useState, useEffect } from "react";

import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Collapse,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel
} from "@material-ui/core";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Table, Spinner, Alert } from "../../../components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useStyles from "./ManageCollegeStyles";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import { GrayButton, YellowButton, GreenButton } from "../../../components";
import * as routeConstants from "../../../constants/RouteConstants";
import DeleteCollege from "./DeleteCollege";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import * as formUtilities from "../../../Utilities/FormUtilities";

const COLLEGE_FILTER = "id";
//const STATE_FILTER = "stateName";
const ZONE_FILTER = "rpc.zone";
const RPC_FILTER = "rpc.id";
const SORT_FIELD_KEY = "_sort";
const COLLEGE_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;

const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const RPCS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;
const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;

const ManageCollege = props => {
  const history = useHistory();
  const [open, setOpen] = React.useState(true);
  const [rpcs, setRpcs] = React.useState([]);
  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    colleges: [],
    zones: [],
    dataForView: [],
    zonesForEdit: [],
    rpcsForEdit: [],
    states: [],
    /** This is when we return from edit page */
    isDataEdited: props["location"]["fromeditCollege"]
      ? props["location"]["isDataEdited"]
      : false,
    editedData: props["location"]["fromeditCollege"]
      ? props["location"]["editedData"]
      : {},
    fromeditCollege: props["location"]["fromeditCollege"]
      ? props["location"]["fromeditCollege"]
      : false,
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddCollege"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddCollege"]
      ? props["location"]["addedData"]
      : {},
    fromAddCollege: props["location"]["fromAddCollege"]
      ? props["location"]["fromAddCollege"]
      : false,
    /** This is for delete */
    isDataDeleted: false,
    dataToDelete: {},
    isView: false,
    showModalDelete: false,
    filterDataParameters: {},
    isFilterSearch: false,
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true
  });

  const getFilterData = () => {
    serviceProviders
      .serviceProviderForGetRequest(RPCS_URL)
      .then(res => {
        setRpcs(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    /** Seperate function to get zone data */
    getCollegeData(10, 1);
    getFilterData();
  }, []);

  /** This seperate function is used to get the college data*/
  const getCollegeData = async (pageSize, page, paramsForCollege = null) => {
    if (
      paramsForCollege !== null &&
      !formUtilities.checkEmpty(paramsForCollege)
    ) {
      let defaultParams = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "name:asc"
      };
      Object.keys(paramsForCollege).map(key => {
        defaultParams[key] = paramsForCollege[key];
      });
      paramsForCollege = defaultParams;
    } else {
      paramsForCollege = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "name:asc"
      };
    }
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));

    await serviceProviders
      .serviceProviderForGetRequest(COLLEGE_URL, paramsForCollege)
      .then(async res => {
        formState.dataToShow = [];
        formState.tempData = [];
        let temp = [];
        let college_data = res.data.result;
        let currentPage = res.data.page;
        let totalRows = res.data.rowCount;
        let currentPageSize = res.data.pageSize;
        let pageCount = res.data.pageCount;
        /** As college data is in nested form we first convert it into
         * a float structure and store it in data
         */

        await serviceProviders
          .serviceProviderForGetRequest(ZONES_URL)
          .then(res => {
            formState.zones = res.data.result;
            temp = convertCollegeData(college_data);
            setFormState(formState => ({
              ...formState,
              colleges: college_data,
              dataToShow: temp,
              tempData: temp,
              pageSize: currentPageSize,
              totalRows: totalRows,
              page: currentPage,
              pageCount: pageCount,
              isDataLoading: false
            }));
          })
          .catch(error => {
            console.log("error", error);
          });
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  /** Converting college unstructured data into structred flat format for passing it into datatable */
  const convertCollegeData = data => {
    let collegeDataArray = [];
    if (data.length > 0) {
      for (let i in data) {
        var tempIndividualCollegeData = {};
        tempIndividualCollegeData["id"] = data[i]["id"];
        tempIndividualCollegeData["name"] = data[i]["name"];
        tempIndividualCollegeData["college_code"] = data[i]["college_code"];
        tempIndividualCollegeData["address"] = data[i]["address"];
        tempIndividualCollegeData["rpc"] = data[i]["rpc"]["name"];
        tempIndividualCollegeData["contact_number"] = data[i]["contact_number"];
        tempIndividualCollegeData["college_email"] = data[i]["college_email"];
        for (let j in formState.zones) {
          if (formState.zones[j]["id"] === data[i]["rpc"]["zone"]) {
            tempIndividualCollegeData["zone_name"] = formState.zones[j]["name"];
          }
        }
        collegeDataArray.push(tempIndividualCollegeData);
      }
      return collegeDataArray;
    }
  };

  /** Pagination */
  const handlePerRowsChange = async (perPage, page) => {
    /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getCollegeData(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getCollegeData(perPage, page);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getCollegeData(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getCollegeData(formState.pageSize, page);
      }
    }
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getCollegeData(perPage, page, formState.filterDataParameters);
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
      isDataLoading: true
    }));
    /**Need to confirm this thing for resetting the data */
    restoreData();
  };

  /** Restoring the data basically resets all te data i.e it gets all the data in view zones
   * i.e the nested zones data and also resets the data to []
   */

  const restoreData = () => {
    getCollegeData(formState.pageSize, 1);
  };

  const getDataForEdit = async (id, isView = false) => {
    /** Get college data for edit */
    let paramsForCollege = {
      id: id
    };
    await serviceProviders
      .serviceProviderForGetRequest(COLLEGE_URL, paramsForCollege)
      .then(res => {
        /** This we will use as final data for edit we send to modal */
        let editData = res.data.result[0];
        /** Check if zone is present in college data under rpc */
        if (
          editData.hasOwnProperty("rpc") &&
          editData["rpc"].hasOwnProperty("zone") &&
          editData["rpc"]["zone"] != null
        ) {
          /** If present get state id using that zone */
          let paramsForZones = {
            id: editData["rpc"]["zone"]
          };
          serviceProviders
            .serviceProviderForGetRequest(ZONES_URL, paramsForZones)
            .then(res => {
              editData["state"] = res.data.result[0]["state"]["id"];
              history.push({
                pathname: routeConstants.EDIT_COLLEGE,
                editCollege: true,
                dataForEdit: editData
              });
            })
            .catch(error => {
              console.log("error while getting data for edit > ", error);
            });
        } else {
          console.log("Rpc or zones for the college not present!");
        }
      })
      .catch(error => {
        console.log("error");
      });
  };

  const editCell = event => {
    getDataForEdit(event.target.id);
  };

  const viewCell = event => {
    history.push({
      pathname: routeConstants.DETAIL_COLLEGE,
      dataForEdit: event.target.id
    });
  };

  const isDeleteCellCompleted = status => {
    formState.isDataDeleted = status;
  };

  const deleteCell = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      dataToDelete: { id: event.target.id },
      showModalDelete: true
    }));
  };

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
    }
  };

  /** This is used to handle the close modal event for delete*/
  const handleCloseDeleteModal = () => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setFormState(formState => ({
      ...formState,
      isDataDeleted: false,
      showModalDelete: false
    }));
    if (formState.isDataDeleted) {
      getCollegeData(formState.pageSize, formState.page);
    }
  };

  /** Columns to show in table */
  const column = [
    { name: "Name", sortable: true, selector: "name" },
    { name: "Zone", sortable: true, selector: "zone_name" },
    { name: "RPC", sortable: true, selector: "rpc" },

    /** Columns for edit and delete */

    {
      cell: cell => (
        <Tooltip title="View" placement="top">
          <i
            className="material-icons"
            id={cell.id}
            onClick={viewCell}
            style={{ color: "green", fontSize: "19px" }}
          >
            view_list
          </i>
        </Tooltip>
      ),
      button: true,
      conditionalCellStyles: []
    },
    {
      cell: cell => (
        <Tooltip title="Edit" placement="top">
          <i
            className="material-icons"
            id={cell.id}
            value={cell.name}
            onClick={editCell}
            style={{ color: "green", fontSize: "19px" }}
          >
            edit
          </i>
        </Tooltip>
      ),
      button: true,
      conditionalCellStyles: []
    },
    {
      cell: cell => (
        <Tooltip title="Delete" placement="top">
          <i
            className="material-icons"
            id={cell.id}
            onClick={deleteCell}
            style={{ color: "red" }}
          >
            delete_outline
          </i>
        </Tooltip>
      ),
      button: true,
      conditionalCellStyles: []
    }
  ];

  const classes = useStyles();
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.VIEW_COLLEGE_TEXT}
        </Typography>
        <GreenButton
          variant="contained"
          color="primary"
          onClick={clearFilter}
          disableElevation
          to={routeConstants.ADD_COLLEGE}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          {genericConstants.ADD_COLLEGE_BUTTON}
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        {/** Error/Success messages to be shown for edit */}
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
              {genericConstants.ALERT_SUCCESS_DATA_EDITED_MESSAGE}
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
              {genericConstants.ALERT_ERROR_DATA_EDITED_MESSAGE}
            </Alert>
          </Collapse>
        ) : null}

        {/** Error/Success messages to be shown for add */}
        {formState.fromAddCollege && formState.isDataAdded ? (
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
        {formState.fromAddCollege && !formState.isDataAdded ? (
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

        <Card>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="collegeName_filter_college"
                  name={COLLEGE_FILTER}
                  options={formState.colleges}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(COLLEGE_FILTER, event, value)
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="College Filter"
                      placeholder="College Filter"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="rpcs_filter_college"
                  options={rpcs}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete(RPC_FILTER, event, value);
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Rpc Filter"
                      placeholder="College Filter"
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
        <Card className={classes.tabledata} variant="outlined">
          {formState.dataToShow ? (
            formState.dataToShow.length ? (
              <Table
                data={formState.dataToShow}
                column={column}
                defaultSortField="name"
                defaultSortAsc={formState.sortAscending}
                editEvent={editCell}
                deleteEvent={deleteCell}
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
            <div className={classes.noDataMargin}>
              {genericConstants.NO_DATA_TO_SHOW_TEXT}
            </div>
          )}{" "}
          <DeleteCollege
            showModal={formState.showModalDelete}
            closeModal={handleCloseDeleteModal}
            id={formState.dataToDelete["id"]}
            deleteEvent={isDeleteCellCompleted}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ManageCollege;
