import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

const AddStudentIcon = props => {
  return (
    <Tooltip
      title={
        <React.Fragment>
          <Typography color="inherit">Add Student</Typography>
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
        person_add
      </i>
    </Tooltip>
  );
};

export default AddStudentIcon;
