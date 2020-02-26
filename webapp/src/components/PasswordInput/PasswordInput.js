import React from "react";
import { InputAdornment, TextField } from "@material-ui/core";
import { RemoveRedEye } from "@material-ui/icons";

const input = props => (
  <TextField
    autoFocus={props.autoFocus ? props.autoFocus : false}
    className={props.className}
    id={props.id}
    label={props.label}
    name={props.name}
    onChange={props.onChange}
    value={props.value}
    variant={props.variant ? props.variant : "standard"}
    error={props.error ? props.error : false}
    placeholder={props.placeholder}
    type={props.type}
    helperText={props.helperText}
    inputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <RemoveRedEye />
        </InputAdornment>
      )
    }}
  />
);

export default input;
