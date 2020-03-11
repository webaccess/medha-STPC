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
import useStyles from "./ManageCollegeStyles";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import { GrayButton, YellowButton, GreenButton } from "../../../components";
import * as routeConstants from "../../../constants/RouteConstants";
import DeleteCollege from "./DeleteCollege";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";

const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const COLLEGE_FILTER = "collegeName";
const COLLEGE_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;

const ManageCollege = props => {
  const history = useHistory();
  const [open, setOpen] = React.useState(true);
  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    colleges: [],
    zones: [],
    zonesForEdit: [],
    rpcsForEdit: [],
    states: [],
    /** This is when we return from edit page */
    isDataEdited: props["location"]["fromeditCollege"]
      ? props["location"]["isDataEdited"]
      : false,
    editedData: props["location"]["fromeditCollege"]
      ? props["location"]["editedData"]
      : {},
    fromeditCollege: props["location"]["fromeditCollege"]
      ? props["location"]["fromeditCollege"]
      : false,
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddCollege"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddCollege"]
      ? props["location"]["addedData"]
      : {},
    fromAddCollege: props["location"]["fromAddCollege"]
      ? props["location"]["fromAddCollege"]
      : false,
    /** This is for delete */
    isDataDeleted: false,
    dataToDelete: {},
    isView: false,
    showModalDelete: false,
    filterDataParameters: {
      COLLEGE_FILTER: ""
    },
    pageSize: 10,
    totalRows: "",
    page: "",
    pageCount: ""
  });

  useEffect(() => {
    /** Seperate function to get zone data */
    getCollegeData();
  }, []);

  /** This seperate function is used to get the college data*/
  const getCollegeData = async () => {
    await serviceProviders
      .serviceProviderForGetRequest(COLLEGE_URL)
      .then(res => {
        formState.dataToShow = [];
        formState.tempData = [];
        let temp = [];
        let college_data = res.data.result;

        /** As college data is in nested form we first convert it into
         * a float structure and store it in data
         */
        serviceProviders
          .serviceProviderForGetRequest(ZONES_URL)
          .then(res => {
            formState.zones = res.data.result;
            temp = convertCollegeData(college_data);
            setFormState(formState => ({
              ...formState,
              colleges: college_data,
              dataToShow: temp,
              tempData: temp
            }));
          })
          .catch(error => {
            console.log("error", error);
          });
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  /** Converting college unstructured data into structred flat format for passing it into datatable */
  const convertCollegeData = data => {
    let collegeDataArray = [];
    if (data.length > 0) {
      for (let i in data) {
        var tempIndividualCollegeData = {};
        tempIndividualCollegeData["id"] = data[i]["id"];
        tempIndividualCollegeData["name"] = data[i]["name"];
        tempIndividualCollegeData["college_code"] = data[i]["college_code"];
        tempIndividualCollegeData["address"] = data[i]["address"];
        tempIndividualCollegeData["rpc"] = data[i]["rpc"]["name"];
        tempIndividualCollegeData["contact_number"] = data[i]["contact_number"];
        tempIndividualCollegeData["college_email"] = data[i]["college_email"];
        for (let j in formState.zones) {
          if (formState.zones[j]["id"] === data[i]["rpc"]["zone"]) {
            tempIndividualCollegeData["zone_name"] = formState.zones[j]["name"];
          }
        }
        collegeDataArray.push(tempIndividualCollegeData);
      }
      return collegeDataArray;
    }
  };

  /** Restoring the data basically resets all te data i.e it gets all the data in view zones
   * i.e the nested zones data and also resets the data to []
  
  const restoreData = () => {
    getZoneData();
  };
  */
  const restoreData = () => {
    getCollegeData();
  };

  const getDataForEdit = async (id, isView = false) => {
    /** Get college data for edit */
    let paramsForCollege = {
      id: id
    };
    await serviceProviders
      .serviceProviderForGetRequest(COLLEGE_URL, paramsForCollege)
      .then(res => {
        /** This we will use as final data for edit we send to modal */
        let editData = res.data.result[0];
        console.log("editData", editData);
        /** Check if zone is present in college data under rpc */
        if (
          editData.hasOwnProperty("rpc") &&
          editData["rpc"].hasOwnProperty("zone") &&
          editData["rpc"]["zone"] != null
        ) {
          /** If present get state id using that zone */
          let paramsForZones = {
            id: editData["rpc"]["zone"]
          };
          serviceProviders
            .serviceProviderForGetRequest(ZONES_URL, paramsForZones)
            .then(res => {
              editData["state"] = res.data.result[0]["state"]["id"];
              history.push({
                pathname: routeConstants.EDIT_COLLEGE,
                editCollege: true,
                dataForEdit: editData
              });
            })
            .catch(error => {
              console.log("error while getting data for edit > ", error);
            });
        } else {
          console.log("Rpc or zones for the college not present!");
        }
      })
      .catch(error => {
        console.log("error");
      });
  };

  const editCell = event => {
    getDataForEdit(event.target.id);
  };

  const viewCell = event => {
    getDataForEdit(event.target.id, true);
  };

  const isDeleteCellCompleted = status => {
    formState.isDataDeleted = status;
  };

  const deleteCell = event => {
    event.persist();
    setFormState(formState => ({
      ...formState,
      dataToDelete: { id: event.target.id },
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
      if (row["name"] === formState.filterDataParameters[COLLEGE_FILTER]) {
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
    restoreData();
  };

  /** This is used to handle the close modal event for delete*/
  const handleCloseDeleteModal = () => {
    /** This restores all the data when we close the modal */
    //restoreData();
    setFormState(formState => ({
      ...formState,
      isDataDeleted: false,
      showModalDelete: false
    }));
    if (formState.isDataDeleted) {
      getCollegeData();
    }
  };

  /** Columns to show in table */
  const column = [
    { name: "Name", sortable: true, selector: "name" },
    { name: "Zone", sortable: true, selector: "zone_name" },
    { name: "RPC", sortable: true, selector: "rpc" },

    /** Columns for edit and delete */

    {
      cell: cell => (
        <Tooltip title="View" placement="top">
          <i
            className="material-icons"
            id={cell.id}
            //onClick={viewCell}
            style={{ color: "green" }}
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

  const classes = useStyles();
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.VIEW_COLLEGE_TEXT}
        </Typography>
        <GreenButton
          variant="contained"
          color="primary"
          onClick={clearFilter}
          disableElevation
          to={routeConstants.ADD_COLLEGE}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          {genericConstants.ADD_COLLEGE_BUTTON}
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        {/** Error/Success messages to be shown for edit */}
        {formState.fromeditCollege && formState.isDataEdited ? (
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
        {formState.fromeditCollege && !formState.isDataEdited ? (
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
        {formState.fromAddCollege && formState.isDataAdded ? (
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
        {formState.fromAddCollege && !formState.isDataAdded ? (
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

        <Card>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  name={COLLEGE_FILTER}
                  options={formState.colleges}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(COLLEGE_FILTER, event, value)
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="College Name"
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
                  {genericConstants.SEARCH_BUTTON_TEXT}
                </YellowButton>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
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
                // totalRows={totalRows}
                // handlePerRowsChange={handlePerRowsChange}
                // handlePageChange={handlePageChange}
              />
            ) : (
              <Spinner />
            )
          ) : (
            <div className={classes.noDataMargin}>
              {genericConstants.NO_DATA_TO_SHOW_TEXT}
            </div>
          )}{" "}
          <DeleteCollege
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

export default ManageCollege;
