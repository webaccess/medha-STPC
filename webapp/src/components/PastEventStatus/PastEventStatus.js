import React from "react";
import { Tooltip } from "@material-ui/core";

const PastEventStatus = props => {
  return (
    <Tooltip title={props.style ? "Attended" : "Missed"} placement="top">
      <i
        className="material-icons"
        style={
          props.style
            ? { color: "green", fontSize: "23px" }
            : { color: "grey", fontSize: "23px" }
        }
      >
        how_to_reg
      </i>
    </Tooltip>
  );
};

export default PastEventStatus;
