import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Box, TextField, Typography, Grid } from "@material-ui/core";
import * as authPageConstants from "../../constants/AuthPageConstants.js";
import Logo from "../../components/Logo/Logo.js";
import useStyles from "../OTP/OTPstyles.js";
import Button from "../../components/GreenButton/GreenButton.js";
import form from "./OTPform.json";
import validateInput from "../../components/Validation/Validation.js";

const VerifyOtp = props => {
  let history = useHistory();

  const [otp, setotp] = useState("");
  const classes = useStyles();
  const [error, setError] = useState("");

  const validate = () => {
    const error = validateInput(otp, form["otp"]["validations"]);
    console.log(error);
    if (error[0]) setError(error);
    else history.push("/registration");
  };

  return (
    <Container>
      <div className={classes.paper}>
        <Box mt={1} style={{ backgroundColor: "black" }}>
          <center>
            <Logo />
          </center>
        </Box>
        <Typography component="h1" variant="h5" style={{ marginTop: ".9rem" }}>
          {authPageConstants.REGISTER}
        </Typography>
        <div className={classes.form}>
          <Grid container spacing={3}>
            <Grid item>
              <TextField
                label="OTP"
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
            </Grid>
            <Grid item>
              <Button
                color="primary"
                type="submit"
                mfullWidth
                variant="contained"
              >
                {authPageConstants.RESEND_OTP_BUTTON}
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <Button
                color="primary"
                type="submit"
                mfullWidth
                variant="contained"
                size="large"
                onClick={() => {
                  validate();
                }}
              >
                {authPageConstants.VERIFY_OTP_BUTTON}
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </Container>
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
};
export default VerifyOtp;
