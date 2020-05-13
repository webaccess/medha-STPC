import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const PastEventStatus = props => {
  return (
    <Tooltip
      title={
        props.style ? (
          <React.Fragment>
            <Typography color="inherit">Attended</Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography color="inherit">Missed</Typography>
          </React.Fragment>
        )
      }
      placement="top"
    >
      <i
        className="material-icons"
        style={
          props.style
            ? { color: "green", fontSize: "23px" }
            : { color: "grey", fontSize: "23px" }
        }
      >
        how_to_reg
      </i>
    </Tooltip>
  );
};

export default PastEventStatus;
