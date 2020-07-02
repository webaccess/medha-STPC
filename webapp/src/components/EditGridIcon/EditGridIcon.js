import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const EditGridIcon = props => {
  return (
    <Tooltip
      id={"editGridIconToolTip"}
      title={
        props.title ? (
          <React.Fragment>
            <Typography id="editGridIconTypgraphy" color="inherit">
              {props.title}
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography id="editGridIconTypgraphy" color="inherit">
              Edit
            </Typography>
          </React.Fragment>
        )
      }
      placement="top"
    >
      <i
        className="material-icons"
        id={props.id}
        userId={props.userId}
        contactId={props.contactId}
        value={props.value}
        onClick={props.disabled ? null : props.onClick}
        style={
          props.disabled
            ? { color: "#8C8C8C", fontSize: "20px" }
            : { color: "green", fontSize: "20px" }
        }
      >
        edit
      </i>
    </Tooltip>
  );
};

export default EditGridIcon;
