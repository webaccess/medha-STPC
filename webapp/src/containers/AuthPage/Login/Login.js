import React, { useState, useEffect, useContext } from "react";
import clsx from "clsx";
import { get } from "lodash";
import axios from "axios";
import { Redirect } from "react-router-dom";
import {
  Grid,
  Button,
  TextField,
  Link,
  Typography,
  CssBaseline,
  FormHelperText,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  CardContent,
  CardMedia,
  Icon,
  Paper,
  Hidden,
  useMediaQuery,
  Collapse,
  Backdrop,
  CircularProgress
} from "@material-ui/core";
import useStyles from "./LoginStyles";
import form from "./loginform.json";
import {
  Alert,
  Auth as auth,
  Validation as validateInput
} from "../../../components";
import * as routeConstants from "../../../constants/RouteConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import * as authPageConstants from "../../../constants/AuthPageConstants";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useTheme } from "@material-ui/core/styles";
import * as formUtilities from "../../../utilities/FormUtilities";
import image from "../../../assets/images/login-img.png";
import CardIcon from "../../../components/Card/CardIcon.js";
import { useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import SetIndexContext from "../../../context/SetIndexContext";
const identifier = "identifier";
const password = "password";

const LogIn = props => {
  const [openSpinner, setOpenSpinner] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const [ifSuccess, setIfSuccess] = React.useState(false);
  const [ifFailure, setIfFailure] = React.useState(false);
  const { index, setIndex } = useContext(SetIndexContext);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    showPassword: false,
    fromPasswordChangedPage: props.from
      ? props.from.fromPasswordChangedPage
        ? true
        : false
      : false,
    dataToShow: props.from
      ? props.from.fromPasswordChangedPage
        ? props.from.dataToShow
        : ""
      : ""
  });

  function checkAllKeysPresent(obj) {
    let areFieldsValid = false;
    Object.keys(form).map(field => {
      if (form[field]["required"] === true && obj.hasOwnProperty(field)) {
        areFieldsValid = true;
      } else {
        areFieldsValid = false;
      }
    });
    return areFieldsValid;
  }

  function count(obj) {
    return !Object.keys(obj).length ? true : false;
  }

  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true
  });

  useEffect(() => {
    if (formUtilities.checkAllKeysPresent(formState.values, form)) {
      Object.keys(formState.values).map(field => {
        const errors = validateInput(
          formState.values[field],
          form[field]["validations"]
        );
        setFormState(formState => ({
          ...formState,
          isValid:
            !errors.length &&
            count(formState.errors) &&
            checkAllKeysPresent(formState.values)
              ? true
              : false,
          errors: errors.length
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
    } else {
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        form
      );
      Object.keys(formState.values).map(field => {
        const errors = validateInput(
          formState.values[field],
          form[field]["validations"]
        );
        setFormState(formState => ({
          ...formState,
          isValid:
            !errors.length &&
            count(formState.errors) &&
            checkAllKeysPresent(formState.values)
              ? true
              : false,
          errors: errors.length
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
    }

    Object.keys(formState.values).map(field => {
      const errors = validateInput(
        formState.values[field],
        form[field]["validations"]
      );
      setFormState(formState => ({
        ...formState,
        isValid:
          !errors.length &&
          count(formState.errors) &&
          checkAllKeysPresent(formState.values)
            ? true
            : false,
        errors: errors.length
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
    setIfFailure(false);

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

  if (ifSuccess && auth.getToken()) {
    return auth.getUserInfo().role.name === roleConstants.STUDENT ? (
      <Redirect
        to={{
          pathname: routeConstants.VIEW_PROFILE,
          state: { from: props.location }
        }}
      />
    ) : (
      <Redirect
        to={{
          pathname: routeConstants.DASHBOARD_URL,
          state: { from: props.location }
        }}
      />
    );
  }

  const handleSignIn = event => {
    event.preventDefault();
    processLogin();
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const setUserData = (jwt, user) => {
    auth.setToken(jwt, true);
    auth.setUserInfo(user, true);
    setIfSuccess(true);
  };

  const moveToErrorPageForBlocked = () => {
    history.push({
      pathname: routeConstants.REQUIRED_ERROR_PAGE,
      from: "login"
    });
  };

  const processLogin = async () => {
    setOpenSpinner(true);
    await axios
      .post(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_LOGIN_PATH,
        {
          identifier: formState.values.identifier,
          password: formState.values.password
        }
      )
      .then(response => {
        setIndex(0);
        if (response.data.user.role.name === roleConstants.STUDENT) {
          /** This check whether the college is blocked or not then it checks whether the user is blocked or not */
          if (response.data.user.studentInfo.organization.is_blocked) {
            moveToErrorPageForBlocked();
          } else {
            if (response.data.user.blocked) {
              moveToErrorPageForBlocked();
            } else if (!response.data.user.studentInfo.is_verified) {
              history.push(routeConstants.REQUIRED_CONFORMATION);
            } else {
              setUserData(response.data.jwt, response.data.user);
            }
          }
          setOpenSpinner(false);
        } else if (
          response.data.user.role.name === roleConstants.COLLEGEADMIN
        ) {
          if (response.data.user.studentInfo.organization.is_blocked) {
            moveToErrorPageForBlocked();
          } else {
            if (response.data.user.blocked) {
              moveToErrorPageForBlocked();
            } else {
              setUserData(response.data.jwt, response.data.user);
            }
          }
          setOpenSpinner(false);
        } else if (response.data.user.role.name === roleConstants.MEDHAADMIN) {
          if (response.data.user.blocked) {
            moveToErrorPageForBlocked();
          } else {
            setUserData(response.data.jwt, response.data.user);
          }
          setOpenSpinner(false);
        } else if (
          response.data.user.role.name === roleConstants.DEPARTMENTADMIN
        ) {
          if (response.data.user.blocked) {
            moveToErrorPageForBlocked();
          } else {
            setUserData(response.data.jwt, response.data.user);
          }
          setOpenSpinner(false);
        } else if (response.data.user.role.name === roleConstants.ZONALADMIN) {
          if (response.data.user.blocked) {
            moveToErrorPageForBlocked();
          } else {
            setUserData(response.data.jwt, response.data.user);
          }
          setOpenSpinner(false);
        } else if (response.data.user.role.name === roleConstants.RPCADMIN) {
          if (response.data.user.blocked) {
            moveToErrorPageForBlocked();
          } else {
            setUserData(response.data.jwt, response.data.user);
          }
          setOpenSpinner(false);
        } else {
          moveToErrorPageForBlocked();
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 400) {
            if (error.response.data["message"]) {
              if (
                error.response.data["message"][0]["messages"][0]["id"] ===
                "Auth.form.error.blocked"
              ) {
                moveToErrorPageForBlocked();
              } else if (
                error.response.data["message"][0]["messages"][0]["id"] ===
                "Auth.form.error.invalid"
              ) {
                setOpen(true);
                setIfFailure(true);
              }
            }
          } else {
            setOpen(true);
            setIfFailure(true);
            console.log("An error occurred:", JSON.stringify(error));
          }
        }
      });
    setOpenSpinner(false);
  };

  const handleClickShowPassword = () => {
    setFormState({
      ...formState,
      showPassword: !formState.showPassword
    });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

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
                    {authPageConstants.SIGN_IN_HEADER}
                  </Typography>
                </div>
                {ifFailure ? (
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
                      {authPageConstants.INVALID_USER}
                    </Alert>
                  </Collapse>
                ) : formState.fromPasswordChangedPage ? (
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
                      {formState.dataToShow}
                    </Alert>
                  </Collapse>
                ) : null}
                <form
                  className={classes.form}
                  noValidate
                  onSubmit={handleSignIn}
                  id="form"
                >
                  <TextField
                    id={get(form[identifier], "id")}
                    variant="outlined"
                    margin="normal"
                    error={hasError("identifier")}
                    fullWidth
                    autoFocus={get(form[identifier], "autoFocus")}
                    helperText={
                      hasError(identifier)
                        ? formState.errors[identifier].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    label={get(form[identifier], "label")}
                    name={identifier}
                    onChange={handleChange}
                    type={get(form[identifier], "type")}
                    value={formState.values[identifier] || ""}
                  />

                  <FormControl
                    fullWidth
                    className={clsx(classes.margin, classes.textField)}
                    variant="outlined"
                  >
                    <InputLabel
                      htmlFor="outlined-adornment-password"
                      fullWidth
                      error={hasError(password)}
                    >
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id={get(form[password], "id")}
                      name={password}
                      type={formState.showPassword ? "text" : "password"}
                      value={formState.values[password] || ""}
                      onChange={handleChange}
                      fullWidth
                      error={hasError(password)}
                      endAdornment={
                        <InputAdornment
                          position="end"
                          error={hasError(password)}
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
                    <FormHelperText error={hasError(password)}>
                      {hasError(password)
                        ? formState.errors[password].map(error => {
                            return error + " ";
                          })
                        : null}
                    </FormHelperText>
                    <Link
                      className={classes.forgotpass}
                      href={routeConstants.FORGOT_PASSWORD_URL}
                      variant="body2"
                      className={classes.linkColor}
                    >
                      {authPageConstants.FORGOT_PASSWORD_ROUTE_TEXT}
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
                    {authPageConstants.SIGN_IN_BUTTON}
                  </Button>
                  <Grid container>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                      Don't have an account? |{" "}
                      <Link
                        href={routeConstants.REQUEST_OTP}
                        variant="body2"
                        className={classes.linkColor}
                      >
                        {authPageConstants.NEW_REG_ROUTE_TEXT}
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
            <Backdrop className={classes.backdrop} open={openSpinner}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
