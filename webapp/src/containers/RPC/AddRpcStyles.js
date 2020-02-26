import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  button: {
    marginTop: "25px",
    marginLeft: "75px"
  },
  align: {
    marginLeft: "250px"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  filterOptionsMargin: {
    marginTop: theme.spacing(3)
  }
}));

export default useStyles;
