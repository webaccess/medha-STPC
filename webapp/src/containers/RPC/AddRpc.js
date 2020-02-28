import React, { useState, useEffect } from "react";
import AddRpcSchema from "./AddRpcSchema.js";
import useStyles from "./AddRpcStyles.js";
import { get } from "lodash";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Button,
  TextField,
  Typography
} from "@material-ui/core";
import * as formUtilities from "../../Utilities/FormUtilities";
import * as databaseUtilities from "../../Utilities/StrapiUtilities";
import * as strapiConstants from "../../constants/StrapiApiConstants";
import * as routeConstants from "../../constants/RouteConstants";
import * as genericConstants from "../../constants/GenericConstants.js";
import CustomRouterLink from "../../components/CustomRouterLink/CustomRouterLink.js";
import Alert from "../../components/Alert/Alert.js";

const rpcName = "rpcName";
const stateName = "stateName";
const zoneName = "zoneName";
const collegeName = "collegeName";

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
    axios
      .get(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES)
      .then(res => {
        setStates(res.data);
      });
    axios
      .get(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES)
      .then(res => {
        setGetColleges(res.data);
      });
  }, []);
  useEffect(() => {
    /** TO GET ZONE IN AUTOCOMPLETE ON THE CHANGE OF STATES */

    axios({
      method: "get",
      url: strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES,
      params: { "state.id": formState.values[stateName] }
    }).then(res => {
      setZones(res.data);
    });
  }, [formState.values[stateName]]);

  const handleChange = e => {
    /** TO SET VALUES IN FORMSTATE */
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

  const hasError = field => (formState.errors[field] ? true : false);

  const handleSubmit = event => {
    let isValid = false;
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
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        AddRpcSchema
      );
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
    axios({
      method: "post",
      async: false,
      url: strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS,
      data: postData
    })
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
            <CardHeader />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    id={get(AddRpcSchema[rpcName], "id")}
                    label={get(AddRpcSchema[rpcName], "label")}
                    margin="dense"
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
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    id="combo-box-demo"
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
                  />
                </Grid>
                <Grid item md={6} xs={12}>
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
                  />
                </Grid>
                <Grid item md={6} xs={12}>
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
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button type="submit" color="primary" variant="contained">
                {genericConstants.SAVE_BUTTON_TEXT}
              </Button>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                component={CustomRouterLink}
                to={routeConstants.VIEW_RPC}
              >
                {genericConstants.CANCEL_BUTTON_TEXT}
              </Button>
            </CardActions>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
export default AddRpc;
