import React, { useState, useContext } from "react";
import clsx from "clsx";
import { get } from "lodash";
import useStyles from "../../ContainerStyles/AddEditPageStyles";
import ChangePasswordStyles from "./ChangePasswordStyles";
import * as genericConstants from "../../../constants/GenericConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import {
  YellowButton,
  GrayButton,
  Auth as auth,
  Alert
} from "../../../components";
import CloseIcon from "@material-ui/icons/Close";
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  CardContent,
  Card,
  CardActions,
  FormHelperText,
  Collapse
} from "@material-ui/core";
import * as formUtilities from "../../../utilities/FormUtilities";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import * as serviceProviders from "../../../api/Axios";
import ChangePasswordSchema from "./ChangePasswordSchema";
import LoaderContext from "../../../context/LoaderContext";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import SetIndexContext from "../../../context/SetIndexContext";

const OLDPASSWORD = "oldPassword";
const NEWPASSWORD = "newPassword";

const ChangePassword = props => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const changePasswordClasses = ChangePasswordStyles();
  const { setLoaderStatus } = useContext(LoaderContext);
  const { setIndex } = useContext(SetIndexContext);
  setIndex(null);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    showNewPassword: false,
    showOldPassword: false,
    isSuccessChangingPassword: false,
    isErrorChangingPassword: false
  });

  const handleChange = e => {
    e.persist();
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
    if (formState.errors.hasOwnProperty(e.target.name)) {
      delete formState.errors[e.target.name];
    }
  };

  const handleClickShowOldPassword = () => {
    setFormState({
      ...formState,
      showOldPassword: !formState.showOldPassword
    });
  };

  const handleClickShowNewPassword = () => {
    setFormState({
      ...formState,
      showNewPassword: !formState.showNewPassword
    });
  };
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const setLoader = () => {
    setLoaderStatus(true);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setOpen(true);
    setLoader();
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      ChangePasswordSchema
    );
    if (checkAllFieldsValid) {
      formState.errors = formUtilities.setErrors(
        formState.values,
        ChangePasswordSchema
      );
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        ChangePasswordSchema
      );
      formState.errors = formUtilities.setErrors(
        formState.values,
        ChangePasswordSchema
      );
    }
    if (isValid) {
      postStateData();
      /** Call axios from here */
      setFormState(formState => ({
        ...formState,
        isValid: true,
        isErrorChangingPassword: false,
        isSuccessChangingPassword: false
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        isValid: false,
        isErrorChangingPassword: false,
        isSuccessChangingPassword: false
      }));
      setLoaderStatus(false);
    }
  };
  const postStateData = () => {
    let postData = {
      username: auth.getUserInfo().username,
      oldPassword: formState.values[OLDPASSWORD],
      password: formState.values[NEWPASSWORD],
      passwordConfirmation: formState.values[NEWPASSWORD]
    };
    let headers = {
      "content-type": "application/json"
    };
    serviceProviders
      .serviceProviderForPostRequest(
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_CHANGE_PASSWORD,
        postData,
        headers
      )
      .then(res => {
        setLoaderStatus(false);
        setFormState(formState => ({
          ...formState,
          isSuccessChangingPassword: true,
          isErrorChangingPassword: false,
          values: {}
        }));
      })
      .catch(error => {
        setLoaderStatus(false);
        setFormState(formState => ({
          ...formState,
          isSuccessChangingPassword: false,
          isErrorChangingPassword: true,
          values: {}
        }));
      });
    /** Set state to reload form */
    setFormState(formState => ({
      ...formState,
      isValid: true
    }));
  };

  const hasError = field => (formState.errors[field] ? true : false);
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.CHANGE_PASSWORD}
        </Typography>
      </Grid>

      <Grid item xs={12} className={classes.formgrid}>
        {/** Error/Success messages to be shown for edit */}
        {formState.isSuccessChangingPassword &&
        !formState.isErrorChangingPassword ? (
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
              Password Changed Successfully.
            </Alert>
          </Collapse>
        ) : null}
        {formState.isErrorChangingPassword &&
        !formState.isSuccessChangingPassword ? (
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
              Error Changing Password.
            </Alert>
          </Collapse>
        ) : null}
      </Grid>

      <Grid item xs={12} className={classes.formgrid}>
        <Card className={classes.root} variant="outlined">
          <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <FormControl
                    fullWidth
                    className={clsx(
                      changePasswordClasses.margin,
                      classes.elementroot
                    )}
                    variant="outlined"
                  >
                    <InputLabel
                      htmlFor="outlined-adornment-password"
                      fullWidth
                      error={hasError(OLDPASSWORD)}
                    >
                      Old Password
                    </InputLabel>
                    <OutlinedInput
                      id={get(ChangePasswordSchema[OLDPASSWORD], "id")}
                      name={OLDPASSWORD}
                      type={formState.showOldPassword ? "text" : "password"}
                      value={formState.values[OLDPASSWORD] || ""}
                      onChange={handleChange}
                      fullWidth
                      error={hasError(OLDPASSWORD)}
                      endAdornment={
                        <InputAdornment
                          position="end"
                          error={hasError(OLDPASSWORD)}
                        >
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowOldPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {formState.showOldPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={90}
                      InputLabelProps={{
                        classes: {
                          root: changePasswordClasses.cssLabel,
                          focused: changePasswordClasses.cssFocused
                        }
                      }}
                      InputProps={{
                        classes: {
                          root: changePasswordClasses.cssOutlinedInput,
                          focused: changePasswordClasses.cssFocused,
                          notchedOutline: changePasswordClasses.notchedOutline
                        }
                      }}
                    ></OutlinedInput>
                    <FormHelperText error={hasError(OLDPASSWORD)}>
                      {hasError(OLDPASSWORD)
                        ? formState.errors[OLDPASSWORD].map(error => {
                            return error + " ";
                          })
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormControl
                    fullWidth
                    className={clsx(
                      changePasswordClasses.margin,
                      classes.elementroot
                    )}
                    variant="outlined"
                  >
                    <InputLabel
                      htmlFor="outlined-adornment-password"
                      fullWidth
                      error={hasError(NEWPASSWORD)}
                    >
                      New Password
                    </InputLabel>
                    <OutlinedInput
                      id={get(ChangePasswordSchema[NEWPASSWORD], "id")}
                      name={NEWPASSWORD}
                      type={formState.showNewPassword ? "text" : "password"}
                      value={formState.values[NEWPASSWORD] || ""}
                      onChange={handleChange}
                      fullWidth
                      error={hasError(NEWPASSWORD)}
                      endAdornment={
                        <InputAdornment
                          position="end"
                          error={hasError(NEWPASSWORD)}
                        >
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {formState.showNewPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={90}
                      InputLabelProps={{
                        classes: {
                          root: changePasswordClasses.cssLabel,
                          focused: changePasswordClasses.cssFocused
                        }
                      }}
                      InputProps={{
                        classes: {
                          root: changePasswordClasses.cssOutlinedInput,
                          focused: changePasswordClasses.cssFocused,
                          notchedOutline: changePasswordClasses.notchedOutline
                        }
                      }}
                    ></OutlinedInput>
                    <FormHelperText error={hasError(NEWPASSWORD)}>
                      {hasError(NEWPASSWORD)
                        ? formState.errors[NEWPASSWORD].map(error => {
                            return error + " ";
                          })
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <Grid item xs={12} className={classes.CardActionGrid}>
              <CardActions className={classes.btnspace}>
                <Grid item xs={12}>
                  <Grid item xs={12} md={6} xl={3}>
                    <Grid container spacing={3}>
                      <Grid item md={2} xs={12}>
                        <YellowButton
                          type="submit"
                          color="primary"
                          variant="contained"
                        >
                          {genericConstants.SAVE_BUTTON_TEXT}
                        </YellowButton>
                      </Grid>

                      <Grid item md={2} xs={12}>
                        <GrayButton
                          type="submit"
                          color="primary"
                          variant="contained"
                          to={
                            auth.getUserInfo().role.name ===
                            roleConstants.STUDENT
                              ? routeConstants.VIEW_PROFILE
                              : routeConstants.DASHBOARD_URL
                          }
                        >
                          {genericConstants.CANCEL_BUTTON_TEXT}
                        </GrayButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardActions>
            </Grid>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
export default ChangePassword;
