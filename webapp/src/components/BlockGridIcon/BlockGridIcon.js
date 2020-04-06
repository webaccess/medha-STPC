import React from "react";
import { Tooltip } from "@material-ui/core";

const BlockIcon = props => {
  return (
    <Tooltip title={props.title ? "Unblock" : "Block"} placement="top">
      <i
        className="material-icons"
        id={props.id}
        value={props.value}
        onClick={props.onClick}
        style={
          props.style
            ? { color: "red", fontSize: "21px" }
            : { color: "green", fontSize: "21px" }
        }
      >
        block
      </i>
    </Tooltip>
  );
};

export default BlockIcon;
