import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const ThumbsUpDownIcon = props => {
  return (
    <Tooltip
      title={
        props.title ? (
          <React.Fragment>
            <Typography color="inherit">{props.title}</Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography color="inherit">Add Feedback</Typography>
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
        thumbs_up_down
      </i>
    </Tooltip>
  );
};

export default ThumbsUpDownIcon;
