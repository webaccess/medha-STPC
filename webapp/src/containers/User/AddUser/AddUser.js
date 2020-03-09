import React, { useState, useEffect } from "react";
import UserSchema from "../UserSchema";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import { get } from "lodash";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useStyles from "../UserStyles";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import { Alert, YellowButton, GrayButton } from "../../../components";
import * as genericConstants from "../../../constants/GenericConstants";
import * as serviceProvider from "../../../api/Axios";
import * as routeConstants from "../../../constants/RouteConstants";

import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography
} from "@material-ui/core";

const firstname = "firstname";
const lastname = "lastname";
const email = "email";
const contact = "contact";
const username = "username";
const password = "password";
const state = "state";
const zone = "zone";
const rpc = "rpc";
const role = "role";
const college = "college";
const active = "active";

const Adduser = props => {
  const classes = useStyles();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false
  });
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES
      )
      .then(res => {
        setStates(res.data);
      })
      .catch(error => {
        console.log(error);
      });

    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ZONES
      )
      .then(res => {
        setZones(res.data);
      })
      .catch(error => {
        console.log(error);
      });

    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_RPCS
      )
      .then(res => {
        setRpcs(res.data);
      })
      .catch(error => {
        console.log(error);
      });

    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES
      )
      .then(res => {
        setColleges(res.data);
      })
      .catch(error => {
        console.log(error);
      });

    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ROLES
      )
      .then(res => {
        let roles = [];
        for (let i in res.data.roles) {
          if (
            res.data.roles[i]["name"] !== "Admin" &&
            res.data.roles[i]["name"] !== "Authenticated" &&
            res.data.roles[i]["name"] !== "Public"
          ) {
            roles.push(res.data.roles[i]);
          }
        }
        setRoles(roles);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleChange = e => {
    /** TO SET VALUES IN FORMSTATE */
    e.persist();
    setFormState(formState => ({
      ...formState,

      values: {
        ...formState.values,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value
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

  const handleChangeAutoComplete = (eventName, event, value) => {
    /**TO SET VALUES OF AUTOCOMPLETE */
    if (value !== null) {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [eventName]: value.id
        },
        touched: {
          ...formState.touched,
          [eventName]: true
        }
      }));
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
    } else {
      delete formState.values[eventName];
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      UserSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(formState.values, UserSchema);
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        UserSchema
      );
      formState.errors = formUtilities.setErrors(formState.values, UserSchema);
    }
    console.log(isValid, formState);
    if (isValid) {
      /** CALL POST FUNCTION */
      postUserData();

      /** Call axios from here */
      setFormState(formState => ({
        ...formState,
        isValid: true
      }));
    } else {
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
  };

  const postUserData = async () => {
    let postData = databaseUtilities.addUser(
      formState.values[username],
      formState.values[email],
      formState.values[firstname],
      formState.values[lastname],
      formState.values[password],
      formState.values[contact],
      formState.values[active],
      formState.values[state] ? formState.values[state] : null,
      formState.values[zone] ? formState.values[zone] : null,
      formState.values[rpc] ? formState.values[rpc] : null,
      formState.values[college] ? formState.values[college] : null,
      formState.values[role] ? formState.values[role] : null
    );

    serviceProvider
      .serviceProviderForPostRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_USERS,
        postData
      )
      .then(res => {
        console.log(res);
        setStates(res.data);
        setIsFailed(false);
        setIsSuccess(true);
      })
      .catch(error => {
        console.log(error);
        setIsSuccess(false);
        setIsFailed(true);
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
          {genericConstants.ADD_USER_TITLE}
        </Typography>
        {isSuccess ? (
          <Alert severity="success">
            {genericConstants.ALERT_SUCCESS_BUTTON_MESSAGE}
          </Alert>
        ) : null}
        {isFailed ? (
          <Alert severity="error">
            {genericConstants.ALERT_ERROR_BUTTON_MESSAGE}
          </Alert>
        ) : null}
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card className={classes.root} variant="outlined">
          <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <CardContent>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={3} xs={12}>
                  <TextField
                    label={get(UserSchema[firstname], "label")}
                    name={firstname}
                    value={formState.values[firstname] || ""}
                    error={hasError(firstname)}
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleChange}
                    helperText={
                      hasError(firstname)
                        ? formState.errors[firstname].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    label={get(UserSchema[lastname], "label")}
                    name={lastname}
                    value={formState.values[lastname] || ""}
                    error={hasError(lastname)}
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleChange}
                    helperText={
                      hasError(lastname)
                        ? formState.errors[lastname].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    label={get(UserSchema[email], "label")}
                    name={email}
                    value={formState.values[email] || ""}
                    error={hasError(email)}
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleChange}
                    helperText={
                      hasError(email)
                        ? formState.errors[email].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    label={get(UserSchema[contact], "label")}
                    name={contact}
                    value={formState.values[contact] || ""}
                    error={hasError(contact)}
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleChange}
                    helperText={
                      hasError(contact)
                        ? formState.errors[contact].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                  <TextField
                    id={get(UserSchema[username], "id")}
                    label={get(UserSchema[username], "label")}
                    name={username}
                    value={formState.values[username] || ""}
                    error={hasError(username)}
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleChange}
                    helperText={
                      hasError(username)
                        ? formState.errors[username].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    label={get(UserSchema[password], "label")}
                    name={password}
                    value={formState.values[password] || ""}
                    error={hasError(password)}
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleChange}
                    helperText={
                      hasError(password)
                        ? formState.errors[password].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                  <Autocomplete
                    id="combo-box-demo"
                    className={classes.root}
                    options={roles}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(role, event, value);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(role)}
                        label={get(UserSchema[role], "label")}
                        variant="outlined"
                        name="tester"
                        helperText={
                          hasError(role)
                            ? formState.errors[state].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <Autocomplete
                    id="combo-box-demo"
                    className={classes.root}
                    options={states}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(state, event, value);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={get(UserSchema[state], "label")}
                        variant="outlined"
                        error={hasError(state)}
                        helperText={
                          hasError(state)
                            ? formState.errors[state].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Switch
                          name={active}
                          checked={formState.values[active]}
                          onChange={handleChange}
                          value={formState.values[active]}
                          error={hasError(active)}
                          helperText={
                            hasError(active)
                              ? formState.errors[active].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      }
                      label={get(UserSchema[active], "label")}
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item md={3} xs={12}>
                  <Autocomplete
                    id="combo-box-demo"
                    className={classes.root}
                    options={zones}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(zone, event, value);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={get(UserSchema[zone], "label")}
                        variant="outlined"
                        error={hasError(zone)}
                        helperText={
                          hasError(zone)
                            ? formState.errors[zone].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <Autocomplete
                    id="combo-box-demo"
                    className={classes.root}
                    options={rpcs}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(rpc, event, value);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={get(UserSchema[rpc], "label")}
                        variant="outlined"
                        error={hasError(rpc)}
                        helperText={
                          hasError(rpc)
                            ? formState.errors[rpc].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <Autocomplete
                    id="combo-box-demo"
                    className={classes.root}
                    options={colleges}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(college, event, value);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={get(UserSchema[college], "label")}
                        variant="outlined"
                        error={hasError(college)}
                        helperText={
                          hasError(college)
                            ? formState.errors[college].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
            </CardContent>
            <CardActions className={classes.btnspace}>
              <YellowButton type="submit" color="primary" variant="contained">
                {genericConstants.SAVE_BUTTON_TEXT}
              </YellowButton>
              <GrayButton
                type="submit"
                color="primary"
                variant="contained"
                to={routeConstants.VIEW_USER}
              >
                {genericConstants.CANCEL_BUTTON_TEXT}
              </GrayButton>
            </CardActions>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
export default Adduser;
