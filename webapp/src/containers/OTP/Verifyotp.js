import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
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
  CardContent
} from "@material-ui/core";
import * as routeConstants from "../../constants/RouteConstants";
import { Redirect } from "../../../node_modules/react-router-dom";
import * as authPageConstants from "../../constants/AuthPageConstants.js";

import useStyles from "../OTP/OTPstyles.js";

import form from "./OTPform.json";
import validateInput from "../../components/Validation/Validation.js";
import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import axios from "axios";
import CardIcon from "../../components/Card/CardIcon";
import image from "../../assets/images/login-img.png";
import LoaderContext from "../../context/LoaderContext";

const VerifyOtp = props => {
  let history = useHistory();

  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);

  const [otp, setotp] = useState("");
  const classes = useStyles();
  const [error, setError] = useState("");
  const { layout: Layout } = props;
  const [click, setclick] = useState(false);

  const validate = () => {
    setLoaderStatus(true);
    const error = validateInput(otp, form["otp"]["validations"]);
    console.log(error);
    if (error[0]) {
      setError(error);
      setLoaderStatus(false);
    } else {
      axios
        .post(
          strapiApiConstants.STRAPI_DB_URL +
            strapiApiConstants.STRAPI_CHECK_OTP,
          { otp: otp, contact_number: props.location.state.contactNumber }
        )
        .then(res => {
          history.push(routeConstants.NEW_REGISTRATION_URL, {
            otp: otp,
            contactNumber: props.location.state.contactNumber,
            from: routeConstants.VERIFY_OTP
          });
          setLoaderStatus(false);
        })
        .catch(err => {
          if (err.response.data.message === "User already registered") {
            setError("User Already Registered");
          } else if (err.response.data.message === "OTP is invalid")
            setError("Invalid OTP");

          setLoaderStatus(false);
        });
    }
  };

  const requestOtpAgain = () => {
    setLoaderStatus(true);
    axios
      .post(
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_REQUEST_STUDENT_OTP,
        { contact_number: props.location.state.contactNumber }
      )
      .then(res => {
        setclick(true);
        setLoaderStatus(false);
      })
      .catch(err => {
        console.log(err);
        setLoaderStatus(false);
      });
  };
  if (!props.location.state) {
    return (
      <Redirect
        to={{
          pathname: routeConstants.SIGN_IN_URL
        }}
      />
    );
  } else {
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
                        {authPageConstants.OTP_ALERT}{" "}
                        {props.location.state.contactNumber}
                      </Typography>
                      <TextField
                        label="One Time Password"
                        name="otp"
                        value={otp}
                        style={{ marginRight: "175px" }}
                        error={error[0] ? true : false}
                        variant="outlined"
                        fullWidth
                        helperText={error ? error : null}
                        onChange={event => {
                          if (otp.length > 0) setError("");
                          setotp(event.target.value);
                        }}
                      />
                      {click ? null : (
                        <Link
                          href="javascript:void(0);"
                          variant="body2"
                          className={classes.linkColor}
                          onClick={requestOtpAgain}
                        >
                          {authPageConstants.RESEND_OTP_BUTTON}
                        </Link>
                      )}
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
                        Verify OTP
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

                <CardMedia
                  className={classes.cover}
                  image={image}
                  title="Live from space album cover"
                />
              </Paper>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
};
export default VerifyOtp;
