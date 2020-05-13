import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const BlockIcon = props => {
  return (
    <Tooltip
      title={
        props.title ? (
          <React.Fragment>
            <Typography color="inherit">Unblock</Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography color="inherit">Block</Typography>
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
            ? { color: "#8C8C8C", fontSize: "20px" }
            : { color: "green", fontSize: "20px" }
        }
      >
        block
      </i>
    </Tooltip>
  );
};

export default BlockIcon;
