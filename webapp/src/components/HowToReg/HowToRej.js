import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const HowToReg = props => {
  return (
    <Tooltip
      id="howToReg-id"
      title={
        props.style ? (
          <React.Fragment>
            <Typography color="inherit">Absent</Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography color="inherit">Present</Typography>
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

export default HowToReg;
