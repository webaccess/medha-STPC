import React, { useState, useEffect, useCallback } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import BlockIcon from "@material-ui/icons/Block";
import DeleteIcon from "@material-ui/icons/Delete";
import { useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
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

import { Table, Spinner, Alert } from "../../../components";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import { GrayButton, YellowButton, GreenButton } from "../../../components";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import useStyles from "./ViewUserStyles";
import DeleteUser from "./DeleteUser";
import BlockUser from "./BlockUser";
import * as formUtilities from "../../../Utilities/FormUtilities";

const USER_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;
const ZONE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const RPC_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;
const IPC_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
const ROLE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ROLES;

const ZONE_FILTER = "zone.id";
const RPC_FILTER = "rpc.id";
const IPC_FILTER = "college.id";
const USER_FILTER = "id";
const ROLE_FILTER = "role.id";

const SORT_FIELD_KEY = "_sort";

const ViewUsers = props => {
  const [open, setOpen] = useState(true);
  const classes = useStyles();
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);

  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    users: [],
    zones: [],
    rpcs: [],
    roles: [],
    ipcs: [],
    filterDataParameters: {},
    isFilterSearch: false,
    /** This is when we return from edit page */
    isDataEdited: props["location"]["fromeditUser"]
      ? props["location"]["isDataEdited"]
      : false,
    editedData: props["location"]["fromeditUser"]
      ? props["location"]["editedData"]
      : {},
    fromeditUser: props["location"]["fromeditUser"]
      ? props["location"]["fromeditUser"]
      : false,
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddUser"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddUser"]
      ? props["location"]["addedData"]
      : {},
    fromAddUser: props["location"]["fromAddUser"]
      ? props["location"]["fromAddUser"]
      : false,
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showEditModal: false,
    showModalDelete: false,
    isMultiDelete: false,
    MultiDeleteID: [],
    isBlocked: false,
    isUnBlocked: false,
    isDelete: false,
    dataToBlock: {},
    showModalBlock: false,
    isUserBlocked: false,
    isMulBlocked: false,
    isMulUnBlocked: false,
    MultiBlockUser: {},
    bottonBlockUnblock: "Block Selected User",
    greenButtonChecker: true,
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true,
    selectedRowFilter: true
  });

  useEffect(() => {
    /** Seperate function to get user data */
    getUserData(10, 1);

    serviceProviders
      .serviceProviderForGetRequest(ZONE_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          zones: res.data.result
        }));
      })
      .catch(error => {
        console.log("error");
      });

    serviceProviders
      .serviceProviderForGetRequest(RPC_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          rpcs: res.data.result
        }));
      })
      .catch(error => {
        console.log("error");
      });

    serviceProviders
      .serviceProviderForGetRequest(IPC_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          ipcs: res.data.result
        }));
      })
      .catch(error => {
        console.log("error");
      });

    serviceProviders
      .serviceProviderForGetRequest(ROLE_URL)
      .then(res => {
        let rolesArray = [];
        for (let i in res.data.roles) {
          if (
            res.data.roles[i]["name"] !== "Admin" &&
            res.data.roles[i]["name"] !== "Authenticated" &&
            res.data.roles[i]["name"] !== "Public"
          ) {
            rolesArray.push(res.data.roles[i]);
          }
        }
        setFormState(formState => ({
          ...formState,

          roles: rolesArray
        }));
      })
      .catch(error => {
        console.log("error");
      });
  }, []);

  const getUserData = async (pageSize, page, paramsForUsers = null) => {
    if (paramsForUsers !== null && !formUtilities.checkEmpty(paramsForUsers)) {
      let defaultParams = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "username:asc"
      };
      Object.keys(paramsForUsers).map(key => {
        defaultParams[key] = paramsForUsers[key];
      });
      paramsForUsers = defaultParams;
    } else {
      paramsForUsers = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "username:asc"
      };
    }
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));

    await serviceProviders
      .serviceProviderForGetRequest(USER_URL, paramsForUsers)
      .then(res => {
        formState.dataToShow = [];
        formState.tempData = [];
        let temp = [];
        temp = convertUserData(res.data.result);
        setFormState(formState => ({
          ...formState,
          users: res.data.result,
          pageSize: res.data.pageSize,
          totalRows: res.data.rowCount,
          page: res.data.page,
          pageCount: res.data.pageCount,
          dataToShow: temp,
          tempData: temp,
          isDataLoading: false
        }));
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  const convertUserData = data => {
    let x = [];
    if (data.length > 0) {
      for (let i in data) {
        var temp = {};
        temp["id"] = data[i]["id"];
        temp["username"] = data[i]["username"];
        temp["blocked"] = data[i]["blocked"];
        temp["role"] = data[i]["role"]["name"];
        temp["zone"] = data[i]["zone"] ? data[i]["zone"]["name"] : "";
        temp["rpc"] = data[i]["rpc"] ? data[i]["rpc"]["name"] : "";
        temp["college"] = data[i]["college"] ? data[i]["college"]["name"] : "";

        x.push(temp);
      }
      return x;
    }
  };

  /** Pagination */
  const handlePerRowsChange = async (perPage, page) => {
    /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getUserData(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getUserData(perPage, page);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getUserData(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getUserData(formState.pageSize, page);
      }
    }
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getUserData(perPage, page, formState.filterDataParameters);
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
    getUserData(formState.pageSize, 1);
  };

  const isDeleteCellCompleted = status => {
    formState.isDataDeleted = status;
  };

  const deleteCell = event => {
    let dataId = event.target.id;
    setFormState(formState => ({
      ...formState,
      dataToDelete: { id: dataId },
      showEditModal: false,
      showModalDelete: true
    }));
  };

  /** This is used to handle the close modal event */
  const handleCloseDeleteModal = () => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setFormState(formState => ({
      ...formState,
      showEditModal: false,
      isDataDeleted: false,
      showModalDelete: false
    }));
    if (formState.isDataDeleted) {
      getUserData();
    }
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalBlock: false,
      showModalDelete: false
    }));
  };

  /** To reset search filter */
  const refreshPage = () => {
    window.location.reload(false);
  };

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
    }
  };

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
      MultiDeleteID: arrayId
    }));
  };

  const blockedCell = event => {
    for (var k = 0; k < formState.dataToShow.length; k++) {
      if (
        parseInt(event.target.id) === parseInt(formState.dataToShow[k]["id"])
      ) {
        if (formState.dataToShow[k]["blocked"] === true) {
          blockedCellData(event.target.id, false);
        } else {
          blockedCellData(event.target.id, true);
        }
      }
    }
  };

  const blockedCellData = (id, isBlocked = false) => {
    if (isBlocked === true) {
      setFormState(formState => ({
        ...formState,
        dataToBlock: id,
        isBlocked: true,
        isUnBlocked: false,
        showModalBlock: true
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        dataToBlock: id,
        isBlocked: false,
        isUnBlocked: true,
        showModalBlock: true
      }));
    }
  };

  const isUserBlockCompleted = status => {
    formState.isUserBlocked = status;
  };

  const handleCloseBlockModal = () => {
    /** This restores all the data when we close the modal */
    setFormState(formState => ({
      ...formState,
      showModalBlock: false
    }));
    if (formState.isUserBlocked) {
      //getUserData();
      window.location.reload(false);
    }
  };

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
          bottonBlockUnblock: "Block Selected User"
        }));
      } else {
        setFormState(formState => ({
          ...formState,
          bottonBlockUnblock: "Unblock Selected User"
        }));
      }
    });
    setSelectedRows(state.selectedRows);
  }, []);

  const blockMulUserById = () => {
    let arrayId = [];
    for (var k = 0; k < selectedRows.length; k++) {
      arrayId.push(selectedRows[k]["id"]);
    }
    if (formState.bottonBlockUnblock === "Block Selected User") {
      setFormState(formState => ({
        ...formState,
        isMulBlocked: true,
        isMulUnBlocked: false,
        showModalBlock: true,
        MultiBlockUser: arrayId
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        isMulBlocked: false,
        isMulUnBlocked: true,
        showModalBlock: true,
        MultiBlockUser: arrayId
      }));
    }
  };

  const getDataForEdit = async id => {
    let paramsForUsers = {
      id: id
    };
    await serviceProviders
      .serviceProviderForGetRequest(USER_URL, paramsForUsers)
      .then(res => {
        let editData = res.data.result[0];
        /** move to edit page */
        history.push({
          pathname: routeConstants.EDIT_USER,
          editUser: true,
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

  const viewCell = event => {
    history.push({
      pathname: routeConstants.DETAIL_USER,
      dataForEdit: event.target.id
    });
  };

  /** Table Data */
  const column = [
    { name: "User Name", sortable: true, selector: "username" },
    { name: "Zone", sortable: true, selector: "zone" },
    { name: "Role", sortable: true, selector: "role" },
    { name: "RPC", sortable: true, selector: "rpc" },
    { name: "IPC", sortable: true, selector: "college" },
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
            style={{ color: "green" }}
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
        <Tooltip title="Block" placement="top">
          <i
            className="material-icons"
            id={cell.id}
            value={cell.name}
            onClick={blockedCell}
          >
            block
          </i>
        </Tooltip>
      ),
      button: true,
      conditionalCellStyles: [
        {
          when: row => row.blocked === true,
          style: {
            color: "red"
          }
        },
        {
          when: row => row.blocked === false,
          style: {
            color: "green"
          }
        }
      ]
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
      {console.log(props)}
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Manage User
        </Typography>
        <GreenButton
          variant="contained"
          color="secondary"
          onClick={() => blockMulUserById()}
          startIcon={<BlockIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          {formState.bottonBlockUnblock}
        </GreenButton>

        <GreenButton
          variant="contained"
          color="secondary"
          onClick={() => deleteMulUserById()}
          startIcon={<DeleteIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          Delete Selected User
        </GreenButton>

        <GreenButton
          variant="contained"
          color="primary"
          onClick={clearFilter}
          disableElevation
          to={routeConstants.ADD_USER}
          startIcon={<AddCircleOutlineOutlinedIcon />}
          buttonDisabled={formState.selectedRowFilter}
        >
          Add User
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        {/** Error/Success messages to be shown for edit */}
        {formState.fromeditUser && formState.isDataEdited ? (
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
        {formState.fromeditUser && !formState.isDataEdited ? (
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
        {formState.fromAddUser && formState.isDataAdded ? (
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
        {formState.fromAddUser && !formState.isDataAdded ? (
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
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  name={USER_FILTER}
                  options={formState.users}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.username}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(USER_FILTER, event, value)
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="User Name"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  name={ROLE_FILTER}
                  options={formState.roles}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(ROLE_FILTER, event, value)
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Role"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  name={ZONE_FILTER}
                  options={formState.zones}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(ZONE_FILTER, event, value)
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Zone"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  name={RPC_FILTER}
                  options={formState.rpcs}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(RPC_FILTER, event, value)
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="RPC"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  name={IPC_FILTER}
                  options={formState.ipcs}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(IPC_FILTER, event, value)
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="IPC"
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
                  Search
                </YellowButton>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <GrayButton
                  variant="contained"
                  color="primary"
                  onClick={refreshPage}
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
                deleteEvent={deleteCell}
                defaultSortField="username"
                defaultSortAsc={formState.sortAscending}
                progressPending={formState.isDataLoading}
                paginationTotalRows={formState.totalRows}
                paginationRowsPerPageOptions={[10, 20, 50]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
              />
            ) : (
              <div className={classes.noDataMargin}>No data to show</div>
            )
          ) : (
            <Spinner />
          )}

          {formState.isMultiDelete ? (
            <DeleteUser
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              deleteEvent={isDeleteCellCompleted}
              id={formState.MultiDeleteID}
              isMultiDelete={formState.isMultiDelete}
              modalClose={modalClose}
            />
          ) : (
            <DeleteUser
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              id={formState.dataToDelete["id"]}
              deleteEvent={isDeleteCellCompleted}
              modalClose={modalClose}
            />
          )}
          {formState.isMulBlocked || formState.isMulUnBlocked ? (
            <BlockUser
              id={formState.MultiBlockUser}
              isMulBlocked={formState.isMulBlocked}
              isUnMulBlocked={formState.isMulUnBlocked}
              getModel={formState.showModalBlock}
              closeBlockModal={handleCloseBlockModal}
              blockEvent={isUserBlockCompleted}
              modalClose={modalClose}
            />
          ) : (
            <BlockUser
              id={formState.dataToBlock}
              getModel={formState.showModalBlock}
              closeBlockModal={handleCloseBlockModal}
              blockEvent={isUserBlockCompleted}
              isBlocked={formState.isBlocked}
              isUnBlocked={formState.isUnBlocked}
              modalClose={modalClose}
            />
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ViewUsers;
