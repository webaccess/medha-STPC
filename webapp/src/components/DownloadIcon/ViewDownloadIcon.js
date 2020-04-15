import React from "react";
import { Tooltip } from "@material-ui/core";

const ViewDownloadIcon = props => {
  return (
    <Tooltip title={props.title} placement="top">
      <i
        className="material-icons"
        id={props.id}
        value={props.value}
        style={{ color: "green", fontSize: "23px" }}
        onClick={props.onClick}
      >
        get_app
      </i>
    </Tooltip>
  );
};

export default ViewDownloadIcon;
