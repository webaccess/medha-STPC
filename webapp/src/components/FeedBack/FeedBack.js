import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const FeedBack = props => {
  return (
    <Tooltip
      title={
        props.isGiveFeedback ? (
          <React.Fragment>
            <Typography color="inherit">Give FeedBack</Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography color="inherit">View FeedBack</Typography>
          </React.Fragment>
        )
      }
      placement="top"
    >
      <i
        className="material-icons"
        id={props.id}
        value={props.value}
        onClick={props.onClick}
        style={{ color: "green", fontSize: "20px" }}
      >
        feedback
      </i>
    </Tooltip>
  );
};

export default FeedBack;
