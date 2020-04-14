import React, { useState } from "react";
import useStyles from "../StudentStyles.js";
import { get } from "lodash";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField
} from "@material-ui/core";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants.js";
import * as serviceProviders from "../../../api/Axios";
import { Alert, GrayButton, YellowButton } from "../../../components";
import { useHistory } from "react-router-dom";
import EducationSchema from "../EducationSchema.js";
import auth from "../../../components/Auth/Auth.js";
import Autocomplete from "@material-ui/lab/Autocomplete";

const qualification = "qualification";
const yearOfPassing = "yearOfPassing";
const board = "board";
const percentage = "percentage";

const AddEditEducation = props => {
  const history = useHistory();
  const classes = useStyles();
  const studentInfo = auth.getUserInfo()
    ? auth.getUserInfo().studentInfo
    : null;

  const EDUCATION_URL =
    strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EDUCATIONS;

  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    isEditEducation: props["editEducation"] ? props["editEducation"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0
  });

  /** Part for editing Education */
  if (formState.isEditEducation && !formState.counter) {
    if (props["dataForEdit"]) {
      if (props["dataForEdit"]["qualification"]) {
        formState.values[qualification] = props["dataForEdit"]["qualification"];
      }
      if (props["dataForEdit"]["year_of_passing"]) {
        formState.values[yearOfPassing] =
          props["dataForEdit"]["year_of_passing"];
      }
      if (props["dataForEdit"]["board"]) {
        formState.values[board] = props["dataForEdit"]["board"];
      }
      if (props["dataForEdit"]["percentage"]) {
        formState.values[percentage] = props["dataForEdit"]["percentage"];
      }

      formState.counter += 1;
    }
  }

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

  /** This checks if the corresponding field has errors */
  const hasError = field => (formState.errors[field] ? true : false);

  /** Handle submit handles the submit and performs all the validations */
  const handleSubmit = event => {
    let isValid = false;
    // /** Checkif all fields are present in the submitted form */
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      EducationSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        EducationSchema
      );
      /** Checks if the form is empty */
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        EducationSchema
      );
      /** This sets errors by comparing it with the json schema provided */
      formState.errors = formUtilities.setErrors(
        formState.values,
        EducationSchema
      );
    }
    if (isValid) {
      /** CALL POST FUNCTION */
      postEducationData();
    } else {
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
    event.preventDefault();
  };

  const postEducationData = async () => {
    const id = studentInfo ? studentInfo.id : null;

    let postData = databaseUtilities.addEducation(
      formState.values[qualification],
      formState.values[board],
      formState.values[yearOfPassing],
      formState.values[percentage]
    );
    console.log(postData);
    // Adding student id to post data
    postData.student = id;
    if (formState.isEditEducation) {
      serviceProviders
        .serviceProviderForPutRequest(
          EDUCATION_URL,
          formState.dataForEdit["id"],
          postData
        )
        .then(res => {
          history.push({
            pathname: routeConstants.VIEW_EDUCATION,
            fromEditEducation: true,
            isDataEdited: true,
            editResponseMessage: "",
            editedData: {}
          });
        })
        .catch(error => {
          console.log(error);
          history.push({
            pathname: routeConstants.VIEW_EDUCATION,
            fromEditEducation: true,
            isDataEdited: false,
            editResponseMessage: "",
            editedData: {}
          });
        });
    } else {
      serviceProviders
        .serviceProviderForPostRequest(EDUCATION_URL, postData)
        .then(res => {
          console.log(res);
          setIsSuccess(true);
          history.push({
            pathname: routeConstants.VIEW_EDUCATION,
            fromAddEducation: true,
            isDataAdded: true,
            addResponseMessage: "",
            addedData: {}
          });
        })
        .catch(error => {
          history.push({
            pathname: routeConstants.VIEW_EDUCATION,
            fromAddEducation: true,
            isDataAdded: false,
            addResponseMessage: "",
            addedData: {}
          });
        });
    }
  };

  const handleChangeAutoComplete = (eventName, event, value) => {
    /**TO SET VALUES OF AUTOCOMPLETE */
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [eventName]: value ? value.value : ""
      },
      touched: {
        ...formState.touched,
        [eventName]: true
      }
    }));
    if (formState.errors.hasOwnProperty(eventName)) {
      delete formState.errors[eventName];
    }
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
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
                  <Autocomplete
                    id="qualification-list"
                    className={classes.elementroot}
                    options={genericConstants.QUALIFICATIONS}
                    getOptionLabel={option => option.value}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(qualification, event, value);
                    }}
                    value={
                      genericConstants.QUALIFICATIONS[
                        genericConstants.QUALIFICATIONS.findIndex(function (
                          item
                        ) {
                          return item.value === formState.values[qualification];
                        })
                      ] || null
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(qualification)}
                        label="Qualification"
                        required
                        variant="outlined"
                        name="tester"
                        helperText={
                          hasError(qualification)
                            ? formState.errors[qualification].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    id={get(EducationSchema[yearOfPassing], "id")}
                    label={get(EducationSchema[yearOfPassing], "label")}
                    margin="normal"
                    name={yearOfPassing}
                    onChange={handleChange}
                    required
                    type={get(EducationSchema[yearOfPassing], "type")}
                    value={formState.values[yearOfPassing] || ""}
                    error={hasError(yearOfPassing)}
                    helperText={
                      hasError(yearOfPassing)
                        ? formState.errors[yearOfPassing].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    variant="outlined"
                    className={classes.elementroot}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    id={get(EducationSchema[board], "id")}
                    label={get(EducationSchema[board], "label")}
                    margin="normal"
                    name={board}
                    onChange={handleChange}
                    required
                    type={get(EducationSchema[board], "type")}
                    value={formState.values[board] || ""}
                    error={hasError(board)}
                    helperText={
                      hasError(board)
                        ? formState.errors[board].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    variant="outlined"
                    className={classes.elementroot}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    id={get(EducationSchema[percentage], "id")}
                    label={get(EducationSchema[percentage], "label")}
                    margin="normal"
                    name={percentage}
                    onChange={handleChange}
                    required
                    type={get(EducationSchema[percentage], "type")}
                    value={formState.values[percentage] || ""}
                    error={hasError(percentage)}
                    helperText={
                      hasError(percentage)
                        ? formState.errors[percentage].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    variant="outlined"
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
                to={routeConstants.VIEW_EDUCATION}
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
export default AddEditEducation;
