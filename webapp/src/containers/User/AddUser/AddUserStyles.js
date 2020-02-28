import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
  },
  formgrid:{
    marginTop: theme.spacing(4),
    alignItems: 'center',
    marginLeft: theme.spacing(4)
  },
  title:{
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2)
  }
}));

export default useStyles;
