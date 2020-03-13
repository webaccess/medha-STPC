import React, { useState, useEffect } from "react";
import UserSchema from "../UserSchema";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import { get } from "lodash";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useStyles from "../UserStyles";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Alert, YellowButton, GrayButton } from "../../../components";
import {
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText
} from "@material-ui/core";
import * as genericConstants from "../../../constants/GenericConstants";
import * as serviceProvider from "../../../api/Axios";
import * as routeConstants from "../../../constants/RouteConstants";
import { useHistory } from "react-router-dom";
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
  const history = useHistory();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    showPassword: false,
    isEditUser: props["editUser"] ? props["editUser"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0
  });
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [roles, setRoles] = useState([]);

  const USERS_URL =
    strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_USERS;

  /** Part for editing state */
  if (formState.isEditUser && !formState.counter) {
    if (props["dataForEdit"]) {
      if (props["dataForEdit"]["first_name"]) {
        formState.values[firstname] = props["dataForEdit"]["first_name"];
      }
      if (props["dataForEdit"]["last_name"]) {
        formState.values[lastname] = props["dataForEdit"]["last_name"];
      }
      if (props["dataForEdit"]["email"]) {
        formState.values[email] = props["dataForEdit"]["email"];
      }
      if (props["dataForEdit"]["contact_number"]) {
        formState.values[contact] = props["dataForEdit"]["contact_number"];
      }
      if (props["dataForEdit"]["username"]) {
        formState.values[username] = props["dataForEdit"]["username"];
      }
      if (props["dataForEdit"]["confirmed"]) {
        formState.values[active] = props["dataForEdit"]["confirmed"];
      }
      if (props["dataForEdit"]["role"] && props["dataForEdit"]["role"]["id"]) {
        formState.values[role] = props["dataForEdit"]["role"]["id"];
      }
      if (
        props["dataForEdit"]["state"] &&
        props["dataForEdit"]["state"]["id"]
      ) {
        formState.values[state] = props["dataForEdit"]["state"]["id"];
      }
      if (props["dataForEdit"]["zone"] && props["dataForEdit"]["zone"]["id"]) {
        formState.values[zone] = props["dataForEdit"]["zone"]["id"];
      }
      if (props["dataForEdit"]["rpc"] && props["dataForEdit"]["rpc"]["id"]) {
        formState.values[rpc] = props["dataForEdit"]["rpc"]["id"];
      }
      if (
        props["dataForEdit"]["college"] &&
        props["dataForEdit"]["college"]["id"]
      ) {
        formState.values[college] = props["dataForEdit"]["college"]["id"];
      }
    }
    formState.counter += 1;
  }

  useEffect(() => {
    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES
      )
      .then(res => {
        setStates(res.data.result);
      })
      .catch(error => {
        console.log(error);
      });

    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ZONES
      )
      .then(res => {
        setZones(res.data.result);
      })
      .catch(error => {
        console.log(error);
      });

    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_RPCS
      )
      .then(res => {
        setRpcs(res.data.result);
      })
      .catch(error => {
        console.log(error);
      });

    serviceProvider
      .serviceProviderForGetRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES
      )
      .then(res => {
        setColleges(res.data.result);
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
    if (formState.isEditUser) {
      serviceProvider
        .serviceProviderForPutRequest(
          USERS_URL,
          formState.dataForEdit["id"],
          postData
        )
        .then(res => {
          history.push({
            pathname: routeConstants.VIEW_USER,
            fromeditUser: true,
            isDataEdited: true,
            editResponseMessage: "",
            editedData: {}
          });
        })
        .catch(error => {
          history.push({
            pathname: routeConstants.VIEW_USER,
            fromeditUser: true,
            isDataEdited: false,
            editResponseMessage: "",
            editedData: {}
          });
        });
    } else {
      serviceProvider
        .serviceProviderForPostRequest(USERS_URL, postData)
        .then(res => {
          history.push({
            pathname: routeConstants.VIEW_USER,
            fromAddUser: true,
            isDataAdded: true,
            addResponseMessage: "",
            addedData: {}
          });
        })
        .catch(error => {
          history.push({
            pathname: routeConstants.VIEW_USER,
            fromAddUser: true,
            isDataAdded: false,
            addResponseMessage: "",
            addedData: {}
          });
        });
    }
  };

  const handleClickShowPassword = () => {
    setFormState({ ...formState, showPassword: !formState.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
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
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      {get(UserSchema[password], "label")}
                    </InputLabel>
                    <OutlinedInput
                      id={get(UserSchema[password], "id")}
                      name={password}
                      required
                      fullWidth
                      error={hasError(password)}
                      type={formState.showPassword ? "text" : "password"}
                      value={formState.values[password] || ""}
                      onChange={handleChange}
                      endAdornment={
                        <InputAdornment position="end">
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
                    />
                    <FormHelperText error={hasError(password)}>
                      {hasError(password)
                        ? formState.errors[password].map(error => {
                            return error + " ";
                          })
                        : null}
                    </FormHelperText>
                  </FormControl>
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
                    value={
                      roles[
                        roles.findIndex(function(item, i) {
                          return item.id === formState.values[role];
                        })
                      ] || null
                    }
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
                    value={
                      states[
                        states.findIndex(function(item, i) {
                          return item.id === formState.values[state];
                        })
                      ] || null
                    }
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
                    value={
                      zones[
                        zones.findIndex(function(item, i) {
                          return item.id === formState.values[zone];
                        })
                      ] || null
                    }
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
                    value={
                      rpcs[
                        rpcs.findIndex(function(item, i) {
                          return item.id === formState.values[rpc];
                        })
                      ] || null
                    }
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
                    value={
                      colleges[
                        colleges.findIndex(function(item, i) {
                          return item.id === formState.values[college];
                        })
                      ] || null
                    }
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
