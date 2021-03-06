import React from "react";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import customTheme from "./CustomDateTimePickerStyles";

const CustomDateTimePicker = props => {
  return (
    <MuiThemeProvider theme={customTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          label={props.label}
          inputVariant="outlined"
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          helperText={props.helperText}
          {...props}
          fullWidth
        />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

export default CustomDateTimePicker;
