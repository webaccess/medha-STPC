import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import * as roleConstants from "../../../constants/RoleConstants";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import useStyles from "../CommonStyles/DeleteStyles.js";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton } from "../../../components";
import auth from "../../../components/Auth";

const DELETE_DOCUMENT_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENTS_DIRECT_URL;
const DOCUMENT_ID = "document";
const DeleteDocument = props => {
  const [formState, setFormState] = useState({
    isDeleteData: false,
    isValid: false,
    documentCounter: 0,
    values: {}
  });

  if (props.showModal && !formState.documentCounter) {
    formState.documentCounter = 0;
    formState.values[DOCUMENT_ID] = props.id;
    formState.isDeleteData = false;
  }

  const handleCloseModal = data => {
    setFormState(formState => ({
      ...formState,
      values: {},
      isDeleteData: false,
      isValid: false,
      documentCounter: 0
    }));

    if (formState.isDeleteData) {
      props.deleteEvent(true, data);
    } else {
      props.deleteEvent(false, data);
    }
    props.closeModal();
  };

  const handleSubmit = event => {
    /** CALL Put FUNCTION */
    deleteData();
    event.preventDefault();
  };

  const deleteData = () => {
    const studentInfo =
      auth.getUserInfo() !== null &&
      auth.getUserInfo().role.name === roleConstants.STUDENT
        ? auth.getUserInfo().studentInfo.contact.id
        : auth.getStudentIdFromCollegeAdmin();

    const API_URL =
      `${DELETE_DOCUMENT_URL}/${studentInfo}/` +
      strapiConstants.STRAPI_DELETE_UPLOAD;

    const id = `${props.id}?document=${props.documentId}`;

    serviceProviders
      .serviceProviderForDeleteRequest(API_URL, id)
      .then(res => {
        setFormState(formState => ({
          ...formState,
          isValid: true
        }));
        formState.isDeleteData = true;
        handleCloseModal(res.data.name);
      })
      .catch(error => {
        console.log("error");
        formState.isDeleteData = false;
        handleCloseModal(error.response.data.message);
      });
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
            {genericConstants.DELETE_TEXT}
          </Typography>
          <div className={classes.edit_dialog}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item lg className={classes.deletemessage}>
                  Do yo want to delete this field?
                </Grid>
                <Grid item xs>
                  <YellowButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    {genericConstants.DELETE_TEXT}
                  </YellowButton>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default DeleteDocument;
