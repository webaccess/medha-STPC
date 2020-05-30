import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const FeedBack = props => {
  if (props.isGiveFeedback) {
    return (
      <Tooltip
        title={
          <React.Fragment>
            <Typography color="inherit">Give FeedBack</Typography>
          </React.Fragment>
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
          rate_review
        </i>
      </Tooltip>
    );
  } else if (props.isEditFeedback) {
    return (
      <Tooltip
        title={
          <React.Fragment>
            <Typography color="inherit">Edit FeedBack</Typography>
          </React.Fragment>
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
          rate_review
        </i>
      </Tooltip>
    );
  } else if (props.cannotGiveFeedback) {
    return (
      <Tooltip
        title={
          <React.Fragment>
            <Typography color="inherit">Cannot give feedback</Typography>
          </React.Fragment>
        }
        placement="top"
      >
        <i
          className="material-icons"
          id={props.id}
          value={props.value}
          onClick={null}
          disabled={true}
          style={{ color: "gray", fontSize: "20px" }}
        >
          rate_review
        </i>
      </Tooltip>
    );
  } else if (props.isViewFeedback) {
    if (props.feedbackNotAvailable) {
      return (
        <Tooltip
          title={
            <React.Fragment>
              <Typography color="inherit">{props.message}</Typography>
            </React.Fragment>
          }
          placement="top"
        >
          <i
            className="material-icons"
            id={props.id}
            value={props.value}
            onClick={null}
            style={{ color: "gray", fontSize: "20px" }}
          >
            feedback
          </i>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip
          title={
            <React.Fragment>
              <Typography color="inherit">{props.message}</Typography>
            </React.Fragment>
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
    }
  }
};

export default FeedBack;
