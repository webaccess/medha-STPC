import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import customTheme from "./InlineDatePickerStyles";

function InlineDatePicker(props) {
  return (
    <MuiThemeProvider theme={customTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          autoOk
          // disableToolbar
          variant="inline"
          inputVariant="outlined"
          format="dd/MM/yyyy"
          id={props.id}
          color={props.color}
          label={props.label}
          value={props.value}
          error={props.error}
          placeholder={props.placeholder}
          helperText={props.helperText}
          onChange={props.onChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
}

export default InlineDatePicker;
