import React from "react";
import { Button } from "@material-ui/core";
import useStyles from "./GrayButtonStyles";
import { CustomRouterLink } from "../../components";

const GrayButton = props => {
  const classes = useStyles();
  return props.to !== undefined ? (
    <Button
      type={props.type ? props.type : "submit"}
      color={props.color ? props.color : "primary"}
      variant={props.variant ? props.variant : "contained"}
      component={CustomRouterLink}
      to={props.to}
      className={classes.resetbtn}
      fullWidth
    >
      {props.children}
    </Button>
  ) : (
    <Button
      type={props.type ? props.type : "submit"}
      color={props.color ? props.color : "primary"}
      variant={props.variant ? props.variant : "contained"}
      className={classes.resetbtn}
      onClick={props.onClick}
      fullWidth
    >
      {props.children}
    </Button>
  );
};

export default GrayButton;
