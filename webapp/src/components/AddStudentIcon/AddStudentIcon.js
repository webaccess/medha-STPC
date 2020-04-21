import React from "react";
import { Tooltip } from "@material-ui/core";

const AddStudentIcon = props => {
  return (
    <Tooltip title="Add Student" placement="top">
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
