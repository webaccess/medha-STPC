import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import useStyles from "./ForgotPasswordStyles";
import validateInput from "../../../components/Validation/ValidateInput/ValidateInput";
import form from "./forgotPassword.json";
import { get } from "lodash";
import * as authPageConstants from "../../../components/Constants/AuthPageConstants";
import * as routeConstants from "../../../components/Constants/RouteConstants";

import Alert from "../../../components/AlertMessage/Alert";
import Logo from "../../../components/Logo/Logo";

const newPassword = "newPassword";
const confirmNewPassword = "confirmNewPassword";
const mobileNumber = "mobileNumber";
const otp = "otp";

const ForgotPassword = props => {
  const classes = useStyles();
  const [isOtpVerificationFailed, setIsOtpVerificationFailed] = React.useState(
    false
  );

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    otp: "",
    otpResent: false,
    otpSent: false,
    otpVerify: false,
    passChangeSuccess: false,
    passChangeFailure: false,
    formType: authPageConstants.FORM_TYPE_ENTER_MOBILE
  });

  const handleSubmit = evt => {
    if (formState.otpSent === false) {
      sendOtp();
    } else if (
      (formState.otpSent === true || formState.otpResent === true) &&
      formState.otpVerify === false
    ) {
      verifyOtp();
    } else if (formState.otpVerify === true) {
      console.log("change password");
    }
    evt.preventDefault();
  };

  function checkAllKeysPresent(obj) {
    let areFieldsValid = false;

    Object.keys(form).map(field => {
      if (field === newPassword || field === confirmNewPassword) {
        if (form[field]["required"] === true && obj.hasOwnProperty(field)) {
          areFieldsValid = true;
        } else {
          areFieldsValid = false;
        }
      }
    });
    return areFieldsValid;
  }

  function count(obj) {
    return !Object.keys(obj).length ? true : false;
  }

  useEffect(() => {
    Object.keys(formState.values).map(field => {
      const errors = validateInput(
        formState.values[field],
        form[field]["validations"]
      );
      if (
        field === confirmNewPassword &&
        formState.values[field] &&
        formState.values[field].length &&
        formState.values[newPassword] !== formState.values[field]
      ) {
        errors.push("new password and confirm password doesn't match");
      }
      formState.formType === authPageConstants.FORM_TYPE_CHANGE_PASS
        ? setFormState(formState => ({
            ...formState,
            isValid:
              !errors.length &&
              count(formState.errors) &&
              checkAllKeysPresent(formState.values)
                ? true
                : false,
            errors:
              errors.length && form
                ? {
                    ...formState.errors,
                    [field]: errors
                  }
                : formState.errors
          }))
        : setFormState(formState => ({
            ...formState,
            isValid: errors.length ? false : true,
            errors:
              errors.length && form
                ? {
                    ...formState.errors,
                    [field]: errors
                  }
                : formState.errors
          }));
      if (!errors.length && formState.errors.hasOwnProperty(field)) {
        delete formState.errors[field];
      }
    });
  }, [formState.values]);

  useEffect(() => {
    console.log("otp set ", formState.otp);
  }, [formState.otp]);

  const handleChange = e => {
    e.persist();
    setIsOtpVerificationFailed(false);
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [e.target.name]: e.target.value
      },
      touched: {
        ...formState.touched,
        [e.target.name]: true
      }
    }));
  };

  const sendOtp = () => {
    let otp = generateOtp();
    setFormState(formState => ({
      ...formState,
      otp: otp.toString(),
      otpSent: true,
      isValid: false,
      formType: authPageConstants.FORM_TYPE_VERIFY_OTP
    }));
  };

  const resendOtp = () => {
    let otp = generateOtp();
    setFormState(formState => ({
      ...formState,
      otp: otp.toString(),
      otpResent: true,
      isValid: false
    }));
  };

  const generateOtp = () => {
    return Math.floor(1000000 + Math.random() * 9000000);
  };

  const verifyOtp = () => {
    if (formState.otp === formState.values[otp]) {
      setFormState(formState => ({
        ...formState,
        otpVerify: true,
        isValid: false,
        formType: authPageConstants.FORM_TYPE_CHANGE_PASS
      }));
    } else {
      setIsOtpVerificationFailed(true);
    }
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Box mt={1}>
          <center>
            <Logo />
          </center>
        </Box>
        <Typography component="h1" variant="h5" style={{ marginTop: ".9rem" }}>
          {authPageConstants.FORGOT_PASSWORD_HEADER}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          {formState.otpVerify === true ? (
            <Box component="div">
              <Typography
                component="h5"
                variant="subtitle2"
                style={{ marginTop: ".9rem" }}
              >
                {authPageConstants.CONFIRM_NEW_PASS_ALERT}
              </Typography>
              <Box component="div" display="inline">
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  type={get(form[newPassword], "type")}
                  id={get(form[newPassword], "id")}
                  label={get(form[newPassword], "label")}
                  name={newPassword}
                  autoFocus
                  value={formState.values[newPassword] || ""}
                  onChange={handleChange}
                  error={hasError(newPassword)}
                  helperText={
                    hasError(newPassword)
                      ? formState.errors[newPassword].map(error => {
                          return "\n" + error;
                        })
                      : null
                  }
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  type={get(form[confirmNewPassword], "type")}
                  fullWidth
                  id={get(form[confirmNewPassword], "id")}
                  label={get(form[confirmNewPassword], "label")}
                  name={confirmNewPassword}
                  value={formState.values[confirmNewPassword] || ""}
                  onChange={handleChange}
                  error={hasError(confirmNewPassword)}
                  helperText={
                    hasError(confirmNewPassword)
                      ? formState.errors[confirmNewPassword].map(error => {
                          return "\n" + error;
                        })
                      : null
                  }
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                disabled={!formState.isValid}
              >
                {authPageConstants.PASS_SAVE_BUTTON}
              </Button>
            </Box>
          ) : formState.otpSent === true ? (
            <Box component="div">
              <Typography
                component="h5"
                variant="subtitle2"
                style={{ marginTop: ".9rem" }}
              >
                {authPageConstants.OTP_ALERT} {formState.values.mobilenumber}
              </Typography>
              <Box component="div">
                <Box component="div" display="inline">
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    id={get(form[otp], "id")}
                    label={get(form[otp], "label")}
                    name={otp}
                    type={get(form[otp], "type")}
                    autoFocus
                    value={formState.values[otp] || ""}
                    onChange={handleChange}
                    error={hasError(otp)}
                    helperText={
                      hasError(otp)
                        ? formState.errors[otp].map(error => {
                            return "\n" + error;
                          })
                        : null
                    }
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.resendOtp}
                    onClick={resendOtp}
                  >
                    {authPageConstants.RESEND_OTP_BUTTON}
                  </Button>
                </Box>
              </Box>
              <Box component="div">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  className={classes.submit}
                  disabled={!formState.isValid}
                >
                  {authPageConstants.VERIFY_OTP_BUTTON}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box component="div">
              <Typography
                component="h5"
                variant="subtitle2"
                style={{ marginTop: ".9rem" }}
              >
                {authPageConstants.MOBILE_NUMBER_ALERT}
              </Typography>
              <Box component="div" display="inline">
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  type={get(form[mobileNumber], "type")}
                  id={get(form[mobileNumber], "id")}
                  label={get(form[mobileNumber], "label")}
                  name={mobileNumber}
                  error={hasError(mobileNumber)}
                  helperText={
                    hasError(mobileNumber)
                      ? formState.errors[mobileNumber].map(error => {
                          return "\n" + error;
                        })
                      : null
                  }
                  autoFocus
                  value={formState.values[mobileNumber] || ""}
                  onChange={handleChange}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submit}
                disabled={!formState.isValid}
              >
                {authPageConstants.SEND_OTP_BUTTON}
              </Button>
            </Box>
          )}
          <Grid container>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Link href={routeConstants.SIGN_IN_URL} variant="body2">
                {authPageConstants.BACK_TO_LOGIN_TEXT}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {isOtpVerificationFailed ? (
        <Alert severity="error">{authPageConstants.INVALID_OTP}</Alert>
      ) : null}
    </Container>
  );
};

export default ForgotPassword;
