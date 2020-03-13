import React, { useState, useEffect } from "react";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Tooltip,
  Collapse,
  IconButton
} from "@material-ui/core";
import useStyles from "./ViewRpcStyles";
import {
  Table,
  Spinner,
  GreenButton,
  GrayButton,
  YellowButton,
  Alert
} from "../../../components";
import DeleteRpc from "./DeleteRpc";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as formUtilities from "../../../Utilities/FormUtilities";
import { CustomRouterLink } from "../../../components";
import * as routeConstants from "../../../constants/RouteConstants";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";

const RPC_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;
const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const RPC_FILTER = "id";
const SORT_FIELD_KEY = "_sort";

const ViewRpc = props => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const history = useHistory();

  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    zones: [],
    rpcs: [],
    states: [],
    isFilterSearch: false,
    filterDataParameters: {},
    /** This is when we return from edit page */
    isDataEdited: props["location"]["fromEditRpc"]
      ? props["location"]["isDataEdited"]
      : false,
    editedData: props["location"]["fromEditRpc"]
      ? props["location"]["editedData"]
      : {},
    fromEditRpc: props["location"]["fromEditRpc"]
      ? props["location"]["fromEditRpc"]
      : false,
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddRpc"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddRpc"]
      ? props["location"]["addedData"]
      : {},
    fromAddRpc: props["location"]["fromAddRpc"]
      ? props["location"]["fromAddRpc"]
      : false,
    /** This is for delete */
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showModalDelete: false,
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true
  });
  useEffect(() => {
    getRpcStateData(10, 1);
  }, []);

  const getRpcStateData = async (pageSize, page, paramsForRpc = null) => {
    if (paramsForRpc !== null && !formUtilities.checkEmpty(paramsForRpc)) {
      let defaultParams = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "name:asc"
      };
      Object.keys(paramsForRpc).map(key => {
        defaultParams[key] = paramsForRpc[key];
      });
      paramsForRpc = defaultParams;
    } else {
      paramsForRpc = {
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
      .serviceProviderForGetRequest(STATES_URL)
      .then(async res => {
        let states = [];
        states = res.data.result;
        let currentPage = res.data.page;
        let totalRows = res.data.rowCount;
        let currentPageSize = res.data.pageSize;
        let pageCount = res.data.pageCount;
        await serviceProviders
          .serviceProviderForGetRequest(RPC_URL, paramsForRpc)
          .then(res => {
            formState.dataToShow = [];
            formState.tempData = [];
            let temp = [];
            /** As rpcs data is in nested form we first convert it into
             * a float structure and store it in data
             */
            temp = convertRpcData(res.data.result, states);
            setFormState(formState => ({
              ...formState,
              rpcs: res.data.result,
              dataToShow: temp,
              tempData: temp,
              pageSize: currentPageSize,
              totalRows: totalRows,
              page: currentPage,
              pageCount: pageCount,
              isDataLoading: false
            }));
          })
          .catch(error => {});
      })
      .catch(error => {});
  };

  /** Pagination */
  const handlePerRowsChange = async (perPage, page) => {
    /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getRpcStateData(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getRpcStateData(perPage, page);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getRpcStateData(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getRpcStateData(formState.pageSize, page);
      }
    }
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getRpcStateData(perPage, page, formState.filterDataParameters);
    }
  };

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

  const restoreData = () => {
    getRpcStateData(formState.pageSize, 1);
  };

  const editCell = event => {
    getDataForEdit(event.target.id);
  };

  const isDeleteCellCompleted = status => {
    formState.isDataDeleted = status;
  };

  const deleteCell = event => {
    setFormState(formState => ({
      ...formState,
      dataToDelete: { id: event.target.id },
      showModalDelete: true
    }));
  };

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      formState.isFilterSearch = false;
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
    }
  };

  /** This is used to handle the close modal event */
  const handleCloseDeleteModal = () => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setFormState(formState => ({
      ...formState,
      isDataDeleted: false,
      showModalDelete: false
    }));
    if (formState.isDataDeleted) {
      getRpcStateData(formState.pageSize, formState.page);
    }
  };

  const convertRpcData = (data, statedata) => {
    let x = [];
    if (data.length > 0) {
      for (let i in data) {
        var temp = {};
        temp["id"] = data[i]["id"];
        temp["name"] = data[i]["name"];
        temp["zone"] = data[i]["zone"]["name"];
        if (data[i]["zone"]["state"]) {
          for (let j in statedata) {
            if (data[i]["zone"]["state"] === statedata[j].id) {
              temp["state"] = statedata[j]["name"];
            }
          }
        }
        x.push(temp);
      }
      return x;
    }
  };

  const getDataForEdit = async id => {
    let paramsForRpcs = {
      id: id
    };
    await serviceProviders
      .serviceProviderForGetRequest(RPC_URL, paramsForRpcs)
      .then(res => {
        let editData = res.data.result[0];
        history.push({
          pathname: routeConstants.EDIT_RPC,
          editRpc: true,
          dataForEdit: editData
        });
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  const column = [
    { name: "Name", sortable: true, selector: "name" },
    { name: "Zone", sortable: true, selector: "zone" },
    { name: "State", sortable: true, selector: "state" },
    /** Columns for edit and delete */
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

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.VIEW_RPC_TEXT}
        </Typography>

        <GreenButton
          variant="contained"
          color="primary"
          disableElevation
          component={CustomRouterLink}
          to={routeConstants.ADD_RPC}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          {genericConstants.ADD_RPC_TEXT}
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        {/** Delete rpc data */}
        {/** Error/Success messages to be shown for edit */}
        {formState.fromEditRpc && formState.isDataEdited ? (
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
        {formState.fromEditRpc && !formState.isDataEdited ? (
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
        {formState.fromAddRpc && formState.isDataAdded ? (
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
        {formState.fromAddRpc && !formState.isDataAdded ? (
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
              {genericConstants.ALERT_ERROR_DATA_ADDED_MESSAGE}
            </Alert>
          </Collapse>
        ) : null}
        <Card>
          <CardContent>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  //name={ZONE_FILTER}
                  options={formState.rpcs}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(RPC_FILTER, event, value)
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="RPC Name"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid className={classes.filterButtonsMargin}>
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
              <Grid className={classes.filterButtonsMargin}>
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
            <div className={classes.noDataMargin}>No data to show</div>
          )}
          <DeleteRpc
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
export default ViewRpc;
