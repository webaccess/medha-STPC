import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Collapse,
  IconButton
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import styles from "./Document.module.css";
import useStyles from "../CommonStyles/ViewStyles.js";
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
  Alert,
  Auth,
  ViewGridIcon,
  DeleteGridIcon
} from "../../../components";
import DeleteDocument from "./DeleteDocument";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";

const ViewDocument = props => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  const history = useHistory();
  const [formState, setFormState] = useState({
    dataToShow: [],
    documents: [],
    documentFilters: [],
    filterDataParameters: {},
    isFilterSearch: false,
    /** This is when we return from add page */
    isDataAdded: props["location"]["fromAddDocument"]
      ? props["location"]["isDataAdded"]
      : false,
    addedData: props["location"]["fromAddDocument"]
      ? props["location"]["addedData"]
      : {},
    fromAddDocument: props["location"]["fromAddDocument"]
      ? props["location"]["fromAddDocument"]
      : false,
    /** This is for delete */
    isDataDeleted: false,
    dataToEdit: {},
    dataToDelete: {},
    showModalDelete: false,
    /** Pagination and sortinig data */
    isDataLoading: false,
    sortAscending: true
  });

  const studentInfo = Auth.getUserInfo()
    ? Auth.getUserInfo().studentInfo
    : null;
  const studentId = studentInfo ? studentInfo.id : null;

  const STUDENT_DOCUMENT_URL =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_STUDENTS +
    `/${studentId}/document`;
  const DOCUMENT_FILTER = "id";

  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(STUDENT_DOCUMENT_URL)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          documentFilters: res.data.result
        }));
      })
      .catch(error => {
        console.log("error", error);
      });

    getDocuments();
  }, []);

  /** This seperate function is used to get the document data*/
  const getDocuments = async (params = null) => {
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));

    await serviceProviders
      .serviceProviderForGetRequest(STUDENT_DOCUMENT_URL, params)
      .then(res => {
        formState.dataToShow = [];
        setFormState(formState => ({
          ...formState,
          documents: res.data.result,
          dataToShow: res.data.result,
          isDataLoading: false
        }));
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  /** Search filter is called when we select filters and click on search button */
  const searchFilter = async () => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getDocuments(formState.filterDataParameters);
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
    getDocuments();
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
    console.log(filterName, event, value);
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
      getDocuments();
    }
  };

  const viewCell = item => {
    if (item.url) window.open(`${strapiConstants.STRAPI_DB_URL}${item.url}`);
  };

  /** Columns to show in table */
  const column = [
    { name: "Name", sortable: true, selector: "name" },
    { name: "Size", sortable: true, selector: "size" },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <ViewGridIcon
              id={cell.id}
              value={cell.name}
              onClick={() => viewCell(cell)}
            />
          </div>
          <div className={classes.PaddingActionButton}>
            <DeleteGridIcon
              id={cell.id}
              value={cell.title}
              onClick={deleteCell}
            />
          </div>
        </div>
      ),
      width: "18%",
      cellStyle: {
        width: "18%",
        maxWidth: "18%"
      }
    }
  ];

  const handleAddDocumentClick = () => {
    history.push({
      pathname: routeConstants.ADD_DOCUMENTS
    });
  };

  console.log(formState.dataToShow);
  return (
    <Card style={{ padding: "8px" }}>
      <CardContent className={classes.Cardtheming}>
        <Grid>
          <Grid item xs={12} className={classes.title}>
            <GreenButton
              variant="contained"
              color="primary"
              style={{ marginRight: "0px !important" }}
              onClick={handleAddDocumentClick}
              disableElevation
              to={routeConstants.ADD_DOCUMENTS}
              startIcon={<AddCircleOutlineOutlinedIcon />}
            >
              {genericConstants.ADD_DOCUMENT_TEXT}
            </GreenButton>
          </Grid>

          <Grid item xs={12} className={classes.formgrid}>
            {/** Error/Success messages to be shown for add */}
            {formState.fromAddDocument && formState.isDataAdded ? (
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
            {formState.fromAddDocument && !formState.isDataAdded ? (
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
                      options={formState.documentFilters}
                      className={classes.autoCompleteField}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) =>
                        handleChangeAutoComplete(DOCUMENT_FILTER, event, value)
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
                  deleteEvent={deleteCell}
                  progressPending={formState.isDataLoading}
                  pagination={false}
                  selectableRows={false}
                />
              ) : (
                <div className={classes.noDataMargin}>
                  No documents details found
                </div>
              )
            ) : (
              <Spinner />
            )}
            <DeleteDocument
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              id={formState.dataToDelete["id"]}
              deleteEvent={isDeleteCellCompleted}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ViewDocument;
