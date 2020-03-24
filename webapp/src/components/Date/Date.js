import React from "react";
import useStyles from "./DateStyles";
import TextField from "@material-ui/core/TextField";

export default function DatePickers(props) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        //id={props.id}
        label={props.label}
        type="date"
        variant="outlined"
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
      />
    </form>
  );
}
