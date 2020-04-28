import { createMuiTheme } from "@material-ui/core";

const customTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "black"
      }
    },
    MuiButton: {
      textPrimary: {
        color: "#000"
      }
    },
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
    },
    MuiOutlinedInput: {
      input: {
        padding: "17.5px 14px"
      }
    },
    MuiInputBase: {
      root: {
        fontSize: "14px"
      }
    },
    MuiSvgIcon: {
      root: {
        fontSize: "20px",
        paddingTop: "5px"
      }
    },
    MuiFormLabel: {
      root: {
        fontSize: "14px",
        color: "#263238"
      }
    }
  }
});

export default customTheme;
