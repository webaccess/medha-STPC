import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const CrossGridIcon = props => {
  return (
    <Tooltip
      title={
        <React.Fragment>
          <Typography color="inherit">Unmark attendance</Typography>
        </React.Fragment>
      }
      placement="top"
    >
      <i
        className="material-icons"
        id={props.id}
        value={props.name}
        onClick={props.onClick}
        style={{
          color: "#8C8C8C",
          fontSize: "23px",
          cursor: "pointer"
        }}
      >
        clear
      </i>
    </Tooltip>
  );
};

export default CrossGridIcon;
