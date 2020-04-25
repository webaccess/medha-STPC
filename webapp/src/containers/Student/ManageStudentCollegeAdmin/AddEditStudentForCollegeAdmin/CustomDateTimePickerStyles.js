import { createMuiTheme } from "@material-ui/core";

const customTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "black"
      }
    },
    MuiInputBase: {
      root: {
        fontSize: "14px"
      }
    },
    MuiFormLabel: {
      root: {
        color: "#000"
      }
    },
    MuiButton: {
      textPrimary: {
        color: "#000"
      }
    },
    MuiPickersClock: {
      pin: {
        backgroundColor: "#000"
      }
    },
    MuiPickersClockPointer: {
      pointer: {
        backgroundColor: "#000"
      },
      thumb: {
        backgroundColor: "#000",
        border: "14px solid #000"
      },
      noPoint: {
        backgroundColor: "#000"
      }
    },
    MuiPickersClockNumber: {
      clockNumberSelected: {
        backgroundColor: "#000"
      }
    },

    MuiPickerDTTabs: { tabs: { backgroundColor: "black" } },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: "#000",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#8E8E8E",
          color: "#FFF"
        }
      },
      dayDisabled: {
        color: "light-gray"
      },
      current: {
        color: ""
      }
    }
  }
});

export default customTheme;
