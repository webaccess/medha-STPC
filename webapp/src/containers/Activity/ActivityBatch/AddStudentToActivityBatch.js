import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import useStyles from "./AddStudentToActivityBatchStyles.js";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import {
  Table,
  Spinner,
  YellowButton,
  GrayButton,
  Alert
} from "../../../components";

const AddStudentToActivityBatch = props => {
  const [formState, setFormState] = useState({
    dataToShow: [],
    students: [],
    studentsFilter: [],
    filterDataParameters: {},
    isFilterSearch: false,
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true
  });

  const ACTIVITY_BATCH_STUDENTS =
    strapiConstants.STRAPI_DB_URL +
    strapiConstants.STRAPI_ACTIVITY +
    `/${props.activity}/` +
    strapiConstants.STRAPI_STUDENTS;

  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(ACTIVITY_BATCH_STUDENTS)
      .then(res => {
        formState.dataToShow = [];
        setFormState(formState => ({
          ...formState,
          students: res.data.result,
          dataToShow: res.data.result,
          pageSize: res.data.pageSize,
          totalRows: res.data.rowCount,
          page: res.data.page,
          pageCount: res.data.pageCount,
          isDataLoading: false
        }));
      })
      .catch(() => {});
  }, []);

  const handleCloseModal = () => {
    props.closeModal();
  };

  // /** Pagination */
  // const handlePerRowsChange = async (perPage, page) => {
  //   /** If we change the now of rows per page with filters supplied then the filter should by default be applied*/
  //   if (formUtilities.checkEmpty(formState.filterDataParameters)) {
  //     await getStudents(perPage, page);
  //   } else {
  //     if (formState.isFilterSearch) {
  //       await searchFilter(perPage, page);
  //     } else {
  //       await getStudents(perPage, page);
  //     }
  //   }
  // };

  // const handlePageChange = async page => {
  //   if (formUtilities.checkEmpty(formState.filterDataParameters)) {
  //     await getStudents(formState.pageSize, page);
  //   } else {
  //     if (formState.isFilterSearch) {
  //       await searchFilter(formState.pageSize, page);
  //     } else {
  //       await getStudents(formState.pageSize, page);
  //     }
  //   }
  // };

  const handleSubmit = event => {
    /** CALL Put FUNCTION */

    event.preventDefault();
  };

  const classes = useStyles();
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.showModal}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={props.showModal}>
        <div className={classes.paper}>
          <Typography variant={"h2"} className={classes.textMargin}>
            {genericConstants.ADD_STUDENT_TO_ACTIVITY_BATCH}
          </Typography>
          <div className={classes.edit_dialog}>
            {/* {formState.dataToShow ? (
              formState.dataToShow.length ? (
                <div>
                  <Table
                    data={formState.dataToShow}
                    column={column}
                    defaultSortField="name"
                    defaultSortAsc={formState.sortAscending}
                    deleteEvent={deleteCell}
                    progressPending={formState.isDataLoading}
                    paginationTotalRows={formState.totalRows}
                    paginationRowsPerPageOptions={[10, 20, 50]}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    onSelectedRowsChange={handleRowChange}
                    noDataComponent="No Student Details found"
                  />
                </div>
              ) : (
                <div className={classes.noDataMargin}>
                  No Student details found
                </div>
              )
            ) : (
              <Spinner />
            )} */}
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default AddStudentToActivityBatch;
