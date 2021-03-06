import React, { useState, useEffect } from "react";
import { get } from "lodash";
import useStyles from "../../ContainerStyles/AddEditPageStyles";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import AddZoneForm from "../ZoneSchema";
import * as databaseUtilities from "../../../utilities/StrapiUtilities";
import * as formUtilities from "../../../utilities/FormUtilities";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { GrayButton, YellowButton } from "../../../components";
import * as genericConstants from "../../../constants/GenericConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import { Backdrop, CircularProgress } from "@material-ui/core";

import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Grid,
  Typography
} from "@material-ui/core";
import * as serviceProviders from "../../../api/Axios";
import { useHistory } from "react-router-dom";
import LoaderContext from "../../../context/LoaderContext";
import { useContext } from "react";

const ZONE_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ZONES;
const STATES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;

const AddEditZone = props => {
  const history = useHistory();
  const zone = "zoneName";
  const state = "stateName";
  const content = "content";
  const classes = useStyles();

  const [formState, setFormState] = useState({
    backDrop: false,
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    isEditZone: props["editZone"] ? props["editZone"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0
  });

  const [states, setStates] = useState(props.option ? props.option : []);

  /** Part for editing college */
  if (formState.isEditZone && !formState.counter) {
    if (props["dataForEdit"]) {
      if (props["dataForEdit"]["name"]) {
        formState.values[zone] = props["dataForEdit"]["name"];
      }
      if (
        props["dataForEdit"]["state"] &&
        props["dataForEdit"]["state"]["id"]
      ) {
        formState.values[state] = props["dataForEdit"]["state"]["id"];
      }
      formState.counter += 1;
    }
  }

  useEffect(() => {
    let paramsForPageSize = {
      name_contains: "Uttar Pradesh"
    };
    serviceProviders
      .serviceProviderForGetRequest(STATES_URL, paramsForPageSize)
      .then(res => {
        setStates(res.data.result);
      })
      .catch(error => {
        console.log("error > ", error);
      });
  }, []);

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

  const handleChangeAutoComplete = (eventName, event, value) => {
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
      AddZoneForm
    );
    if (checkAllFieldsValid) {
      formState.errors = formUtilities.setErrors(formState.values, AddZoneForm);
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        AddZoneForm
      );
      formState.errors = formUtilities.setErrors(formState.values, AddZoneForm);
    }
    if (isValid) {
      postZoneData();

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
      formState.backDrop = false;
    }
  };

  const postZoneData = async () => {
    let postData = databaseUtilities.addZone(
      formState.values[zone],
      formState.values[state] ? formState.values[state] : null
    );
    if (formState.isEditZone) {
      serviceProviders
        .serviceProviderForPutRequest(
          ZONE_URL,
          formState.dataForEdit["id"],
          postData
        )
        .then(res => {
          formState.backDrop = false;
          history.push({
            pathname: routeConstants.MANAGE_ZONES,
            fromEditZone: true,
            isDataEdited: true,
            editedZoneData: res.data,
            editResponseMessage: "",
            editedData: {}
          });
        })
        .catch(error => {
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
          formState.backDrop = false;
          console.log(error, error.response);
          history.push({
            pathname: routeConstants.MANAGE_ZONES,
            fromEditZone: true,
            isDataEdited: false,
            editResponseMessage: errorMessage ? errorMessage : "",
            editedData: {}
          });
        });

      /** Set state to reload form */
      setFormState(formState => ({
        ...formState,
        isValid: true
      }));
    } else {
      serviceProviders
        .serviceProviderForPostRequest(ZONE_URL, postData)
        .then(res => {
          formState.backDrop = false;
          history.push({
            pathname: routeConstants.MANAGE_ZONES,
            fromAddZone: true,
            isDataAdded: true,
            addedZoneData: res.data,
            addResponseMessage: "",
            addedData: {}
          });
        })
        .catch(error => {
          formState.backDrop = false;
          console.log(error, error.response);
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
            pathname: routeConstants.MANAGE_ZONES,
            fromAddZone: true,
            isDataAdded: false,
            addResponseMessage: errorMessage ? errorMessage : "",
            addedData: {}
          });
        });

      /** Set state to reload form */
      setFormState(formState => ({
        ...formState,
        isValid: true
      }));
    }
  };

  const hasError = field => (formState.errors[field] ? true : false);

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        {formState.isEditZone ? (
          <Typography variant="h4" gutterBottom>
            {genericConstants.EDIT_ZONE_TEXT}
          </Typography>
        ) : (
          <Typography variant="h4" gutterBottom>
            {get(AddZoneForm[content], "title")}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card className={classes.root} variant="outlined">
          <form autoComplete="off" noValidate onSubmit={handleSubmit} id="form">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <TextField
                    label={get(AddZoneForm[zone], "label")}
                    name={zone}
                    value={formState.values[zone] || ""}
                    error={hasError(zone)}
                    placeholder={get(AddZoneForm[zone], "placeholder")}
                    variant="outlined"
                    id="test"
                    required
                    fullWidth
                    onChange={handleChange}
                    helperText={
                      hasError(zone)
                        ? formState.errors[zone].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    className={classes.elementroot}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Autocomplete
                    id="states-filter"
                    className={classes.root}
                    options={states}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(state, event, value);
                    }}
                    value={
                      states[
                        states.findIndex(function (item, i) {
                          return item.id === formState.values[state];
                        })
                      ] || null /** Please give a default " " blank value */
                    }
                    renderInput={params => (
                      <TextField
                        id="state-filter-test-id"
                        {...params}
                        label={get(AddZoneForm[state], "label")}
                        variant="outlined"
                        placeholder={get(AddZoneForm[state], "placeholder")}
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
                    className={classes.elementroot}
                  />
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
                          id="submit"
                          color="primary"
                          variant="contained"
                          onClick={() => {
                            formState.backDrop = true;
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
                          to={routeConstants.MANAGE_ZONES}
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
      <Backdrop className={classes.backDrop} open={formState.backDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
};
export default AddEditZone;
