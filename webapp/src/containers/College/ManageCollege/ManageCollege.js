import React, { useState, useEffect } from "react";

import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";

import axios from "axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Table, Spinner } from "../../../components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useStyles from "./ManageCollegeStyles";
import * as serviceProviders from "../../../api/Axios";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as genericConstants from "../../../constants/GenericConstants";
import {
  GrayButton,
  GreenButton,
  YellowRouteButton
} from "../../../components";
import * as routeConstants from "../../../constants/RouteConstants";
import DeleteCollege from "./DeleteCollege";
import EditCollege from "./EditCollege";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";

const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const STREAMS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;
const USERS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;
const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const COLLEGES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
const COLLEGE_FILTER = "collegeName";
const COLLEGE_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;

const ManageCollege = props => {
  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    colleges: [],
    zones: [],
    zonesForEdit: [],
    rpcsForEdit: [],
    states: [],
    isDataEdited: false,
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showEditModal: false,
    showModalDelete: false,
    filterDataParameters: {
      COLLEGE_FILTER: ""
    }
  });
  /** This will change */
  const [user, setUser] = useState([]);
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [streamsData, setStreamsData] = useState([]);

  useEffect(() => {}, [formState.dataToEdit]);

  /** Pre-populate the data with zones data and state data. State data is used while editing the data */
  useEffect(() => {
    /** Seperate function to get zone data */
    getCollegeData();
    serviceProviders
      .serviceProviderForGetRequest(USERS_URL)
      .then(res => {
        setUser(res.data);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(STATES_URL)
      .then(res => {
        setStates(res.data);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(STREAMS_URL)
      .then(res => {
        setStreamsData(res.data);
      })
      .catch(error => {
        console.log("error", error);
      });
  }, []);

  /** This seperate function is used to get the college data*/
  const getCollegeData = async () => {
    await serviceProviders
      .serviceProviderForGetRequest(COLLEGE_URL)
      .then(res => {
        formState.dataToShow = [];
        formState.tempData = [];
        let temp = [];
        /** As college data is in nested form we first convert it into
         * a float structure and store it in data
         */
        temp = convertCollegeData(res.data);
        setFormState(formState => ({
          ...formState,
          colleges: res.data,
          dataToShow: temp,
          tempData: temp
        }));
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  const convertCollegeData = data => {
    let x = [];
    if (data.length > 0) {
      for (let i in data) {
        var temp = {};
        temp["id"] = data[i]["id"];
        temp["name"] = data[i]["name"];
        temp["college_code"] = data[i]["college_code"];
        temp["address"] = data[i]["address"];
        temp["rpc"] = data[i]["rpc"]["name"];
        temp["contact_number"] = data[i]["contact_number"];
        temp["college_email"] = data[i]["college_email"];
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
  const restoreData = () => {
    getCollegeData();
  };

  const getDataForEdit = async id => {
    /** Get college data for edit */
    await serviceProviders
      .serviceProviderForGetOneRequest(COLLEGE_URL, id)
      .then(res => {
        /** This we will use as final data for edit we send to modal */
        let editData = res.data;
        /** Check if zone is present in college data under rpc */
        if (
          editData.hasOwnProperty("rpc") &&
          editData["rpc"].hasOwnProperty("zone") &&
          editData["rpc"]["zone"] != null
        ) {
          /** If present get state id using that zone */
          let zones = [];
          let rpcs = [];
          serviceProviders
            .serviceProviderForGetOneRequest(ZONES_URL, editData["rpc"]["zone"])
            .then(res => {
              editData["state"] = res.data["state"]["id"];
              /** After getting state id get correspnding all zones and rpcs using that state id to pre populate the edit section */

              let url_array = [];
              url_array.push(
                STATES_URL +
                  "/" +
                  res.data["state"]["id"] +
                  "/" +
                  strapiConstants.STRAPI_ZONES
              );

              url_array.push(
                ZONES_URL +
                  "/" +
                  editData["rpc"]["zone"] +
                  "/" +
                  strapiConstants.STRAPI_RPCS
              );

              serviceProviders
                .serviceProviderForAllGetRequest(url_array)
                .then(
                  axios.spread((data1, data2) => {
                    if (Array.isArray(data1.data)) {
                      zones = data1.data[0].zones;
                    } else {
                      zones = data1.data.zones;
                    }
                    if (Array.isArray(data2.data)) {
                      rpcs = data2.data[0].zones;
                    } else {
                      rpcs = data2.data.rpcs;
                    }
                    setFormState(formState => ({
                      ...formState,
                      dataToEdit: editData,
                      showEditModal: true,
                      showModalDelete: false,
                      zonesForEdit: zones,
                      rpcsForEdit: rpcs
                    }));
                  })
                )
                .catch(error => {
                  console.log("error for axios all > ", error);
                });
            })
            .catch(error => {
              console.log("error while getting data for edit > ", error);
            });
        }
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
    event.persist();
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
      getCollegeData();
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
      getCollegeData();
    }
  };

  /** Columns to show in table */
  const column = [
    { name: "Id", sortable: true, selector: "id" },
    { name: "College Name", sortable: true, selector: "name" },
    { name: "College Code", sortable: true, selector: "college_code" },
    { name: "Address", sortable: true, selector: "address" },
    { name: "Rpc", sortable: true, selector: "rpc" },
    { name: "Contact Number", sortable: true, selector: "contact_number" },
    { name: "Contact Email", sortable: true, selector: "college_email" },

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
        <i className="material-icons" id={cell.id} onClick={deleteCell}>
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
          College
        </Typography>

        <YellowRouteButton
          variant="contained"
          color="primary"
          onClick={clearFilter}
          disableElevation
          to={routeConstants.ADD_COLLEGE}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          Add College
        </YellowRouteButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
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
                <GreenButton
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={searchFilter}
                >
                  {genericConstants.SEARCH_BUTTON_TEXT}
                </GreenButton>
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
                // pagination
                // paginationServer
                // paginationTotalRows={totalRows}
                // onChangeRowsPerPage={handlePerRowsChange}
                // onChangePage={handlePageChange}
              />
            ) : (
              <Spinner />
            )
          ) : (
            <div className={classes.noDataMargin}>No data to show</div>
          )}
          <EditCollege
            showModal={formState.showEditModal}
            closeModal={handleCloseModal}
            dataToEdit={formState.dataToEdit}
            id={formState.dataToEdit["id"]}
            editEvent={isEditCellCompleted}
            statesData={states}
            userData={user}
            streamsDataForEdit={streamsData}
            zonesForEdit={formState.zonesForEdit}
            rpcsForEdit={formState.rpcsForEdit}
          />
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
