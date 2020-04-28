import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const ViewGridIcon = props => {
  return (
    <Tooltip
      title={
        <React.Fragment>
          <Typography color="inherit">View</Typography>
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
        view_list
      </i>
    </Tooltip>
  );
};

export default ViewGridIcon;
