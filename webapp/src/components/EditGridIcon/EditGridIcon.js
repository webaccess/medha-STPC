import React from "react";
import { Tooltip } from "@material-ui/core";

const EditGridIcon = props => {
  return (
    <Tooltip title="Edit" placement="top">
      <i
        className="material-icons"
        id={props.id}
        userId={props.userId}
        value={props.value}
        onClick={props.onClick}
        style={{ color: "green", fontSize: "20px" }}
      >
        edit
      </i>
    </Tooltip>
  );
};

export default EditGridIcon;
