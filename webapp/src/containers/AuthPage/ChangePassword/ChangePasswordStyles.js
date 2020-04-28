import { makeStyles } from "@material-ui/core/styles";

const ChangePasswordStyles = makeStyles((theme) => ({
  margin: {
    marginTop: theme.spacing(2),
  },
  cssLabel: {
    color: "#666666",
  },
  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: `#dedede !important`,
    },
  },
  cssFocused: {
    borderColor: `#dedede !important`,
    color: `#666666 !important`,
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "#666 !important",
  },
}));

export default ChangePasswordStyles;
