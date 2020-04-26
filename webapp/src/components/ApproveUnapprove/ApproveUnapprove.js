import React from "react";
import { Tooltip } from "@material-ui/core";

const ApproveUnapprove = (props) => {
  return (
    <Tooltip title={props.isApproved ? "Unapprove" : "Approve"} placement="top">
      <i
        className="material-icons"
        id={props.id}
        value={props.value}
        onClick={props.onClick}
        style={
          props.isApproved
            ? { color: "green", fontSize: "20px" }
            : { color: "#8C8C8C", fontSize: "20px" }
        }
      >
        done
      </i>
    </Tooltip>
  );
};

export default ApproveUnapprove;
