import React from "react";
import { TextField } from "@material-ui/core";
import useStyles from "./ReadOnlyTextFieldStyles";

const ReadOnlyTextField = props => {
  const classes = useStyles();
  return (
    <TextField
      id={props.id}
      label={props.label}
      defaultValue={props.defaultValue}
      multiline
      fullWidth
      variant="outlined"
      InputLabelProps={{
        shrink: true,
        classes: {
          root: classes.cssLabel,
          focused: classes.cssFocused
        }
      }}
      InputProps={{
        readOnly: true,
        classes: {
          root: classes.cssOutlinedInput,
          focused: classes.cssFocused,
          notchedOutline: classes.notchedOutline
        }
      }}
    />
  );
};

export default ReadOnlyTextField;
