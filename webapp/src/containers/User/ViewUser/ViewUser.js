import React, { useState, useEffect, useCallback } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";

import { Table, Spinner } from "../../../components";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import { GrayButton, YellowButton, GreenButton } from "../../../components";
import * as serviceProviders from "../../../api/Axios";
import useStyles from "./ViewUserStyles";
import DeleteUser from "./DeleteUser";
import BlockUser from "./BlockUser"

const USER_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;
const ZONE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const RPC_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;
const IPC_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
const ROLE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ROLES;

const ZONE_FILTER = "zoneFilter";
const RPC_FILTER = "rpcFilter";
const IPC_FILTER = "ipcFilter";
const USER_FILTER = "userFilter";
const ROLE_FILTER = "roleFilter";

const ViewUsers = () => {
  const classes = useStyles();
  const [selectedRows, setSelectedRows] = useState([]);

  const [formState, setFormState] = useState({

    dataToShow: [],
    tempData: [],
    users: [],
    zones: [],
    rpcs: [],
    roles: [],
    ipcs: [],
    filterDataParameters: {
      zoneFilter: "",
      rpcFilter: "",
      ipcFilter: "",
      userFilter: "",
      roleFilter: ""
    },
    isDataEdited: false,
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
    MultiBlockUser: {}
  });

  useEffect(() => {
    /** Seperate function to get user data */
    getUserData();

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

  const getUserData = async () => {
    await serviceProviders
      .serviceProviderForGetRequest(USER_URL)
      .then(res => {
        formState.dataToShow = [];
        formState.tempData = [];
        let temp = [];
        temp = convertUserData(res.data);
        setFormState(formState => ({
          ...formState,
          users: res.data,
          dataToShow: temp,
          tempData: temp
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

  /** To reset search filter */
  const refreshPage = () => {
    window.location.reload(false);
  };

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      formState.filterDataParameters[filterName] = "";
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] =
        value["name"] || value["username"];
    }
  };

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

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

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = () => {
    const filteredData = formState.tempData.filter(
      dataObj =>
        dataObj.username.indexOf(
          formState.filterDataParameters[USER_FILTER]
        ) !== -1 &&
        dataObj.role.indexOf(formState.filterDataParameters[ROLE_FILTER]) !==
          -1 &&
        dataObj.zone.indexOf(formState.filterDataParameters[ZONE_FILTER]) !==
          -1 &&
        dataObj.rpc.indexOf(formState.filterDataParameters[RPC_FILTER]) !==
          -1 &&
        dataObj.college.indexOf(formState.filterDataParameters[IPC_FILTER]) !==
          -1
    );

    setFormState(formState => ({
      ...formState,
      dataToShow: filteredData
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
    //restoreData();
    setFormState(formState => ({
      ...formState,
      showModalBlock: false
    }));
    if (formState.isUserBlocked) {
      getUserData();
    }
  };

  const blockMulUserById = () => {
    let arrayId = [];

    for (var k = 0; k < selectedRows.length; k++) {

      if (selectedRows[k]["blocked"] === true) {
        arrayId.push(selectedRows[k]["id"]);
        setFormState(formState => ({
          ...formState,
          isMulBlocked: false,
          isMulUnBlocked: true,
          showModalBlock: true,
          MultiBlockUser: arrayId
        }));
      } else {
        arrayId.push(selectedRows[k]["id"]);
        setFormState(formState => ({
          ...formState,
          isMulBlocked: true,
          isMulUnBlocked: false,
          showModalBlock: true,
          MultiBlockUser: arrayId
        }));
      }
    }
  };


  /** Table Data */
  const column = [
    { name: "Users", sortable: true, selector: "username" },
    { name: "Zone", sortable: true, selector: "zone" },
    { name: "Role", sortable: true, selector: "role" },
    { name: "RPC", sortable: true, selector: "rpc" },
    { name: "IPC", sortable: true, selector: "college" },
    /** Columns for edit and delete */
    {
      cell: cell => (
        <i
          className="material-icons"
          id={cell.id}
          value={cell.name}
          onClick={blockedCell}
        >
          block
        </i>
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
        <i
          className="material-icons"
          id={cell.id}
          value={cell.name}
          //onClick={editCell}
        >
          edit
        </i>
      ),
      button: true,
      conditionalCellStyles: []
    },
    {
      cell: cell => (
        <i
          className="material-icons"
          id={cell.id}
          onClick={deleteCell}
          style={{ color: "red" }}
        >
          delete_outline
        </i>
      ),
      button: true,
      conditionalCellStyles: []
    }
  ];

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          User
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => blockMulUserById()}
        >
          Block
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => deleteMulUserById()}
        >
          Delete
        </Button>

        <GreenButton
          variant="contained"
          color="primary"
          //onClick={clearFilter}
          disableElevation
          to={routeConstants.ADD_USER}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          Add User
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
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
                      label="Name"
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
                  onClick={searchFilter}
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
                //contextActions={contextActions}
                //editEvent={editCell}
                deleteEvent={deleteCell}
              />
            ) : (
              <div className={classes.noDataMargin}>No data to show</div>
            )
          ) : (
            <Spinner />
          )}
          {/* <EditState
          showModal={formState.showEditModal}
          //closeModal={handleCloseModal}
          dataToEdit={formState.dataToEdit}
          id={formState.dataToEdit["id"]}
         // editEvent={isEditCellCompleted}
        /> */}
          {formState.isMultiDelete ? (
            <DeleteUser
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              deleteEvent={isDeleteCellCompleted}
              id={formState.MultiDeleteID}
              isMultiDelete={formState.isMultiDelete}
            />
          ) : (
            <DeleteUser
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              id={formState.dataToDelete["id"]}
              deleteEvent={isDeleteCellCompleted}
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
            />
          ) : (
            <BlockUser
              id={formState.dataToBlock}
              getModel={formState.showModalBlock}
              closeBlockModal={handleCloseBlockModal}
              blockEvent={isUserBlockCompleted}
              isBlocked={formState.isBlocked}
              isUnBlocked={formState.isUnBlocked}
            />
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ViewUsers;
