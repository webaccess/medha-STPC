import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const ViewGridIcon = props => {
  return (
    <Tooltip
      id={"title-id"}
      title={
        props.title ? (
          <React.Fragment>
            <Typography color="inherit">{props.title}</Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography color="inherit">View Student List</Typography>
          </React.Fragment>
        )
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
        group
      </i>
    </Tooltip>
  );
};

export default ViewGridIcon;
