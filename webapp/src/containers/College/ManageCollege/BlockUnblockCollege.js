import React, { useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  CircularProgress,
  Modal,
  Backdrop,
  Fade
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import useStyles from "../../ContainerStyles/ModalPopUpStyles";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton, GrayButton } from "../../../components";
import * as formUtilities from "../../../Utilities/FormUtilities";

const COLLEGE_BLOCK_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_BLOCK_COLLEGE;

const COLLEGE_UNBLOCK_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_UNBLOCK_COLLEGE;

const BlockUnblockCollege = props => {
  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = useState({
    isDataBlockUnblock: false,
    isValid: false,
    stateCounter: 0
  });

  /** Part for editing college */
  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.isDataBlockUnblock = false;
  }

  const handleCloseModal = (message = "") => {
    setOpen(false);
    /** This event handles the scenario when the pop up is closed just by clicking outside the popup 
    to ensure that only string value is passed to message variable */
    if (typeof message !== "string") {
      message = "";
    }
    setFormState(formState => ({
      ...formState,
      values: {},
      isDataBlockUnblock: false,
      isValid: false,
      stateCounter: 0
    }));
    if (formState.isDataBlockUnblock) {
      props.closeModal(true, message);
    } else {
      props.closeModal(false, message);
    }
  };

  const handleSubmit = async event => {
    /** CALL Put FUNCTION */
    setOpen(true);
    event.preventDefault();
    event.persist();
    props.clearSelectedRow(true);
    /** Calls checkIfStateCanBeDelete function to check whether the state can be deleted
     and returns back an opbject with status and message*/
    blockUnblockData();
  };

  const blockUnblockData = () => {
    if (props.isMultiBlock || props.isMultiUnblock) {
      let COLLEGE_URL = "";
      if (props.isMultiUnblock) {
        COLLEGE_URL = COLLEGE_UNBLOCK_URL;
      } else {
        COLLEGE_URL = COLLEGE_BLOCK_URL;
      }
      let postData = {
        ids: props.multiBlockCollegeIds
      };
      serviceProviders
        .serviceProviderForPostRequest(COLLEGE_URL, postData)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDataBlockUnblock = true;
          if (props.isMultiUnblock) {
            handleCloseModal("Colleges have been unblocked successfully");
          } else {
            handleCloseModal("Colleges have been blocked successfully");
          }
        })
        .catch(error => {
          console.log("error");
          formState.isDataBlockUnblock = false;
          if (props.isMultiUnblock) {
            handleCloseModal(
              "An error has occured while unblocking colleges. Kindly, try again."
            );
          } else {
            handleCloseModal(
              "An error has occured while blocking colleges. Kindly, try again."
            );
          }
        });
    } else {
      if (props.dataToBlockUnblock["is_blocked"]) {
        let ids = [];
        ids.push(props.dataToBlockUnblock["id"]);
        let postData = {
          ids: ids
        };
        serviceProviders
          .serviceProviderForPostRequest(COLLEGE_UNBLOCK_URL, postData)
          .then(res => {
            setFormState(formState => ({
              ...formState,
              isValid: true
            }));
            formState.isDataBlockUnblock = true;
            handleCloseModal(
              "College " +
                props.dataToBlockUnblock["name"] +
                " has been unblocked."
            );
          })
          .catch(error => {
            console.log("error");
            formState.isDataBlockUnblock = false;
            handleCloseModal(
              "An error has occured while unblocking college" +
                props.dataToBlockUnblock["name"] +
                ". Kindly, try again."
            );
          });
      } else {
        let ids = [];
        ids.push(props.dataToBlockUnblock["id"]);
        let postData = {
          ids: ids
        };
        serviceProviders
          .serviceProviderForPostRequest(COLLEGE_BLOCK_URL, postData)
          .then(res => {
            setFormState(formState => ({
              ...formState,
              isValid: true
            }));
            formState.isDataBlockUnblock = true;
            handleCloseModal(
              "College " +
                props.dataToBlockUnblock["name"] +
                " has been blocked."
            );
          })
          .catch(error => {
            console.log("error");
            formState.isDataBlockUnblock = false;
            handleCloseModal(
              "An error has occured while blocking college" +
                props.dataToBlockUnblock["name"] +
                ". Kindly, try again."
            );
          });
      }
    }
  };

  const handleBlock = async event => {
    props.clearSelectedRow(true);
    props.closeModal();
  };

  const classes = useStyles();
  return (
    <React.Fragment>
      {!formUtilities.checkEmpty(props.dataToBlockUnblock) ||
      props.multiBlockCollegeIds.length ? (
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
              <div className={classes.blockpanel}>
                <Typography variant={"h2"} className={classes.textMargin}>
                  {props.isMultiBlock || props.isMultiUnblock
                    ? props.isMultiBlock
                      ? genericConstants.BLOCK_BUTTON_TEXT
                      : genericConstants.UNBLOCK_BUTTON_TEXT
                    : null}
                  {!props.isMultiBlock && !props.isMultiUnblock
                    ? props.dataToBlockUnblock["is_blocked"]
                      ? genericConstants.UNBLOCK_BUTTON_TEXT
                      : genericConstants.BLOCK_BUTTON_TEXT
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
                      {props.isMultiBlock || props.isMultiUnblock
                        ? props.isMultiBlock
                          ? "Are you sure you want to block all selected colleges"
                          : "Are you sure you want to unblock all selected colleges"
                        : null}
                      {!props.isMultiBlock && !props.isMultiUnblock
                        ? props.dataToBlockUnblock["is_blocked"]
                          ? "Are you sure you want to unblock college " +
                            props.dataToBlockUnblock["name"]
                          : "Are you sure you want to block college " +
                            props.dataToBlockUnblock["name"]
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
                        OK
                      </YellowButton>
                    </Grid>
                    <Grid item>
                      <GrayButton
                        type="submit"
                        color="primary"
                        variant="contained"
                        onClick={handleBlock}
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
      ) : null}
    </React.Fragment>
  );
};

export default BlockUnblockCollege;
