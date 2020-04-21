import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
  Hidden,
  CardMedia,
  Paper,
  Icon,
  CardContent,
  useMediaQuery,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Collapse,
  CircularProgress,
  Backdrop
} from "@material-ui/core";
import * as routeConstants from "../../constants/RouteConstants";
import { Redirect } from "../../../node_modules/react-router-dom";
import * as authPageConstants from "../../constants/AuthPageConstants.js";
import Logo from "../../components/Logo/Logo.js";
import useStyles from "../OTP/OTPstyles.js";
import GreenButton from "../../components/GreenButton/GreenButton.js";
import form from "./OTPform.json";
import validateInput from "../../components/Validation/Validation.js";
import YellowButton from "../../components/YellowButton/YellowButton.js";
import * as serviceProvider from "../../api/Axios.js";
import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import axios from "axios";
import CardIcon from "../../components/Card/CardIcon";
import image from "../../assets/images/login-img.png";

const VerifyOtp = props => {
  let history = useHistory();

  const [otp, setotp] = useState("");
  const classes = useStyles();
  const [error, setError] = useState("");
  const { layout: Layout } = props;
  const [click, setclick] = useState(false);

  const validate = () => {
    const error = validateInput(otp, form["otp"]["validations"]);
    console.log(error);
    if (error[0]) setError(error);
    else {
      axios
        .post(
          strapiApiConstants.STRAPI_DB_URL +
            strapiApiConstants.STRAPI_CHECK_OTP,
          { otp: otp, contact_number: props.location.state.contactNumber }
        )
        .then(res => {
          console.log("IN then");
          history.push(routeConstants.NEW_REGISTRATION_URL, {
            otp: otp,
            contactNumber: props.location.state.contactNumber
          });
        })
        .catch(err => {
          console.log(err.response.status);
          if (err.response.status === 403) {
            history.push(routeConstants.REQUIRED_CONFORMATION);
          } else if (err.response.status === 400) setError("Invalid OTP");
        });
    }
  };

  const requestOtpAgain = () => {
    axios
      .post(
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_REQUEST_STUDENT_OTP,
        { contact_number: props.location.state.contactNumber }
      )
      .then(res => {
        setclick(true);
        console.log(click);
      })
      .catch(err => {
        console.log(err);
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
        {console.log(props)}
        {/* <div className={classes.paper}>
          <Card className={classes.paper}>
            <CardContent style={{ margin: "30px" }}>
              <Typography
                component="h1"
                variant="h5"
                style={{ marginTop: ".9rem" }}
              >
                {authPageConstants.REGISTER}
              </Typography>
              <div className={classes.form}>
                <Grid container spacing={3}>
                  <Grid item md={12}>
                    <TextField
                      label="One Time Password"
                      name="otp"
                      value={otp}
                      error={error[0] ? true : false}
                      variant="outlined"
                      fullWidth
                      helperText={error ? error : null}
                      onChange={(event) => {
                        if (otp.length > 0) setError("");
                        setotp(event.target.value);
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item>
                    <YellowButton
                      color="Secondary"
                      mfullWidth
                      variant="contained"
                      size="large"
                      disabled={click}
                      onClick={() => {
                        requestOtpAgain();
                      }}
                    >
                      {authPageConstants.RESEND_OTP_BUTTON}
                    </YellowButton>
                  </Grid>

                  <Grid item>
                    <GreenButton
                      color="primary"
                      type="submit"
                      mfullWidth
                      variant="contained"
                      size="large"
                      greenButtonChecker={true}
                      onClick={() => {
                        validate();
                      }}
                    >
                      {authPageConstants.VERIFY_OTP_BUTTON}
                    </GreenButton>
                  </Grid>
                </Grid>
              </div>
            </CardContent>
            <CardMedia
              style={{
                width: "500px",
                height: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
              image={image}
              title="Live from space album cover"
            />
          </Card>
        </div> */}

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
                        label="One Time Password"
                        name="otp"
                        value={otp}
                        error={error[0] ? true : false}
                        variant="outlined"
                        fullWidth
                        helperText={error ? error : null}
                        onChange={event => {
                          if (otp.length > 0) setError("");
                          setotp(event.target.value);
                        }}
                      />
                      <Link
                        href="javascript:void(0);"
                        variant="body2"
                        className={classes.linkColor}
                        onClick={requestOtpAgain}
                      >
                        {authPageConstants.RESEND_OTP_BUTTON}
                      </Link>
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
                      {/* <Backdrop
                        className={classes.backdrop}
                        open={openBackdrop}
                      >
                        <CircularProgress color="inherit" />
                      </Backdrop> */}
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
