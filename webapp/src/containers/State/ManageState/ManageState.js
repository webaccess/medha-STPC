import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Typography,
  Collapse,
  IconButton
} from "@material-ui/core";
import orderBy from "lodash/orderBy";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import useStyles from "../../ContainerStyles/ManagePageStyles";
import * as serviceProviders from "../../../api/Axios";
import * as routeConstants from "../../../constants/RouteConstants";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as formUtilities from "../../../utilities/FormUtilities";
import {
  Table,
  Spinner,
  GreenButton,
  YellowButton,
  GrayButton,
  Alert,
  EditGridIcon,
  DeleteGridIcon
} from "../../../components";
import DeleteState from "./DeleteState";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import LoaderContext from "../../../context/LoaderContext";
import { useContext } from "react";

const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;

const SORT_FIELD_KEY = "_sort";
const STATE_FILTER = "name_contains";

const ViewStates = props => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  const history = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  let { setLoaderStatus } = useContext(LoaderContext);
  if (props.isTesting) {
    setLoaderStatus = () => {
      return true;
    };
  }

  /** Form state variables */
  const [formState, setFormState] = useState({
    filterState: "",
    dataToShow: props.stateData ? props.stateData : [],
    states: [],
    filterDataParameters: {},
    isFilterSearch: props.isFilterSearch ? props.isFilterSearch : false,
    /** This is when we return from edit page */
    isDataEdited:
      props["location"] && props["location"]["fromEditState"]
        ? props["location"]["isDataEdited"]
        : false,
    editedData:
      props["location"] && props["location"]["fromEditState"]
        ? props["location"]["editedData"]
        : {},
    fromEditState:
      props["location"] && props["location"]["fromEditState"]
        ? props["location"]["fromEditState"]
        : false,
    editedStateName:
      props["location"] && props["location"]["stateDataEdited"]
        ? props["location"]["stateDataEdited"]["name"]
        : "",

    /** This is when we return from add page */
    isDataAdded:
      props["location"] && props["location"]["fromAddState"]
        ? props["location"]["isDataAdded"]
        : false,
    addedData:
      props["location"] && props["location"]["fromAddState"]
        ? props["location"]["addedData"]
        : {},
    fromAddState:
      props["location"] && props["location"]["fromAddState"]
        ? props["location"]["fromAddState"]
        : false,
    addedStateName:
      props["location"] && props["location"]["addedStateData"]
        ? props["location"]["addedStateData"]["name"]
        : "",
    /** This is for delete */
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showModalDelete: props.showModalDelete ? props.showModalDelete : false,
    isClearResetFilter: false,
    isMultiDelete: props.isMultiDelete ? props.isMultiDelete : false,
    MultiDeleteID: props.MultiDeleteID ? props.MultiDeleteID : [],
    greenButtonChecker: true,
    selectedRowFilter: true,
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true,
    /** Message to show */
    fromDeleteModal: false,
    messageToShow: "",
    toggleCleared: false
  });

  useEffect(() => {
    getStateData(10, 1);
  }, []);

  /** This seperate function is used to get the zone data*/
  const getStateData = async (pageSize, page, paramsForState = null) => {
    if (paramsForState !== null && !formUtilities.checkEmpty(paramsForState)) {
      let defaultParams = {};
      if (paramsForState.hasOwnProperty(SORT_FIELD_KEY)) {
        defaultParams = {
          page: page,
          pageSize: pageSize
        };
      } else {
        defaultParams = {
          page: page,
          pageSize: pageSize,
          [SORT_FIELD_KEY]: "name:ASC"
        };
      }
      Object.keys(paramsForState).map(key => {
        defaultParams[key] = paramsForState[key];
      });
      paramsForState = defaultParams;
    } else {
      paramsForState = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "name:ASC"
      };
    }
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));
    await serviceProviders
      .serviceProviderForGetRequest(STATES_URL, paramsForState, {})
      .then(res => {
        formState.dataToShow = [];
        let tempCollegeData = [];
        let college_data = res.data.result;

        /** As college data is in nested form we first convert it into
         * a float structure and store it in data
         */
        tempCollegeData = convertCollegeData(college_data);
        setFormState(formState => ({
          ...formState,
          states: res.data.result,
          dataToShow: tempCollegeData,
          pageSize: res.data.pageSize,
          totalRows: res.data.rowCount,
          page: res.data.page,
          pageCount: res.data.pageCount,
          isDataLoading: false
        }));
      })
      .catch(error => {
        console.log("errorStates", error);
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
        collegeDataArray.push(tempIndividualCollegeData);
      }
      return collegeDataArray;
    }
  };

  /** Pagination to handle row change*/
  const handlePerRowsChange = async (perPage, page) => {
    /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      await getStateData(perPage, page);
    } else {
      if (formState.isFilterSearch) {
        await searchFilter(perPage, page);
      } else {
        await getStateData(perPage, page, formState.filterDataParameters);
      }
    }
  };

  /** Pagination to handle page change */
  const handlePageChange = page => {
    if (formUtilities.checkEmpty(formState.filterDataParameters)) {
      getStateData(formState.pageSize, page);
    } else {
      if (formState.isFilterSearch) {
        searchFilter(formState.pageSize, page);
      } else {
        getStateData(formState.pageSize, page, formState.filterDataParameters);
      }
    }
  };

  /** Pagination Search filter is called when we select filters and click on search button */
  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getStateData(perPage, page, formState.filterDataParameters);
    } else {
      await getStateData(perPage, page);
    }
  };

  /** This is used for clearing filter */
  const clearFilter = () => {
    setFormState(formState => ({
      ...formState,
      filterState: "",
      // filterStateData: "",
      isFilterSearch: false,
      isClearResetFilter: true,
      /** Clear all filters */
      filterDataParameters: {},
      /** Turns on the spinner */
      isDataLoading: true
    }));
    selectedRowCleared(true);
    restoreData();
  };

  /** function used for restoring data */
  const restoreData = () => {
    getStateData(formState.pageSize, 1);
  };

  /** Edit -------------------------------------------------------*/
  const getDataForEdit = async id => {
    setLoaderStatus(true);
    let paramsForStates = {
      id: id
    };
    await serviceProviders
      .serviceProviderForGetRequest(STATES_URL, paramsForStates, {})
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
    setLoaderStatus(false);
  };

  const editCell = event => {
    getDataForEdit(event.target.id);
  };

  /** Delete cell ------------------ */

  const deleteCell = event => {
    setLoaderStatus(true);
    setFormState(formState => ({
      ...formState,
      dataToDelete: {
        id: event.target.id,
        name: event.target.getAttribute("value")
      },
      showModalDelete: true,
      isDataDeleted: false,
      fromDeleteModal: false,
      messageToShow: "",
      fromAddState: false,
      fromEditState: false,
      isMultiDelete: props.isMultiDelete ? props.isMultiDelete : false
    }));
  };

  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalDelete: false,
      isMultiDelete: false,
      dataToDelete: {}
    }));
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
      messageToShow: statusToShow,
      isMultiDelete: false,
      dataToDelete: {}
    }));
    if (status) {
      getStateData(formState.pageSize, 1, formState.filterDataParameters);
    }
  };

  /** Multi Delete */
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
      isDataDeleted: false,
      fromDeleteModal: false,
      isMultiDelete: true,
      MultiDeleteID: arrayId,
      fromAddState: false,
      fromEditState: false
    }));
  };

  /** On select multiple rows */
  const handleRowSelected = useCallback(state => {
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
    setSelectedRows(state.selectedRows);
  }, []);

  const handleFilterChange = event => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [STATE_FILTER]: event.target.value
      }
    }));
    event.persist();
  };

  const filterStateData = () => {
    getStateData(10, 1, formState.filterDataParameters);
  };

  const selectedRowCleared = data => {
    formState.toggleCleared = data;
    setTimeout(() => {
      setFormState(formState => ({
        ...formState,
        toggleCleared: false
      }));
    }, 2000);
  };

  /** --------------------------------------------------- */
  /** Columns to show in table */
  const column = [
    {
      name: "Name",
      sortable: true,
      selector: "name"
    },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <EditGridIcon id={cell.id} value={cell.name} onClick={editCell} />
          </div>
          <div className={classes.PaddingActionButton}>
            <DeleteGridIcon
              id={cell.id}
              value={cell.name}
              onClick={deleteCell}
            />
          </div>
        </div>
      ),
      width: "20%",
      cellStyle: {
        width: "auto",
        maxWidth: "auto"
      }
    }
  ];

  const handleSort = (
    column,
    sortDirection,
    perPage = formState.pageSize,
    page = 1
  ) => {
    formState.filterDataParameters[SORT_FIELD_KEY] =
      column.selector + ":" + sortDirection;
    getStateData(perPage, page, formState.filterDataParameters);
  };

  return (
    <Grid>
      <Grid
        container
        spacing={3}
        justify="space-between"
        className={classes.title}
      >
        <Grid item>
          <Typography variant="h4" gutterBottom>
            {genericConstants.VIEW_STATE_TEXT}
          </Typography>
        </Grid>
        <Grid item>
          <GreenButton
            variant="contained"
            color="secondary"
            onClick={() => deleteMulUserById()}
            startIcon={<DeleteIcon />}
            greenButtonChecker={formState.greenButtonChecker}
            buttonDisabled={formState.selectedRowFilter}
            style={{ margin: "2px", marginRight: "15px" }}
          >
            Delete Selected States
          </GreenButton>

          <GreenButton
            variant="contained"
            color="primary"
            onClick={clearFilter}
            disableElevation
            to={routeConstants.ADD_STATES}
            startIcon={<AddCircleOutlineOutlinedIcon />}
            style={{ margin: "2px" }}
          >
            {genericConstants.ADD_STATE_TEXT}
          </GreenButton>
        </Grid>
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
              State {formState.editedStateName} has been updated successfully.
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
              An error has occured while updating state. Kindly, try again.
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
              State {formState.addedStateName} has been added successfully.
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
              An error has occured while adding state. Kindly, try again.
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
        <Card className={classes.root} variant="outlined">
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <TextField
                  label={"Name"}
                  placeholder="Name"
                  id="name"
                  value={formState.filterDataParameters[STATE_FILTER] || ""}
                  variant="outlined"
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <YellowButton
                  id="submitFilter"
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={filterStateData}
                >
                  {genericConstants.SEARCH_BUTTON_TEXT}
                </YellowButton>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <GrayButton
                  id="clearFilter"
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
                id="ManageTableID"
                data={formState.dataToShow}
                column={column}
                defaultSortField="name"
                onSelectedRowsChange={handleRowSelected}
                defaultSortAsc={formState.sortAscending}
                editEvent={editCell}
                deleteEvent={deleteCell}
                progressPending={formState.isDataLoading}
                onSort={handleSort}
                sortServer={true}
                paginationDefaultPage={formState.page}
                paginationPerPage={formState.pageSize}
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
          )}{" "}
          {formState.showModalDelete ? (
            <DeleteState
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              id={
                formState.isMultiDelete
                  ? formState.MultiDeleteID
                  : formState.dataToDelete["id"]
              }
              modalClose={modalClose}
              isMultiDelete={formState.isMultiDelete ? true : false}
              dataToDelete={formState.dataToDelete}
              clearSelectedRow={selectedRowCleared}
            />
          ) : null}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ViewStates;
