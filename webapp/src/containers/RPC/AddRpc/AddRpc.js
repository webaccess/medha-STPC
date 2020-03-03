import React, { useState, useEffect } from "react";
import AddRpcSchema from "../AddRpcSchema";
import useStyles from "./AddRpcStyles";
import { get } from "lodash";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Typography
} from "@material-ui/core";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants.js";
import * as serviceProviders from "../../../api/Axios";
import { Alert, GrayButton, GreenButton } from "../../../components";

const rpcName = "rpcName";
const stateName = "stateName";
const zoneName = "zoneName";
const collegeName = "collegeName";

const STATE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const COLLEGE_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const RPCS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;

const AddRpc = props => {
  const classes = useStyles();
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [getColleges, setGetColleges] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false
  });

  useEffect(() => {
    /* TO GET STATES AND COLLEGE IN AUTOCOMPLETE */
    serviceProviders.serviceProviderForGetRequest(STATE_URL).then(res => {
      setStates(res.data);
    });
    serviceProviders.serviceProviderForGetRequest(COLLEGE_URL).then(res => {
      setGetColleges(res.data);
    });
  }, []);

  useEffect(() => {}, [zones]);

  useEffect(() => {
    /** TO GET ZONE IN AUTOCOMPLETE ON THE CHANGE OF STATES */
    let url =
      STATE_URL +
      "/" +
      formState.values[stateName] +
      "/" +
      strapiConstants.STRAPI_ZONES;
    serviceProviders
      .serviceProviderForGetRequest(url)
      .then(res => {
        setZones(res.data[0].zones);
      })
      .catch(error => {
        console.log("error", error);
      });
  }, [formState.values[stateName]]);

  /** This handle change is used to handle changes to text field */
  const handleChange = event => {
    /** TO SET VALUES IN FORMSTATE */
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));

    /** This is used to remove any existing errors if present in text field */
    if (formState.errors.hasOwnProperty(event.target.name)) {
      delete formState.errors[event.target.name];
    }
  };

  /** This handle change is used to handle changes to auto complete */
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

      /** This is used to remove any existing errors if present in auto complete */
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
    } else {
      /** This is used to remove clear out data form auto complete when we click cross icon of auto complete */
      delete formState.values[eventName];
    }
  };

  /** This checks if the corresponding field has errors */
  const hasError = field => (formState.errors[field] ? true : false);

  /** Handle submit handles the submit and performs all the validations */
  const handleSubmit = event => {
    let isValid = false;
    /** Checkif all fields are present in the submitted form */
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      AddRpcSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        AddRpcSchema
      );
      /** Checks if the form is empty */
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        AddRpcSchema
      );
      /** This sets errors by comparing it with the json schema provided */
      formState.errors = formUtilities.setErrors(
        formState.values,
        AddRpcSchema
      );
    }
    if (isValid) {
      /** CALL POST FUNCTION */
      postRpcData();
    } else {
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
    event.preventDefault();
  };

  const postRpcData = async () => {
    let postData = databaseUtilities.addRpc(
      formState.values[rpcName],
      formState.values[zoneName]
        ? databaseUtilities.setZone(formState.values[zoneName])
        : null,
      formState.values[collegeName]
        ? databaseUtilities.setMainCollege(formState.values[collegeName])
        : null
    );

    serviceProviders
      .serviceProviderForPostRequest(RPCS_URL, postData)
      .then(res => {
        console.log(res);
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

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.ADD_RPC_TITLE}
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
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    id={get(AddRpcSchema[rpcName], "id")}
                    label={get(AddRpcSchema[rpcName], "label")}
                    margin="normal"
                    name={rpcName}
                    onChange={handleChange}
                    required
                    type={get(AddRpcSchema[rpcName], "type")}
                    value={formState.values[rpcName] || ""}
                    error={hasError(rpcName)}
                    helperText={
                      hasError(rpcName)
                        ? formState.errors[rpcName].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    variant="outlined"
                    className={classes.elementroot}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Autocomplete
                    id={get(AddRpcSchema[stateName], "id")}
                    options={states}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(stateName, event, value);
                    }}
                    name={stateName}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(stateName)}
                        helperText={
                          hasError(stateName)
                            ? formState.errors[stateName].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                        value={option => option.id}
                        name={stateName}
                        key={option => option.id}
                        label={get(AddRpcSchema[stateName], "label")}
                        variant="outlined"
                      />
                    )}
                    className={classes.elementroot}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Autocomplete
                    id="combo-box-demo"
                    options={zones}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(zoneName, event, value);
                    }}
                    name={zoneName}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(zoneName)}
                        helperText={
                          hasError(zoneName)
                            ? formState.errors[zoneName].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                        value={option => option.id}
                        name={zoneName}
                        key={option => option.id}
                        label={get(AddRpcSchema[zoneName], "label")}
                        variant="outlined"
                      />
                    )}
                    className={classes.elementroot}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Autocomplete
                    id="combo-box-demo"
                    options={getColleges}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(collegeName, event, value);
                    }}
                    name={collegeName}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(collegeName)}
                        helperText={
                          hasError(collegeName)
                            ? formState.errors[collegeName].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                        value={option => option.id}
                        name={collegeName}
                        key={option => option.id}
                        label={get(AddRpcSchema[collegeName], "label")}
                        variant="outlined"
                      />
                    )}
                    className={classes.elementroot}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions className={classes.btnspace}>
              <GreenButton type="submit" color="primary" variant="contained">
                {genericConstants.SAVE_BUTTON_TEXT}
              </GreenButton>
              <GrayButton
                type="submit"
                color="primary"
                variant="contained"
                to={routeConstants.VIEW_RPC}
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
export default AddRpc;
