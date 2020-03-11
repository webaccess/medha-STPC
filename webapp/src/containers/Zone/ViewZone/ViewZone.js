import React, { useState, useEffect } from "react";

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

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Table, Spinner, Alert } from "../../../components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useStyles from "./ViewZoneStyles";
import * as serviceProviders from "../../../api/Axios";
import DeleteZone from "./DeleteZone";
import { GreenButton, YellowButton, GrayButton } from "../../../components";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";

const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const ZONE_FILTER = "zoneFilter";

const ViewZone = props => {
  const [open, setOpen] = React.useState(true);
  const history = useHistory();
  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    zones: [],
    states: [],
    filterDataParameters: {
      ZONE_FILTER: ""
    },
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
    /** This is for delete */
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showModalDelete: false
  });

  /** Pre-populate the data with zones data and state data. State data is used while editing the data */
  useEffect(() => {
    /** Seperate function to get zone data */
    getZoneData();
    serviceProviders
      .serviceProviderForGetRequest(STATES_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          states: res.data.result
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
        temp = convertZoneData(res.data.result);
        setFormState(formState => ({
          ...formState,
          zones: res.data.result,
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
  const handleCloseDeleteModal = () => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setFormState(formState => ({
      ...formState,
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
        <Tooltip title="Delete" placement="top">
          <i
            className="material-icons tableicons"
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

  /** Set zone data to data in formState */

  /** Empty the initial nested zones array as we have already added our data in the formState.data array*/
  //formState.zones = [];

  const classes = useStyles();
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.VIEW_ZONE_TEXT}
        </Typography>

        <GreenButton
          variant="contained"
          color="primary"
          disableElevation
          to={routeConstants.ADD_ZONES}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          {genericConstants.ADD_ZONE_TEXT}
        </GreenButton>
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
              {genericConstants.ALERT_SUCCESS_DATA_EDITED_MESSAGE}
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
              {genericConstants.ALERT_ERROR_DATA_EDITED_MESSAGE}
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
              {genericConstants.ALERT_SUCCESS_DATA_ADDED_MESSAGE}
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
              {genericConstants.ALERT_ERROR_DATA_ADDED_MESSAGE}
            </Alert>
          </Collapse>
        ) : null}
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
                <YellowButton
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={searchFilter}
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
                editEvent={editCell}
                deleteEvent={deleteCell}
              />
            ) : (
              <Spinner />
            )
          ) : (
            <div className={classes.noDataMargin}>No data to show</div>
          )}
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
