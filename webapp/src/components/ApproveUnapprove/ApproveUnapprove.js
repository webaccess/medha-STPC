import React from "react";
import { Tooltip } from "@material-ui/core";

const ApproveUnapprove = props => {
  return (
    <Tooltip title={props.isApproved ? "Unapprove" : "Approve"} placement="top">
      {props.isApproved ? (
        <i
          className="material-icons"
          id={props.id}
          value={props.value}
          onClick={props.onClick}
          style={{ color: "#5a6659", fontSize: "20px" }}
        >
          clear
        </i>
      ) : (
        <i
          className="material-icons"
          id={props.id}
          value={props.value}
          onClick={props.onClick}
          style={{ color: "green", fontSize: "20px" }}
        >
          done
        </i>
      )}
    </Tooltip>
  );
};

export default ApproveUnapprove;
