import React from "react";
import { Tooltip } from "@material-ui/core";

const ViewGridIcon = (props) => {
  return (
    <Tooltip title="View Student List" placement="top">
      <i
        className="material-icons"
        id={props.id}
        value={props.value}
        style={{ color: "green", fontSize: "20px" }}
        onClick={props.onClick}
      >
        group
      </i>
    </Tooltip>
  );
};

export default ViewGridIcon;
