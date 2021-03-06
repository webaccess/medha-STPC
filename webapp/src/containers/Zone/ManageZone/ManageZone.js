import React, { useState, useEffect, useCallback } from "react";

import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Collapse,
  IconButton,
  Tooltip,
  Backdrop,
  CircularProgress
} from "@material-ui/core";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Table, Spinner, Alert } from "../../../components";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import * as serviceProviders from "../../../api/Axios";
import DeleteZone from "./DeleteZone";
import { GreenButton, YellowButton, GrayButton } from "../../../components";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import * as formUtilities from "../../../utilities/FormUtilities";
import DeleteIcon from "@material-ui/icons/Delete";
import LoaderContext from "../../../context/LoaderContext";
import { useContext } from "react";

const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;

const SORT_FIELD_KEY = "_sort";
const ViewZone = props => {
  const [open, setOpen] = React.useState(true);
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [zonesFilter, setZonesFilter] = useState([]);
  const [backDrop, setBackDrop] = useState(false);
  const [formState, setFormState] = useState({
    filterZone: "",
    dataToShow: props.testingZoneData ? props.testingZoneData : [],
    tempData: [],
    zones: [],
    zonesFilter: [],
    states: [],
    filterDataParameters: {},
    isFilterSearch: false,
    /** This is when we return from edit page */
    isDataEdited: props["location"]["fromEditZone"]
      ? props["location"]["isDataEdited"]
      : false,
    editedData: props["location"]["fromEditZone"]
      ? props["location"]["editedData"]
      : {},
    fromEditZone: props["location"]["fromEditZone"]
      ? props["location"]["fromEditZone"]
      : false,
    editedZoneName: props["location"]["editedZoneData"]
      ? props["location"]["editedZoneData"]["name"]
      : "",
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddZone"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddZone"]
      ? props["location"]["addedData"]
      : {},
    fromAddZone: props["location"]["fromAddZone"]
      ? props["location"]["fromAddZone"]
      : false,
    addedZoneName: props["location"]["addedZoneData"]
      ? props["location"]["addedZoneData"]["name"]
      : "",
    isClearResetFilter: false,
    /** This is for delete */
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showModalDelete: false,
    isMultiDelete: false,
    MultiDeleteID: [],
    selectedRowFilter: true,
    greenButtonChecker: true,
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true,
    resetPagination: false,
    /** Message to show */
    fromDeleteModal: false,
    messageToShow: "",
    toggleCleared: false
  });

  /** Pre-populate the data with zones data and state data. State data is used while editing the data */
  useEffect(() => {
    /** Seperate function to get zone data */
    getZoneData(10, 1);
  }, []);

  /** This seperate function is used to get the zone data*/
  const getZoneData = async (pageSize, page, paramsForZones = null) => {
    if (paramsForZones !== null && !formUtilities.checkEmpty(paramsForZones)) {
      let defaultParams = {};
      if (paramsForZones.hasOwnProperty(SORT_FIELD_KEY)) {
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
      Object.keys(paramsForZones).map(key => {
        defaultParams[key] = paramsForZones[key];
      });
      paramsForZones = defaultParams;
    } else {
      paramsForZones = {
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
      .serviceProviderForGetRequest(ZONES_URL, paramsForZones)
      .then(res => {
        formState.dataToShow = [];
        formState.tempData = [];
        let temp = [];
        /** As zones data is in nested form we first convert it into
         * a float structure and store it in data
         */
        temp = convertZoneData(res.data.result);
        setFormState(formState => ({
          ...formState,
          zones: res.data.result,
          dataToShow: temp,
          tempData: temp,
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

  const convertZoneData = data => {
    let x = [];
    if (data.length > 0) {
      for (let i in data) {
        var temp = {};
        temp["id"] = data[i]["id"];
        temp["name"] = data[i]["name"];
        temp["state"] = data[i]["state"] ? data[i]["state"]["name"] : "";
        x.push(temp);
      }
      return x;
    }
  };

  /** Pagination */
  const handlePerRowsChange = async (perPage, page) => {
    /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getZoneData(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getZoneData(perPage, page, formState.filterDataParameters);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getZoneData(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getZoneData(
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
      await getZoneData(perPage, page, formState.filterDataParameters);
    } else {
      await getZoneData(perPage, page);
    }
  };

  const clearFilter = () => {
    setZonesFilter([""]);
    setFormState(formState => ({
      ...formState,
      isFilterSearch: false,
      isClearResetFilter: true,
      /** Clear all filters */
      filterDataParameters: {},
      /** Turns on the spinner */
      isDataLoading: true
    }));
    selectedRowCleared(true);
    /**Need to confirm this thing for resetting the data */
    restoreData();
  };

  const restoreData = () => {
    getZoneData(formState.pageSize, 1);
  };

  /** Restoring the data basically resets all te data i.e it gets all the data in view zones
   * i.e the nested zones data and also resets the data to []
  
  const restoreData = () => {
    getZoneData();
  };
  */

  const getDataForEdit = async id => {
    setBackDrop(true);
    let paramsForZones = {
      id: id
    };
    await serviceProviders
      .serviceProviderForGetRequest(ZONES_URL, paramsForZones)
      .then(res => {
        let editData = res.data.result[0];
        history.push({
          pathname: routeConstants.EDIT_ZONES,
          editZone: true,
          dataForEdit: editData
        });
      })
      .catch(error => {
        console.log("error", error);
      });
    setBackDrop(false);
  };
  const editCell = event => {
    getDataForEdit(event.target.id);
  };

  const deleteCell = event => {
    setFormState(formState => ({
      ...formState,
      dataToDelete: {
        id: event.target.id,
        name: event.target.getAttribute("value")
      },
      showModalDelete: true,
      isDataDeleted: false,
      fromDeleteModal: false,
      messageToShow: "",
      fromAddZone: false,
      fromEditZone: false,
      isMultiDelete: false
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
      messageToShow: statusToShow,
      isMultiDelete: false,
      dataToDelete: {}
    }));
    if (status) {
      getZoneData(formState.pageSize, 1, formState.filterDataParameters);
    }
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalDelete: false,
      dataToDelete: {}
    }));
  };

  /** Multi Delete */
  /** Get multiple user id for delete */
  const deleteMulUserById = () => {
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
      fromAddZone: false,
      fromEditZone: false
    }));
  };

  /** On select multiple rows */
  const handleRowSelected = useCallback(state => {
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
    setSelectedRows(state.selectedRows);
  }, []);

  const handleFilterChange = event => {
    setZonesFilter(event.target.value);
  };

  const filterZoneData = () => {
    let params = "?name_contains=" + zonesFilter;

    let FilterZoneURL =
      strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES + params;

    serviceProviders
      .serviceProviderForGetRequest(FilterZoneURL)
      .then(res => {
        formState.dataToShow = [];
        formState.tempData = [];
        let temp = [];
        /** As zones data is in nested form we first convert it into
         * a float structure and store it in data
         */
        temp = convertZoneData(res.data.result);
        setFormState(formState => ({
          ...formState,
          zones: res.data.result,
          dataToShow: temp,
          tempData: temp,
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

  const selectedRowCleared = data => {
    formState.toggleCleared = data;
    setTimeout(() => {
      setFormState(formState => ({
        ...formState,
        toggleCleared: false
      }));
    }, 2000);
  };

  /** Columns to show in table */
  const column = [
    { name: "Name", sortable: true, selector: "name" },
    { name: "State", sortable: true, selector: "state" },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <Tooltip title="Edit" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
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
                className="material-icons tableicons"
                id={cell.id}
                onClick={deleteCell}
                value={cell.name}
                style={{ color: "red", fontSize: "21px" }}
              >
                delete_outline
              </i>
            </Tooltip>
          </div>
        </div>
      ),
      width: "20%",
      cellStyle: {
        width: "auto",
        maxWidth: "auto"
      }
    }
  ];

  /** Set zone data to data in formState */

  /** Empty the initial nested zones array as we have already added our data in the formState.data array*/
  //formState.zones = [];

  const handleSort = (
    column,
    sortDirection,
    perPage = formState.pageSize,
    page = 1
  ) => {
    if (column.selector === "state") {
      column.selector = "state.name";
    }
    formState.filterDataParameters[SORT_FIELD_KEY] =
      column.selector + ":" + sortDirection;
    getZoneData(perPage, page, formState.filterDataParameters);
  };

  const classes = useStyles();
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
            {genericConstants.VIEW_ZONE_TEXT}
          </Typography>
        </Grid>
        <Grid item>
          <GreenButton
            id="deleteMulUsers"
            variant="contained"
            color="secondary"
            onClick={() => deleteMulUserById()}
            startIcon={<DeleteIcon />}
            greenButtonChecker={formState.greenButtonChecker}
            buttonDisabled={formState.selectedRowFilter}
            style={{ margin: "2px", marginRight: "15px" }}
          >
            Delete Selected Zones
          </GreenButton>
          <GreenButton
            id="addZones"
            variant="contained"
            color="primary"
            disableElevation
            to={routeConstants.ADD_ZONES}
            startIcon={<AddCircleOutlineOutlinedIcon />}
            style={{ margin: "2px" }}
          >
            {genericConstants.ADD_ZONE_TEXT}
          </GreenButton>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        {/** Error/Success messages to be shown for edit */}
        {formState.fromEditZone && formState.isDataEdited ? (
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
              Zone {formState.editedZoneName} has been updated successfully.
            </Alert>
          </Collapse>
        ) : null}
        {formState.fromEditZone && !formState.isDataEdited ? (
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
              {props.location.editResponseMessage
                ? props.location.editResponseMessage
                : "An error has occured while updating Zone. Kindly, try again."}
            </Alert>
          </Collapse>
        ) : null}

        {/** Error/Success messages to be shown for add */}
        {formState.fromAddZone && formState.isDataAdded ? (
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
              Zone {formState.addedZoneName} has been added successfully.
            </Alert>
          </Collapse>
        ) : null}
        {formState.fromAddZone && !formState.isDataAdded ? (
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
              {props.location.addResponseMessage
                ? props.location.addResponseMessage
                : "An error has occured while adding zone.  Kindly, try again."}
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

        <Card className={classes.root} variant="outlined">
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <TextField
                  id="name"
                  label={"Name"}
                  placeholder="Name"
                  variant="outlined"
                  value={zonesFilter}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid className={classes.filterButtonsMargin}>
                <YellowButton
                  id="submitFilter"
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={filterZoneData}
                >
                  {genericConstants.SEARCH_BUTTON_TEXT}
                </YellowButton>
              </Grid>
              <Grid className={classes.filterButtonsMargin}>
                <GrayButton
                  id="cancelFilter"
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
                id="ManageTableID"
                data={formState.dataToShow}
                column={column}
                defaultSortField="name"
                onSelectedRowsChange={handleRowSelected}
                defaultSortAsc={formState.sortAscending}
                paginationResetDefaultPage={formState.resetPagination}
                editEvent={editCell}
                deleteEvent={deleteCell}
                progressPending={formState.isDataLoading}
                paginationDefaultPage={formState.page}
                paginationPerPage={formState.pageSize}
                paginationTotalRows={formState.totalRows}
                paginationRowsPerPageOptions={[10, 20, 50]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                onSort={handleSort}
                sortServer={true}
                clearSelectedRows={formState.toggleCleared}
              />
            ) : (
              <Spinner />
            )
          ) : (
            <div className={classes.noDataMargin}>No data to show</div>
          )}
          {formState.showModalDelete ? (
            <DeleteZone
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
              clearSelectedRow={selectedRowCleared}
            />
          ) : null}
        </Card>
      </Grid>
      <Backdrop className={classes.backDrop} open={backDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
};

export default ViewZone;
