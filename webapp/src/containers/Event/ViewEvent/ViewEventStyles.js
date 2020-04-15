import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  btnspace: {
    padding: "15px 18px 50px",
  },
  formgrid: {
    marginTop: theme.spacing(0),
    alignItems: "center",
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
  imageDiv: {
    width: "100%",
    height: "200px",
    display: "flex",
    backgroundColor: "white",
    margin: "auto",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  ViewEventImageStyling: {
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
  MarginTop: {
    marginTop: "24px",
  },
}));
export default useStyles;
