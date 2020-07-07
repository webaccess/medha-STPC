import React, { useState, useEffect } from "react";
import AddRpcSchema from "../AddRpcSchema";
import useStyles from "../../ContainerStyles/AddEditPageStyles";
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
import * as formUtilities from "../../../utilities/FormUtilities";
import * as databaseUtilities from "../../../utilities/StrapiUtilities";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants.js";
import * as serviceProviders from "../../../api/Axios";
import { Alert, GrayButton, YellowButton } from "../../../components";
import { useHistory } from "react-router-dom";
import LoaderContext from "../../../context/LoaderContext";
import { useContext } from "react";

const rpcName = "rpcName";
const stateName = "stateName";
const collegeName = "collegeName";

const STATE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const RPCS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS;

const AddEditRpc = props => {
  const history = useHistory();
  const classes = useStyles();
  const [states, setStates] = useState(props.option ? props.option : []);
  const [getColleges, setGetColleges] = useState(
    props.collegeOption ? props.collegeOption : []
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const { setLoaderStatus } = useContext(LoaderContext);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    isStateClearFilter: false,
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
      name_contains: "Uttar Pradesh"
    };

    serviceProviders
      .serviceProviderForGetRequest(STATE_URL, paramsForPageSize)
      .then(res => {
        setStates(res.data.result);
      });
  }, []);

  useEffect(() => {
    if (formState.values[stateName]) {
      let COLLEGE_URL =
        strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_STATES +
        "/" +
        formState.values[stateName] +
        "/" +
        strapiConstants.STRAPI_ORGANIZATION +
        "/" +
        formState.dataForEdit["id"] +
        "/rpc";
      serviceProviders.serviceProviderForGetRequest(COLLEGE_URL).then(res => {
        setGetColleges(res.data);
      });
    }
    return () => {};
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
        },
        isStateClearFilter: false
      }));

      /** This is used to remove any existing errors if present in auto complete */
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
    } else {
      let setStateFilterValue = false;
      /** If we click cross for state the college should clear off! */
      if (eventName === stateName) {
        /** 
        This flag is used to determine that state is cleared which clears 
        off college by setting their value to null 
        */
        setStateFilterValue = true;
        /** 
        When state is cleared then clear college
        */
        setGetColleges([]);
        delete formState.values[collegeName];
      }
      setFormState(formState => ({
        ...formState,
        isStateClearFilter: setStateFilterValue
      }));
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
      setLoaderStatus(false);
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
          setLoaderStatus(false);
          history.push({
            pathname: routeConstants.MANAGE_RPC,
            fromEditRpc: true,
            isDataEdited: true,
            editedRPCData: res.data,
            editResponseMessage: "",
            editedData: {}
          });
        })
        .catch(error => {
          setLoaderStatus(false);
          console.log("Put ERROR", error, error.response);
          let errorMessage;

          if (
            error.response !== undefined &&
            error.response.status !== undefined &&
            error.response.status === 400
          ) {
            if (error.response.data["message"]) {
              errorMessage = error.response.data["message"];
            }
          }
          history.push({
            pathname: routeConstants.MANAGE_RPC,
            fromEditRpc: true,
            isDataEdited: false,
            editResponseMessage: errorMessage ? errorMessage : "",
            editedData: {}
          });
        });
    } else {
      serviceProviders
        .serviceProviderForPostRequest(RPCS_URL, postData)
        .then(res => {
          setLoaderStatus(false);
          history.push({
            pathname: routeConstants.MANAGE_RPC,
            fromAddRpc: true,
            isDataAdded: true,
            addedRPCData: res.data,
            addResponseMessage: "",
            addedData: {}
          });
        })
        .catch(error => {
          console.log(error, error.response);
          setLoaderStatus(false);
          let errorMessage;

          if (
            error.response !== undefined &&
            error.response.status !== undefined &&
            error.response.status === 400
          ) {
            if (error.response.data["message"]) {
              errorMessage = error.response.data["message"];
            }
          }
          history.push({
            pathname: routeConstants.MANAGE_RPC,
            fromAddRpc: true,
            isDataAdded: false,
            addResponseMessage: errorMessage ? errorMessage : "",
            addedData: {}
          });
        });
    }
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        {formState.isEditRpc ? (
          <Typography variant="h4" gutterBottom>
            {genericConstants.EDIT_RPC_TEXT}
          </Typography>
        ) : (
          <Typography variant="h4" gutterBottom>
            {genericConstants.ADD_RPC_TITLE}
          </Typography>
        )}
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
                    placeholder={get(AddRpcSchema[rpcName], "placeholder")}
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
                      formState.isStateClearFilter
                        ? null
                        : states[
                            states.findIndex(function (item, i) {
                              return item.id === formState.values[stateName];
                            })
                          ] || null /** Please give a default " " blank value */
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(stateName)}
                        placeholder={get(
                          AddRpcSchema[stateName],
                          "placeholder"
                        )}
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
                {formState.isEditRpc ? (
                  <Grid item md={12} xs={12}>
                    <Autocomplete
                      id={get(AddRpcSchema[collegeName], "id")}
                      options={getColleges}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(collegeName, event, value);
                      }}
                      name={collegeName}
                      value={
                        formState.isStateClearFilter
                          ? null
                          : getColleges[
                              getColleges.findIndex(function (item, i) {
                                return (
                                  item.id === formState.values[collegeName]
                                );
                              })
                            ] ||
                            null /** Please give a default " " blank value */
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError(collegeName)}
                          placeholder={get(
                            AddRpcSchema[collegeName],
                            "placeholder"
                          )}
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
                    />{" "}
                  </Grid>
                ) : null}
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
                          onClick={() => {
                            setLoaderStatus(true);
                          }}
                        >
                          {genericConstants.SAVE_BUTTON_TEXT}
                        </YellowButton>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <GrayButton
                          type="submit"
                          color="primary"
                          variant="contained"
                          to={routeConstants.MANAGE_RPC}
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
export default AddEditRpc;
