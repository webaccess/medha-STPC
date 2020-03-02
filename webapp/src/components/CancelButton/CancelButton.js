import React from "react";
import { Button } from "@material-ui/core";
import * as genericConstants from "../../constants/GenericConstants";
import useStyles from "./CancelButtonStyles";
import { CustomRouterLink } from "../../components";

const CancelButton = props => {
  const classes = useStyles();
  return (
    <Button
      type={props.type ? props.type : "submit"}
      color={props.color ? props.color : "primary"}
      variant={props.variant ? props.variant : "contained"}
      component={CustomRouterLink}
      to={props.to}
      className={classes.resetbtn}
    >
      {genericConstants.CANCEL_BUTTON_TEXT}
    </Button>
  );
};

export default CancelButton;
