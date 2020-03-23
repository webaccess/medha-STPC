import React, { useState, useEffect } from "react";
import AddRpcSchema from "../AddRpcSchema";
import useStyles from "./AddEditRpcStyles";
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
import { Alert, GrayButton, YellowButton } from "../../../components";
import { useHistory } from "react-router-dom";

const rpcName = "rpcName";
const stateName = "stateName";
// const zoneName = "zoneName";
const collegeName = "collegeName";

const STATE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const COLLEGE_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
const ZONES_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
const RPCS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;

const AddEditRpc = props => {
  const history = useHistory();
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
    isSuccess: false,
    isEditRpc: props["editRpc"] ? props["editRpc"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0
  });

  /** Part for editing college */
  if (formState.isEditRpc && !formState.counter) {
    if (props["dataForEdit"]) {
      if (props["dataForEdit"]["name"]) {
        formState.values[rpcName] = props["dataForEdit"]["name"];
      }
      if (
        props["dataForEdit"]["state"] &&
        props["dataForEdit"]["state"]["id"]
      ) {
        formState.values[stateName] = props["dataForEdit"]["state"]["id"];
      }
      if (
        props["dataForEdit"]["main_college"] &&
        props["dataForEdit"]["main_college"]["id"]
      ) {
        formState.values[collegeName] =
          props["dataForEdit"]["main_college"]["id"];
      }

      formState.counter += 1;
    }
  }

  useEffect(() => {
    /* TO GET STATES AND COLLEGE IN AUTOCOMPLETE */

    let paramsForPageSize = {
      pageSize: 100000
    };

    serviceProviders
      .serviceProviderForGetRequest(STATE_URL, paramsForPageSize)
      .then(res => {
        setStates(res.data.result);
      });
    serviceProviders
      .serviceProviderForGetRequest(COLLEGE_URL, paramsForPageSize)
      .then(res => {
        setGetColleges(res.data.result);
      });
  }, []);

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
      formState.values[stateName] ? formState.values[stateName] : null,
      formState.values[collegeName] ? formState.values[collegeName] : null
    );
    if (formState.isEditRpc) {
      serviceProviders
        .serviceProviderForPutRequest(
          RPCS_URL,
          formState.dataForEdit["id"],
          postData
        )
        .then(res => {
          history.push({
            pathname: routeConstants.VIEW_RPC,
            fromEditRpc: true,
            isDataEdited: true,
            editResponseMessage: "",
            editedData: {}
          });
        })
        .catch(error => {
          console.log(error);
          history.push({
            pathname: routeConstants.VIEW_RPC,
            fromEditRpc: true,
            isDataEdited: false,
            editResponseMessage: "",
            editedData: {}
          });
        });
    } else {
      serviceProviders
        .serviceProviderForPostRequest(RPCS_URL, postData)
        .then(res => {
          history.push({
            pathname: routeConstants.VIEW_RPC,
            fromAddRpc: true,
            isDataAdded: true,
            addResponseMessage: "",
            addedData: {}
          });
        })
        .catch(error => {
          history.push({
            pathname: routeConstants.VIEW_RPC,
            fromAddRpc: true,
            isDataAdded: false,
            addResponseMessage: "",
            addedData: {}
          });
        });
    }
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
                    value={
                      states[
                        states.findIndex(function(item, i) {
                          return item.id === formState.values[stateName];
                        })
                      ] || null /** Please give a default " " blank value */
                    }
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
                    options={getColleges}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(collegeName, event, value);
                    }}
                    name={collegeName}
                    value={
                      getColleges[
                        getColleges.findIndex(function(item, i) {
                          return item.id === formState.values[collegeName];
                        })
                      ] || null /** Please give a default " " blank value */
                    }
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
              <YellowButton type="submit" color="primary" variant="contained">
                {genericConstants.SAVE_BUTTON_TEXT}
              </YellowButton>
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
export default AddEditRpc;
