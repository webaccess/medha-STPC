import React from "react";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import customTheme from "./CustomDateTimePickerStyles";

const CustomDateTimePicker = props => {
  return (
    <MuiThemeProvider theme={customTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          label={props.label}
          inputVariant="outlined"
          value={props.value}
          onChange={props.onChange}
          helperText={props.helperText}
        />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

export default CustomDateTimePicker;
