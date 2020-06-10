import { makeStyles } from "@material-ui/core/styles";
import noImageIcon from "../../assets/images/no-image-icon.png";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  elementroot: {
    width: "30%"
  },
  btnspace: {
    padding: "15px 18px 50px"
  },
  formgrid: {
    marginTop: theme.spacing(2),
    alignItems: "center"
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
  }
}));

export default useStyles;
