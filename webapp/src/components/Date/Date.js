import React from "react";
import useStyles from "./DateStyles";
import TextField from "@material-ui/core/TextField";

export default function DatePickers(props) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        id={props.id}
        label={props.label}
        type="date"
        variant="outlined"
        placeholder={props.placeholder}
        className={classes.textField}
        onChange={props.onChange}
        value={props.value}
        InputLabelProps={{
          shrink: true
        }}
      />
    </form>
  );
}
