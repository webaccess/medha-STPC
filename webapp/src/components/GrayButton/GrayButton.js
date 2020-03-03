import React from "react";
import { Button } from "@material-ui/core";
import useStyles from "./GrayButtonStyles";
import { CustomRouterLink } from "../../components";

const GrayButton = props => {
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
      {props.children}
    </Button>
  );
};

export default GrayButton;
