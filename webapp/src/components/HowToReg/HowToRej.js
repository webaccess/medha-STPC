import React from "react";
import { Tooltip } from "@material-ui/core";

const HowToReg = props => {
  return (
    <Tooltip title={props.style ? "Absent" : "Present"} placement="top">
      <i
        className="material-icons"
        id={props.id}
        value={props.value}
        onClick={props.onClick}
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

export default HowToReg;
