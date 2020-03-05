import React, { useState, useEffect } from "react";

import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Table, Spinner } from "../../../components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useStyles from "./ViewZoneStyles";
import * as serviceProviders from "../../../api/Axios";
import EditZone from "./EditZone";
import DeleteZone from "./DeleteZone";
import {
  YellowRouteButton,
  GreenButton,
  GrayButton
} from "../../../components";
import * as routeConstants from "../../../constants/RouteConstants";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";

const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const ZONE_FILTER = "zoneFilter";

const ViewZone = props => {
  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    zones: [],
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
    console.log("dataToEdit ", formState.dataToEdit);
  }, [formState.dataToEdit]);

  /** Pre-populate the data with zones data and state data. State data is used while editing the data */
  useEffect(() => {
    /** Seperate function to get zone data */
    getZoneData();
    serviceProviders
      .serviceProviderForGetRequest(STATES_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          states: res.data
        }));
      })
      .catch(error => {
        console.log("error");
      });
  }, []);

  /** This seperate function is used to get the zone data*/
  const getZoneData = async () => {
    await serviceProviders
      .serviceProviderForGetRequest(ZONES_URL)
      .then(res => {
        formState.dataToShow = [];
        formState.tempData = [];
        let temp = [];
        /** As zones data is in nested form we first convert it into
         * a float structure and store it in data
         */
        console.log("Zone Data > ", res.data);
        temp = convertZoneData(res.data);
        setFormState(formState => ({
          ...formState,
          zones: res.data,
          dataToShow: temp,
          tempData: temp
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
        temp["state"] = data[i]["state"]["name"];
        x.push(temp);
      }
      return x;
    }
  };

  /** Restoring the data basically resets all te data i.e it gets all the data in view zones
   * i.e the nested zones data and also resets the data to []
  
  const restoreData = () => {
    getZoneData();
  };
  */

  const getDataForEdit = async id => {
    await serviceProviders
      .serviceProviderForGetOneRequest(ZONES_URL, id)
      .then(res => {
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

  const editCell = event => {
    getDataForEdit(event.target.id);
  };

  const isEditCellCompleted = status => {
    formState.isDataEdited = status;
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

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["name"];
    }
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = () => {
    let filteredData = formState.tempData.filter(function(row) {
      if (row["name"] === formState.filterDataParameters[ZONE_FILTER]) {
        return true;
      } else {
        return false;
      }
    });
    setFormState(formState => ({
      ...formState,
      dataToShow: filteredData
    }));
  };

  /** This restores all the data when we clear the filters
   */
  const clearFilter = () => {
    setFormState(formState => ({
      ...formState,
      dataToShow: formState.tempData
    }));
    /**Need to confirm this thing for resetting the data */
    //restoreData();
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
      getZoneData();
    } else {
      setFormState(formState => ({
        ...formState,
        showEditModal: false,
        isDataEdited: false,
        showModalDelete: false
      }));
    }
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
      getZoneData();
    }
  };

  /** Columns to show in table */
  const column = [
    { name: "Name", sortable: true, selector: "name" },
    { name: "State", sortable: true, selector: "state" },
    /** Columns for edit and delete */
    {
      cell: cell => (
        <i
          className="material-icons"
          id={cell.id}
          value={cell.name}
          onClick={editCell}
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
          className="material-icons tableicons"
          id={cell.id}
          onClick={deleteCell}
        >
          delete_outline
        </i>
      ),
      button: true,
      conditionalCellStyles: []
    }
  ];

  /** Set zone data to data in formState */

  /** Empty the initial nested zones array as we have already added our data in the formState.data array*/
  //formState.zones = [];

  const classes = useStyles();
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Zone
        </Typography>

        <YellowRouteButton
          variant="contained"
          color="primary"
          onClick={clearFilter}
          disableElevation
          to={routeConstants.ADD_ZONES}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          Add Zone
        </YellowRouteButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card className={classes.root} variant="outlined">
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
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
                      label="Zone Name"
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
                  onClick={searchFilter}
                >
                  Search
                </GreenButton>
              </Grid>
              <Grid className={classes.filterButtonsMargin}>
                <GrayButton
                  variant="contained"
                  color="primary"
                  onClick={clearFilter}
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
                editEvent={editCell}
                deleteEvent={deleteCell}
              />
            ) : (
              <Spinner />
            )
          ) : (
            <div className={classes.noDataMargin}>No data to show</div>
          )}
          <EditZone
            states={formState.states}
            showModal={formState.showEditModal}
            closeModal={handleCloseModal}
            dataToEdit={formState.dataToEdit}
            id={formState.dataToEdit["id"]}
            editEvent={isEditCellCompleted}
          />
          <DeleteZone
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

export default ViewZone;
