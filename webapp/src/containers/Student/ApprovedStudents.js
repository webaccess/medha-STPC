import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import * as serviceProviders from "../../api/Axios";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import { YellowButton, GrayButton } from "../../components";
import useStyles from "./ApproveStudentStyles";

const STUDENTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENTS;

const ApprovedStudents = props => {

  const [open, setOpen] = React.useState(false);
  const[username, setUsername] = useState([]);
  const [formState, setFormState] = useState({
    isDataBlock: false,
    isValid: false,
    stateCounter: 0,
    values: {}
  });

  if(props.id){
    serviceProviders.serviceProviderForGetOneRequest(STUDENTS_URL, props.id).then(res=>{
      setUsername(res.data.user.username)
    })
    .catch(error => {
      console.log('error',error)
    })
  }


  const handleCloseModal = (message = "") => {
    setOpen(false);
    if (typeof message !== "string") {
      message = "";
    }
    setFormState(formState => ({
      ...formState,
      values: {},
      isDataBlock: false,
      isValid: false,
      stateCounter: 0
    }));

    if (formState.isDataBlock) {
      props.blockEvent(true, message);
    } else {
      props.blockEvent(false, message);
    }
    props.closeBlockModal();
  };

  const handleSubmit = event => {
    /** CALL Put FUNCTION */
    ApprovedStudent();
    event.preventDefault();
  };

  const ApprovedStudent = () => {
    var approve_url;
    var paramsId ;
    if (props.Data === true ) {
    
      approve_url =  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENT + "/unapprove"  ;
      paramsId = {
        ids: parseInt(props.id) 
      };
    } 
    if(props.Data === false){
      approve_url =   strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENT + "/approve"  ;
      paramsId = {
        ids: parseInt(props.id) 
      };
    }
    if(props.isMulBlocked === true ){
      approve_url =   strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENT + "/approve"  ;
      for(var i=0 ; i<props.id.length;i++){
        paramsId = {
          ids: parseInt(props.id[i]) 
        };
        serviceProviders.serviceProviderForPostRequest(approve_url, paramsId)
        .then(res => {
          formState.isDataBlock = true;
          handleCloseModal("Students successfully approved");
        })
        .catch(error => {
          formState.isDataBlock = false;
          handleCloseModal("Error approving students");
        });
      }
   
    }
    if(props.isUnMulBlocked === true){
      approve_url =   strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STUDENT + "/unapprove"  ;
      for(var i=0 ; i<props.id.length;i++){
        paramsId = {
          ids: parseInt(props.id[i]) 
        };
        serviceProviders.serviceProviderForPostRequest(approve_url, paramsId)
        .then(res => {
          formState.isDataBlock = true;
          handleCloseModal("Students successfully Unapproved");
        })
        .catch(error => {
          console.log("error---", error);
          formState.isDataBlock = false;
          handleCloseModal("Error Unapproving students");
        });
      }
    }

    serviceProviders.serviceProviderForPostRequest(approve_url, paramsId)
    .then(res => {
      formState.isDataBlock = true;
      if(props.Data === true){
      handleCloseModal("Successfully Unapproved selected student");
      }else{
      
        handleCloseModal("Successfully approved selected student");
      }
    })
    .catch(error => {
      console.log("error---", error);
      formState.isDataBlock = false;
      if(props.Data === true){
        handleCloseModal("Error approving selected student");
        }else{
          handleCloseModal("Error Unapproving selected student");
        }
    });
  
  };

  const classes = useStyles();
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={props.getModel}
      onClose={handleCloseModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={props.getModel}>
        <div className={classes.paper}>
          <div className={classes.blockpanel}>
            <Typography variant={"h2"} className={classes.textMargin}>
              {/* {props.Data ? "Unapprove" : "Approve"} */}
              {props.Data === false
                    ? " Approve  " 
                    : null}
                  {props.Data === true
                    ? " Unapprove  " 
                    : null}
                    {props.isMulBlocked === true ? " Approve "
                    : null}
                    {props.isUnMulBlocked === true
                    ? " Unapprove "
                    : null}
            </Typography>
            <div className={classes.crossbtn}>
              <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={props.modalClose}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <div className={classes.edit_dialog}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item lg className={classes.deletemessage}>
                  {props.Data === false
                    ? "Are you sure you want to approve student " + props["blockedDataName"] + "  ?" 
                    : null}
                  {props.Data === true
                    ? "Are you sure you want to unapprove student " + props["blockedDataName"] + "  ?"
                    : null}
                    {props.isMulBlocked === true ? "Are you sure you want to approve selected "  + props.id.length + " student?"
                    : null}
                    {props.isUnMulBlocked === true
                    ? "Are you sure you want to unapprove selected " + props.id.length +  " student?"
                    : null}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <YellowButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    Ok
                  </YellowButton>
                </Grid>
                <Grid item>
                  <GrayButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={props.modalClose}
                  >
                    Close
                  </GrayButton>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      </Fade>
    </Modal>
  );
};

export default ApprovedStudents;
