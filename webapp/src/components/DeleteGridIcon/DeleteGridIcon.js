import React from "react";
import { Tooltip } from "@material-ui/core";

const DeleteGridIcon = props => {
  return (
    <Tooltip title="Delete" placement="top">
      <i
        className="material-icons"
        id={props.id}
        value={props.value}
        onClick={props.onClick}
        style={{ color: "red", fontSize: "23px" }}
      >
        delete_outline
      </i>
    </Tooltip>
  );
};

export default DeleteGridIcon;
