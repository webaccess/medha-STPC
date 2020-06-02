import React, { useState, useEffect, useContext } from "react";
import UserSchema from "../UserSchema";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import { get, set } from "lodash";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useStyles from "../../ContainerStyles/AddEditPageStyles";
import * as formUtilities from "../../../utilities/FormUtilities";
import * as databaseUtilities from "../../../utilities/StrapiUtilities";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import * as genericConstants from "../../../constants/GenericConstants";
import * as roleConstants from "../../../constants/RoleConstants";
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
  Typography
} from "@material-ui/core";
import LoaderContext from "../../../context/LoaderContext";
import { YellowButton, GrayButton, Auth as auth } from "../../../components";
import { et } from "date-fns/locale";

/** Constants  declaration */
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
const blocked = "blocked";

/** URLS */
const USERS_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_CREATE_USERS;

const STATES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;

const ZONES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ZONES;

const ROLES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ROLES;

const COLLEGE_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES;

let VALIDATIONFORRPC = {
  required: {
    value: "true",
    message: "RPC is required"
  }
};
let VALIDATIONFORSTATE = {
  required: {
    value: "true",
    message: "State is required"
  }
};
let VALIDATIONFORZONE = {
  required: {
    value: "true",
    message: "Zone is required"
  }
};
let VALIDATIONFORCOLLEGE = {
  required: {
    value: "true",
    message: "College is required"
  }
};

