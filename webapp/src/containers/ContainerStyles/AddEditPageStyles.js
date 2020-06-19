import { makeStyles } from "@material-ui/core/styles";
import noImageIcon from "../../assets/images/no-image-icon.png";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  elementroot: {
    width: "30%"
  },
  DateMargin: {
    marginLeft: "6px"
  },
  linkColor: {
    color: "#21abdc",
    fontSize: "0.8rem",
    textAlign: "right"
  },
  btnspace: {
    padding: "20px 18px 20px"
  },
  formgrid: {
    marginTop: theme.spacing(0),
    alignItems: "center",
    marginBottom: "10px"
  },
  divider: {
    marginTop: "15px",
    marginBottom: "15px"
  },
  title: {
    display: "flex",
    marginBottom: theme.spacing(1),
    "& h4": {
      flex: "1",
      fontWeight: "700"
    }
  },
  CardActionGrid: {
    backgroundColor: "#EEEEEE"
  },
  MarginBottom: {
    marginBottom: "10px"
  },
  /**Css for streams section */
  streamcard: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "15px !important",
    marginTop: "15px",
    marginLeft: "4px",
    position: "relative"
  },
  streamoffer: {
    borderRadius: "0px",
    boxShadow: "none !important",
    "& > :first-child": {
      position: "absolute",
      top: "-8px",
      backgroundColor: "#fff"
    }
  },
  streamcardcontent: {
    boxShadow: "none",
    borderBottom: "1px solid #ccc",
    marginBottom: "15px",
    borderRadius: "0px"
  },
  btnspaceadd: {
    padding: "0px 0px 15px"
  },
  /**End of css for streams */
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  } /**Css for description box section */,
  descriptionBox: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "15px !important",
    position: "relative",
    "& label": {
      position: "absolute",
      top: "-8px",
      backgroundColor: "#fff"
    }
  },
  descriptionBoxError: {
    border: "1px solid red",
    borderRadius: "5px",
    padding: "15px !important",
    position: "relative",
    "& label": {
      position: "absolute",
      top: "-8px",
      backgroundColor: "#fff"
    }
  } /**End of Css for description box section */,
  inputFile: {
    display: "none"
  },
  formgridInputFile: {
    marginTop: theme.spacing(0),
    alignItems: "center",
    marginBottom: "-4px"
  },
  InputFileButton: {
    color: "#353535",
    backgroundColor: "#f6c80a",
    fontSize: "13px",
    fontWeight: "700",
    marginLeft: "18%",
    width: "85%",
    borderRadius: "0 !important",
    "&:hover,&:focus": {
      color: "#353535",
      backgroundColor: "#f6c80a"
    }
  },
  DefaultNoImage: {
    width: "85%",
    height: "150px",
    objectFit: "contain",
    backgroundColor: "#666666",
    marginLeft: "18%",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat !important",
    backgroundImage: `url(${noImageIcon})`,
    backgroundSize: "65px"
  },
  UploadImage: {
    width: "85%",
    height: "150px",
    objectFit: "contain",
    backgroundColor: "#666666",
    marginLeft: "18%"
  },
  date: {
    MuiFormControl: {
      root: { width: "100% !important" }
    }
  }
}));

export default useStyles;
