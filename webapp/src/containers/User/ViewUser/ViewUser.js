import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
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
import {
  GrayButton,
  GreenButton,
  YellowRouteButton
} from "../../../components";
import * as serviceProviders from "../../../api/Axios";
import useStyles from "./ViewUserStyles";
import styles from "../User.module.css";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";

const USER_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;
const ZONE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const RPC_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;
const IPC_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
const ROLE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ROLES;

const ViewUsers = () => {
  const classes = useStyles();
  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    users: [],
    zones: [],
    rpcs: [],
    roles: [],
    ipcs: [],
    filterDataParameters: {
      ZONE_FILTER: ""
    },
    isDataEdited: false,
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showEditModal: false,
    showModalDelete: false
  });

  console.log("sam", formState.users);

  useEffect(() => {
    /** Seperate function to get zone data */
    getUserData();

    serviceProviders
      .serviceProviderForGetRequest(ZONE_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          zones: res.data
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
          rpcs: res.data
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
          ipcs: res.data
        }));
      })
      .catch(error => {
        console.log("error");
      });

    serviceProviders
      .serviceProviderForGetRequest(ROLE_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          roles: res.data
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

        console.log("User Data > ", res.data);
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
        temp["role"] = data[i]["role"]["name"];
        temp["zone"] = data[i]["zone"]["name"];
        temp["rpc"] = data[i]["rpc"]["name"];
        temp["college"] = data[i]["college"]["name"];

        x.push(temp);
      }
      return x;
    }
  };

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
          //onClick={deleteCell}
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

        <YellowRouteButton
          variant="contained"
          color="primary"
          //onClick={clearFilter}
          disableElevation
          to={routeConstants.ADD_USER}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          Add User
        </YellowRouteButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  options={formState.users}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  // onChange={(event, value) =>
                  //   handleChangeAutoComplete(STATE_FILTER, event, value)
                  // }
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
                  options={formState.roles}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  // onChange={(event, value) =>
                  //   handleChangeAutoComplete(STATE_FILTER, event, value)
                  // }
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
                  options={formState.zones}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  // onChange={(event, value) =>
                  //   handleChangeAutoComplete(STATE_FILTER, event, value)
                  // }
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
                  options={formState.rpcs}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  // onChange={(event, value) =>
                  //   handleChangeAutoComplete(STATE_FILTER, event, value)
                  // }
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
                  options={formState.ipcs}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  // onChange={(event, value) =>
                  //   handleChangeAutoComplete(STATE_FILTER, event, value)
                  // }
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
                <GreenButton
                  variant="contained"
                  color="primary"
                  disableElevation
                  //onClick={searchFilter}
                >
                  Search
                </GreenButton>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <GrayButton
                  variant="contained"
                  color="primary"
                  //onClick={clearFilter}
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
                //editEvent={editCell}

                //deleteEvent={deleteCell}
              />
            ) : (
              <Spinner />
            )
          ) : (
            <div className={classes.noDataMargin}>No data to show</div>
          )}

          {/* <EditState
          showModal={formState.showEditModal}
          //closeModal={handleCloseModal}
          dataToEdit={formState.dataToEdit}
          id={formState.dataToEdit["id"]}
         // editEvent={isEditCellCompleted}
        />
        <DeleteState
          showModal={formState.showModalDelete}
          //closeModal={handleCloseDeleteModal}
          id={formState.dataToDelete["id"]}
          //deleteEvent={isDeleteCellCompleted}
        /> */}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ViewUsers;
