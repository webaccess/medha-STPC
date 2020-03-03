import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";
import useStyles from "./ViewRpcStyles";
import { Table, Spinner, GreenButton, GrayButton } from "../../../components";
import axios from "axios";
import DeleteRpc from "./DeleteRpc";
import EditRpc from "./EditRpc";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { CustomRouterLink } from "../../../components";
import * as routeConstants from "../../../constants/RouteConstants";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";

import { YellowRouteButton } from "../../../components";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";

const RPC_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;
const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const ARRAY_URL = [RPC_URL, STATES_URL];
const ViewRpc = props => {
  const classes = useStyles();

  // const [states, setStates] = useState([]);

  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    zones: [],
    rpcs: [],
    states: [],
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
  useEffect(() => {
    getRpcStateData();
  }, []);

  const getRpcStateData = async id => {
    await serviceProviders
      .serviceProviderForAllGetRequest(ARRAY_URL)
      .then(
        axios.spread((user1, user2) => {
          setFormState(formState => ({
            ...formState,
            states: user2.data
          }));
          formState.dataToShow = [];
          formState.tempData = [];
          let temp = [];
          /** As rpcs data is in nested form we first convert it into
           * a float structure and store it in data
           */
          temp = convertRpcData(user1.data, user2.data);
          setFormState(formState => ({
            ...formState,
            rpcs: user1.data,
            dataToShow: temp,
            tempData: temp
          }));
        })
      )
      .catch(error => {
        console.log("error", error);
      });
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
      getRpcStateData();
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

  /** This is used to handle the close modal event */
  const handleCloseModal = () => {
    /** This restores all the data when we close the modal */
    //restoreData();
    if (formState.isDataEdited) {
      setFormState(formState => ({
        ...formState,
        showEditModal: false,
        isDataEdited: false,
        showModalDelete: false,
        dataToShow: formState.tempData
      }));
      getRpcStateData();
    } else {
      setFormState(formState => ({
        ...formState,
        showEditModal: false,
        isDataEdited: false,
        showModalDelete: false
      }));
    }
  };

  const getDataForEdit = async id => {
    await serviceProviders
      .serviceProviderForGetOneRequest(RPC_URL, id)
      .then(res => {
        var url =
          strapiConstants.STRAPI_DB_URL +
          strapiConstants.STRAPI_ZONES +
          "/" +
          id +
          "/" +
          strapiConstants.STRAPI_RPCS;
        serviceProviders
          .serviceProviderForGetRequest(url)
          .then(res => {
            var zoneStatesurl =
              strapiConstants.STRAPI_DB_URL +
              strapiConstants.STRAPI_STATES +
              "/" +
              id +
              "/" +
              strapiConstants.STRAPI_ZONES;
            serviceProviders
              .serviceProviderForGetRequest(zoneStatesurl)
              .then(res => {
                console.log("sattesdata for edit", res.data[0]);
              })
              .catch(error => {
                console.log("stateerror", error);
              });

            console.log("zonesedit", res.data);
            setFormState(formState => ({
              ...formState,
              zones: res.data,
              showEditModal: true,
              showModalDelete: false
            }));
          })
          .catch(error => {
            console.log("zonee", error);
          });

        console.log("edit", res.data);
        setFormState(formState => ({
          ...formState,
          dataToEdit: res.data,
          showEditModal: true,
          showModalDelete: false
        }));
      })
      .catch(error => {
        console.log("error");
      });
  };

  const isEditCellCompleted = status => {
    formState.isDataEdited = status;
  };

  const column = [
    { name: "Id", sortable: true, selector: "id" },
    { name: "RPCs", sortable: true, selector: "name" },
    { name: "Zone", sortable: true, selector: "zone" },
    { name: "State", sortable: true, selector: "state" },
    /** Columns for edit and delete */
    {
      cell: cell => (
        <i
          className="material-icons"
          id={cell.id}
          value={cell.name}
          // onClick={editCell}
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
          // onClick={deleteCell}
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
          RPC
        </Typography>

        <YellowRouteButton
          variant="contained"
          color="primary"
          disableElevation
          component={CustomRouterLink}
          to={routeConstants.ADD_RPC}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          Add RPC
        </YellowRouteButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card>
          <CardContent>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  //name={ZONE_FILTER}
                  options={formState.zones}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
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
                <GreenButton
                  variant="contained"
                  color="primary"
                  disableElevation
                  //onClick={searchFilter}
                  to="#"
                >
                  Search
                </GreenButton>
              </Grid>
              <Grid className={classes.filterButtonsMargin}>
                <GrayButton
                  variant="contained"
                  color="primary"
                  //onClick={clearFilter}
                  disableElevation
                  to="#"
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
                editEvent={editCell}
                deleteEvent={deleteCell}
              />
            ) : (
              <Spinner />
            )
          ) : (
            <div className={classes.noDataMargin}>No data to show</div>
          )}
          {/* <EditRpc
          zones={formState.zones}
          states={formState.states}
          showModal={formState.showEditModal}
          closeModal={handleCloseModal}
          dataToEdit={formState.dataToEdit}
          id={formState.dataToEdit["id"]}
          editEvent={isEditCellCompleted}
        /> */}
          {/* <DeleteRpc
        showModal={formState.showModalDelete}
        closeModal={handleCloseDeleteModal}
        id={formState.dataToDelete["id"]}
        deleteEvent={isDeleteCellCompleted}
      /> */}
        </Card>
      </Grid>
    </Grid>
  );
};
export default ViewRpc;
