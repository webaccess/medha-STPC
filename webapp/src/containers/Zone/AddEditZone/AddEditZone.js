import React, { useState, useEffect } from "react";
import { get } from "lodash";
import useStyles from "./AddEditZoneStyles";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import AddZoneForm from "../ZoneSchema";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import * as formUtilities from "../../../Utilities/FormUtilities";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Alert, GrayButton, YellowButton } from "../../../components";
import * as genericConstants from "../../../constants/GenericConstants";
import * as routeConstants from "../../../constants/RouteConstants";

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
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    isEditZone: props["editZone"] ? props["editZone"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0
  });

  const [states, setStates] = useState([]);

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
    console.log(formState);
  }

  useEffect(() => {
    serviceProviders
      .serviceProviderForGetRequest(STATES_URL)
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
          history.push({
            pathname: routeConstants.VIEW_ZONES,
            fromEditZone: true,
            isDataEdited: true,
            editResponseMessage: "",
            editedData: {}
          });
        })
        .catch(error => {
          console.log(error);
          history.push({
            pathname: routeConstants.VIEW_ZONES,
            fromEditZone: true,
            isDataEdited: false,
            editResponseMessage: "",
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
          history.push({
            pathname: routeConstants.VIEW_ZONES,
            fromAddZone: true,
            isDataAdded: true,
            addResponseMessage: "",
            addedData: {}
          });
        })
        .catch(error => {
          console.log(error);
          history.push({
            pathname: routeConstants.VIEW_ZONES,
            fromAddZone: true,
            isDataAdded: false,
            addResponseMessage: "",
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
        {formState.isEditState ? (
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
          <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <TextField
                    label={get(AddZoneForm[zone], "label")}
                    name={zone}
                    value={formState.values[zone] || ""}
                    error={hasError(zone)}
                    variant="outlined"
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
                      ] || null /** Please give a default " " blank value */
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={get(AddZoneForm[state], "label")}
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
                to={routeConstants.VIEW_ZONES}
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
export default AddEditZone;