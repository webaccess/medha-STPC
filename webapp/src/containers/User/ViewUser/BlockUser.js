import React, { useState } from "react";
import { Grid, Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { YellowButton } from "../../../components";
import useStyles from "./DeleteUserStyles";


const USER_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;

const BlockUser = props => {
  const [formState, setFormState] = useState({
    isDataBlock: false,
    isValid: false,
    stateCounter: 0,
    values: {}
  });

  const handleCloseModal = () => {
    setFormState(formState => ({
      ...formState,
      values: {},
      isDataBlock: false,
      isValid: false,
      stateCounter: 0
    }));

    if (formState.isDataBlock) {
      props.blockEvent(true);
    } else {
      props.blockEvent(false);
    }
    props.closeBlockModal();
  };

  const handleSubmit = event => {
    /** CALL Put FUNCTION */
    blockUser();
    event.preventDefault();
  };

  const blockUser = () => {
    var body;
    if (props.isUnBlocked || props.isUnMulBlocked) {
      body = {
        blocked: false
      };
    }
    if (props.isBlocked || props.isMulBlocked) {
      body = {
        blocked: true
      };
    }

    if (props.isMulBlocked || props.isUnMulBlocked) {
      serviceProviders
        .serviceProviderForAllBlockRequest(USER_URL, props.id, body)
        .then(res => {
          formState.isDataBlock = true;
          handleCloseModal();
        })
        .catch(error => {
          console.log("error---", error);
          formState.isDataBlock = false;
          handleCloseModal();
        });
    } else {
      serviceProviders
        .serviceProviderForPutRequest(USER_URL, props.id, body)
        .then(res => {
          formState.isDataBlock = true;
          handleCloseModal();
        })
        .catch(error => {
          console.log("error", error);
          formState.isDataBlock = false;
          handleCloseModal();
        });
    }
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
          <MuiDialogTitle>
            <Typography className={classes.textMargin}>
              {props.isUnBlocked || props.isUnMulBlocked ? "UN-Block" : null}
              {props.isBlocked || props.isMulBlocked ? "Block" : null}
            </Typography>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={props.modalClose}
            >
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>
          <div className={classes.edit_dialog}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item lg className={classes.deletemessage}>
                  {props.isUnBlocked || props.isUnMulBlocked
                    ? "Do you want to UN-Block this user"
                    : null}
                  {props.isBlocked || props.isMulBlocked
                    ? "Do you want to Block this user"
                    : null}
                </Grid>
                <Grid item xs>
                  <YellowButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    {props.isUnBlocked || props.isUnMulBlocked
                      ? "UN-Block"
                      : null}
                    {props.isBlocked || props.isMulBlocked ? "Block" : null}
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

export default BlockUser;