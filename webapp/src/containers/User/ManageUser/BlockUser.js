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

import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { YellowButton, GrayButton } from "../../../components";
import useStyles from "../../ContainerStyles/ModalPopUpStyles";

const USER_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_CONTACT_URL;

const BlockUser = props => {
  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = useState({
    isDataBlockUnblock: false,
    isValid: false,
    stateCounter: 0,
    values: {}
  });

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

  const handleSubmit = event => {
    setOpen(true);
    /** CALL Put FUNCTION */
    blockUser();
    props.clearSelectedRow(true);
    event.preventDefault();
  };
  const blockUser = () => {
    var body;
    if (props.isUnBlocked || props.isMultiUnblock) {
      body = {
        blocked: false
      };
    }
    if (props.isBlocked || props.isMulBlocked) {
      body = {
        blocked: true
      };
    }

    if (props.isMulBlocked || props.isMultiUnblock) {
      let MultiBlockUnblockUrl;
      if (props.isMulBlocked) {
        MultiBlockUnblockUrl = USER_URL + strapiConstants.STRAPI_BLOCK_URL;
      } else if (props.isMultiUnblock) {
        MultiBlockUnblockUrl = USER_URL + strapiConstants.STRAPI_UNBLOCK_URL;
      }
      let MultiBlockUnblockId = {
        ids: props.id
      };
      serviceProviders
        .serviceProviderForPostRequest(
          MultiBlockUnblockUrl,
          MultiBlockUnblockId
        )
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDataBlockUnblock = true;
          if (props.isMultiUnblock) {
            handleCloseModal("Users has been unblocked");
          } else {
            handleCloseModal("Users has been blocked");
          }
        })
        .catch(error => {
          console.log("error");
          formState.isDataBlockUnblock = false;
          if (props.isMultiUnblock) {
            handleCloseModal("Error unblocking selected Users");
          } else {
            handleCloseModal("Error blocking selected Users");
          }
        });
    } else {
      let BLOCK_URL;
      if (props.dataToBlockUnblock.isUserBlock === true) {
        BLOCK_URL = USER_URL + strapiConstants.STRAPI_BLOCK_URL;
      } else if (props.dataToBlockUnblock.isUserBlock === false) {
        BLOCK_URL = USER_URL + strapiConstants.STRAPI_UNBLOCK_URL;
      }

      let BLOCKUNBLOCKID = {
        ids: parseInt(props.id)
      };
      serviceProviders
        .serviceProviderForPostRequest(BLOCK_URL, BLOCKUNBLOCKID)
        .then(res => {
          formState.isDataBlockUnblock = true;
          if (props.dataToBlockUnblock["isUserBlock"]) {
            handleCloseModal(
              "User " + props.dataToBlockUnblock["name"] + " has been blocked"
            );
          } else {
            handleCloseModal(
              "User " + props.dataToBlockUnblock["name"] + " has been unblocked"
            );
          }
        })
        .catch(error => {
          console.log("error", error);
          formState.isDataBlockUnblock = false;
          handleCloseModal("user unblock successfully");
        });
    }
  };

  const handleBlock = async event => {
    props.clearSelectedRow(true);
    props.closeModal();
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
              {props.isUnBlocked || props.isMultiUnblock ? "Unblock" : null}
              {props.isBlocked || props.isMulBlocked ? "Block" : null}
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
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item lg className={classes.deletemessage}>
                  {props.isUnBlocked
                    ? "Are you sure you want to unblock user " +
                      props.dataToBlockUserName
                    : null}
                  {props.isMultiUnblock
                    ? "Are you sure you want to unblock the selected users "
                    : null}
                  {props.isBlocked
                    ? "Are you sure you want to block user " +
                      props.dataToBlockUserName
                    : null}
                  {props.isMulBlocked
                    ? "Are you sure you want to block the selected users "
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
  );
};

export default BlockUser;
