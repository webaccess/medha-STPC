import React, { useState, useContext, useEffect } from "react";
import useStyles from "../StudentStyles.js";
import { get } from "lodash";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  FormGroup,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import * as formUtilities from "../../../utilities/FormUtilities";
import * as databaseUtilities from "../../../utilities/StrapiUtilities";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants.js";
import * as serviceProviders from "../../../api/Axios";
import { Alert, GrayButton, YellowButton } from "../../../components";
import { useHistory } from "react-router-dom";
import EducationSchema from "../EducationSchema.js";
import auth from "../../../components/Auth/Auth.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LoaderContext from "../../../context/LoaderContext";
import axios from "axios";

const yearOfPassing = "yearOfPassing";
const educationYear = "educationYear";
const percentage = "percentage";
const qualification = "qualification";
const institute = "institute";
const pursuing = "pursuing";
const board = "board";
const marksObtained = "marksObtained";
const totalMarks = "totalMarks";

const AddEditEducation = props => {
  const history = useHistory();
  const classes = useStyles();
  const studentInfo =
    auth.getUserInfo() !== null &&
    auth.getUserInfo().role.name === roleConstants.STUDENT
      ? auth.getUserInfo().studentInfo.contact.id
      : auth.getStudentIdFromCollegeAdmin();

  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);

  const EDUCATION_URL =
    strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EDUCATIONS;

  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    flag: 0,
    isSuccess: false,
    isEditEducation: props["editEducation"] ? props["editEducation"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0
  });

  const [boards, setBoards] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    fetchDropdowns(strapiConstants.STRAPI_BOARDS, setBoards);
    fetchDropdowns(strapiConstants.STRAPI_ACADEMIC_YEARS, setAcademicYears);
  }, []);

  useEffect(() => {
    const marksObtained = formState.values["marksObtained"];
    const totalMarks = formState.values["totalMarks"];
    if (
      marksObtained &&
      totalMarks &&
      marksObtained <= totalMarks &&
      totalMarks > 0
    ) {
      const marks = (marksObtained / totalMarks) * 100;

      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          percentage: marks
        }
      }));
    }
  }, [formState.values["marksObtained"], formState.values["totalMarks"]]);

  useEffect(() => {
    const pursuing = formState.values["pursuing"];
    if (pursuing) {
      delete formState.values["marksObtained"];
      delete formState.values["totalMarks"];
      delete formState.values["percentage"];
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values
        }
      }));
    }
  }, [formState.values[pursuing]]);

  useEffect(() => {
    if (!formState.values["otherQualification"]) {
      delete formState.values["otherQualification"];
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values
        }
      }));
    }
  }, [formState.values["otherQualification"]]);

  useEffect(() => {
    if (
      formState.values[qualification] == "secondary" ||
      formState.values[qualification] == "senior_secondary"
    ) {
      delete formState.errors[educationYear];
      delete formState.values[educationYear];
      setFormState(formState => ({
        ...formState,
        errors: {
          ...formState.errors
        }
      }));
    }
  }, [formState.values[qualification]]);

  const fetchDropdowns = (link, setList) => {
    const url = strapiConstants.STRAPI_DB_URL + link;
    axios
      .get(url)
      .then(({ data }) => {
        const list = data.result.map(({ id, name }) => ({ id, name }));
        setList(list);
      })
      .catch(error => {
        console.log(error);
      });
  };

  /** Part for editing Education */
  if (formState.isEditEducation && !formState.counter) {
    setLoaderStatus(true);
    if (props["dataForEdit"]) {
      if (props["dataForEdit"]["year_of_passing"]) {
        formState.values[yearOfPassing] =
          props["dataForEdit"]["year_of_passing"]["id"];
      }
      if (props["dataForEdit"]["education_year"]) {
        formState.values[educationYear] =
          props["dataForEdit"]["education_year"];
      }
      if (props["dataForEdit"]["percentage"]) {
        formState.values[percentage] = props["dataForEdit"]["percentage"];
      }
      if (props["dataForEdit"]["qualification"]) {
        formState.values[qualification] = props["dataForEdit"]["qualification"];
      }
      if (props["dataForEdit"]["institute"]) {
        formState.values[institute] = props["dataForEdit"]["institute"];
      }
      if (props["dataForEdit"]["pursuing"]) {
        formState.values[pursuing] = props["dataForEdit"]["pursuing"];
      }

      if (props["dataForEdit"]["board"]) {
        formState.values[board] = props["dataForEdit"]["board"]["id"];
      }

      if (props["dataForEdit"]["marks_obtained"]) {
        formState.values[marksObtained] =
          props["dataForEdit"]["marks_obtained"];
      }
      if (props["dataForEdit"]["total_marks"]) {
        formState.values[totalMarks] = props["dataForEdit"]["total_marks"];
      }

      formState.counter += 1;
    }
    setLoaderStatus(false);
  }

  /** This handle change is used to handle changes to text field */
  const handleChange = event => {
    /** TO SET VALUES IN FORMSTATE */
    event.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value
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

    if (event.target.name == "pursuing") {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values
        },
        errors: {}
      }));
    }
  };

  /** This checks if the corresponding field has errors */
  const hasError = field => (formState.errors[field] ? true : false);

  /** Handle submit handles the submit and performs all the validations */
  const handleSubmit = event => {
    const schema = getSchema();
    let isValid = false;
    // /** Checkif all fields are present in the submitted form */
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      schema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(formState.values, schema);
      /** Checks if the form is empty */
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        schema
      );
      /** This sets errors by comparing it with the json schema provided */
      formState.errors = formUtilities.setErrors(formState.values, schema);
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

  const getSchema = () => {
    let defaultSchema = Object.assign({}, EducationSchema);
    const isPursuing = formState.values[pursuing];
    const isQualificationReq = formState.values[qualification];

    const isOtherSelected = formState.values[qualification];
    if (isOtherSelected == "other") {
      defaultSchema["otherQualification"] = {
        label: "Other qualification",
        id: "otherQualification",
        autoComplete: "otherQualification",
        required: true,
        placeholder: "Other qualification",
        autoFocus: true,
        type: "number",
        validations: {
          required: {
            value: "true",
            message: "Other qualification is required"
          }
        }
      };
    }

    if (
      isQualificationReq == "secondary" ||
      isQualificationReq == "senior_secondary"
    ) {
      defaultSchema[educationYear] = {
        ...defaultSchema[educationYear],
        required: false
      };
    }

    if (isPursuing) {
      defaultSchema[percentage] = {
        ...defaultSchema[percentage],
        required: false
      };
      defaultSchema[marksObtained] = {
        ...defaultSchema[marksObtained],
        required: false
      };
      defaultSchema[totalMarks] = {
        ...defaultSchema[totalMarks],
        required: false
      };
    }

    return defaultSchema;
  };

  const postEducationData = async () => {
    // const id = studentInfo ? studentInfo.id : null;

    let postData = databaseUtilities.addEducation(
      formState.values[yearOfPassing],
      formState.values[educationYear],
      formState.values[percentage],
      formState.values[qualification],
      formState.values[institute],
      formState.values[pursuing],
      formState.values[board],
      formState.values["otherQualification"],
      formState.values[marksObtained],
      formState.values[totalMarks]
    );
    // Adding student id to post data
    postData.contact = studentInfo;
    if (formState.isEditEducation) {
      serviceProviders
        .serviceProviderForPutRequest(
          EDUCATION_URL,
          formState.dataForEdit["id"],
          postData
        )
        .then(res => {
          if (formState.flag === 1) {
            history.push({
              pathname: routeConstants.VIEW_DOCUMENTS
            });
          } else {
            history.push({
              pathname: routeConstants.VIEW_EDUCATION,
              fromEditEducation: true,
              isDataEdited: true,
              editResponseMessage: "",
              editedData: {}
            });
          }
          setLoaderStatus(false);
        })
        .catch(error => {
          console.log(error);
          history.push({
            pathname: routeConstants.VIEW_EDUCATION,
            fromEditEducation: true,
            isDataEdited: false,
            editResponseMessage: "",
            editedData: {},
            error: error.response.data ? error.response.data.message : ""
          });
          setLoaderStatus(false);
        });
    } else {
      serviceProviders
        .serviceProviderForPostRequest(EDUCATION_URL, postData)
        .then(res => {
          setIsSuccess(true);
          if (formState.flag === 1) {
            history.push({
              pathname: routeConstants.VIEW_DOCUMENTS
            });
          } else {
            history.push({
              pathname: routeConstants.VIEW_EDUCATION,
              fromAddEducation: true,
              isDataAdded: true,
              addResponseMessage: "",
              addedData: {}
            });
          }
          setLoaderStatus(false);
        })
        .catch(error => {
          console.log("POSTEDUCATION", error.response);
          history.push({
            pathname: routeConstants.VIEW_EDUCATION,
            fromAddEducation: true,
            isDataAdded: false,
            addResponseMessage: "",
            addedData: {},
            error: error.response.data ? error.response.data.message : ""
          });
          setLoaderStatus(false);
        });
    }
  };

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

  const saveAndNext = event => {
    event.preventDefault();
    formState["flag"] = 1;
    handleSubmit(event);
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
          <form autoComplete="off" noValidate>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={12} xs={12}>
                  <Autocomplete
                    id="year-of-passing"
                    className={classes.elementroot}
                    options={academicYears}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(yearOfPassing, event, value);
                    }}
                    value={
                      academicYears[
                        academicYears.findIndex(function (item) {
                          return item.id === formState.values[yearOfPassing];
                        })
                      ] || null
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(yearOfPassing)}
                        label={
                          formState.values["pursuing"]
                            ? "Current Year"
                            : "Year of passing"
                        }
                        required
                        variant="outlined"
                        name="tester"
                        helperText={
                          hasError(yearOfPassing)
                            ? formState.errors[yearOfPassing].map(error => {
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
                    className={classes.elementroot}
                    id="qualification-list"
                    options={genericConstants.QUALIFICATION_LIST}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(qualification, event, value);
                    }}
                    value={
                      genericConstants.QUALIFICATION_LIST[
                        genericConstants.QUALIFICATION_LIST.findIndex(function (
                          item
                        ) {
                          return item.id === formState.values[qualification];
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
                {formState.values[qualification] == "other" ? (
                  <Grid item md={12} xs={12}>
                    <TextField
                      fullWidth
                      id="otherQualification"
                      label="Other Qualification"
                      margin="normal"
                      name="otherQualification"
                      onChange={handleChange}
                      required
                      type="text"
                      value={formState.values["otherQualification"] || ""}
                      error={hasError("otherQualification")}
                      helperText={
                        hasError("otherQualification")
                          ? formState.errors["otherQualification"].map(
                              error => {
                                return error + " ";
                              }
                            )
                          : null
                      }
                      variant="outlined"
                      className={classes.elementroot}
                    />
                  </Grid>
                ) : null}

                <Grid item md={12} xs={12}>
                  <Autocomplete
                    id="education-list"
                    className={classes.elementroot}
                    options={genericConstants.EDUCATIONS}
                    getOptionLabel={option => option.value}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(educationYear, event, value);
                    }}
                    value={
                      genericConstants.EDUCATIONS[
                        genericConstants.EDUCATIONS.findIndex(function (item) {
                          return item.id === formState.values[educationYear];
                        })
                      ] || null
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(educationYear)}
                        label="Education Year"
                        required={
                          !(
                            formState.values[qualification] == "secondary" ||
                            formState.values[qualification] ==
                              "senior_secondary"
                          )
                        }
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
                  <Autocomplete
                    className={classes.elementroot}
                    id="board-list"
                    options={boards}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(board, event, value);
                    }}
                    value={
                      boards[
                        boards.findIndex(function (item) {
                          return item.id === formState.values[board];
                        })
                      ] || null
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(board)}
                        label="Board"
                        required
                        variant="outlined"
                        name="tester"
                        helperText={
                          hasError(board)
                            ? formState.errors[board].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Switch
                          name={pursuing}
                          checked={formState.values[pursuing] || false}
                          onChange={handleChange}
                          value={formState.values[pursuing] || false}
                        />
                      }
                      label={
                        formState.values[pursuing] === true
                          ? "Pursuing"
                          : "Not Pursuing"
                      }
                    />
                  </FormGroup>
                </Grid>
                <Grid item md={12} xs={12}>
                  <div className={classes.FlexGrow}>
                    <Grid container>
                      <Grid item>
                        <TextField
                          fullWidth
                          id={get(EducationSchema[marksObtained], "id")}
                          label={get(EducationSchema[marksObtained], "label")}
                          margin="normal"
                          name={marksObtained}
                          onChange={handleChange}
                          required
                          type={get(EducationSchema[marksObtained], "type")}
                          value={formState.values[marksObtained] || ""}
                          error={hasError(marksObtained)}
                          helperText={
                            hasError(marksObtained)
                              ? formState.errors[marksObtained].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                          variant="outlined"
                          disabled={!!formState.values[pursuing]}
                        />
                      </Grid>
                      <Grid item style={{ marginLeft: "8px" }}>
                        <TextField
                          fullWidth
                          id={get(EducationSchema[totalMarks], "id")}
                          label={get(EducationSchema[totalMarks], "label")}
                          margin="normal"
                          name={totalMarks}
                          onChange={handleChange}
                          required
                          type={get(EducationSchema[totalMarks], "type")}
                          value={formState.values[totalMarks] || ""}
                          error={hasError(totalMarks)}
                          helperText={
                            hasError(totalMarks)
                              ? formState.errors[totalMarks].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                          variant="outlined"
                          disabled={!!formState.values[pursuing]}
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
                          disabled={!formState.isEditEducation}
                        />
                      </Grid>
                    </Grid>
                  </div>
                  <Grid item md={12} xs={12}>
                    <TextField
                      fullWidth
                      id={institute}
                      label="Institute"
                      margin="normal"
                      name={institute}
                      onChange={handleChange}
                      type="text"
                      value={formState.values[institute] || ""}
                      error={hasError(institute)}
                      helperText={
                        hasError(institute)
                          ? formState.errors[institute].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      variant="outlined"
                      className={classes.elementroot}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
            <Grid item xs={12} className={classes.CardActionGrid}>
              <CardActions className={classes.btnspace}>
                <YellowButton
                  type="submit"
                  color="primary"
                  variant="contained"
                  style={{ marginRight: "18px" }}
                  onClick={handleSubmit}
                >
                  {genericConstants.SAVE_BUTTON_TEXT}
                </YellowButton>
                <YellowButton
                  color="primary"
                  type="submit"
                  mfullWidth
                  variant="contained"
                  style={{ marginRight: "18px" }}
                  onClick={saveAndNext}
                >
                  <span>{genericConstants.SAVE_AND_NEXT_BUTTON_TEXT}</span>
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
            </Grid>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};
export default AddEditEducation;
