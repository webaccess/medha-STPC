import React from "react";
import { Button } from "@material-ui/core";
import useStyles from "./YellowRouteButtonStyles";
import { CustomRouterLink } from "../../components";

const YellowRouteButton = props => {
  const classes = useStyles();
  return (
    <Button
      variant={props.variant ? props.variant : "contained"}
      color={props.color ? props.color : "primary"}
      className={classes.routebtn}
      startIcon={props.startIcon}
      component={CustomRouterLink}
      to={props.to}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export default YellowRouteButton;
