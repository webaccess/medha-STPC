import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Typography,
  Grid,
  Button,
  CardContent,
  Card,
  CardMedia,
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
import image from "../../assets/images/login-img.png";

const VerifyOtp = (props) => {
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
        .then((res) => {
          console.log("IN then");
          history.push(routeConstants.NEW_REGISTRATION_URL, {
            otp: otp,
            contactNumber: props.location.state.contactNumber,
          });
        })
        .catch((err) => {
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
      .then((res) => {
        setclick(true);
        console.log(click);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (!props.location.state) {
    return (
      <Redirect
        to={{
          pathname: routeConstants.SIGN_IN_URL,
        }}
      />
    );
  } else {
    return (
      <Layout>
        {console.log(props)}
        <div className={classes.paper}>
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
        </div>
      </Layout>
      // <div>
      //   <button
      //     onClick={() => {
      //       history.push("/registration");
      //     }}
      //   >
      //     registration page
      //   </button>
      // </div>
    );
  }
};
export default VerifyOtp;
