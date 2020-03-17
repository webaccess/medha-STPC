import React, { useState, useEffect } from "react";
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
import BlockUnblockCollege from "./BlockUnblockCollege";

/** Contsants for filters */
const COLLEGE_FILTER = "id";
const STATE_FILTER = "rpc.state";
const ZONE_FILTER = "zone.id";
const RPC_FILTER = "rpc.id";
const SORT_FIELD_KEY = "_sort";

/** Url's */
const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const RPCS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;
const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const COLLEGE_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;

const ManageCollege = props => {
  const history = useHistory();
  const [open, setOpen] = React.useState(true);
  /** Data we get for filtering */
  const [collegesFilter, setCollegesFilter] = React.useState([]);
  const [rpcs, setRpcs] = React.useState([]);
  const [zones, setZones] = React.useState([]);
  const [states, setStates] = React.useState([]);
  /**------------------------------------ */
  /** Our actual form data  */
  const [formState, setFormState] = useState({
    dataToShow: [],
    colleges: [],
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
    showModalDelete: false,
    /** View  */
    isView: false,
    /** Filters */
    filterDataParameters: {},
    isFilterSearch: false,
    isClearResetFilter: false,
    isStateClearFilter: false,
    /** For Block */
    isDataBlockUnblock: false,
    dataToBlockUnblock: {},
    showModalBlock: false,
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true
  });

  /** Get filter data parameters i.e intially get only state and college */
  const getFilterData = () => {
    let params = {
      pageSize: 10000000
    };
    serviceProviders
      .serviceProviderForGetRequest(COLLEGE_URL, params)
      .then(res => {
        setCollegesFilter(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(STATES_URL, params)
      .then(res => {
        setStates(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    /** Seperate function to get college paginated data */
    getCollegeData(10, 1);
    /** Seperate function to get state and college data */
    getFilterData();
  }, []);

  /** Get rpcs and zones from state */
  const getZonesAndRpcsOnState = () => {
    setRpcs([]);
    setZones([]);
    delete formState.filterDataParameters[ZONE_FILTER];
    delete formState.filterDataParameters[RPC_FILTER];

    let params = {
      pageSize: 10000000,
      "state.id": formState.filterDataParameters[STATE_FILTER]
    };
    console.log(params, formState.filterDataParameters);
    serviceProviders
      .serviceProviderForGetRequest(RPCS_URL, params)
      .then(res => {
        setRpcs(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(ZONES_URL, params)
      .then(res => {
        setZones(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
  };

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
        let tempCollegeData = [];
        let college_data = res.data.result;

        /** As college data is in nested form we first convert it into
         * a float structure and store it in data
         */
        tempCollegeData = convertCollegeData(college_data);
        setFormState(formState => ({
          ...formState,
          colleges: college_data,
          dataToShow: tempCollegeData,
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

  /** Converting college unstructured data into structred flat format for passing it into datatable */
  const convertCollegeData = data => {
    let collegeDataArray = [];
    if (data.length > 0) {
      for (let i in data) {
        var tempIndividualCollegeData = {};
        tempIndividualCollegeData["id"] = data[i]["id"];
        tempIndividualCollegeData["blocked"] = data[i]["blocked"];
        tempIndividualCollegeData["name"] = data[i]["name"];
        tempIndividualCollegeData["rpc"] = data[i]["rpc"]
          ? data[i]["rpc"]["name"]
          : "";
        tempIndividualCollegeData["zone_name"] = data[i]["zone"]
          ? data[i]["zone"]["name"]
          : "";
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
    } else {
      await getCollegeData(perPage, page);
    }
  };

  /** This restores all the data when we clear the filters*/

  const clearFilter = () => {
    setFormState(formState => ({
      ...formState,
      isFilterSearch: false,
      isClearResetFilter: true,
      isStateClearFilter: true,
      /** Clear all filters */
      filterDataParameters: {},
      /** Turns on the spinner */
      isDataLoading: true
    }));
    setRpcs([]);
    setZones([]);
    /**Need to confirm this thing for resetting the data */
    restoreData();
  };

  /** Restoring the data basically resets all te data i.e it gets all the data in view zones
   * i.e the nested zones data and also resets the data to []
   */

  const restoreData = () => {
    getCollegeData(formState.pageSize, 1);
  };

  /** Edit cell */
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
        history.push({
          pathname: routeConstants.EDIT_COLLEGE,
          editCollege: true,
          dataForEdit: editData
        });
      })
      .catch(error => {
        console.log("error");
      });
  };

  const editCell = event => {
    getDataForEdit(event.target.id);
  };

  /**----------------------------------------------------- */
  /** Delete cell */
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
  /**---------------------------------------------------------- */
  /** View Cell */
  const viewCell = event => {
    history.push({
      pathname: routeConstants.DETAIL_COLLEGE,
      dataForEdit: event.target.id
    });
  };

  /** ---------------------------------------------------------- */
  /** For Block */
  /** This is called when block event is called */
  const blockCell = event => {
    event.persist();
    getDataForBlockUnblock(event.target.id);
  };

  const isBlockUnblockCellCompleted = status => {
    formState.isDataBlockUnblock = status;
  };

  const getDataForBlockUnblock = async id => {
    /** Get college data for edit */
    let paramsForCollege = {
      id: id
    };
    await serviceProviders
      .serviceProviderForGetRequest(COLLEGE_URL, paramsForCollege)
      .then(res => {
        /** This we will use as final data for edit we send to modal */
        let editData = res.data.result[0];
        setFormState(formState => ({
          ...formState,
          dataToBlockUnblock: editData,
          showModalBlock: true
        }));
      })
      .catch(error => {
        console.log("error");
      });
  };

  /** This handles close unblock block modal */
  const handleCloseBlockUnblockModal = () => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setFormState(formState => ({
      ...formState,
      isDataBlockUnblock: false,
      showModalBlock: false
    }));
    if (formState.isDataBlockUnblock) {
      getCollegeData(formState.pageSize, formState.page);
    }
  };

  /** ------------------------------------------------------------------ */
  /** Handles change in auto complete for filters */
  const handleChangeAutoComplete = (filterName, event, value) => {
    /** When we click cross for auto complete */
    if (value === null) {
      let setStateFilterValue = false;
      /** If we click cross for state the zone and rpc should clear off! */
      if (filterName === STATE_FILTER) {
        /** 
        This flag is used to determine that state is cleared which clears 
        off zone and rpc by setting their value to null 
        */
        setStateFilterValue = true;
        /** 
        When state is cleared then clear rpc and zone 
        */
        setRpcs([]);
        setZones([]);
        delete formState.filterDataParameters[ZONE_FILTER];
        delete formState.filterDataParameters[RPC_FILTER];
      }
      setFormState(formState => ({
        ...formState,
        isClearResetFilter: false,
        isStateClearFilter: setStateFilterValue
      }));
      delete formState.filterDataParameters[filterName];
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
      if (filterName === STATE_FILTER) {
        getZonesAndRpcsOnState();
      }
      setFormState(formState => ({
        ...formState,
        isClearResetFilter: false,
        isStateClearFilter: false
      }));
    }
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalBlock: false,
      showModalDelete: false
    }));
  };

  /** Columns to show in table */
  const column = [
    { name: "Name", sortable: true, selector: "name" },
    { name: "Zone", sortable: true, selector: "zone_name" },
    { name: "RPC", sortable: true, selector: "rpc" },

    /** Columns for block, view, edit and delete */
    {
      cell: cell => (
        <Tooltip title={cell.blocked ? "Unblock" : "Block"} placement="top">
          <i
            className="material-icons"
            id={cell.id}
            onClick={blockCell}
            style={
              cell.blocked
                ? { color: "red", fontSize: "19px" }
                : { color: "green", fontSize: "19px" }
            }
          >
            block
          </i>
        </Tooltip>
      ),
      button: true,
      conditionalCellStyles: []
    },
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
                {collegesFilter ? (
                  <Autocomplete
                    id="collegeName_filter_college"
                    name={COLLEGE_FILTER}
                    options={collegesFilter}
                    className={classes.autoCompleteField}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) =>
                      handleChangeAutoComplete(COLLEGE_FILTER, event, value)
                    }
                    value={
                      formState.isClearResetFilter
                        ? null
                        : collegesFilter[
                            collegesFilter.findIndex(function(item, i) {
                              return (
                                item.id ===
                                formState.filterDataParameters[COLLEGE_FILTER]
                              );
                            })
                          ] || null
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
                ) : null}
              </Grid>
              <Grid item>
                <Autocomplete
                  id="states_filter_college"
                  options={states}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete(STATE_FILTER, event, value);
                  }}
                  value={
                    formState.isClearResetFilter
                      ? null
                      : states[
                          states.findIndex(function(item, i) {
                            return (
                              item.id ===
                              formState.filterDataParameters[STATE_FILTER]
                            );
                          })
                        ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="State Name"
                      placeholder="State Name"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="zones_filter_college"
                  options={zones}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => {
                    handleChangeAutoComplete(ZONE_FILTER, event, value);
                  }}
                  value={
                    formState.isClearResetFilter || formState.isStateClearFilter
                      ? null
                      : zones[
                          zones.findIndex(function(item, i) {
                            return (
                              item.id ===
                              formState.filterDataParameters[ZONE_FILTER]
                            );
                          })
                        ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Zone Name"
                      placeholder="Zone Name"
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
                  value={
                    formState.isClearResetFilter || formState.isStateClearFilter
                      ? null
                      : rpcs[
                          rpcs.findIndex(function(item, i) {
                            return (
                              item.id ===
                              formState.filterDataParameters[RPC_FILTER]
                            );
                          })
                        ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Rpc Name"
                      placeholder="College Name"
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
            modalClose={modalClose}
          />
          <BlockUnblockCollege
            showModal={formState.showModalBlock}
            closeModal={handleCloseBlockUnblockModal}
            dataToBlockUnblock={formState.dataToBlockUnblock}
            blockUnblockEvent={isBlockUnblockCellCompleted}
            modalClose={modalClose}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ManageCollege;
