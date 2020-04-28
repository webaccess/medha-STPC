import React from "react";
import { Tooltip } from "@material-ui/core";

const ThumbIcon = props => {
  return (
    <Tooltip title={props.style ? "DeHire" : "Hire"} placement="top">
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
