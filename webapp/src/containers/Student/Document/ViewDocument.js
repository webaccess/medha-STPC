import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Card,
  CardContent,
  Grid,
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
import * as roleConstants from "../../../constants/RoleConstants";
import * as formUtilities from "../../../utilities/FormUtilities";
import {
  Table,
  GreenButton,
  YellowButton,
  GrayButton,
  Alert,
  Auth,
  ViewGridIcon,
  DeleteGridIcon,
  UploadIcon
} from "../../../components";
import DeleteDocument from "./DeleteDocument";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import { useHistory } from "react-router-dom";
import LoaderContext from "../../../context/LoaderContext";
import auth from "../../../components/Auth";
import { startCase } from "lodash";

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
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);

  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: ""
  });

  const studentInfo =
    Auth.getUserInfo() !== null &&
    Auth.getUserInfo().role.name === roleConstants.STUDENT
      ? Auth.getUserInfo().studentInfo.contact.id
      : Auth.getStudentIdFromCollegeAdmin();

  const STUDENT_DOCUMENT_URL =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_STUDENTS_DIRECT_URL +
    `/${studentInfo}/` +
    strapiConstants.STRAPI_STUDENT_DOCUMENT;
  const DOCUMENT_FILTER = "name_contains";

  useEffect(() => {
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

  const isDeleteCellCompleted = (status, message) => {
    formState.isDataDeleted = status;

    if (typeof message === typeof "") {
      if (status) {
        setAlert(() => ({
          isOpen: true,
          message: "Document " + message + " is deleted",
          severity: "success"
        }));
      } else {
        setAlert(() => ({
          isOpen: true,
          message: message,
          severity: "error"
        }));
      }
    }
  };

  const deleteCell = (id, documentId) => {
    setLoaderStatus(true);
    setFormState(formState => ({
      ...formState,
      dataToDelete: { id, documentId },
      showModalDelete: true
    }));
    setLoaderStatus(false);
  };

  const handleFilterChangeForNameField = event => {
    setFormState(formState => ({
      ...formState,
      filterDataParameters: {
        ...formState.filterDataParameters,
        [DOCUMENT_FILTER]: event.target.value
      }
    }));
    event.persist();
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
    if (item.url)
      window.open(`${strapiConstants.STRAPI_DB_URL_WITHOUT_HASH}${item.url}`);
  };

  /** Columns to show in table */
  const column = [
    {
      name: "Name",
      sortable: true,
      cell: cell =>
        cell.isResume ? "Resume" : (cell.document && cell.document.name) || "-"
    },
    {
      name: "Size",
      cell: cell => (cell.document ? cell.document.file.size : "-")
    },
    {
      name: "Year of passing",
      sortable: true,
      cell: cell => (cell.year_of_passing ? cell.year_of_passing.name : "-")
    },
    {
      name: "Qualification",
      sortable: true,
      cell: cell =>
        cell.qualification == "other"
          ? cell.other_qualification
          : cell.qualification || "-"
    },
    { name: "Board", cell: cell => (cell.board ? cell.board.name : "-") },
    {
      name: "Pursuing",
      cell: cell =>
        cell.hasOwnProperty("pursuing") ? (cell.pursuing ? "Yes" : "No") : "-"
    },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <UploadIcon
              id={cell.id}
              value={cell.name}
              title="Upload Document"
              onClick={() => handleAddDocumentClick(cell.id, cell.isResume)}
            />
          </div>

          {cell.document ? (
            <div className={classes.PaddingActionButton}>
              <ViewGridIcon
                id={cell.id}
                value={cell.name}
                onClick={() => viewCell(cell.document.file)}
              />
            </div>
          ) : null}

          {cell.document ? (
            <div className={classes.PaddingActionButton}>
              <DeleteGridIcon
                id={cell.id}
                value={cell.title}
                onClick={() =>
                  deleteCell(cell.document.file.id, cell.document.id)
                }
              />
            </div>
          ) : null}
        </div>
      ),
      width: "20%",
      cellStyle: {
        width: "auto",
        maxWidth: "auto"
      }
    }
  ];

  const handleAddDocumentClick = (id, isResume) => {
    const contact = auth.getUserInfo() ? auth.getUserInfo().contact.id : null;

    history.push({
      pathname: routeConstants.ADD_DOCUMENTS,
      educationId: id,
      isResume,
      contactId: contact
    });
  };

  const AlertAPIResponseMessage = () => {
    return (
      <Collapse in={alert.isOpen}>
        <Alert
          severity={alert.severity || "warning"}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(() => ({ isOpen: false }));
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alert.message}
        </Alert>
      </Collapse>
    );
  };

  return (
    <Card style={{ padding: "8px" }}>
      <CardContent className={classes.Cardtheming}>
        <Grid>
          {/* <Grid item xs={12} className={classes.title}>
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
          </Grid> */}

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
                  {" "}
                  Document uploaded successfully
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
                  Error in Uploading Documents.
                </Alert>
              </Collapse>
            ) : null}
            <AlertAPIResponseMessage />
            <Card className={styles.filterButton}>
              <CardContent className={classes.Cardtheming}>
                <Grid className={classes.filterOptions} container spacing={1}>
                  <Grid item>
                    <TextField
                      id="name"
                      label="Name"
                      margin="normal"
                      variant="outlined"
                      value={
                        formState.filterDataParameters[DOCUMENT_FILTER] || ""
                      }
                      placeholder="Name"
                      className={classes.autoCompleteField}
                      onChange={handleFilterChangeForNameField}
                    />
                  </Grid>
                  <Grid item className={classes.filterButtonsMargin}>
                    <YellowButton
                      id="submitFilter"
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
                      id="cancelFilter"
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
            <Table
              id="ManageTableID"
              data={formState.dataToShow}
              column={column}
              defaultSortField="name"
              defaultSortAsc={formState.sortAscending}
              deleteEvent={deleteCell}
              progressPending={formState.isDataLoading}
              pagination={false}
              selectableRows={false}
              noDataComponent="No Documents found"
            />
            <DeleteDocument
              showModal={formState.showModalDelete}
              closeModal={handleCloseDeleteModal}
              id={formState.dataToDelete["id"]}
              documentId={formState.dataToDelete["documentId"]}
              deleteEvent={isDeleteCellCompleted}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ViewDocument;
