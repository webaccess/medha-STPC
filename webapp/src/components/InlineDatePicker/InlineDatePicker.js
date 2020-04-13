import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import customTheme from "./InlineDatePickerStyles";

function InlineDatePickerDemo(props) {
  return (
    <MuiThemeProvider theme={customTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          autoOk
          disableToolbar
          variant="inline"
          inputVariant="outlined"
          format="dd/MM/yyyy"
          //margin="normal"
          id="date-picker-inline"
          label={props.label}
          value={props.value}
          onChange={props.onChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
}

export default InlineDatePickerDemo;
