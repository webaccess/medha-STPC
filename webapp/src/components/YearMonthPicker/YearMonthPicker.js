import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import customTheme from "./YearMonthPickerStyles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

function YearMonthPicker(props) {
  return (
    <MuiThemeProvider theme={customTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          inputVariant="outlined"
          views={["year"]}
          label={props.label}
          variant="outlined"
          value={props.value}
          onChange={props.onChange}
        />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
}

export default YearMonthPicker;
