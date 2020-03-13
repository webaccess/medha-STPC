import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Tooltip,
  Collapse,
  IconButton
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import styles from "../State.module.css";
import useStyles from "./ViewStateStyles";
import * as serviceProviders from "../../../api/Axios";
import * as routeConstants from "../../../constants/RouteConstants";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as formUtilities from "../../../Utilities/FormUtilities";
import {
  Table,
  Spinner,
  GreenButton,
  YellowButton,
  GrayButton,
  Alert
} from "../../../components";
import DeleteState from "./DeleteState";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";

const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const STATE_FILTER = "id";
const SORT_FIELD_KEY = "_sort";

const ViewStates = props => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  const history = useHistory();
  const [formState, setFormState] = useState({
    dataToShow: [],
    states: [],
    filterDataParameters: {},
    isFilterSearch: false,
    /** This is when we return from edit page */
    isDataEdited: props["location"]["fromEditState"]
      ? props["location"]["isDataEdited"]
      : false,
    editedData: props["location"]["fromEditState"]
      ? props["location"]["editedData"]
      : {},
    fromEditState: props["location"]["fromEditState"]
      ? props["location"]["fromEditState"]
      : false,
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddState"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddState"]
      ? props["location"]["addedData"]
      : {},
    fromAddState: props["location"]["fromAddState"]
      ? props["location"]["fromAddState"]
      : false,
    /** This is for delete */
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showModalDelete: false,
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true
  });

  useEffect(() => {
    getStateData(10, 1);
  }, []);

  /** This seperate function is used to get the zone data*/
  const getStateData = async (pageSize, page, paramsForState = null) => {
    if (paramsForState !== null && !formUtilities.checkEmpty(paramsForState)) {
      let defaultParams = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "name:asc"
      };
      Object.keys(paramsForState).map(key => {
        defaultParams[key] = paramsForState[key];
      });
      paramsForState = defaultParams;
    } else {
      paramsForState = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "name:asc"
      };
    }
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));

    await serviceProviders
      .serviceProviderForGetRequest(STATES_URL, paramsForState)
      .then(res => {
        formState.dataToShow = [];
        setFormState(formState => ({
          ...formState,
          states: res.data.result,
          dataToShow: res.data.result,
          pageSize: res.data.pageSize,
          totalRows: res.data.rowCount,
          page: res.data.page,
          pageCount: res.data.pageCount,
          isDataLoading: false
        }));
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  /** Pagination */
  const handlePerRowsChange = async (perPage, page) => {
    /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getStateData(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getStateData(perPage, page);
      }
    }
  };

  const handlePageChange = async page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getStateData(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(formState.pageSize, page);
      } else {
        await getStateData(formState.pageSize, page);
      }
    }
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getStateData(perPage, page, formState.filterDataParameters);
    }
  };

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

  const restoreData = () => {
    getStateData(formState.pageSize, 1);
  };

  const getDataForEdit = async id => {
    let paramsForStates = {
      id: id
    };
    await serviceProviders
      .serviceProviderForGetRequest(STATES_URL, paramsForStates)
      .then(res => {
        let editData = res.data.result[0];
        /** move to edit page */
        history.push({
          pathname: routeConstants.EDIT_STATE,
          editState: true,
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

  const isDeleteCellCompleted = status => {
    formState.isDataDeleted = status;
  };

  const deleteCell = event => {
    setFormState(formState => ({
      ...formState,
      dataToDelete: { id: event.target.id },
      showModalDelete: true
    }));
  };

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
    }
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
      getStateData(formState.pageSize, formState.page);
    }
  };

  /** Columns to show in table */
  const column = [
    { name: "Name", sortable: true, selector: "name" },
    /** Columns for edit and delete */
    {
      cell: cell => (
        <Tooltip title="Edit" placement="top">
          <i
            className="material-icons"
            id={cell.id}
            value={cell.name}
            onClick={editCell}
            style={{ color: "green", fontSize: "19px" }}
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

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.VIEW_STATE_TEXT}
        </Typography>

        <GreenButton
          variant="contained"
          color="primary"
          onClick={clearFilter}
          disableElevation
          to={routeConstants.ADD_STATES}
          startIcon={<AddCircleOutlineOutlinedIcon />}
        >
          {genericConstants.ADD_STATE_TEXT}
        </GreenButton>
      </Grid>

      <Grid item xs={12} className={classes.formgrid}>
        {/** Error/Success messages to be shown for edit */}
        {formState.fromEditState && formState.isDataEdited ? (
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
        {formState.fromEditState && !formState.isDataEdited ? (
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
        {formState.fromAddState && formState.isDataAdded ? (
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
        {formState.fromAddState && !formState.isDataAdded ? (
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

        <Card className={styles.filterButton}>
          <CardContent className={classes.Cardtheming}>
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
                  onClick={clearFilter}
                  disableElevation
                >
                  {genericConstants.RESET_BUTTON_TEXT}
                </GrayButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {formState.dataToShow ? (
          formState.dataToShow.length ? (
            <Table
              data={formState.dataToShow}
              column={column}
              defaultSortField="name"
              defaultSortAsc={formState.sortAscending}
              editEvent={editCell}
              deleteEvent={deleteCell}
              progressPending={formState.isDataLoading}
              paginationTotalRows={formState.totalRows}
              paginationRowsPerPageOptions={[10, 20, 50]}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
            />
          ) : (
            <Spinner />
          )
        ) : (
          <div className={classes.noDataMargin}>No data to show</div>
        )}
        <DeleteState
          showModal={formState.showModalDelete}
          closeModal={handleCloseDeleteModal}
          id={formState.dataToDelete["id"]}
          deleteEvent={isDeleteCellCompleted}
        />
      </Grid>
    </Grid>
  );
};

export default ViewStates;
