import React from "react";
import { Tooltip } from "@material-ui/core";

const TickGridIcon = (props) => {
  return (
    <Tooltip title="Mark attendance" placement="top">
      <i
        className="material-icons"
        id={props.id}
        value={props.name}
        onClick={props.onClick}
        style={{
          color: props.style.color,
          fontSize: "23px",
          cursor: "pointer",
        }}
      >
        check
      </i>
    </Tooltip>
  );
};

export default TickGridIcon;
