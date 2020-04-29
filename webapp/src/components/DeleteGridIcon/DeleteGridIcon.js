import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const DeleteGridIcon = props => {
  return (
    <Tooltip
      title={
        <React.Fragment>
          <Typography color="inherit">Delete</Typography>
        </React.Fragment>
      }
      placement="top"
    >
      <i
        className="material-icons"
        id={props.id}
        userId={props.userId}
        value={props.value}
        onClick={props.disabled ? null : props.onClick}
        style={
          props.disabled
            ? { color: "#8C8C8C", fontSize: "20px" }
            : { color: "red", fontSize: "20px" }
        }
      >
        delete_outline
      </i>
    </Tooltip>
  );
};

export default DeleteGridIcon;
