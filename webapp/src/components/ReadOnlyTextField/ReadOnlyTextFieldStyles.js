import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  cssLabel: {
    "&$cssFocused": {
      color: `#000 !important`
    }
  },
  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderWidth: "thin",
      borderColor: `rgba(0, 0, 0, 0.23) !important`
    }
  },
  cssFocused: {},
  notchedOutline: {}
}));

export default useStyles;
