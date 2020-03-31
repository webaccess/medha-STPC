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

  const STATES_URL =
    strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;

  const ZONES_URL =
    strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ZONES;

  const COLLEGES_URL =
    strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES;

  const ROLES_URL =
    strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ROLES;

  /** Part for editing state */
  if (formState.dataForEdit && !formState.counter) {
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
    let paramsForPageSize = {
      pageSize: -1
    };
    serviceProvider
      .serviceProviderForGetRequest(STATES_URL, paramsForPageSize)
      .then(res => {
        setStates(res.data.result);
      })
      .catch(error => {
        console.log(error);
      });

    serviceProvider
      .serviceProviderForGetRequest(ROLES_URL, paramsForPageSize)
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
  }, [STATES_URL, ROLES_URL]);

  /** This gets data into zones, rpcs and districts when we change the state */
  useEffect(() => {
    if (formState.values[state]) {
      fetchZoneRpcDistrictData();
    }
    if (formState.values[zone] && formState.values[rpc]) {
      fetchCollegeData();
    }
    return () => {};
  }, [formState.values]);

  /** Common function to get zones, rpcs after changing state */
  async function fetchZoneRpcDistrictData() {
    let zones_url =
      STATES_URL +
      "/" +
      formState.values[state] +
      "/" +
      strapiApiConstants.STRAPI_ZONES;

    await serviceProvider
      .serviceProviderForGetRequest(zones_url)
      .then(res => {
        setZones(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });

    let rpcs_url =
      STATES_URL +
      "/" +
      formState.values[state] +
      "/" +
      strapiApiConstants.STRAPI_RPCS;

    await serviceProvider
      .serviceProviderForGetRequest(rpcs_url)
      .then(res => {
        if (Array.isArray(res.data)) {
          setRpcs(res.data[0].result);
        } else {
          setRpcs(res.data.result);
        }
      })
      .catch(error => {
        console.log("error", error);
      });

    let params = {
      pageSize: -1,
      "state.id": formState.values[state]
    };
  }

  /** Common function to get colleges after changing zone & rpc */
  async function fetchCollegeData() {
    let colleges_url =
      ZONES_URL +
      "/" +
      formState.values[zone] +
      "/" +
      strapiApiConstants.STRAPI_COLLEGES;

    await serviceProvider
      .serviceProviderForGetRequest(colleges_url)
      .then(res => {
        setColleges(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
  }

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

  /** Handle change for autocomplete fields */
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
        },
        isStateClearFilter: false
      }));
      if (eventName === state) {
        fetchZoneRpcDistrictData();
      }
      /** This is used to remove any existing errors if present in auto complete */
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
    } else {
      let setStateFilterValue = false;
      /** If we click cross for state the zone and rpc should clear off! */
      if (eventName === state) {
        /** 
        This flag is used to determine that state is cleared which clears 
        off zone and rpc by setting their value to null 
        */
        setStateFilterValue = true;
        /** 
        When state is cleared then clear rpc and zone 
        */
        setRpcs([]);
        setZones([]);
        setColleges([]);
        delete formState.values[zone];
        delete formState.values[rpc];
        delete formState.values[college];
      }
      if (eventName === zone || eventName === rpc) {
        setColleges([]);
        delete formState.values[college];
      }
      setFormState(formState => ({
        ...formState,
        isStateClearFilter: setStateFilterValue
      }));
      /** This is used to remove clear out data form auto complete when we click cross icon of auto complete */
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
      </Grid>
      <Grid spacing={3}>
        <Card>
          <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <CardContent>
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label={get(UserSchema[firstname], "label")}
                      placeholder={get(UserSchema[firstname], "placeholder")}
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
                  <Grid item md={6} xs={12}>
                    <TextField
                      label={get(UserSchema[lastname], "label")}
                      placeholder={get(UserSchema[lastname], "placeholder")}
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
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label={get(UserSchema[email], "label")}
                      placeholder={get(UserSchema[email], "placeholder")}
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
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label={get(UserSchema[contact], "label")}
                      placeholder={get(UserSchema[contact], "placeholder")}
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
                  <Grid item md={6} xs={12}>
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
                          placeholder={get(UserSchema[role], "placeholder")}
                          variant="outlined"
                          name="tester"
                          helperText={
                            hasError(role)
                              ? formState.errors[role].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      id={get(UserSchema[username], "id")}
                      label={get(UserSchema[username], "label")}
                      placeholder={get(UserSchema[username], "placeholder")}
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
                  <Grid item md={6} xs={12}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-password">
                        {get(UserSchema[password], "label")}
                      </InputLabel>
                      <OutlinedInput
                        id={get(UserSchema[password], "id")}
                        placeholder={get(UserSchema[password], "placeholder")}
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
              </Grid>
              <Divider className={classes.divider} />
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={6} xs={12}>
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
                          placeholder={get(UserSchema[state], "placeholder")}
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
                  <Grid item md={6} xs={12}>
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
                          placeholder={get(UserSchema[zone], "placeholder")}
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
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
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
                          placeholder={get(UserSchema[rpc], "placeholder")}
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
                  <Grid item md={6} xs={12}>
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
                          placeholder={get(UserSchema[college], "placeholder")}
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
                  to={routeConstants.VIEW_USER}
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
export default Adduser;
