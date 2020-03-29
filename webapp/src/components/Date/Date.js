import React from "react";
import useStyles from "./DateStyles";
import TextField from "@material-ui/core/TextField";
//Date Field for date filter
export default function DatePickers(props) {
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        id={props.id}
        label={props.label}
        type="date"
        name={props.name}
        variant="outlined"
        placeholder={props.placeholder}
        onChange={props.onChange}
        defaultValue={props.value}
        InputLabelProps={{
          shrink: true
        }}
        fullWidth
      />
    </form>
  );
}
