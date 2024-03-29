import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const UploadIcon = props => {
  return (
    <Tooltip
      id={"title-id"}
      title={
        <React.Fragment>
          <Typography color="inherit">{props.title}</Typography>
        </React.Fragment>
      }
      placement="top"
    >
      <i
        className="material-icons"
        id={props.id}
        value={props.value}
        style={{ color: "green", fontSize: "20px" }}
        onClick={props.onClick}
      >
        cloud_upload
      </i>
    </Tooltip>
  );
};

export default UploadIcon;
