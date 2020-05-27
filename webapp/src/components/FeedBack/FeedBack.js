import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const FeedBack = props => {
  if (props.isGiveFeedback) {
    return (
      <Tooltip
        title={
          props.isdisabled ? (
            <React.Fragment>
              <Typography color="inherit">Cannot give feedback</Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography color="inherit">Give FeedBack</Typography>
            </React.Fragment>
          )
        }
        placement="top"
      >
        <i
          className="material-icons"
          id={props.id}
          value={props.value}
          onClick={props.isdisabled ? null : props.onClick}
          disabled={props.isdisabled ? true : false}
          style={
            props.isdisabled
              ? { color: "gray", fontSize: "20px" }
              : { color: "green", fontSize: "20px" }
          }
        >
          feedback
        </i>
      </Tooltip>
    );
  } else if (props.isViewFeedback) {
    return (
      <Tooltip
        title={
          props.isdisabled ? (
            <React.Fragment>
              <Typography color="inherit">No FeedBack</Typography>
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
          onClick={props.isdisabled ? null : props.onClick}
          disabled={props.isdisabled ? true : false}
          style={
            props.isdisabled
              ? { color: "gray", fontSize: "20px" }
              : { color: "green", fontSize: "20px" }
          }
        >
          feedback
        </i>
      </Tooltip>
    );
  }
};

export default FeedBack;
