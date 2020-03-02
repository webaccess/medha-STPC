import React, { useState } from "react";
import axios from "axios";
import { get } from "lodash";
import { Alert } from "../../../components";
import useStyles from "../AddStateStyles";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import AddStateForm from "../AddStateForm";
import * as genericConstants from "../../../constants/GenericConstants";
import * as serviceProviders from "../../../api/Axios";

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

const AddState = props => {
  const state = "state";
  const content = "content";
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false
  });

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

  const handleSubmit = event => {
    event.preventDefault();
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      AddStateForm
    );
    if (checkAllFieldsValid) {
      formState.errors = formUtilities.setErrors(
        formState.values,
        AddStateForm
      );
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        AddStateForm
      );
      formState.errors = formUtilities.setErrors(
        formState.values,
        AddStateForm
      );
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
    }
  };

  const postStateData = async () => {
    let postData = databaseUtilities.addState(formState.values[state]);
    // axios({
    //   method: "post",
    //   async: false,
    //   url: strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES,
    //   data: postData

    serviceProviders
      .serviceProviderForPostRequest(
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES,
        postData
      )
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
          {get(AddStateForm[content], "title")}
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
                <TextField
                  label={get(AddStateForm[state], "label")}
                  name={state}
                  value={formState.values[state] || ""}
                  error={hasError(state)}
                  variant="outlined"
                  required
                  fullWidth
                  onChange={handleChange}
                  helperText={
                    hasError(state)
                      ? formState.errors[state].map(error => {
                          return error + " ";
                        })
                      : null
                  }
                />
              </CardContent>
            </CardActionArea>
            <Divider />
            <CardActions>
              <Button variant="contained" color="primary" type="submit">
                {get(AddStateForm[content], "button")}
              </Button>
            </CardActions>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
export default AddState;
