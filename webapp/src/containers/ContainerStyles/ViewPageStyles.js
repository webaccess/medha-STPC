import { makeStyles } from "@material-ui/core/styles";
import noImageIcon from "../../assets/images/no-image-icon.png";
const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%"
  },
  formgrid: {
    marginTop: theme.spacing(0),
    alignItems: "center",
    marginBottom: "10px"
  },
  MarginBottom: {
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
  btnspace: {
    padding: "20px 18px 20px"
  },
  /**Css for streams section */
  btnspaceadd: {
    padding: "0px 15px 15px"
  },
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
    boxShadow: "none !important"
  },
  streamcardcontent: {
    boxShadow: "none",
    marginBottom: "15px",
    borderRadius: "0px"
  },
  CssLabelStyling: {
    position: "absolute",
    top: "-8px",
    backgroundColor: "#fff"
  },
  /**Css for streams section ends here*/
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
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
    width: "50%",
    height: "200px",
    objectFit: "contain",
    backgroundColor: "#666666",
    marginLeft: "33%",
    borderRadius: "50%"
  },
  MakeElementCenter: {
    display: "flex",
    justifyContent: "center"
  },
  AvatarImage: {
    height: "180px",
    width: "180px",
    margin: "20px",
    backgroundColor: "#BDBDBD"
  }
}));
export default useStyles;
