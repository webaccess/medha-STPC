import React from "react";
import { Tooltip } from "@material-ui/core";

const EditGridIcon = props => {
  return (
    <Tooltip title={props.title ? props.title : "Edit"} placement="top">
      <i
        className="material-icons"
        id={props.id}
        userId={props.userId}
        value={props.value}
        onClick={props.disabled ? null : props.onClick}
        style={
          props.disabled
            ? { color: "#8C8C8C", fontSize: "20px" }
            : { color: "green", fontSize: "20px" }
        }
      >
        edit
      </i>
    </Tooltip>
  );
};

export default EditGridIcon;
