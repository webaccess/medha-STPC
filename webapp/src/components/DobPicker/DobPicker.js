import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import customTheme from "./DobPickerStyles";

function DobPicker(props) {
  return (
    <MuiThemeProvider theme={customTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          autoOk
          // disableToolbar
          variant="inline"
          inputVariant="outlined"
          format="dd/MM/yyyy"
          //margin="normal"
          className={props.classes}
          id={props.id}
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

export default DobPicker;
