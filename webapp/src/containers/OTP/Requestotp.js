import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "../OTP/OTPstyles.js";
import validateInput from "../../components/Validation/Validation.js";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Card
} from "@material-ui/core";
import Logo from "../../components/Logo/Logo.js";
import * as authPageConstants from "../../constants/AuthPageConstants.js";
import Button from "../../components/GreenButton/GreenButton.js";
import form from "./OTPform.json";

const RequestOtp = props => {
  let history = useHistory();

  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const classes = useStyles();

  const validate = () => {
    const error = validateInput(
      contactNumber,
      form["contactNumber"]["validations"]
    );
    console.log(error);
    if (error[0]) setError(error);
    else history.push("/verifyotp");
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
            </Grid>
            <Grid item>
              <Button
                color="primary"
                mfullWidth
                variant="contained"
                size="large"
                onClick={() => {
                  validate();
                }}
              >
                {authPageConstants.SEND_OTP_BUTTON}
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </Container>
  );
};
export default RequestOtp;
