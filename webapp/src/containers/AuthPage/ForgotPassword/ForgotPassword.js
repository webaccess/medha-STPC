import React, { useState, useEffect } from "react";
import { get } from "lodash";
import { Alert, Validation as validateInput } from "../../../components";
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
  CircularProgress
} from "@material-ui/core";
import clsx from "clsx";
import useStyles from "./ForgotPasswordStyles";
import form from "./forgotPassword.json";
import { useHistory } from "react-router-dom";
import image from "../../../assets/images/login-img.png";
import * as serviceProvider from "../../../api/Axios";
import * as authPageConstants from "../../../constants/AuthPageConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import * as StrapiApiConstants from "../../../constants/StrapiApiConstants";
import * as formUtilities from "../../../Utilities/FormUtilities";
import CardIcon from "../../../components/Card/CardIcon";
import { useTheme } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";

const newPassword = "newPassword";
const confirmNewPassword = "confirmNewPassword";
const mobileNumber = "mobileNumber";
const otp = "OTP";

const REQUEST_OTP_URL =
  StrapiApiConstants.STRAPI_DB_URL + StrapiApiConstants.STRAPI_REQUEST_OTP;
const VALIDATE_OTP_URL =
  StrapiApiConstants.STRAPI_DB_URL + StrapiApiConstants.STRAPI_VALIDATE_OTP;
const CHANGE_PASSWORD_URL =
  StrapiApiConstants.STRAPI_DB_URL + StrapiApiConstants.STRAPI_CHANGE_PASS_URL;

