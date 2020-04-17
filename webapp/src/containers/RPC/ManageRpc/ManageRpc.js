import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Collapse,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import {
  Table,
  Spinner,
  GreenButton,
  GrayButton,
  YellowButton,
  Alert,
  EditGridIcon,
  DeleteGridIcon
} from "../../../components";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import DeleteRpc from "./DeleteRpc";
import * as formUtilities from "../../../Utilities/FormUtilities";
import { CustomRouterLink } from "../../../components";
import * as routeConstants from "../../../constants/RouteConstants";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";

const RPC_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;

const SORT_FIELD_KEY = "_sort";

const ViewRpc = props => {
  /** Value to set for Rpc filter */
  const [value, setValue] = React.useState(null);

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState] = useState({
    filterRpc: "",
    dataToShow: [],
    tempData: [],
    zones: [],
    rpcs: [],
    rpcFilter: [],
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
    /** Message to show */
    fromDeleteModal: false,
    messageToShow: "",
    isDataDeleted: false,

    /**Filter RPC's */
    rpcsFilterValueToStore: "",
    rpcsFilterData: []
  });
  useEffect(() => {
    let paramsForPageSize = {
      pageSize: -1
    };
    serviceProviders
      .serviceProviderForGetRequest(RPC_URL, paramsForPageSize)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          rpcFilter: res.data.result
        }));
      })
      .catch(error => [console.log("error", error)]);

    getRpcStateData(10, 1);
  }, []);

  useEffect(() => {
    if (
      formState.rpcsFilterValueToStore === null ||
      formState.rpcsFilterValueToStore === ""
    ) {
      setFormState(formState => ({
        ...formState,
        rpcsFilterData: []
      }));
    }
  }, [formState.rpcsFilterValueToStore]);

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
      .serviceProviderForGetRequest(RPC_URL, paramsForRpc)
      .then(res => {
        let currentPage = res.data.page;
        let totalRows = res.data.rowCount;
        let currentPageSize = res.data.pageSize;
        let pageCount = res.data.pageCount;
        formState.dataToShow = [];
        formState.tempData = [];
        let temp = [];
        temp = convertRpcData(res.data.result);
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
      .catch(error => {
        console.log("rpcerror", error);
      });
  };

  const convertRpcData = data => {
    let x = [];
    if (data.length > 0) {
      for (let i in data) {
        var temp = {};
        temp["id"] = data[i]["id"];
        temp["name"] = data[i]["name"];
        temp["state"] = data[i]["state"]["name"];
        x.push(temp);
      }
      return x;
    }
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
    } else {
      await getRpcStateData(perPage, page);
    }
  };

  /**---------------------------clear filter------------------------ */
  const clearFilter = () => {
    setFormState(formState => ({
      ...formState,
      isFilterSearch: false,
      isClearResetFilter: true,
      /** Clear all filters */
      filterDataParameters: {},
      /** Turns on the spinner */
      isDataLoading: true,
      /** Clear filter */
      rpcsFilterValueToStore: null,
      /**Clear filters */
      rpcsFilterData: []
    }));
    /**Need to confirm this thing for resetting the data */
    restoreData();
  };

  const restoreData = () => {
    getRpcStateData(formState.pageSize, 1);
  };

  /**-----------edit ----------- */
  const editCell = event => {
    getDataForEdit(event.target.id);
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

  /** 
  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      formState.isFilterSearch = false;
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
    }
    setFormState(formState => ({
      ...formState,
      isClearResetFilter: false
    }));
  };
*/
  /** ---------Delete -------- */

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
      fromAddRpc: false,
      fromEditRpc: false,
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
      isMultiDelete: false
    }));
    if (status) {
      getRpcStateData(formState.pageSize, 1);
    }
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalDelete: false
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
      fromAddRpc: false,
      fromEditRpc: false
    }));
  };

  /** On select multiple rows */
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

  /** Filter methods and functions */
  const handleFilterChange = event => {
    getFilteredRpcDataValueInDropDown(event.target.value);
    event.persist();
    // setRpcsFilter(event.target.value);
  };

  const getFilteredRpcDataValueInDropDown = rpcValue => {
    setIsLoading(true);
    let params = {
      name_contains: rpcValue
    };
    setValue({
      name: rpcValue
    });
    if (rpcValue !== null || rpcValue !== "") {
      let FilterRpcURL =
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;

      serviceProviders
        .serviceProviderForGetAsyncRequest(FilterRpcURL, params)
        .then(res => {
          if (res.data.result.length !== 0) {
          }
          setIsLoading(false);
          setFormState(formState => ({
            ...formState,
            rpcsFilterData: res.data.result,
            rpcsFilterValueToStore: rpcValue,
            isClearResetFilter: false
          }));
        })
        .catch(error => {
          setIsLoading(false);
          console.log("error", error);
        });
    } else {
      setIsLoading(false);
      setFormState(formState => ({
        ...formState,
        rpcsFilterData: [],
        rpcsFilterValueToStore: rpcValue,
        isClearResetFilter: false
      }));
    }
  };

  const getRpcSelectedValue = (event, value) => {
    if (value === null) {
      getFilteredRpcDataValueInDropDown(null);
    } else {
      getFilteredRpcDataValueInDropDown(value.name);
    }
  };

  /** Search filter is called when we select filters and click on search button */
  const filterRpcData = async (perPage = formState.pageSize, page = 1) => {
    if (
      formState.rpcsFilterValueToStore !== null &&
      formState.rpcsFilterValueToStore !== ""
    ) {
      let params = {
        name_contains: formState.rpcsFilterValueToStore
      };
      formState.isFilterSearch = true;
      await getRpcStateData(perPage, page, params);
    } else {
      await getRpcStateData(perPage, page);
    }
  };

  const column = [
    { name: "Name", sortable: true, selector: "name" },
    { name: "State", sortable: true, selector: "state" },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <EditGridIcon id={cell.id} value={cell.name} onClick={editCell} />
          </div>
          <div className={classes.PaddingActionButton}>
            <DeleteGridIcon
              id={cell.id}
              onClick={deleteCell}
              value={cell.name}
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
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.VIEW_RPC_TEXT}
        </Typography>
        <GreenButton
          variant="contained"
          color="secondary"
          onClick={() => deleteMulUserById()}
          startIcon={<DeleteIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          Delete Selected RPC's
        </GreenButton>
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
        <Card>
          <CardContent>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="rpc-text-filter"
                  freeSolo
                  autoHighlight
                  autoComplete
                  loading={isLoading}
                  options={formState.rpcsFilterData}
                  includeInputInList
                  getOptionLabel={option => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    return option.name;
                  }}
                  renderOption={option => option.name}
                  onChange={getRpcSelectedValue}
                  value={formState.isClearResetFilter ? null : value}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="RPC"
                      margin="normal"
                      variant="outlined"
                      placeholder="Search RPC's"
                      className={classes.autoCompleteField}
                      onChange={handleFilterChange}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {isLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
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
                    filterRpcData();
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
            <div className={classes.noDataMargin}>No data to show</div>
          )}
          <DeleteRpc
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
        </Card>
      </Grid>
    </Grid>
  );
};
export default ViewRpc;