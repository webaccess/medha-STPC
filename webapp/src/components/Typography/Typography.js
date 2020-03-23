import React from "react";
import { Typography } from "@material-ui/core";

const Header = props => {
  return (
    <Typography
      variant={props.variant ? props.variant : "inherit"}
      className={props.className}
    >
      {props.children}
    </Typography>
  );
};

export default Header;
