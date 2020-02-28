import React, { useState, useEffect } from "react";
import axios from "axios";
import { get } from "lodash";
import useStyles from "./AddZoneStyles";
import * as strapiApiConstants from "../../constants/StrapiApiConstants";
import AddZoneForm from "./AddZoneForm";
import * as databaseUtilities from "../../Utilities/StrapiUtilities";
import * as formUtilities from "../../Utilities/FormUtilities";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {CustomRouterLink ,Alert} from "../../components";
import * as genericConstants from "../../constants/GenericConstants";
import {
  Card,
  CardHeader,
  CardActionArea,
  CardContent,
  CardActions,
  TextField,
  Grid,
  Button,
  Divider,
  Typography
} from "@material-ui/core";


const AddZone = props => {
  
  const zone = "zone";
  const state = "state";
  const content = "content";
  const classes = useStyles();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false
  });

  const [states, setStates] = useState([]);

  useEffect(() => {
    axios
      .get(strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES)
      .then(res => {
        setStates(res.data);
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
      console.log("not all keys present ", formState);
    }
    console.log(isValid, formState);
    if (isValid) {
      console.log("formValid");
      postZoneData();

      /** Call axios from here */
      setFormState(formState => ({
        ...formState,
        isValid: true
      }));
    } else {
      console.log("formInValid");
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
  };

  const postZoneData = async () => {
    let postData = databaseUtilities.addZone(
      formState.values[zone],
      formState.values[state]
        ? databaseUtilities.setState(formState.values[state])
        : null
    );
    axios({
      method: "post",
      async: false,
      url: strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_ZONES,
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

  const hasError = field => (formState.errors[field] ? true : false);

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {get(AddZoneForm[content], "title")}
        </Typography>
      </Grid>
      
      <Grid item xs={12} className={classes.formgrid}>
        
        {isSuccess ? (
          <Alert severity="success" className={classes.message}>
            {genericConstants.ALERT_SUCCESS_BUTTON_MESSAGE}
          </Alert>
        ) : null}
        {isFailed ? (
          <Alert severity="error">
            {genericConstants.ALERT_ERROR_BUTTON_MESSAGE}
          </Alert>
        ) : null}

        <Card className={classes.root} variant="outlined">
          <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <CardHeader />
            <CardActionArea>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      id="combo-box-demo"
                      className={classes.root}
                      options={states}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(state, event, value);
                      }}
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
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </CardActionArea>
            <Divider />
            <CardActions>
              <Button variant="contained" color="primary" type="submit">
                {get(AddZoneForm[content], "button")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={CustomRouterLink}
                to="/zones"
              >
                {get(AddZoneForm[content], "cancel")}
              </Button>
            </CardActions>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
export default AddZone;
