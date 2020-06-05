import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const RetryIcon = props => {
  return (
    <Tooltip
      title={
        <React.Fragment>
          <Typography color="inherit">Retry</Typography>
        </React.Fragment>
      }
      placement="top"
    >
      <i
        className="material-icons"
        id={props.id}
        onClick={props.onClick}
        style={{ color: "green", fontSize: "20px" }}
      >
        replay
      </i>
    </Tooltip>
  );
};

export default RetryIcon;
