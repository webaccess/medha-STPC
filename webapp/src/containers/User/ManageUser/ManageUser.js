import React, { useState, useEffect, useCallback, useContext } from "react";
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
  Grid,
  Collapse,
  IconButton,
  Typography
} from "@material-ui/core";

import { Table, Spinner, Alert } from "../../../components";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import {
  GrayButton,
  YellowButton,
  GreenButton,
  ViewGridIcon,
  EditGridIcon,
  BlockGridIcon,
  DeleteGridIcon
} from "../../../components";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import DeleteUser from "./DeleteUser";
import BlockUser from "./BlockUser";
import * as formUtilities from "../../../Utilities/FormUtilities";
import { setCollege, setRole } from "../../../Utilities/StrapiUtilities";
import LoaderContext from "../../../context/LoaderContext";

const USER_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;
const STATE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const RPCS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;
const IPC_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
const ROLE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ROLES;

const STATE_FILTER = "rpc.state";
const ZONE_FILTER = "zone.id";
const RPC_FILTER = "rpc.id";
const IPC_FILTER = "college.id";
const USER_FILTER = "username_contains";
const ROLE_FILTER = "role.id";

const SORT_FIELD_KEY = "_sort";

const ManageUser = props => {
  const [open, setOpen] = useState(true);
  const classes = useStyles();
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [zones, setZones] = useState([]);
  const [states, setStates] = useState([]);
  const [ipcs, setIpcs] = useState([]);
  const [roles, setRoles] = useState([]);
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);

  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    users: [],
    states: [],
    zones: [],
    rpcs: [],
    roles: [],
    filterDataParameters: {},
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
    editedUserName: props["location"]["editedUserName"]
      ? props["location"]["editedUserName"]["username"]
      : "",
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
    addedUserName: props["location"]["addedUserName"]
      ? props["location"]["addedUserName"]["username"]
      : "",
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showEditModal: false,
    showModalDelete: false,
    isMultiDelete: false,
    MultiDeleteID: [],
    isBlocked: false,
    isUnBlocked: false,
    dataToBlockUnblock: {},
    fromBlockModal: false,
    isDelete: false,
    dataToBlock: {},
    showModalBlock: false,
    isUserBlocked: false,
    isMulBlocked: false,
    isMulUnBlocked: false,
    MultiBlockUser: {},
    bottonBlockUnblock: "Block Selected User",
    greenButtonChecker: true,
    dataToBlockUserName: "",
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true,
    selectedRowFilter: true,
    userNameDelete: "",
    /** Filter */
    filterDataParameters: {},
    isFilterSearch: false,
    isClearResetFilter: false,
    isStateClearFilter: false,
    toggleCleared: false
  });

  const getFilterData = () => {
    let params = {
      pageSize: -1
    };

    serviceProviders
      .serviceProviderForGetRequest(STATE_URL, params)
      .then(res => {
        setStates(res.data.result);
      })
      .catch(error => {
        console.log("error");
      });

    serviceProviders
      .serviceProviderForGetRequest(ROLE_URL, params)
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
        setRoles(rolesArray);
      })
      .catch(error => {
        console.log("error");
      });
  };

  useEffect(() => {
    /** Seperate function to get user data */
    getUserData(10, 1);
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

  const getColleges = () => {
    let params = {
      pageSize: -1,
      "zone.id": formState.filterDataParameters[ZONE_FILTER],
      "rpc.id": formState.filterDataParameters[RPC_FILTER]
    };
    serviceProviders
      .serviceProviderForGetRequest(IPC_URL, params)
      .then(res => {
        setIpcs(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
  };

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
        temp["state"] = data[i]["state"] ? data[i]["state"]["name"] : "";
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
    } else {
      await getUserData(perPage, page);
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
    formState.filterDataParameters[STATE_FILTER] = "";
    // window.location.reload();
    /**Need to confirm this thing for resetting the data */
    restoreData();
  };

  /** Restoring the data basically resets all te data i.e it gets all the data in view zones
   * i.e the nested zones data and also resets the data to []
   */

  const restoreData = () => {
    getUserData(formState.pageSize, 1);
  };

  // const isDeleteCellCompleted = status => {
  //   formState.isDataDeleted = status;
  // };

  const deleteCell = event => {
    setLoaderStatus(true);
    let dataId = event.target.id;

    setFormState(formState => ({
      ...formState,
      dataToDelete: {
        id: event.target.id,
        name: event.target.getAttribute("value")
      },
      showEditModal: false,
      showModalDelete: true,
      userNameDelete: event.target.getAttribute("value"),
      isDataDeleted: false,
      messageToShow: "",
      fromDeleteModal: false,
      fromeditCollege: false,
      fromBlockModal: false,
      fromAddUser: false,
      fromeditUser: false
    }));
    setLoaderStatus(false);
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
      getUserData(formState.pageSize, 1);
    }
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalBlock: false,
      showModalDelete: false,
      isMulBlocked: false,
      isMulUnBlocked: false,
      isBlocked: false,
      isUnBlocked: false,
      isMultiDelete: false
    }));
  };
  /** This restores all the data when we clear the filters*/

  const refreshPage = () => {
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
    clearData();
    // window.location.reload();
    /**Need to confirm this thing for resetting the data */
    restoreData();
  };

  /** Restoring the data basically resets all te data i.e it gets all the data in view zones
   * i.e the nested zones data and also resets the data to []
   */

  const clearData = () => {
    setRpcs([]);
    setZones([]);
    setIpcs([]);
    delete formState.filterDataParameters[RPC_FILTER];
    delete formState.filterDataParameters[ZONE_FILTER];
    delete formState.filterDataParameters[STATE_FILTER];
    delete formState.filterDataParameters[IPC_FILTER];
    delete formState.filterDataParameters[ROLE_FILTER];
    delete formState.filterDataParameters[USER_FILTER];
  };

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
        clearStateZoneRpc();
      }
      if (filterName === ZONE_FILTER || filterName === RPC_FILTER) {
        setIpcs([]);
        delete formState.filterDataParameters[IPC_FILTER];
      }
      delete formState.filterDataParameters[filterName];
      setFormState(formState => ({
        ...formState,
        isClearResetFilter: false,
        isStateClearFilter: setStateFilterValue
      }));
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
      if (filterName === STATE_FILTER) {
        getZonesAndRpcsOnState();
      }
      if (filterName === ZONE_FILTER || filterName === RPC_FILTER) {
        getCollegesOnStateAndZone();
      }
      setFormState(formState => ({
        ...formState,
        isClearResetFilter: false,
        isStateClearFilter: false
      }));
    }
  };

  /** Get colleges on change of state zone and rpc */
  const getCollegesOnStateAndZone = () => {
    setIpcs([]);
    delete formState.filterDataParameters[IPC_FILTER];

    if (
      formState.filterDataParameters.hasOwnProperty(ZONE_FILTER) &&
      formState.filterDataParameters.hasOwnProperty(RPC_FILTER)
    ) {
      if (
        formState.filterDataParameters[ZONE_FILTER] &&
        formState.filterDataParameters[ZONE_FILTER] !== "" &&
        formState.filterDataParameters[RPC_FILTER] &&
        formState.filterDataParameters[RPC_FILTER] !== ""
      ) {
        getColleges();
      }
    }
  };

  /** Clear rpc and zone */
  const clearStateZoneRpc = () => {
    setRpcs([]);
    setZones([]);
    setIpcs([]);
    delete formState.filterDataParameters[ZONE_FILTER];
    delete formState.filterDataParameters[RPC_FILTER];
    delete formState.filterDataParameters[IPC_FILTER];
  };

  const handleFilterChange = (event, eventName) => {
    formState.filterDataParameters[event.target.name] = event.target.value;
  };

  /** Get multiple user id for delete */
  const deleteMulUserById = () => {
    setLoaderStatus(true);
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
    setLoaderStatus(false);
  };

  const blockedCell = event => {
    for (var k = 0; k < formState.dataToShow.length; k++) {
      if (
        parseInt(event.target.id) === parseInt(formState.dataToShow[k]["id"])
      ) {
        if (formState.dataToShow[k]["blocked"] === true) {
          blockedCellData(
            event.target.id,
            event.target.getAttribute("value"),
            false
          );
        } else {
          blockedCellData(
            event.target.id,
            event.target.getAttribute("value"),
            true
          );
        }
      }
    }
  };

  const blockedCellData = (id, user, isBlocked = false) => {
    setLoaderStatus(true);
    if (isBlocked === true) {
      setFormState(formState => ({
        ...formState,
        dataToBlock: id,
        dataToBlockUnblock: {
          isUserBlock: isBlocked,
          name: user
        },
        isBlocked: true,
        isUnBlocked: false,
        isMulBlocked: false,
        isMulUnBlocked: false,
        showModalBlock: true,
        dataToBlockUserName: user,
        fromAddUser: false,
        fromeditUser: false
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        dataToBlock: id,
        dataToBlockUnblock: {
          isUserBlock: isBlocked,
          name: user
        },
        isBlocked: false,
        isUnBlocked: true,
        showModalBlock: true,
        isMulBlocked: false,
        isMulUnBlocked: false,
        dataToBlockUserName: user,
        fromAddUser: false,
        fromeditUser: false
      }));
    }
    setLoaderStatus(false);
  };

  const isUserBlockCompleted = status => {
    formState.isUserBlocked = status;
  };

  const selectedRowCleared = data => {
    formState.toggleCleared = data;
  };

  // const isUserBlockCompleted = status => {
  //   formState.isUserBlocked = status;
  // };

  /** This is used to handle the close modal event */
  const handleCloseBlockUnblockModal = (status, statusToShow = "") => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setOpen(true);
    setFormState(formState => ({
      ...formState,
      isDataBlockUnblock: status,
      showModalBlock: false,
      isMulBlocked: false,
      isMulUnBlocked: false,
      fromBlockModal: true,
      dataToBlockUnblock: {},
      dataToBlock: {},
      messageToShow: statusToShow
    }));
    if (status) {
      getUserData(formState.pageSize, 1);
    }
  };

  const handleRowSelected = useCallback(state => {
    let blockData = [];
    let unblockData = [];

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
    setLoaderStatus(true);
    let arrayId = [];
    for (var k = 0; k < selectedRows.length; k++) {
      arrayId.push(selectedRows[k]["id"]);
    }
    if (formState.bottonBlockUnblock === "Block Selected User") {
      setFormState(formState => ({
        ...formState,
        isMulBlocked: true,
        isMulUnBlocked: false,
        isBlocked: false,
        isUnBlocked: false,
        showModalBlock: true,
        MultiBlockUser: arrayId
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        isMulBlocked: false,
        isMulUnBlocked: true,
        isBlocked: false,
        isUnBlocked: false,
        showModalBlock: true,
        MultiBlockUser: arrayId
      }));
    }
    setLoaderStatus(false);
  };

  const getDataForEdit = async id => {
    setLoaderStatus(true);
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
    setLoaderStatus(false);
  };

  const editCell = event => {
    getDataForEdit(event.target.id);
  };

  const viewCell = event => {
    setLoaderStatus(true);
    history.push({
      pathname: routeConstants.VIEW_USER,
      dataForEdit: event.target.id
    });
    setLoaderStatus(false);
  };

  /** Table Data */
  const column = [
    { name: "User Name", sortable: true, selector: "username" },
    { name: "Role", sortable: true, selector: "role" },
    { name: "State", sortable: true, selector: "state" },
    { name: "Zone", sortable: true, selector: "zone" },
    { name: "RPC", sortable: true, selector: "rpc" },
    { name: "IPC", sortable: true, selector: "college" },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <ViewGridIcon id={cell.id} onClick={viewCell} />
          </div>
          <div className={classes.PaddingActionButton}>
            <EditGridIcon id={cell.id} value={cell.name} onClick={editCell} />
          </div>
          <div className={classes.PaddingActionButton}>
            <BlockGridIcon
              title={cell.blocked}
              id={cell.id}
              value={cell.username}
              onClick={blockedCell}
              style={cell.blocked}
            />
          </div>
          <div className={classes.PaddingActionButton}>
            <DeleteGridIcon
              id={cell.id}
              value={cell.username}
              onClick={deleteCell}
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
          {genericConstants.MANAGE_USER_TEXT}
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
          {genericConstants.DELETE_MULTI_USER_BUTTON}
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
          {genericConstants.ADD_USER_TITLE}
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
              User {formState.editedUserName} has been updated successfully.
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
              An error has occured while updating user. Kindly, try again.
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
              User {formState.addedUserName} has been added successfully.
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
              An error has occured while adding user. Kindly, try again.
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
                <TextField
                  label="User Name"
                  placeholder="User Name"
                  variant="outlined"
                  value={formState.filterDataParameters[USER_FILTER]}
                  name={USER_FILTER}
                  onChange={event => {
                    handleFilterChange(event, USER_FILTER);
                  }}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="username_filter"
                  name={ROLE_FILTER}
                  options={roles}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(ROLE_FILTER, event, value)
                  }
                  value={
                    formState.isClearResetFilter
                      ? null
                      : roles[
                          roles.findIndex(function (item, i) {
                            return (
                              item.id ===
                              formState.filterDataParameters[ROLE_FILTER]
                            );
                          })
                        ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Role"
                      placeholder="Role"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="state_filter"
                  name={STATE_FILTER}
                  options={states}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(STATE_FILTER, event, value)
                  }
                  value={
                    formState.isClearResetFilter
                      ? null
                      : states[
                          states.findIndex(function (item, i) {
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
                  id="zone_filter"
                  options={zones}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(ZONE_FILTER, event, value)
                  }
                  value={
                    formState.isClearResetFilter || formState.isStateClearFilter
                      ? null
                      : zones[
                          zones.findIndex(function (item, i) {
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
                  id="rpc_filter"
                  name={RPC_FILTER}
                  options={rpcs}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(RPC_FILTER, event, value)
                  }
                  value={
                    formState.isClearResetFilter || formState.isStateClearFilter
                      ? null
                      : rpcs[
                          rpcs.findIndex(function (item, i) {
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
              <Grid item>
                <Autocomplete
                  id="ipc_filter"
                  name={IPC_FILTER}
                  options={ipcs}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(IPC_FILTER, event, value)
                  }
                  value={
                    formState.isClearResetFilter || formState.isStateClearFilter
                      ? null
                      : ipcs[
                          ipcs.findIndex(function (item, i) {
                            return (
                              item.id ===
                              formState.filterDataParameters[IPC_FILTER]
                            );
                          })
                        ] || null
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="IPC"
                      placeholder="IPC"
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
                  onClick={refreshPage}
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
                onSelectedRowsChange={handleRowSelected}
                deleteEvent={deleteCell}
                defaultSortField="username"
                defaultSortAsc={formState.sortAscending}
                progressPending={formState.isDataLoading}
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

          {formState.isMultiDelete ? (
            <DeleteUser
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              id={formState.MultiDeleteID}
              isMultiDelete={formState.isMultiDelete}
              modalClose={modalClose}
              seletedUser={selectedRows.length}
              clearSelectedRow={selectedRowCleared}
              dataToDelete={formState.dataToDelete}
            />
          ) : (
            <DeleteUser
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              id={formState.dataToDelete["id"]}
              modalClose={modalClose}
              dataToDelete={formState.dataToDelete}
              userName={formState.userNameDelete}
              clearSelectedRow={selectedRowCleared}
            />
          )}
          {formState.isMulBlocked || formState.isMulUnBlocked ? (
            <BlockUser
              id={formState.MultiBlockUser}
              isMulBlocked={formState.isMulBlocked}
              isMultiUnblock={formState.isMulUnBlocked}
              getModel={formState.showModalBlock}
              closeModal={handleCloseBlockUnblockModal}
              // blockEvent={isUserBlockCompleted}
              modalClose={modalClose}
              clearSelectedRow={selectedRowCleared}
            />
          ) : (
            <BlockUser
              id={formState.dataToBlock}
              dataToBlockUserName={formState.dataToBlockUserName}
              dataToBlockUnblock={formState.dataToBlockUnblock}
              getModel={formState.showModalBlock}
              closeModal={handleCloseBlockUnblockModal}
              // blockEvent={isUserBlockCompleted}
              isBlocked={formState.isBlocked}
              isUnBlocked={formState.isUnBlocked}
              modalClose={modalClose}
              clearSelectedRow={selectedRowCleared}
            />
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ManageUser;
