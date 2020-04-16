import React, { useState, useEffect, useCallback } from "react";
import useStyles from "./ManageStudentStyle";
import * as serviceProviders from "../../api/Axios";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import { Table, Spinner, Alert } from "../../components";
import ApprovedStudents from "./ApprovedStudents";
import DeleteStudents from "./DeleteStudents";
import { GrayButton, YellowButton, GreenButton } from "../../components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as formUtilities from "../../Utilities/FormUtilities";
import DeleteIcon from "@material-ui/icons/Delete";
import * as genericConstants from "../../constants/GenericConstants";

import CloseIcon from "@material-ui/icons/Close";
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
import { serviceProviderForGetRequest } from "../../api/Axios";
import auth from "../../components/Auth";

const STUDENTS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES + "/" + auth.getUserInfo().college.id + "/" + strapiConstants.STRAPI_STUDENTS;
const STREAMS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;
const USER_FILTER = "user.username_contains";
const STREAM_FILTER = "stream.id";
const SORT_FIELD_KEY = "_sort";
const COLLEGEID = "college.id";

const ManageStudents = props => {
  
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [streams, setStreams] = useState([]);
  const [formState, setFormState] = useState({
    student: [],
    approvedId: 0,
    approvedData: false,
    showModalBlock: false,
    dataToDelete: {},
    filterDataParameters: {},
    isMultiDelete: false,
    selectedRowFilter: true,
    greenButtonChecker: true,
    isMulBlocked: false,
    isMulUnBlocked: false,
    MultiBlockUser: {},
    isUserBlocked: false,
    blockedName: "",
    bottonBlockUnblock: "Approve Selected User",
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    messageToShow: "",
    sortAscending: true
  });

  useEffect(() => {
    getStudentData(10, 1);

    getStreamData();
  }, []);
  const getStudentData = async (pageSize, page, paramsForUsers = null) => {
    
    if (paramsForUsers !== null && !formUtilities.checkEmpty(paramsForUsers)) {
      let defaultParams = {
        page: page,
        pageSize: pageSize
      };
      Object.keys(paramsForUsers).map(key => {
        defaultParams[key] = paramsForUsers[key];
      });
      paramsForUsers = defaultParams;

    } else {
      paramsForUsers = {
        page: page,
        pageSize: pageSize
      };
    }
  
    serviceProviders
      .serviceProviderForGetRequest(STUDENTS_URL, paramsForUsers)
      .then(res => {
        
        if (res.data.result.length) {
          let tempStudentData = [];
          let student_data = res.data.result;
          tempStudentData = convertStudentData(student_data);
          setFormState(formState => ({
            ...formState,
            student: tempStudentData
          }));
        } else {
          setFormState(formState => ({
            ...formState,
            student: res.data.length
          }));
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  };



  const getStreamData = () => {
    serviceProviders.serviceProviderForGetRequest(STREAMS_URL).then(res => {
     
      setStreams(res.data.result);
    })
    .catch(error => {
      console.log("streamError",error);
    })
  }

  const convertStudentData = data => {
    let studentDataArray = [];
    if (data) {
      for (let i in data) {
 
        var tempIndividualStudentData = {};
        tempIndividualStudentData["id"] = data[i]["id"];
        tempIndividualStudentData["userId"] = data[i]["user"]["id"];
        tempIndividualStudentData["name"] = data[i]["user"]["first_name"] + " " + data[i]["father_first_name"] + " " + data[i]["user"]["last_name"];
        tempIndividualStudentData["streamId"] = data[i]["stream"]["id"];
        tempIndividualStudentData["stream"] = data[i]["stream"]["name"];
        studentDataArray.push(tempIndividualStudentData);
        tempIndividualStudentData["Approved"] = data[i]["verifiedByCollege"];
      }
    
      return studentDataArray;
    }
  };

  const blockedCell = event => {
  

    setFormState(formState => ({
      ...formState,
      blockedName: event.target.getAttribute("value")
    }));

    formState.approvedId = event.target.id;
    for (var k = 0; k < formState.student.length; k++) {
      if (parseInt(event.target.id) === parseInt(formState.student[k]["id"])) {
        if (formState.student[k]["Approved"] === true) {
          blockedCellData(event.target.id, true);
        } else {
          blockedCellData(event.target.id, false);
        }
      }
    }
  };

  const blockedCellData = (id, isApproved = false) => {
    
    if (isApproved === true) {
      setFormState(formState => ({
        ...formState,
        approvedId: id, 
        approvedData: true,
        MultiBlockUser: {},
        isUnBlocked: false,
        showModalBlock: true,
        isMulBlocked: false,
        isMulUnBlocked: false,
        message: ""
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        dataToBlock: id,
        approvedData: false,
        MultiBlockUser: {},
        isUnBlocked: true,
        showModalBlock: true,
        isMulBlocked: false,
        isMulUnBlocked: false,
        message: ""
      }));
    }
  };

  const handleCloseBlockModal = () => {
    /** This restores all the data when we close the modal */
    setFormState(formState => ({
      ...formState,
      showModalBlock: false
    }));
    if (formState.isUserBlocked) {
      //getUserData();
      setFormState(formState => ({
        ...formState,
        showModalBlock: false,
        showModalDelete: false,
        isMultiDelete: false,
        selectedRowFilter: true,
        greenButtonChecker: true,
        isMulBlocked: false,
        isMulUnBlocked: false,
        MultiBlockUser: {},
        isUserBlocked: false
      }));
      getStudentData();
      // window.location.reload(false);
    }
  };

  const isUserBlockCompleted = (status, statusToShow = "") => {
    
   
    if(status){
     
      formState.showAlert = status;
    }else{
     
      formState.showAlert = status;
    }


    setOpen(true);
    setFormState(formState => ({
      ...formState,
      isDataBlockUnblock: status,
      showModalBlock: false,
      // fromBlockModal: true,
      isMulBlocked: false,
      isMulUnBlocked: false,
      // multiBlockCollegeIds: [],
      MultiBlockUser: {},
      messageToShow: statusToShow
    }));

    formState.isUserBlocked = status;
  };
  const modalClose = () => {
    setFormState(formState => ({
      ...formState,
      showModalBlock: false,
      showModalDelete: false
    }));
  };

  const deleteCell = event => {
    let dataId = event.target.id;
   
    setFormState(formState => ({
      ...formState,
      dataToDelete: { id: dataId,
        name: event.target.getAttribute("value")
       },
      showEditModal: false,
      showModalDelete: true,
      message: ""
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
      getStudentData();
    }
  };

  const isDeleteCellCompleted = (status, statusToShow = "") => {
    if(status){
      formState.showDeleteAlert = status;
    }else{
      formState.showDeleteAlert = status;
    }
    // formState.isDataDeleted = status;

    setOpen(true);
    setFormState(formState => ({
      ...formState,
      isDataDeleted: status,
      showModalDelete: false,
      // fromDeleteModal: true,
      // isMultiDelete: false,
      messageToShow: statusToShow
    }));
  };

  const handleChangeAutoComplete = (filterName, event, value) => {
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["userId"];
    }
  };

  const handleChangeAutoCompleteStream = (filterName, event, value) => {
  
    if (value === null) {
      delete formState.filterDataParameters[filterName];
      //restoreData();
    } else {
      formState.filterDataParameters[filterName] = value["id"];
    }
  };

  const handleFilterChange = event => {
    formState.filterDataParameters[event.target.name] = event.target.value;
  };

  const searchFilter = async (perPage = formState.pageSize, page = 1) => {
    if (!formUtilities.checkEmpty(formState.filterDataParameters)) {
      formState.isFilterSearch = true;
      await getStudentData(perPage, page, formState.filterDataParameters);
    }
  };


    /** Pagination */
    const handlePerRowsChange = async (perPage, page) => {
      /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
      if (formUtilities.checkEmpty(formState.filterDataParameters)) {
        await getStudentData(perPage, page);
      } else {
        if (formState.isFilterSearch) {
          await searchFilter(perPage, page);
        } else {
          await getStudentData(perPage, page);
        }
      }
    };
  
    const handlePageChange = async page => {
      if (formUtilities.checkEmpty(formState.filterDataParameters)) {
        await getStudentData(formState.pageSize, page);
      } else {
        if (formState.isFilterSearch) {
          await searchFilter(formState.pageSize, page);
        } else {
          await getStudentData(formState.pageSize, page);
        }
      }
    };

  /** To reset search filter */
  const refreshPage = () => {
    getStudentData();
    // window.location.reload(false);
  };

  const deleteMulUserById = () => {
    let arrayId = [];

    selectedRows.forEach(d => {
      arrayId.push(d.id);
    });

    setFormState(formState => ({
      ...formState,
      showEditModal: false,
      showModalDelete: true,
      isMultiDelete: true,
      MultiDeleteID: arrayId
    }));
  };

  const handleRowSelected = useCallback(state => {
    let blockData = [];
    let unblockData = [];

    if (state.selectedCount >= 1) {
      setFormState(formState => ({
        ...formState,
        selectedRowFilter: false
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        selectedRowFilter: true
      }));
    }

    state.selectedRows.forEach(data => {
      if (data.Approved === false) {
        blockData.push(data);
      } else {
        unblockData.push(data);
      }
      if (blockData.length > 0) {
        setFormState(formState => ({
          ...formState,
          bottonBlockUnblock: "Approve Selected User"
        }));
      } else {
        setFormState(formState => ({
          ...formState,
          bottonBlockUnblock: "Unapprove Selected User"
        }));
      }
    });
    setSelectedRows(state.selectedRows);
  }, []);

  const blockMulUserById = () => {
    let arrayId = [];
    for (var k = 0; k < selectedRows.length; k++) {
      arrayId.push(selectedRows[k]["id"]);
    }
    if (formState.bottonBlockUnblock === "Approve Selected User") {
      setFormState(formState => ({
        ...formState,
        isMulBlocked: true,
        isMulUnBlocked: false,
        showModalBlock: true,
        MultiBlockUser: arrayId
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        isMulBlocked: false,
        isMulUnBlocked: true,
        showModalBlock: true,
        MultiBlockUser: arrayId
      }));
    }
  };

  /** Columns to show in table */
  const column = [
    { name: "Name", sortable: true, selector: "name" },
    { name: "Stream", sortable: true, selector: "stream" },
    {
      name: "Actions",
      cell: cell => (
        <div className={classes.DisplayFlex}>
          <div className={classes.PaddingFirstActionButton}>
            <Tooltip
              title={cell.Approved ? "UNapprove" : "Approve"}
              placement="top"
            >
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                onClick={blockedCell}
                style={cell.Approved ? { color: "green" } : { color: "red" }}
              >
                done
              </i>
            </Tooltip>
          </div>
          <div className={classes.PaddingActionButton}>
            <Tooltip title="View" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                // onClick={viewCell}
                style={{ color: "green" }}
              >
                view_list
              </i>
            </Tooltip>
          </div>
          <div className={classes.PaddingActionButton}>
            <Tooltip title="Edit" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                // onClick={editCell}
                style={{ color: "green", fontSize: "21px" }}
              >
                edit
              </i>
            </Tooltip>
          </div>
          <div className={classes.PaddingActionButton}>
            <Tooltip title="Delete" placement="top">
              <i
                className="material-icons"
                id={cell.id}
                value={cell.name}
                onClick={deleteCell}
                style={{ color: "red", fontSize: "23px" }}
              >
                delete_outline
              </i>
            </Tooltip>
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

  return (
    
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.MANAGE_STUDENTS}
        </Typography>
       
        <GreenButton
          variant="contained"
          color="secondary"
          to={"/"}
          onClick={() => blockMulUserById()}
          // startIcon={<BlockIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          {formState.bottonBlockUnblock}
          {/* Approved Selected User */}
        </GreenButton>

        <GreenButton
          variant="contained"
          color="secondary"
          onClick={() => deleteMulUserById()}
          startIcon={<DeleteIcon />}
          greenButtonChecker={formState.greenButtonChecker}
          buttonDisabled={formState.selectedRowFilter}
        >
          {genericConstants.DELETE_SELECTED_STUDENT}
        </GreenButton>
        <GreenButton
          variant="contained"
          color="primary"
          // onClick={clearFilter}
          // disableElevation
          to={"/"}
          // startIcon={<AddCircleOutlineOutlinedIcon />}
          // buttonDisabled={formState.selectedRowFilter}
        >
          {genericConstants.ADD_STUDENT_BUTTON_TEXT}
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        {/* //error success ManageStudents */}

     

        {formState.showAlert && formState.messageToShow !== "" ?
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
          {formState.messageToShow }
          {/* {genericConstants.ALERT_SUCCESS_DATA_EDITED_MESSAGE} */}
        </Alert>
      </Collapse>
       : null }

{formState.showAlert === false && formState.messageToShow !== "" ?
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
          {formState.messageToShow }
      
        </Alert>
      </Collapse>
       : null }


      </Grid>

      <Card>
        <CardContent className={classes.Cardtheming}>
          <Grid className={classes.filterOptions} container spacing={1}>
            <Grid item>
              <TextField
                label={"Name"}
                placeholder="Name"
                variant="outlined"
                name={USER_FILTER}
                onChange={handleFilterChange}
              />
              
            </Grid>
            <Grid item>
              <Autocomplete
                id="combo-box-demo"
                name={STREAM_FILTER}
                options={streams}
                className={classes.autoCompleteField}
                getOptionLabel={option => option.name}
                onChange={(event, value) =>
                  handleChangeAutoCompleteStream(STREAM_FILTER, event, value)
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Stream"
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
                onClick={refreshPage}
                disableElevation
              >
                {genericConstants.RESET_BUTTON_TEXT}
              </GrayButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* table */}

      <Card className={classes.tabledata} variant="outlined">
        {formState.student ? (
          formState.student.length ? (
            <Table
              data={formState.student}
              column={column}
              defaultSortField="name"
              defaultSortAsc={formState.sortAscending}
              // editEvent={editCell}
              onSelectedRowsChange={handleRowSelected}
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
          <div className={classes.noDataMargin}>
            {genericConstants.NO_DATA_TO_SHOW_TEXT}
          </div>
        )}
        {formState.isMultiDelete ? (
          <DeleteStudents
            showModal={formState.showModalDelete}
            closeModal={handleCloseDeleteModal}
            deleteEvent={isDeleteCellCompleted}
            id={formState.MultiDeleteID}
            isMultiDelete={formState.isMultiDelete}
            modalClose={modalClose}
          />
        ) : (
          <DeleteStudents
            showModal={formState.showModalDelete}
            closeModal={handleCloseDeleteModal}
            id={formState.dataToDelete["id"]}
            deleteEvent={isDeleteCellCompleted}
            dataToDelete={formState.dataToDelete}
          />
        )}
        {formState.isMulBlocked || formState.isMulUnBlocked ? (
          <ApprovedStudents
            id={formState.MultiBlockUser}
            isMulBlocked={formState.isMulBlocked}
            isUnMulBlocked={formState.isMulUnBlocked}
            getModel={formState.showModalBlock}
            closeBlockModal={handleCloseBlockModal}
            blockEvent={isUserBlockCompleted}
            modalClose={modalClose}
          />
        ) : (
          <ApprovedStudents
            id={formState.approvedId}
            blockedDataName={formState.blockedName}
            Data={formState.approvedData}
            getModel={formState.showModalBlock}
            closeBlockModal={handleCloseBlockModal}
            blockEvent={isUserBlockCompleted}
            isBlocked={formState.isBlocked}
            isUnBlocked={formState.isUnBlocked}
            modalClose={modalClose}
          />
        )}
      </Card>
    </Grid>
  );
};
export default ManageStudents;
