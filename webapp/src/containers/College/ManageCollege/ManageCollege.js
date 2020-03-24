import React, { useState, useEffect, useCallback } from "react";
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

import BlockIcon from "@material-ui/icons/Block";
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
import DeleteIcon from "@material-ui/icons/Delete";

/** Contsants for filters */
const COLLEGE_FILTER = "name_contains";
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
  const [selectedRows, setSelectedRows] = useState([]);
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
    isMultiDelete: false,
    MultiDeleteID: [],
    selectedRowFilter: true,
    greenButtonChecker: true,
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
    isMulBlocked: false,
    isMulUnBlocked: false,
    multiBlockCollegeIds: [],
    bottonBlockUnblock: "Block Selected Colleges",
    fromBlockModal: false,
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
      pageSize: -1
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
      pageSize: -1,
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
    formState.filterDataParameters = {};
    // formState.filterDataParameters["name_contains"] = "";
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
    formState.filterDataParameters[COLLEGE_FILTER] = "";
    console.log("formstate--->>", formState.filterDataParameters);
    // window.location.reload();
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
        console.log("error");
      });
  };

  const blockMulCollegeById = () => {
    let arrayId = [];
    for (var k = 0; k < selectedRows.length; k++) {
      arrayId.push(selectedRows[k]["id"]);
    }
    if (formState.bottonBlockUnblock === "Block Selected Colleges") {
      setFormState(formState => ({
        ...formState,
        isMulBlocked: true,
        isMulUnBlocked: false,
        showModalBlock: true,
        multiBlockCollegeIds: arrayId,
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
        multiBlockCollegeIds: arrayId,
        fromDeleteModal: false,
        fromAddCollege: false,
        fromeditCollege: false,
        fromBlockModal: false
      }));
    }
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
      getCollegeData(formState.pageSize, 1);
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

  /**----------------------------------------------------- */

  const deleteCell = event => {
    setFormState(formState => ({
      ...formState,
      dataToDelete: {
        id: event.target.id,
        name: event.target.getAttribute("value")
      },
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
      getCollegeData(formState.pageSize, 1);
    }
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalBlock: false,
      showModalDelete: false
    }));
  };

  const handleFilterChange = event => {
    console.log("handleFilterChange", event.target.name, event.target.value);
    formState.filterDataParameters[event.target.name] = event.target.value;
  };

  /** Multi Delete */
  /** Get multiple user id for delete */
  const deleteMulCollegeById = () => {
    let arrayId = [];

    selectedRows.forEach(d => {
      arrayId.push(d.id);
    });

    setFormState(formState => ({
      ...formState,
      showEditModal: false,
      showModalDelete: true,
      isMultiDelete: true,
      MultiDeleteID: arrayId,
      isDataDeleted: false,
      fromDeleteModal: false,
      fromAddCollege: false,
      fromeditCollege: false,
      fromBlockModal: false
    }));
  };

  /** On select multiple rows */
  const handleRowSelected = useCallback(state => {
    let blockData = [];
    let unblockData = [];

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

    state.selectedRows.forEach(data => {
      if (data.blocked === false) {
        blockData.push(data);
      } else {
        unblockData.push(data);
      }
      if (blockData.length > 0) {
        setFormState(formState => ({
          ...formState,
          bottonBlockUnblock: "Block Selected Colleges"
        }));
      } else {
        setFormState(formState => ({
          ...formState,
          bottonBlockUnblock: "Unblock Selected Colleges"
        }));
      }
    });
    setSelectedRows(state.selectedRows);
  }, []);

  /** Columns to show in table */
  const column = [
    { name: "Name", sortable: true, selector: "name" },
    { name: "Zone", sortable: true, selector: "zone_name" },
    { name: "RPC", sortable: true, selector: "rpc" },

    /** Columns for block, view, edit and delete */

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
        <Tooltip title={cell.blocked ? "Unblock" : "Block"} placement="top">
          <i
            className="material-icons"
            id={cell.id}
            value={cell.name}
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
        <Tooltip title="Delete" placement="top">
          <i
            className="material-icons"
            id={cell.id}
            value={cell.name}
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
          color="secondary"
          onClick={() => blockMulCollegeById()}
          startIcon={<BlockIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          {formState.bottonBlockUnblock}
        </GreenButton>

        <GreenButton
          variant="contained"
          color="secondary"
          onClick={() => deleteMulCollegeById()}
          startIcon={<DeleteIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          Delete Selected Colleges
        </GreenButton>

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

        <Card>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                {console.log(
                  "return",
                  formState.filterDataParameters[COLLEGE_FILTER]
                )}
                <TextField
                  label={"College"}
                  placeholder="College"
                  variant="outlined"
                  name={COLLEGE_FILTER}
                  onChange={handleFilterChange}
                />
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
                      label="State"
                      placeholder="State"
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
                      label="Zone"
                      placeholder="Zone"
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
                      label="RPC"
                      placeholder="RPC"
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
                onSelectedRowsChange={handleRowSelected}
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
            id={
              formState.isMultiDelete
                ? formState.MultiDeleteID
                : formState.dataToDelete["id"]
            }
            modalClose={modalClose}
            isMultiDelete={formState.isMultiDelete ? true : false}
            dataToDelete={formState.dataToDelete}
          />
          <BlockUnblockCollege
            showModal={formState.showModalBlock}
            closeModal={handleCloseBlockUnblockModal}
            dataToBlockUnblock={formState.dataToBlockUnblock}
            blockUnblockEvent={isBlockUnblockCellCompleted}
            isMultiBlock={formState.isMulBlocked ? true : false}
            isMultiUnblock={formState.isMulUnBlocked ? true : false}
            multiBlockCollegeIds={formState.multiBlockCollegeIds}
            modalClose={modalClose}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ManageCollege;
