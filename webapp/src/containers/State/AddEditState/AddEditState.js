import React, { useState, useEffect } from "react";
import { get } from "lodash";
import useStyles from "../../ContainerStyles/AddEditPageStyles";
import * as databaseUtilities from "../../../utilities/StrapiUtilities";
import * as formUtilities from "../../../utilities/FormUtilities";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import StateSchema from "../StateSchema";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as serviceProviders from "../../../api/Axios";
import { YellowButton, GrayButton } from "../../../components";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Grid,
  Typography
} from "@material-ui/core";
import LoaderContext from "../../../context/LoaderContext";
import { useContext } from "react";

const STATES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;

const AddEditState = props => {
  const history = useHistory();
  const state = "state";
  const content = "content";
  const classes = useStyles();
  const { setLoaderStatus } = useContext(LoaderContext);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    isEditState: props["editState"] ? props["editState"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0
  });

  /** Part for editing state */
  if (formState.isEditState && !formState.counter) {
    if (props["dataForEdit"]) {
      if (props["dataForEdit"]["name"]) {
        formState.values[state] = props["dataForEdit"]["name"];
      }
    }
    formState.counter += 1;
  }

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

  const setLoader = () => {
    setLoaderStatus(true);
  };
  const handleSubmit = event => {
    event.preventDefault();
    setLoader();
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      StateSchema
    );
    if (checkAllFieldsValid) {
      formState.errors = formUtilities.setErrors(formState.values, StateSchema);
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        StateSchema
      );
      formState.errors = formUtilities.setErrors(formState.values, StateSchema);
    }
    if (isValid) {
      postStateData();

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
      setLoaderStatus(false);
    }
  };

  const postStateData = () => {
    let postData = databaseUtilities.addState(formState.values[state]);
    if (formState.isEditState) {
      serviceProviders
        .serviceProviderForPutRequest(
          STATES_URL,
          formState.dataForEdit["id"],
          postData
        )
        .then(res => {
          setLoaderStatus(false);
          history.push({
            pathname: routeConstants.MANAGE_STATES,
            fromEditState: true,
            isDataEdited: true,
            stateDataEdited: res.data,
            editResponseMessage: "",
            editedData: {}
          });
        })
        .catch(error => {
          setLoaderStatus(false);
          history.push({
            pathname: routeConstants.MANAGE_STATES,
            fromEditState: true,
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
        .serviceProviderForPostRequest(STATES_URL, postData)
        .then(res => {
          setLoaderStatus(false);
          history.push({
            pathname: routeConstants.MANAGE_STATES,
            fromAddState: true,
            addedStateData: res.data,
            isDataAdded: true,
            addResponseMessage: "",
            addedData: {}
          });
        })
        .catch(error => {
          setLoaderStatus(false);
          history.push({
            pathname: routeConstants.MANAGE_STATES,
            fromAddState: true,
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
            {genericConstants.EDIT_STATE_TEXT}
          </Typography>
        ) : (
          <Typography variant="h4" gutterBottom>
            {get(StateSchema[content], "title")}
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
                    label={get(StateSchema[state], "label")}
                    name={state}
                    value={formState.values[state] || ""}
                    error={hasError(state)}
                    placeholder={get(StateSchema[state], "placeholder")}
                    variant="outlined"
                    required
                    id="test"
                    fullWidth
                    onChange={handleChange}
                    helperText={
                      hasError(state)
                        ? formState.errors[state].map(error => {
                            return error + " ";
                          })
                        : null
                    }
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
                          to={routeConstants.MANAGE_STATES}
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
export default AddEditState;
