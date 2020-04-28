import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const ThumbIcon = props => {
  return (
    <Tooltip
      title={
        props.style ? (
          <React.Fragment>
            <Typography color="inherit">DeHire</Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography color="inherit">Hire</Typography>
          </React.Fragment>
        )
      }
      placement="top"
    >
      <i
        className="material-icons"
        id={props.id}
        value={props.value}
        onClick={props.onClick}
        style={
          props.style
            ? { color: "green", fontSize: "19px" }
            : { color: "grey", fontSize: "19px" }
        }
      >
        thumb_up
      </i>
    </Tooltip>
  );
};

export default ThumbIcon;
