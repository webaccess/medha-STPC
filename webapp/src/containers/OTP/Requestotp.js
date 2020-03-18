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
  Card,
  CardContent,
  Hidden,
  CardMedia
} from "@material-ui/core";
import Logo from "../../components/Logo/Logo.js";
import * as authPageConstants from "../../constants/AuthPageConstants.js";
import Button from "../../components/GreenButton/GreenButton.js";
import form from "./OTPform.json";
import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import * as serviceProvider from "../../api/Axios.js";
import axios from "axios";
import image from "../../assets/images/login-img.png";

const RequestOtp = props => {
  let history = useHistory();

  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const classes = useStyles();
  const { layout: Layout } = props;
  const validate = () => {
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
    console.log(
      strapiApiConstants.STRAPI_DB_URL +
        strapiApiConstants.STRAPI_REQUEST_STUDENT_OTP
    );
    axios
      .post(
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_REQUEST_STUDENT_OTP,
        { contact_number: contactNumber }
      )
      .then(res => {
        history.push("/verifyotp", { contactNumber: contactNumber });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Layout>
      {console.log(props)}
      <div className={classes.paper}>
        <Card className={classes.paper}>
          <CardContent style={{ padding: "50px", marginLeft: "20px" }}>
            <Typography
              component="h1"
              variant="h5"
              style={{ marginTop: ".9rem" }}
            >
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
              </Grid>
              <Grid container spacing={3}>
                <Grid item style={{ padding: "14px" }}>
                  <Button
                    color="primary"
                    mfullWidth
                    variant="contained"
                    size="large"
                    greenButtonChecker={true}
                    onClick={() => {
                      validate();
                    }}
                  >
                    <span style={{ margin: "10px" }}>
                      {authPageConstants.SEND_OTP_BUTTON}
                    </span>
                  </Button>
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
              justifyContent: "flex-end"
            }}
            image={image}
            title="Live from space album cover"
          />
        </Card>
      </div>
    </Layout>
  );
};
export default RequestOtp;
