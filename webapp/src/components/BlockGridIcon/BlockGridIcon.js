import React from "react";
import { Tooltip } from "@material-ui/core";

const BlockIcon = (props) => {
  return (
    <Tooltip title={props.title ? "Unblock" : "Block"} placement="top">
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
