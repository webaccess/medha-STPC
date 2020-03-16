import React from "react";
import { Button } from "@material-ui/core";
import useStyles from "./GreenButtonStyles";
import { CustomRouterLink } from "../../components";

const GreenButton = props => {
  const classes = useStyles();
  const greenButtonChecker = props.greenButtonChecker;

  if (greenButtonChecker) {
    return(
      <Button
      type={props.type ? props.type : "submit"}
      color={props.color ? props.color : "primary"}
      variant={props.variant ? props.variant : "contained"}
      className={classes.routebtn}
      startIcon={props.startIcon}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
    );
  }
  else {
    return(
      <Button
      variant={props.variant ? props.variant : "contained"}
      color={props.color ? props.color : "primary"}
      className={classes.routebtn}
      startIcon={props.startIcon}
      // component={CustomRouterLink}
      to={props.to}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
    );
  }

};

export default GreenButton;
