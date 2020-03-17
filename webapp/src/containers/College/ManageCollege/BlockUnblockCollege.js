import React, { useState } from "react";
import { Grid, Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import useStyles from "./DeleteCollegeStyles";
import * as serviceProviders from "../../../api/Axios";
import * as genericConstants from "../../../constants/GenericConstants";
import { YellowButton } from "../../../components";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";

const COLLEGE_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;

const BlockUnblockCollege = props => {
  const [formState, setFormState] = useState({
    isDataBlockUnblock: false,
    isValid: false,
    stateCounter: 0,
    values: {},
    dynamicBar: [{ index: Math.random() }]
  });

  /** Part for editing college */
  if (props.showModal && !formState.stateCounter) {
    formState.stateCounter = 0;
    formState.values = props.dataToBlockUnblock;
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

  const handleCloseModal = () => {
    setFormState(formState => ({
      ...formState,
      values: {},
      isDataBlockUnblock: false,
      isValid: false,
      stateCounter: 0
    }));

    if (formState.isDataBlockUnblock) {
      props.blockUnblockEvent(true);
    } else {
      props.blockUnblockEvent(false);
    }
    props.closeModal();
  };

  const handleSubmit = event => {
    /** CALL Put FUNCTION */
    blockUnblockData();
    event.preventDefault();
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
        handleCloseModal();
      })
      .catch(error => {
        console.log("error");
        formState.isDataBlockUnblock = false;
        handleCloseModal();
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
          <div className={classes.crossbtn}> 
            <IconButton
              className={classes.closeButton}
              aria-label="close"
              onClick={props.modalClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div className={classes.edit_dialog}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item lg className={classes.deletemessage}>
                  Do yo want to{" "}
                  {formState.values["block"] ? "unblock " : "block "} this
                  college?
                </Grid>
                <Grid item xs>
                  <YellowButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    {formState.values["block"]
                      ? genericConstants.UNBLOCK_BUTTON_TEXT
                      : genericConstants.BLOCK_BUTTON_TEXT}
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

export default BlockUnblockCollege;
