import React, { useLayoutEffect, useState } from "react";
import { Button } from "@material-ui/core";
import useStyles from "./GreenButtonStyles";
import { CustomRouterLink } from "../../components";
import { isMobile } from "react-device-detect";

const GreenButton = props => {
  const classes = useStyles();
  const greenButtonChecker = props.greenButtonChecker;
  const buttonDisabled = props.buttonDisabled;

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth]);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }

  function ShowWindowDimensions(props) {
    const [width] = useWindowSize();
    return width;
  }

  if (greenButtonChecker) {
    if (ShowWindowDimensions() < 590) {
      return (
        <Button
          type={props.type ? props.type : "submit"}
          color={props.color ? props.color : "primary"}
          variant={props.variant ? props.variant : "contained"}
          className={props.className ? props.className : classes.routebtn}
          startIcon={props.startIcon}
          onClick={props.onClick}
          disabled={buttonDisabled}
          style={props.style}
          fullWidth
        >
          {props.children}
        </Button>
      );
    } else {
      return (
        <Button
          type={props.type ? props.type : "submit"}
          color={props.color ? props.color : "primary"}
          variant={props.variant ? props.variant : "contained"}
          className={props.className ? props.className : classes.routebtn}
          startIcon={props.startIcon}
          onClick={props.onClick}
          disabled={buttonDisabled}
          style={props.style}
        >
          {props.children}
        </Button>
      );
    }
  } else {
    if (ShowWindowDimensions() < 590) {
      return (
        <Button
          variant={props.variant ? props.variant : "contained"}
          color={props.color ? props.color : "primary"}
          className={classes.routebtn}
          startIcon={props.startIcon}
          component={CustomRouterLink}
          to={props.to}
          onClick={props.onClick}
          style={props.style}
          fullWidth
        >
          {props.children}
        </Button>
      );
    } else {
      return (
        <Button
          variant={props.variant ? props.variant : "contained"}
          color={props.color ? props.color : "primary"}
          className={classes.routebtn}
          startIcon={props.startIcon}
          component={CustomRouterLink}
          to={props.to}
          onClick={props.onClick}
          style={props.style}
        >
          {props.children}
        </Button>
      );
    }
  }
};

export default GreenButton;
