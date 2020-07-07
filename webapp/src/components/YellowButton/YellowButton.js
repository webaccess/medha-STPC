import React from "react";
import { Button } from "@material-ui/core";
import useStyles from "./YellowButtonStyles";

const YellowButton = props => {
  const classes = useStyles();
  return (
    <Button
      type={props.type ? props.type : "submit"}
      color={props.color ? props.color : "primary"}
      variant={props.variant ? props.variant : "contained"}
      className={classes.submitbtn}
      onClick={props.onClick}
      disabled={props.disabled}
      style={props.style}
      fullWidth
    >
      {props.children}
    </Button>
  );
};

export default YellowButton;
