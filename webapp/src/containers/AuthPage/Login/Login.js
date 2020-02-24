import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { get, isEmpty } from "lodash";
import useStyles from "./LoginStyles";
import axios from "axios";
import { Redirect } from "react-router-dom";
import auth from "../../../components/Auth/Auth";
import * as routeConstants from "../../../components/Constants/RouteConstants";
import * as authPageConstants from "../../../components/Constants/AuthPageConstants";
import * as strapiApiConstants from "../../../components/Constants/StrapiApiConstants";
import form from "./loginform.json";
import { Grid, Button, TextField, Link, Typography } from "@material-ui/core";
import validateInput from "../../../components/Validation/ValidateInput/ValidateInput";
import Alert from "../../../components/AlertMessage/Alert";
import Logo from "../../../components/Logo/Logo";

const identifier = "identifier";
const password = "password";

const LogIn = props => {
  const classes = useStyles();
  const [ifSuccess, setIfSuccess] = React.useState(false);
  const [ifFailure, setIfFailure] = React.useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false
  });

  useEffect(() => {
    Object.keys(formState.values).map(field => {
      const errors = validateInput(
        formState.values[field],
        form[field]["validations"]
      );
      setFormState(formState => ({
        ...formState,
        isValid: errors.length ? false : true,
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
    return <Redirect to="/" />;
  }

  const handleSignIn = event => {
    event.preventDefault();
    processLogin();
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const processLogin = async () => {
    await axios
      .post(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_LOGIN_PATH,
        {
          identifier: formState.values.identifier,
          password: formState.values.password
        }
      )
      .then(response => {
        auth.setToken(response.data.jwt, true);
        setIfSuccess(true);
        // Handle success.
      })
      .catch(error => {
        setIfFailure(true);
        console.log("An error occurred:", error);
      });
  };

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
          {authPageConstants.SIGN_IN_HEADER}
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSignIn}>
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
          <TextField
            id={get(form[password], "id")}
            variant="outlined"
            margin="normal"
            error={hasError(password)}
            fullWidth
            helperText={
              hasError(password)
                ? formState.errors[password].map(error => {
                    return error + " ";
                  })
                : null
            }
            label={get(form[password], "label")}
            name={password}
            onChange={handleChange}
            type={get(form[password], "type")}
            value={formState.values[password] || ""}
          />
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
            <Grid item xs={6} style={{ textAlign: "center" }}>
              <Link href={routeConstants.FORGOT_PASSWORD_URL} variant="body2">
                {authPageConstants.FORGOT_PASSWORD_ROUTE_TEXT}
              </Link>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "center" }}>
              <Link href={routeConstants.NEW_REGISTRATION_URL} variant="body2">
                {authPageConstants.NEW_REG_ROUTE_TEXT}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {ifFailure ? (
        <Alert severity="error">{authPageConstants.INVALID_USER}</Alert>
      ) : null}
    </Container>
  );
};

export default LogIn;
