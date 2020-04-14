import React from "react";
import { Tooltip } from "@material-ui/core";

const ThumbIcon = props => {
  return (
    <Tooltip title={props.style ? "Dehire" : "Hire"} placement="top">
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
        thumb_up
      </i>
    </Tooltip>
  );
};

export default ThumbIcon;
