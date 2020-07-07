import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "../OTP/OTPstyles.js";
import validateInput from "../../components/Validation/Validation.js";
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
  CardMedia,
  Paper,
  Icon,
  CardContent,
  Hidden
} from "@material-ui/core";
import * as authPageConstants from "../../constants/AuthPageConstants.js";
import form from "./OTPform.json";
import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import axios from "axios";
import image from "../../assets/images/login-img.png";
import CardIcon from "../../components/Card/CardIcon";
import * as routeConstants from "../../constants/RouteConstants";
import LoaderContext from "../../context/LoaderContext.js";

const RequestOtp = props => {
  let history = useHistory();

  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);

  const classes = useStyles();
  const { layout: Layout } = props;
  const validate = () => {
    setLoaderStatus(true);
    const error = validateInput(
      contactNumber,
      form["contactNumber"]["validations"]
    );
    console.log(error);
    if (error[0]) setError(error);
    else {
      postCall();
    }
  };

  const postCall = () => {
    axios
      .post(
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_REQUEST_STUDENT_OTP,
        { contact_number: contactNumber }
      )
      .then(res => {
        history.push("/verifyotp", { contactNumber: contactNumber });
        setLoaderStatus(false);
      })
      .catch(err => {
        console.log(err);
        setLoaderStatus(false);
      });
  };

  return (
    <Layout>
      <div className={classes.masterlogin2}>
        <div className={classes.masterlogin1}>
          <div className={classes.masterlogin}>
            <Paper className={classes.rootDesktop}>
              <CardContent>
                <CssBaseline />
                <div className={classes.paper}>
                  <div className={classes.signin_header}>
                    <div className={classes.loginlock}>
                      <CardIcon>
                        <Icon>lock</Icon>
                      </CardIcon>
                    </div>
                    <Typography
                      className={classes.signin}
                      component="h1"
                      variant="h5"
                      style={{ fontWeight: "700" }}
                    >
                      {authPageConstants.REGISTER}
                    </Typography>
                  </div>

                  <React.Fragment>
                    <Typography
                      component="h5"
                      variant="subtitle2"
                      style={{ marginTop: ".9rem", marginBottom: ".9rem" }}
                    >
                      {authPageConstants.MOBILE_NUMBER_ALERT}
                    </Typography>
                    <TextField
                      label="Contact Number"
                      name="contactnumber"
                      value={contactNumber}
                      variant="outlined"
                      fullWidth
                      error={error[0] ? true : false}
                      required
                      helperText={error ? error : null}
                      onChange={event => {
                        if (contactNumber.length === 9) setError("");
                        setContactNumber(event.target.value);
                      }}
                    />
                    <Button
                      color="primary"
                      type="submit"
                      fullWidth
                      variant="contained"
                      className={classes.submit}
                      onClick={() => {
                        validate();
                      }}
                    >
                      {authPageConstants.SEND_OTP_BUTTON}
                    </Button>
                  </React.Fragment>
                  <Grid container>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                      <Link
                        href={routeConstants.SIGN_IN_URL}
                        variant="body2"
                        className={classes.linkColor}
                      >
                        {authPageConstants.BACK_TO_LOGIN_TEXT}
                      </Link>
                    </Grid>
                  </Grid>
                </div>
              </CardContent>

              <Hidden mdDown>
                <CardMedia
                  className={classes.cover}
                  image={image}
                  title="UPSTPC"
                />
              </Hidden>
            </Paper>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default RequestOtp;
