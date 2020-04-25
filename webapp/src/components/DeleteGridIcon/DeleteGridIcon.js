import React from "react";
import { Tooltip } from "@material-ui/core";

const DeleteGridIcon = props => {
  return (
    <Tooltip title="Delete" placement="top">
      <i
        className="material-icons"
        id={props.id}
        userId={props.userId}
        value={props.value}
        onClick={props.onClick}
        style={{ color: "red", fontSize: "20px" }}
      >
        delete_outline
      </i>
    </Tooltip>
  );
};

export default DeleteGridIcon;
