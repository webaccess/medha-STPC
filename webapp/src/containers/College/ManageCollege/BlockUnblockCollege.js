import React, { useState } from "react";
import {
  Grid,
  Typography,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import useStyles from "./DeleteCollegeStyles";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton, GrayButton } from "../../../components";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";

const COLLEGE_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;

const BlockUnblockCollege = props => {
  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = useState({
    isDataBlockUnblock: false,
    isValid: false,
    stateCounter: 0,
    values: {},
    dynamicBar: []
  });

  /** Part for editing college */
  if (props.showModal && !formState.stateCounter) {
    formState.values = {};
    formState.stateCounter = 0;
    formState.isDataBlockUnblock = false;
    if (props["dataToBlockUnblock"]) {
      if (props["dataToBlockUnblock"]["name"]) {
        formState.values["collegeName"] = props["dataToBlockUnblock"]["name"];
      }
      if (props["dataToBlockUnblock"]["college_code"]) {
        formState.values["collegeCode"] =
          props["dataToBlockUnblock"]["college_code"];
      }
      if (props["dataToBlockUnblock"]["address"]) {
        formState.values["address"] = props["dataToBlockUnblock"]["address"];
      }
      if (props["dataToBlockUnblock"]["contact_number"]) {
        formState.values["contactNumber"] =
          props["dataToBlockUnblock"]["contact_number"];
      }
      if (props["dataToBlockUnblock"]["college_email"]) {
        formState.values["collegeEmail"] =
          props["dataToBlockUnblock"]["college_email"];
      }
      if (props["dataToBlockUnblock"]["state"]) {
        formState.values["state"] = props["dataToBlockUnblock"]["state"]["id"];
      }
      if (props["dataToBlockUnblock"]["district"]) {
        formState.values["district"] =
          props["dataToBlockUnblock"]["district"]["id"];
      }
      if (props["dataToBlockUnblock"]["blocked"]) {
        formState.values["block"] = props["dataToBlockUnblock"]["blocked"];
      }
      if (props["dataToBlockUnblock"]["zone"]) {
        formState.values["zone"] = props["dataToBlockUnblock"]["zone"]["id"];
      }
      if (props["dataToBlockUnblock"]["rpc"]) {
        formState.values["rpc"] = props["dataToBlockUnblock"]["rpc"]["id"];
      }
      if (
        props["dataToBlockUnblock"]["principal"] &&
        props["dataToBlockUnblock"]["principal"]["id"]
      ) {
        formState.values["principal"] =
          props["dataToBlockUnblock"]["principal"]["id"];
      }
      if (
        props["dataToBlockUnblock"]["stream_strength"] &&
        props["dataToBlockUnblock"]["stream_strength"].length
      ) {
        let dynamicBar = [];
        for (let i in props["dataToBlockUnblock"]["stream_strength"]) {
          let tempDynamicBarrValue = {};
          tempDynamicBarrValue["index"] = Math.random();
          tempDynamicBarrValue["streams"] =
            props["dataToBlockUnblock"]["stream_strength"][i]["stream"]["id"];
          tempDynamicBarrValue["strength"] = props["dataToBlockUnblock"][
            "stream_strength"
          ][i]["strength"].toString();
          dynamicBar.push(tempDynamicBarrValue);
        }
        formState.dynamicBar = dynamicBar;
      }
      formState.counter += 1;
    }
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
    /** Calls checkIfStateCanBeDelete function to check whether the state can be deleted
     and returns back an opbject with status and message*/
    blockUnblockData();
  };

  const getDynamicBarData = () => {
    let streamStrengthArrayValues = [];
    formState.dynamicBar.map(field => {
      let streamStrengthValue = {};
      if (field.hasOwnProperty("streams") && field.hasOwnProperty("strength")) {
        streamStrengthValue["stream"] = field["streams"];
        streamStrengthValue["strength"] = parseInt(field["strength"]);
        streamStrengthArrayValues.push(streamStrengthValue);
      }
    });
    return streamStrengthArrayValues;
  };

  const blockUnblockData = () => {
    if (props.isMultiBlock || props.isMultiUnblock) {
      console.log(
        "ids",
        props.multiBlockCollegeIds,
        props.isMultiBlock,
        props.isMultiUnblock
      );
      formState.isDataBlockUnblock = false;
      handleCloseModal("Error blocking/unblocking selected Colleges");
    } else {
      let streamStrengthArray = [];
      streamStrengthArray = getDynamicBarData();
      let postData = databaseUtilities.addCollege(
        formState.values["collegeName"],
        formState.values["collegeCode"],
        formState.values["address"],
        formState.values["contactNumber"],
        formState.values["collegeEmail"].toLowerCase(),
        formState.values["block"] ? false : true,
        formState.values["principal"] ? formState.values["principal"] : null,
        formState.values["rpc"] ? formState.values["rpc"] : null,
        formState.values["zone"] ? formState.values["zone"] : null,
        formState.values["district"] ? formState.values["district"] : null,
        streamStrengthArray
      );
      serviceProviders
        .serviceProviderForPutRequest(
          COLLEGE_URL,
          props.dataToBlockUnblock["id"],
          postData
        )
        .then(res => {
          setFormState(formState => ({
            ...formState,
            isValid: true
          }));
          formState.isDataBlockUnblock = true;
          if (formState.values["block"]) {
            handleCloseModal(
              "College " +
                formState.values["collegeName"] +
                " successfully unblocked"
            );
          } else {
            handleCloseModal(
              "College " +
                formState.values["collegeName"] +
                " successfully blocked"
            );
          }
        })
        .catch(error => {
          console.log("error");
          formState.isDataBlockUnblock = false;
          if (formState.values["block"]) {
            handleCloseModal(
              "Error unblocking College " + formState.values["collegeName"]
            );
          } else {
            handleCloseModal(
              "Error blocking College " + formState.values["collegeName"]
            );
          }
        });
    }
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
          <div className={classes.blockpanel}>
            <Typography variant={"h2"} className={classes.textMargin}>
              {formState.values["block"]
                ? genericConstants.UNBLOCK_BUTTON_TEXT
                : genericConstants.BLOCK_BUTTON_TEXT}
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
                    ? formState.values["block"]
                      ? "Are you sure you want to unblock college " +
                        formState.values["collegeName"]
                      : "Are you sure you want to block college " +
                        formState.values["collegeName"]
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

export default BlockUnblockCollege;
