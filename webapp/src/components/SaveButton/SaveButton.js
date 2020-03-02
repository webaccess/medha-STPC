import React from "react";
import { Button } from "@material-ui/core";
import * as genericConstants from "../../constants/GenericConstants";
import useStyles from "./SaveButtonStyles";

const SaveButton = props => {
  const classes = useStyles();
  return (
    <Button
      type={props.type ? props.type : "submit"}
      color={props.color ? props.color : "primary"}
      variant={props.variant ? props.variant : "contained"}
      className={classes.submitbtn}
    >
      {genericConstants.SAVE_BUTTON_TEXT}
    </Button>
  );
};

export default SaveButton;
