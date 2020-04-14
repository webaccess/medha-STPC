import React from "react";
import { Tooltip } from "@material-ui/core";

const CrossGridIcon = (props) => {
  return (
    <Tooltip title="Unmark attendance" placement="top">
      <i
        className="material-icons"
        id={props.id}
        value={props.name}
        onClick={props.onClick}
        style={{
          color: "red",
          fontSize: "23px",
          cursor: "pointer",
        }}
      >
        clear
      </i>
    </Tooltip>
  );
};

export default CrossGridIcon;
