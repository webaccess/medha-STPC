import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const ToolTipComponent = props => {
  return (
    <Tooltip
      title={
        <React.Fragment>
          <Typography color="inherit">{props.data}</Typography>
        </React.Fragment>
      }
      placement="top"
    >
      <div>{props.data}</div>
    </Tooltip>
  );
};

export default ToolTipComponent;
