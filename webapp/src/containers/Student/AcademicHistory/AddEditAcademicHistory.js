import React, { useState, useEffect, useContext } from "react";
import useStyles from "../StudentStyles.js";
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
import AcademicHistorySchema from "../AcademicHistorySchema";
import auth from "../../../components/Auth/Auth.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { get } from "lodash";
import LoaderContext from "../../../context/LoaderContext.js";

const academicYear = "academicYear";
const educationYear = "educationYear";
const percentage = "percentage";

const educationYearList = [
  { name: "First", id: "First" },
  { name: "Second", id: "Second" },
  { name: "Third", id: "Third" },
  { name: "Fourth", id: "Fourth" }
];

const AddEditAcademicHistory = props => {
  const history = useHistory();
  const classes = useStyles();

  const studentInfo = auth.getUserInfo()
    ? auth.getUserInfo().studentInfo
    : null;
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);

  const ACADEMIC_HISTORY_URL =
    strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACADEMIC_HISTORY;

  const ACADEMIC_YEAR_URL =
    strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ACADEMIC_YEARS;

  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    isEditAcademicHistory: props["editAcademicHistory"]
      ? props["editAcademicHistory"]
      : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0
  });

  const [academicYears, setAcademicYearList] = useState([]);

  useEffect(() => {
    setLoaderStatus(true);
    serviceProviders
      .serviceProviderForGetRequest(ACADEMIC_YEAR_URL)
      .then(res => {
        setAcademicYearList(
          res.data.result.map(({ id, name }) => ({ id, name }))
        );
      });
    setLoaderStatus(false);
  }, []);

  /** Part for editing Education */
  if (formState.isEditAcademicHistory && !formState.counter) {
    setLoaderStatus(true);
    if (props["dataForEdit"]) {
      if (props["dataForEdit"]["academic_year"]) {
        const academicYearId = props["dataForEdit"]["academic_year"]
          ? props["dataForEdit"]["academic_year"]["id"]
          : null;
        formState.values[academicYear] = academicYearId;
      }
      if (props["dataForEdit"]["education_year"]) {
        formState.values[educationYear] =
          props["dataForEdit"]["education_year"];
      }
      if (props["dataForEdit"]["percentage"]) {
        formState.values[percentage] = props["dataForEdit"]["percentage"];
      }
      formState.counter += 1;
    }
    setLoaderStatus(false);
  }

  const handleChangeAutoComplete = (eventName, event, value) => {
    /**TO SET VALUES OF AUTOCOMPLETE */
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [eventName]: value ? value.id : ""
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
    setLoaderStatus(true);
    let isValid = false;
    // /** Checkif all fields are present in the submitted form */
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      AcademicHistorySchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        AcademicHistorySchema
      );
      /** Checks if the form is empty */
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        AcademicHistorySchema
      );
      /** This sets errors by comparing it with the json schema provided */
      formState.errors = formUtilities.setErrors(
        formState.values,
        AcademicHistorySchema
      );
    }
    if (isValid) {
      /** CALL POST FUNCTION */
      postAcademicHistoryData();
    } else {
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
    setLoaderStatus(false);
    event.preventDefault();
  };

  const postAcademicHistoryData = async () => {
    const id = studentInfo ? studentInfo.id : null;

    let postData = databaseUtilities.addAcademicHistory(
      formState.values[academicYear],
      formState.values[educationYear],
      formState.values[percentage]
    );

    // Adding student id to post data
    postData.student = id;
    if (formState.isEditAcademicHistory) {
      serviceProviders
        .serviceProviderForPutRequest(
          ACADEMIC_HISTORY_URL,
          formState.dataForEdit["id"],
          postData
        )
        .then(res => {
          history.push({
            pathname: routeConstants.VIEW_ACADEMIC_HISTORY,
            fromEditAcademicHistory: true,
            isDataEdited: true,
            editResponseMessage: "",
            editedData: {}
          });
          setLoaderStatus(false);
        })
        .catch(error => {
          history.push({
            pathname: routeConstants.VIEW_ACADEMIC_HISTORY,
            fromEditAcademicHistory: true,
            isDataEdited: false,
            editResponseMessage: "",
            editedData: {}
          });
          setLoaderStatus(false);
        });
    } else {
      serviceProviders
        .serviceProviderForPostRequest(ACADEMIC_HISTORY_URL, postData)
        .then(res => {
          setIsSuccess(true);
          history.push({
            pathname: routeConstants.VIEW_ACADEMIC_HISTORY,
            fromAddAcademicHistory: true,
            isDataAdded: true,
            addResponseMessage: "",
            addedData: {}
          });
          setLoaderStatus(false);
        })
        .catch(error => {
          history.push({
            pathname: routeConstants.VIEW_ACADEMIC_HISTORY,
            fromAddAcademicHistory: true,
            isDataAdded: false,
            addResponseMessage: "",
            addedData: {}
          });
          setLoaderStatus(false);
        });
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
                    id="Academic-year-list"
                    className={classes.elementroot}
                    options={academicYears}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(academicYear, event, value);
                    }}
                    value={
                      academicYears[
                        academicYears.findIndex(function (item, i) {
                          return item.id === formState.values[academicYear];
                        })
                      ] || null
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(academicYear)}
                        label="Academic Year"
                        required
                        variant="outlined"
                        name="tester"
                        helperText={
                          hasError(academicYear)
                            ? formState.errors[academicYear].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <Autocomplete
                    id="education-year-list"
                    className={classes.elementroot}
                    options={educationYearList}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(educationYear, event, value);
                    }}
                    value={
                      educationYearList[
                        educationYearList.findIndex(function (item, i) {
                          return item.id === formState.values[educationYear];
                        })
                      ] || null
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        style={{ marginTop: "16px" }}
                        error={hasError(educationYear)}
                        label="Education Year"
                        required
                        variant="outlined"
                        name="tester"
                        helperText={
                          hasError(educationYear)
                            ? formState.errors[educationYear].map(error => {
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
                    id={get(AcademicHistorySchema[percentage], "id")}
                    label={get(AcademicHistorySchema[percentage], "label")}
                    margin="normal"
                    name={percentage}
                    onChange={handleChange}
                    required
                    type={get(AcademicHistorySchema[percentage], "type")}
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
                to={routeConstants.VIEW_ACADEMIC_HISTORY}
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
export default AddEditAcademicHistory;