const AddEditUser = props => {
  /** Initializing all the hooks */
  const classes = useStyles();
  const history = useHistory();
  const { setLoaderStatus } = useContext(LoaderContext);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    showPassword: false,
    isEditUser: props["editUser"] ? props["editUser"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0,
    isCollegeAdmin:
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN ? true : false
  });
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isDisable, setIsDisable] = useState(false);

  /** Part for editing user */
  if (formState.isEditUser && !formState.counter) {
    setLoaderStatus(true);
    if (props["dataForEdit"]) {
      formState.values[password] = undefined;
      if (props["dataForEdit"]["first_name"]) {
        formState.values[firstname] = props["dataForEdit"]["first_name"];
      }
      if (props["dataForEdit"]["last_name"]) {
        formState.values[lastname] = props["dataForEdit"]["last_name"];
      }
      if (
        props["dataForEdit"]["contact"] &&
        props["dataForEdit"]["contact"]["email"]
      ) {
        formState.values[email] = props["dataForEdit"]["contact"]["email"];
      }
      if (
        props["dataForEdit"]["contact"] &&
        props["dataForEdit"]["contact"]["phone"]
      ) {
        formState.values[contact] = props["dataForEdit"]["contact"]["phone"];
      }
      if (
        props["dataForEdit"]["contact"] &&
        props["dataForEdit"]["contact"]["user"] &&
        props["dataForEdit"]["contact"]["user"]["username"]
      ) {
        formState.values[username] =
          props["dataForEdit"]["contact"]["user"]["username"];
      }
      if (
        props["dataForEdit"]["contact"] &&
        props["dataForEdit"]["contact"]["user"] &&
        props["dataForEdit"]["contact"]["user"]["blocked"]
      ) {
        formState.values[blocked] =
          props["dataForEdit"]["contact"]["user"]["blocked"];
      }
      if (
        props["dataForEdit"]["contact"] &&
        props["dataForEdit"]["contact"]["user"] &&
        props["dataForEdit"]["contact"]["user"]["role"] &&
        props["dataForEdit"]["contact"]["user"]["role"]["id"]
      ) {
        formState.values[role] =
          props["dataForEdit"]["contact"]["user"]["role"]["id"];
      }
      if (
        props["dataForEdit"]["contact"] &&
        props["dataForEdit"]["contact"]["user"] &&
        props["dataForEdit"]["contact"]["user"]["role"] &&
        props["dataForEdit"]["contact"]["user"]["role"]["name"] === "Student"
      ) {
        /** For populating state */
        if (
          props["dataForEdit"] &&
          props["dataForEdit"]["contact"] &&
          props["dataForEdit"]["contact"]["state"]
        ) {
          formState.values[state] = props["dataForEdit"]["contact"]["state"];
        } else {
          formState.values[state] = "";
        }

        /** For populating zone */
        if (
          props["dataForEdit"]["organization"] &&
          props["dataForEdit"]["organization"]["zone"]
        ) {
          formState.values[zone] = props["dataForEdit"]["organization"]["zone"];
        } else {
          formState.values[zone] = "";
        }

        /** For populating rpc */
        if (
          props["dataForEdit"]["organization"] &&
          props["dataForEdit"]["organization"]["rpc"]
        ) {
          formState.values[rpc] = props["dataForEdit"]["organization"]["rpc"];
        } else {
          formState.values[rpc] = "";
        }

        /** For populating ipc */
        if (props["dataForEdit"]["organization"]) {
          formState.values[college] =
            props["dataForEdit"]["organization"]["id"];
        } else {
          formState.values[college] = "";
        }
      } else {
        /** For populating state */
        if (
          props["dataForEdit"] &&
          props["dataForEdit"]["contact"] &&
          props["dataForEdit"]["contact"]["user"] &&
          props["dataForEdit"]["contact"]["user"]["state"]
        ) {
          formState.values[state] =
            props["dataForEdit"]["contact"]["user"]["state"]["id"];
        } else {
          formState.values[state] = "";
        }

        /** For populating zone */
        if (
          props["dataForEdit"] &&
          props["dataForEdit"]["contact"] &&
          props["dataForEdit"]["contact"]["user"] &&
          props["dataForEdit"]["contact"]["user"]["zone"]
        ) {
          formState.values[zone] =
            props["dataForEdit"]["contact"]["user"]["zone"]["id"];
        } else {
          formState.values[zone] = "";
        }

        /** For populating rpc */
        if (
          props["dataForEdit"] &&
          props["dataForEdit"]["contact"] &&
          props["dataForEdit"]["contact"]["user"] &&
          props["dataForEdit"]["contact"]["user"]["rpc"]
        ) {
          formState.values[rpc] =
            props["dataForEdit"]["contact"]["user"]["rpc"]["id"];
        } else {
          formState.values[rpc] = "";
        }

        /** For populating ipc */
        if (props["dataForEdit"]["organization"]) {
          formState.values[college] =
            props["dataForEdit"]["organization"]["id"];
        } else {
          formState.values[college] = "";
        }
      }
    }
    formState.counter += 1;
  }

  /** Use Effect function to set roles */
  useEffect(() => {
    /** Initially clear all the vlidations */
    clearValidations();

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
            res.data.roles[i]["name"] !== "Public" &&
            res.data.roles[i]["name"] !== "Student"
          ) {
            roles.push(res.data.roles[i]);
          }
          if (formState.isEditUser && res.data.roles[i]["name"] === "Student") {
            roles.push(res.data.roles[i]);
          }
          if (
            formState.dataForEdit["contact"] &&
            formState.dataForEdit["contact"]["user"] &&
            formState.dataForEdit["contact"]["user"]["role"] &&
            formState.dataForEdit["contact"]["user"]["role"]["name"] ===
              "Student"
          ) {
            setIsDisable(true);
          } else {
            setIsDisable(false);
          }
        }
        setRoles(roles);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  /** This gets data into zones, rpcs and districts when we change the state */
  useEffect(() => {
    if (
      formState.values.hasOwnProperty(state) &&
      formState.values[state] !== null &&
      formState.values[state] !== undefined
    ) {
      fetchZoneRpcDistrictData();
    }
  }, [formState.values[state]]);

  /** Common function to get zones, rpcs after changing state */
  async function fetchZoneRpcDistrictData() {
    if (
      formState.values.hasOwnProperty(state) &&
      formState.values[state] !== null &&
      formState.values[state] !== undefined &&
      formState.values[state] !== ""
    ) {
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
    }
  }

  useEffect(() => {
    if (formState.values[zone] && formState.values[rpc]) {
      fetchCollegeData();
    }
  }, [formState.values[zone], formState.values[rpc]]);

  /** Function to get college data after selcting zones and rpc's */
  async function fetchCollegeData() {
    let params = {
      "zone.id": formState.values[zone],
      "rpc.id": formState.values[rpc],
      pageSize: -1
    };

    await serviceProvider
      .serviceProviderForGetRequest(COLLEGE_URL, params)
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
      /** Get dependent roles */
      if (eventName === role) {
        let roleName = value.id;
        clearValidations();
        setValidationsForDifferentRoles(roleName);
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
        clearZoneRpcCollege();
        /** 
        When state is cleared then clear rpc and zone 
        */
      }
      if (eventName === zone || eventName === rpc) {
        setColleges([]);
        delete formState.values[college];
      }
      /** Clear dependent roles */
      if (eventName === role) {
        clearZoneRpcCollege();
        delete formState.values[state];
        clearValidations();
      }
      setFormState(formState => ({
        ...formState,
        isStateClearFilter: setStateFilterValue
      }));
      /** This is used to remove clear out data form auto complete when we click cross icon of auto complete */
      delete formState.values[eventName];
    }
  };

  const clearZoneRpcCollege = () => {
    setRpcs([]);
    setZones([]);
    setColleges([]);
    delete formState.values[zone];
    delete formState.values[rpc];
    delete formState.values[college];
  };

  const clearValidations = () => {
    UserSchema[rpc]["required"] = false;
    UserSchema[state]["required"] = false;
    UserSchema[zone]["required"] = false;
    UserSchema[college]["required"] = false;
    UserSchema[rpc]["validations"] = {};
    UserSchema[state]["validations"] = {};
    UserSchema[zone]["validations"] = {};
    UserSchema[college]["validations"] = {};
  };

  const setValidationsForDifferentRoles = roleId => {
    let roleName = "";
    for (let i in roles) {
      if (roles[i]["id"] === roleId) {
        roleName = roles[i]["name"];
        break;
      }
    }
    if (roleName === roleConstants.COLLEGEADMIN || roleName === "Student") {
      UserSchema[rpc]["required"] = true;
      UserSchema[state]["required"] = true;
      UserSchema[zone]["required"] = true;
      UserSchema[college]["required"] = true;
      UserSchema[rpc]["validations"] = VALIDATIONFORRPC;
      UserSchema[state]["validations"] = VALIDATIONFORSTATE;
      UserSchema[zone]["validations"] = VALIDATIONFORZONE;
      UserSchema[college]["validations"] = VALIDATIONFORCOLLEGE;
    } else if (roleName === "RPC Admin") {
      UserSchema[rpc]["required"] = true;
      UserSchema[state]["required"] = true;
      UserSchema[rpc]["validations"] = VALIDATIONFORRPC;
      UserSchema[state]["validations"] = VALIDATIONFORSTATE;
    } else if (roleName === "Zonal Admin") {
      UserSchema[state]["required"] = true;
      UserSchema[zone]["required"] = true;
      UserSchema[state]["validations"] = VALIDATIONFORSTATE;
      UserSchema[zone]["validations"] = VALIDATIONFORZONE;
    } else if (roleName === "Medha Admin") {
      clearValidations();
    }
  };
  const handleSubmit = event => {
    event.preventDefault();
    setLoaderStatus(true);
    if (formState.isEditUser) {
      UserSchema[password]["required"] = false;
      UserSchema[password]["validations"] = {
        validatePasswordMinLength: {
          value: "true",
          message: "Password is too short"
        }
      };
      if (formState.values[role]) {
        setValidationsForDifferentRoles(formState.values[role]);
      }
    } else {
      UserSchema[password]["required"] = true;
      UserSchema[password]["validations"] = {
        required: {
          value: "true",
          message: "password is required"
        },
        validatePasswordMinLength: {
          value: "true",
          message: "Password is too short"
        }
      };
    }
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
      setLoaderStatus(false);
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
  };

  const postUserData = async () => {
    setLoaderStatus(true);
    let postData = databaseUtilities.addUser(
      formState.values[username],
      formState.values[email],
      formState.values[firstname],
      formState.values[lastname],
      formState.values[password] ? formState.values[password] : undefined,
      formState.values[contact],
      formState.values[blocked] ? formState.values[blocked] : false,
      formState.values[state] ? formState.values[state] : null,
      formState.values[zone] ? formState.values[zone] : null,
      formState.values[rpc] ? formState.values[rpc] : null,
      formState.values[college] ? formState.values[college] : null,
      formState.values[role] ? formState.values[role] : null
    );
    if (formState.isEditUser) {
      let EDIT_USER_URL =
        strapiApiConstants.STRAPI_DB_URL +
        strapiApiConstants.STRAPI_CONTACT_URL;
      let EDIT_URL = strapiApiConstants.STRAPI_EDIT_STUDENT;
      serviceProvider
        .serviceProviderForPutRequest(
          EDIT_USER_URL,
          formState.dataForEdit.contact["id"],
          postData,
          EDIT_URL
        )
        .then(res => {
          history.push({
            pathname: routeConstants.MANAGE_USER,
            fromeditUser: true,
            isDataEdited: true,
            editedUserName: res.data.result,
            editResponseMessage: "",
            editedData: {}
          });
          setLoaderStatus(false);
        })
        .catch(error => {
          history.push({
            pathname: routeConstants.MANAGE_USER,
            fromeditUser: true,
            isDataEdited: false,
            editResponseMessage: "",
            editedData: {}
          });
          setLoaderStatus(false);
        });
    } else {
      serviceProvider
        .serviceProviderForPostRequest(USERS_URL, postData)
        .then(res => {
          history.push({
            pathname: routeConstants.MANAGE_USER,
            fromAddUser: true,
            isDataAdded: true,
            addedUserName: res.data.user,
            addResponseMessage: "",
            addedData: {}
          });
          setLoaderStatus(false);
        })
        .catch(error => {
          history.push({
            pathname: routeConstants.MANAGE_USER,
            fromAddUser: true,
            isDataAdded: false,
            addResponseMessage: "",
            addedData: {}
          });
        });
      setLoaderStatus(false);
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
          {formState.isEditUser
            ? genericConstants.EDIT_USER_TITLE
            : genericConstants.ADD_USER_TITLE}
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
                      id={get(UserSchema[role], "id")}
                      className={classes.root}
                      options={roles}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(role, event, value);
                      }}
                      value={
                        roles[
                          roles.findIndex(function (item, i) {
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
                      <InputLabel
                        htmlFor="outlined-adornment-password"
                        fullWidth
                        error={hasError(password)}
                      >
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
              <Grid item md={4} xs={12}>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        name={blocked}
                        checked={formState.values[blocked] || false}
                        onChange={handleChange}
                        value={formState.values[blocked] || false}
                        error={hasError(blocked)}
                        helperText={
                          hasError(blocked)
                            ? formState.errors[blocked].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                      />
                    }
                    label={formState.values[blocked] ? "Unblock" : "Block"}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id={get(UserSchema[state], "id")}
                      className={classes.root}
                      disabled={isDisable}
                      options={states}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(state, event, value);
                      }}
                      value={
                        isDisable
                          ? null
                          : states[
                              states.findIndex(function (item, i) {
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
                      id={get(UserSchema[zone], "id")}
                      className={classes.root}
                      disabled={isDisable}
                      options={zones}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(zone, event, value);
                      }}
                      value={
                        isDisable
                          ? null
                          : zones[
                              zones.findIndex(function (item, i) {
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
                      id={get(UserSchema[rpc], "id")}
                      className={classes.root}
                      disabled={isDisable}
                      options={rpcs}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(rpc, event, value);
                      }}
                      value={
                        isDisable
                          ? null
                          : rpcs[
                              rpcs.findIndex(function (item, i) {
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
                      id={get(UserSchema[college], "id")}
                      className={classes.root}
                      disabled={isDisable}
                      options={colleges}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(college, event, value);
                      }}
                      value={
                        isDisable
                          ? null
                          : colleges[
                              colleges.findIndex(function (item, i) {
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
                  to={routeConstants.MANAGE_USER}
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
export default AddEditUser;
