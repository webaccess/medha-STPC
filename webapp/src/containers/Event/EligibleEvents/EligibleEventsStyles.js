import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    display: "flex",
    marginBottom: theme.spacing(1),
    "& h4": {
      flex: "1",
      fontWeight: "700",
    },
  },
  defaultMargin: {
    margin: "2%",
  },
  cardHeight: {
    height: "600px",
  },
  imageDiv: {
    width: "100%",
    height: "200px",
    display: "flex",
    backgroundColor: "white",
    margin: "auto",
  },

  titleDiv: {
    width: "100%",
    height: "50px",
  },
  successTickDiv: {
    width: "100%",
    height: "50px",
  },
  contentDiv: {
    width: "100%",
    height: "200px",
  },
  buttonsDiv: {
    width: "100%",
    height: "50px",
  },
  buttonAlign: {
    textAlign: "center",
  },
  EligibleEventsStyling: {
    backgroundSize: "100%",
    backgroundColor: "#666",
    height: "200px",
    marginBottom: "8px",
  },
  NoEventsStyling: {
    backgroundSize: "90px",
    backgroundColor: "#666",
    height: "200px",
    marginBottom: "8px",
  },
  BoxPadding: {
    padding: "24px",
  },
  TextAlign: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: "14px",
    marginBottom: "30px",
    marginTop: "12px",
  },
  divider: {
    marginTop: "15px",
    marginBottom: "15px",
  },
  ReadMoreButton: {
    backgroundColor: "#f6c80a",
    color: "#353535",
    borderRadius: "3px",
    textTransform: "capitalize",
    fontSize: "13px",
    fontWeight: "700",
    borderRadius: "0 !important",
    margin: "13px",
    "&:hover": {
      background: "#000",
      color: "#fff",
    },
  },
  CardHeaderFooter: {
    backgroundColor: "#EEEEEE",
  },
  IconButton: {
    padding: "6px",
  },
  DivHeight: {
    height: "75px",
  },
}));
export default useStyles;
