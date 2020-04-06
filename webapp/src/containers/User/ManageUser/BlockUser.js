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

const USER_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;

const BlockUser = props => {
  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = useState({
    isDataBlock: false,
    isValid: false,
    stateCounter: 0,
    values: {}
  });

  const handleCloseModal = () => {
    setOpen(false);
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
    setOpen(true);
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
          <div className={classes.blockpanel}>
            <Typography variant={"h2"} className={classes.textMargin}>
              {props.isUnBlocked || props.isUnMulBlocked ? "Unblock" : null}
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
                  {props.isUnBlocked || props.isUnMulBlocked
                    ? "Are you sure you want to unblock this user"
                    : null}
                  {props.isBlocked || props.isMulBlocked
                    ? "Are you sure you want to block this user"
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

export default BlockUser;