const ForgotPassword = props => {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const history = useHistory();
  const classes = useStyles();
  const [isOtpVerificationFailed, setIsOtpVerificationFailed] = React.useState(
    false
  );

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    otpResent: false,
    otpSent: false,
    otpVerify: false,
    passChangeSuccess: false,
    passChangeFailure: false,
    resetPasswordToken: "",
    errorsToShow: "",
    isChangePassFailed: false,
    showPassword: false,
    otpSendingFailed: false,
    formType: authPageConstants.FORM_TYPE_ENTER_MOBILE
  });

  const handleClickShowPassword = () => {
    setFormState({
      ...formState,
      showPassword: !formState.showPassword
    });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleSubmit = async evt => {
    evt.preventDefault();
    evt.persist();
    if (formState.otpSent === false) {
      sendOtp();
    } else if (
      (formState.otpSent === true || formState.otpResent === true) &&
      formState.otpVerify === false
    ) {
      await verifyOtp();
    } else if (formState.otpVerify === true) {
      await changePassword();
    }
  };

  const changePassword = async () => {
    setFormState(formState => ({
      ...formState,
      isChangePassFailed: false
    }));
    let postData = {
      code: formState.resetPasswordToken,
      password: formState.values[newPassword],
      passwordConfirmation: formState.values[newPassword]
    };
    let headers = {
      "Content-Type": "application/json"
    };
    await serviceProvider
      .serviceProviderForPostRequest(CHANGE_PASSWORD_URL, postData, headers)
      .then(res => {
        history.push({
          pathname: routeConstants.SIGN_IN_URL,
          fromPasswordChangedPage: true,
          dataToShow: "Password Changed Successfully"
        });
      })
      .catch(error => {
        setOpen(true);
        setFormState(formState => ({
          ...formState,
          isChangePassFailed: true,
          errorsToShow: "Error Changing Password"
        }));
      });
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
      },
      isChangePassFailed: false
    }));
  };

  const sendOtp = async () => {
    await generateOtp(true, false);
  };

  const resendOtp = async () => {
    await generateOtp(false, true);
    return false;
  };

  /** Function used to generate otp */
  const generateOtp = async (sendOtp, resendOtp) => {
    /** Reset error message */
    setIsOtpVerificationFailed(false);
    setFormState(formState => ({
      ...formState,
      otpSendingFailed: false
    }));
    let postData = { contact_number: formState.values[mobileNumber] };
    let headers = {
      "Content-Type": "application/json"
    };
    await serviceProvider
      .serviceProviderForPostRequest(REQUEST_OTP_URL, postData, headers)
      .then(res => {
        if (res.data.result.status === "Ok") {
          if (sendOtp) {
            setFormState(formState => ({
              ...formState,
              otpSent: true,
              isValid: false,
              otpSendingFailed: false,
              errorsToShow: "",
              formType: authPageConstants.FORM_TYPE_VERIFY_OTP
            }));
          } else if (resendOtp) {
            setOpen(true);
            setFormState(formState => ({
              ...formState,
              otpSendingFailed: false,
              otpResent: true,
              isValid: false,
              errorsToShow: "OTP sent successfully"
            }));
          }
        }
      })
      .catch(error => {
        setOpen(true);
        setFormState(formState => ({
          ...formState,
          otpSendingFailed: true,
          errorsToShow: "Error Generating OTP"
        }));
      });
  };

  const verifyOtp = async () => {
    setIsOtpVerificationFailed(false);
    let postData = {
      contact_number: formState.values[mobileNumber],
      otp: formState.values[otp]
    };
    let headers = {
      "Content-Type": "application/json"
    };
    await serviceProvider
      .serviceProviderForPostRequest(VALIDATE_OTP_URL, postData, headers)
      .then(res => {
        if (
          res.data.statusCode === 400 &&
          res.data.message === "OTP has expired"
        ) {
          setOpen(true);
          setIsOtpVerificationFailed(true);
          setFormState(formState => ({
            ...formState,
            errorsToShow: "OTP has expired"
          }));
        } else if (res.data.message === "EmptyResponse") {
          setOpen(true);
          setIsOtpVerificationFailed(true);
          setFormState(formState => ({
            ...formState,
            errorsToShow: "Invalid OTP"
          }));
        } else if (formUtilities.checkEmpty(res.data)) {
          setOpen(true);
          setIsOtpVerificationFailed(true);
          setFormState(formState => ({
            ...formState,
            errorsToShow: "Invalid OTP"
          }));
        } else if (res.data.result && res.data.result.resetPasswordToken) {
          formState.resetPasswordToken = res.data.result.resetPasswordToken;
          setFormState(formState => ({
            ...formState,
            otpVerify: true,
            isValid: false,
            resetPasswordToken: res.data.result.resetPasswordToken,
            errorsToShow: "",
            formType: authPageConstants.FORM_TYPE_CHANGE_PASS
          }));
        }
      })
      .catch(error => {
        console.log("error verifying otp ", error);
        setOpen(true);
        setIsOtpVerificationFailed(true);
        setFormState(formState => ({
          ...formState,
          errorsToShow: "Error verifying OTP"
        }));
      });
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true
  });

  return (
    <div className={classes.masterlogin2}>
      <div className={classes.masterlogin1}>
        <div className={classes.masterlogin}>
          <Paper className={isDesktop ? classes.rootDesktop : classes.root}>
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
                    {authPageConstants.FORGOT_PASSWORD_HEADER}
                  </Typography>
                </div>
                {isOtpVerificationFailed ||
                formState.isChangePassFailed ||
                formState.otpSendingFailed ? (
                  <Collapse in={open}>
                    <Alert
                      severity="error"
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                    >
                      {formState.errorsToShow}
                    </Alert>
                  </Collapse>
                ) : formState.otpResent &&
                  formState.errorsToShow === "OTP sent successfully" ? (
                  <Collapse in={open}>
                    <Alert
                      severity="success"
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                    >
                      {formState.errorsToShow}
                    </Alert>
                  </Collapse>
                ) : null}
                <form
                  className={classes.form}
                  noValidate
                  onSubmit={handleSubmit}
                >
                  {formState.otpVerify === true ? (
                    <React.Fragment>
                      <Typography
                        component="h5"
                        variant="subtitle2"
                        style={{ marginTop: ".9rem", marginBottom: ".9rem" }}
                      >
                        {authPageConstants.CONFIRM_NEW_PASS_ALERT}
                      </Typography>
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
                            ? formState.errors[confirmNewPassword].map(
                                error => {
                                  return "\n" + error;
                                }
                              )
                            : null
                        }
                      />
                      <Button
                        color="primary"
                        disabled={!formState.isValid}
                        type="submit"
                        fullWidth
                        variant="contained"
                        className={classes.submit}
                      >
                        {authPageConstants.RESET_PASS_BUTTON}
                      </Button>
                    </React.Fragment>
                  ) : formState.otpSent === true ? (
                    <React.Fragment>
                      <Typography
                        component="h5"
                        variant="subtitle2"
                        style={{ marginTop: ".9rem", marginBottom: ".9rem" }}
                      >
                        {authPageConstants.OTP_ALERT}{" "}
                        {formState.values.mobileNumber}
                      </Typography>
                      <FormControl
                        fullWidth
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                      >
                        <InputLabel
                          htmlFor="outlined-adornment-password"
                          fullWidth
                          error={hasError(otp)}
                        >
                          OTP
                        </InputLabel>
                        <OutlinedInput
                          id={get(form[otp], "id")}
                          name={otp}
                          type={formState.showPassword ? "text" : "password"}
                          value={formState.values[otp] || ""}
                          onChange={handleChange}
                          fullWidth
                          error={hasError(otp)}
                          endAdornment={
                            <InputAdornment
                              position="end"
                              error={hasError(otp)}
                            >
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {formState.showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          labelWidth={70}
                          InputLabelProps={{
                            classes: {
                              root: classes.cssLabel,
                              focused: classes.cssFocused
                            }
                          }}
                          InputProps={{
                            classes: {
                              root: classes.cssOutlinedInput,
                              focused: classes.cssFocused,
                              notchedOutline: classes.notchedOutline
                            }
                          }}
                        ></OutlinedInput>
                        <FormHelperText error={hasError(otp)}>
                          {hasError(otp)
                            ? formState.errors[otp].map(error => {
                                return "\n" + error;
                              })
                            : null}
                        </FormHelperText>
                        <Link
                          href="javascript:void(0);"
                          variant="body2"
                          className={classes.linkColor}
                          onClick={resendOtp}
                        >
                          {authPageConstants.RESEND_OTP_BUTTON}
                        </Link>
                      </FormControl>
                      <Button
                        color="primary"
                        disabled={!formState.isValid}
                        type="submit"
                        fullWidth
                        variant="contained"
                        className={classes.submit}
                      >
                        {authPageConstants.VERIFY_OTP_BUTTON}
                      </Button>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Typography
                        component="h5"
                        variant="subtitle2"
                        style={{ marginTop: ".9rem", marginBottom: ".9rem" }}
                      >
                        {authPageConstants.MOBILE_NUMBER_ALERT}
                      </Typography>
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
                      <Button
                        color="primary"
                        disabled={!formState.isValid}
                        type="submit"
                        fullWidth
                        variant="contained"
                        className={classes.submit}
                      >
                        {authPageConstants.SEND_OTP_BUTTON}
                      </Button>
                    </React.Fragment>
                  )}
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
                </form>
              </div>
            </CardContent>

            <Hidden mdDown>
              <CardMedia
                className={classes.cover}
                image={image}
                title="Live from space album cover"
              />
            </Hidden>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
