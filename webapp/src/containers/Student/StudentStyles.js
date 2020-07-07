import { makeStyles } from "@material-ui/core/styles";
import noImageIcon from "../../assets/images/no-image-icon.png";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  elementroot: {
    [theme.breakpoints.up("lg")]: {
      width: "30%"
    }
  },
  btnspace: {
    padding: "20px 18px 20px"
  },
  formgrid: {
    marginTop: theme.spacing(0),
    alignItems: "center",
    marginBottom: "10px"
  },
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

  FlexGrow: {
    flexGrow: 1,
    width: "30%"
  },

  inputFileForDocument: {
    display: "none"
  },
  InputFileButtonForDocument: {
    color: "#353535",
    backgroundColor: "#f6c80a",
    fontSize: "13px",
    fontWeight: "700",
    marginLeft: "16px",
    width: "85%",
    borderRadius: "0 !important",
    "&:hover,&:focus": {
      color: "#353535",
      backgroundColor: "#f6c80a"
    }
  },
  DefaultNoImageForDocument: {
    width: "85%",
    height: "150px",
    objectFit: "contain",
    backgroundColor: "#666666",
    marginLeft: "16px",
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat !important",
    backgroundImage: `url(${noImageIcon})`,
    backgroundSize: "65px"
  },
  UploadImageForDocument: {
    width: "85%",
    height: "150px",
    objectFit: "contain",
    backgroundColor: "#666666",
    marginLeft: "16px"
  },
  CardActionGrid: {
    backgroundColor: "#EEEEEE"
  }
}));

export default useStyles;
