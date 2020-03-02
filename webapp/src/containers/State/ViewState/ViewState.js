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

import styles from "../State.module.css";
import useStyles from "../StateStyles";
import { CustomRouterLink } from "../../../components";
import * as serviceProviders from "../../../api/Axios";
import * as routeConstants from "../../../constants/RouteConstants";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Table, Spinner } from "../../../components";
import EditState from "./EditState";
import DeleteState from "./DeleteState";

const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const STATE_FILTER = "stateFilter";

const ViewStates = () => {
  const classes = useStyles();

  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    states: [],
    filterDataParameters: {
      STATE_FILTER: ""
    },
    isDataEdited: false,
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showEditModal: false,
    showModalDelete: false
  });

  useEffect(() => {
    getStateData();
  }, []);

  /** This seperate function is used to get the zone data*/
  const getStateData = async () => {
    await serviceProviders
      .serviceProviderForGetRequest(STATES_URL)
      .then(res => {
        formState.dataToShow = [];
        formState.tempData = [];
        setFormState(formState => ({
          ...formState,
          states: res.data,
          dataToShow: res.data,
          tempData: res.data
        }));
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  const getDataForEdit = async id => {
    await serviceProviders
      .serviceProviderForGetOneRequest(STATES_URL, id)
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
      if (row["name"] === formState.filterDataParameters[STATE_FILTER]) {
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
      getStateData();
    } else {
      setFormState(formState => ({
        ...formState,
        showEditModal: false,
        isDataEdited: false,
        showModalDelete: false
      }));
    }
  };

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
      showEditModal: false,
      isDataDeleted: false,
      showModalDelete: false
    }));
    if (formState.isDataDeleted) {
      getStateData();
    }
  };

  /** Columns to show in table */
  const column = [
    { name: "Id", sortable: true, selector: "id" },
    { name: "States", sortable: true, selector: "name" },
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

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item>
          <Typography variant="h1" className={styles.header}>
            State
          </Typography>
        </Grid>
        <Grid item sm>
          <Button
            variant="contained"
            color="primary"
            onClick={clearFilter}
            disableElevation
            className={classes.addStateButton}
            component={CustomRouterLink}
            to={routeConstants.ADD_STATES}
          >
            Add State
          </Button>
        </Grid>
        {/* This is used for the filterig data */}
        <Card className={styles.filterButton}>
          <CardContent>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  options={formState.states}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) =>
                    handleChangeAutoComplete(STATE_FILTER, event, value)
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="State Name"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={searchFilter}
                >
                  Search
                </Button>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={clearFilter}
                  disableElevation
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {formState.dataToShow ? (
          formState.dataToShow.length ? (
            <Table
              data={formState.dataToShow}
              column={column}
              editEvent={editCell}
              //deleteEvent={deleteCell}
            />
          ) : (
            <Spinner />
          )
        ) : (
          <div className={classes.noDataMargin}>No data to show</div>
        )}
        <EditState
          showModal={formState.showEditModal}
          closeModal={handleCloseModal}
          dataToEdit={formState.dataToEdit}
          id={formState.dataToEdit["id"]}
          editEvent={isEditCellCompleted}
        />
        <DeleteState
          showModal={formState.showModalDelete}
          closeModal={handleCloseDeleteModal}
          id={formState.dataToDelete["id"]}
          deleteEvent={isDeleteCellCompleted}
        />
      </Grid>
    </div>
  );
};

export default ViewStates;
