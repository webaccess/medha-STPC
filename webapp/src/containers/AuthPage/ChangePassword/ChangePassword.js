import React from "react";
import clsx from "clsx";
import useStyles from "../../ContainerStyles/AddEditPageStyles";
import ChangePasswordStyles from "./ChangePasswordStyles";
import * as genericConstants from "../../../constants/GenericConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import { YellowButton, GrayButton } from "../../../components";
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  CardContent,
  Card,
  CardActions,
} from "@material-ui/core";

const ChangePassword = (props) => {
  const classes = useStyles();
  const changePasswordClasses = ChangePasswordStyles();

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.CHANGE_PASSWORD}
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card className={classes.root} variant="outlined">
          <form autoComplete="off" noValidate>
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
                      //error={hasError(password)}
                    >
                      Old Password
                    </InputLabel>
                    <OutlinedInput
                      //id={get(form[password], "id")}
                      //name={password}
                      //type={formState.showPassword ? "text" : "password"}
                      //value={formState.values[password] || ""}
                      //onChange={handleChange}
                      fullWidth
                      //error={hasError(password)}
                      endAdornment={
                        <InputAdornment
                          position="end"
                          //error={hasError(password)}
                        >
                          <IconButton
                            aria-label="toggle password visibility"
                            //onClick={handleClickShowPassword}
                            //onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {/* {formState.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )} */}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={90}
                      InputLabelProps={{
                        classes: {
                          root: changePasswordClasses.cssLabel,
                          focused: changePasswordClasses.cssFocused,
                        },
                      }}
                      InputProps={{
                        classes: {
                          root: changePasswordClasses.cssOutlinedInput,
                          focused: changePasswordClasses.cssFocused,
                          notchedOutline: changePasswordClasses.notchedOutline,
                        },
                      }}
                    ></OutlinedInput>
                    {/* <FormHelperText error={hasError(password)}>
                      {hasError(password)
                        ? formState.errors[password].map((error) => {
                            return error + " ";
                          })
                        : null}
                    </FormHelperText> */}
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
                      //error={hasError(password)}
                    >
                      New Password
                    </InputLabel>
                    <OutlinedInput
                      //id={get(form[password], "id")}
                      //name={password}
                      //type={formState.showPassword ? "text" : "password"}
                      //value={formState.values[password] || ""}
                      //onChange={handleChange}
                      fullWidth
                      //error={hasError(password)}
                      endAdornment={
                        <InputAdornment
                          position="end"
                          //error={hasError(password)}
                        >
                          <IconButton
                            aria-label="toggle password visibility"
                            //onClick={handleClickShowPassword}
                            //onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {/* {formState.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )} */}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={90}
                      InputLabelProps={{
                        classes: {
                          root: changePasswordClasses.cssLabel,
                          focused: changePasswordClasses.cssFocused,
                        },
                      }}
                      InputProps={{
                        classes: {
                          root: changePasswordClasses.cssOutlinedInput,
                          focused: changePasswordClasses.cssFocused,
                          notchedOutline: changePasswordClasses.notchedOutline,
                        },
                      }}
                    ></OutlinedInput>
                    {/* <FormHelperText error={hasError(password)}>
                      {hasError(password)
                        ? formState.errors[password].map((error) => {
                            return error + " ";
                          })
                        : null}
                    </FormHelperText> */}
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <Grid item xs={12} className={classes.CardActionGrid}>
              <CardActions className={classes.btnspace}>
                <YellowButton type="submit" color="primary" variant="contained">
                  {genericConstants.SAVE_BUTTON_TEXT}
                </YellowButton>
                <GrayButton
                  type="submit"
                  color="primary"
                  variant="contained"
                  to={routeConstants.DASHBOARD_URL}
                >
                  {genericConstants.CANCEL_BUTTON_TEXT}
                </GrayButton>
              </CardActions>
            </Grid>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
export default ChangePassword;
