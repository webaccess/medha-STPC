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
import moment from "moment";

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
    hideYear: false,
    isSuccess: false,
    isEditEducation: props["editEducation"] ? props["editEducation"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0,
    otherId: 0
  });

  const [boards, setBoards] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    fetchDropdowns(strapiConstants.STRAPI_BOARDS, setBoards);
    fetchDropdowns(strapiConstants.STRAPI_ACADEMIC_YEARS, setAcademicYears);
  }, []);

  useEffect(() => {
    const marksObtained = parseInt(formState.values["marksObtained"]);
    const totalMarks = parseInt(formState.values["totalMarks"]);
    if (marksObtained > 0 && marksObtained <= totalMarks && totalMarks > 0) {
      const marks = (marksObtained / totalMarks) * 100;
      delete formState.errors[percentage];
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          percentage: marks
        },
        errors: {
          ...formState.errors
        }
      }));
    }

    let updateState = false,
      errorMessage = null;
    if (marksObtained && totalMarks && marksObtained > totalMarks) {
      updateState = true;
      errorMessage = ["Marks Obtained should be less than total Marks"];
    }

    if (marksObtained <= 0) {
      updateState = true;
      errorMessage = ["Marks should be greater than 0"];
    }

    if (totalMarks <= 0) {
      updateState = true;
      errorMessage = ["Total Marks should be greater than 0"];
    }

    if (updateState) {
      formState.errors[percentage] = errorMessage;
      delete formState.values[percentage];
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values
        },
        errors: {
          ...formState.errors
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
      delete formState.values["board"];

      const currentAcademicYear = getCurrentAcademicYear();
      const undergraduate = genericConstants.QUALIFICATION_LIST.find(
        q => q.id == "undergraduate"
      );

      if (currentAcademicYear) {
        formState.values[yearOfPassing] = currentAcademicYear.id;
      }

      if (undergraduate) {
        formState.values[qualification] = undergraduate.id;
      }

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
      formState.values[qualification] == "senior_secondary" ||
      formState.values[qualification] === "graduation" ||
      formState.values[qualification] === "postgraduate" ||
      formState.values[qualification] === "diploma" ||
      formState.values[qualification] === "iti" ||
      formState.values[qualification] === "other"
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

    if (
      formState.values[qualification] == "undergraduate" ||
      formState.values[qualification] == "postgraduate"
    ) {
      delete formState.errors[board];
      delete formState.values[board];
      setFormState(formState => ({
        ...formState,
        errors: {
          ...formState.errors
        }
      }));
    }

    if (formState.values[qualification] === "other") {
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
    const url =
      strapiConstants.STRAPI_DB_URL +
      link +
      "?pageSize=-1&_sort=start_date:asc";
    axios
      .get(url)
      .then(({ data }) => {
        if (link === "boards") {
          const id = data.result
            .map(board => {
              if (board.name === "Other") return board.id;
            })
            .filter(c => c);

          setFormState(formState => ({
            ...formState,
            otherId: id[0]
          }));
        }
        const list = data.result;
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
        if (
          formState.values[qualification] === "secondary" ||
          formState.values[qualification] === "senior_secondary"
        ) {
          EducationSchema.qualification.required = false;
          EducationSchema.qualification.validations = {};
          setFormState(formState => ({
            ...formState,
            hideYear: true
          }));
        }
      }
      if (props["dataForEdit"]["other_qualification"]) {
        formState.values["otherQualification"] =
          props["dataForEdit"]["other_qualification"];
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
      if (props["dataForEdit"]["other_board"]) {
        formState.values["otherboard"] = props["dataForEdit"]["other_board"];
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
    setLoaderStatus(true);
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
    setLoaderStatus(false);
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
      defaultSchema[educationYear] = {
        ...defaultSchema[educationYear],
        required: false
      };
    }

    if (formState.values[board] === formState.otherId) {
      defaultSchema["otherboard"] = {
        label: "Other Board",
        id: "otherboard",
        autoComplete: "otherboard",
        required: true,
        placeholder: "Other board",
        autoFocus: true,
        type: "text",
        validations: {
          required: {
            value: "true",
            message: "Other board is required"
          }
        }
      };
    }

    if (
      isQualificationReq == "secondary" ||
      isQualificationReq == "senior_secondary" ||
      isQualificationReq === "graduation" ||
      isQualificationReq === "postgraduate" ||
      isQualificationReq === "diploma" ||
      isQualificationReq === "iti" ||
      isQualificationReq === "other"
    ) {
      defaultSchema[educationYear] = {
        ...defaultSchema[educationYear],
        required: false
      };
    }

    if (
      isQualificationReq == "undergraduate" ||
      isQualificationReq == "graduation" ||
      isQualificationReq === "diploma" ||
      isQualificationReq === "iti" ||
      isQualificationReq == "postgraduate"
    ) {
      defaultSchema[board] = {
        ...defaultSchema[board],
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
      defaultSchema[board] = {
        ...defaultSchema[board],
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
      formState.values[totalMarks],
      formState.values["otherboard"]
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
            setLoaderStatus(false);
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
            setLoaderStatus(false);
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
    if (eventName === qualification && value) {
      if (
        value.id === "secondary" ||
        value.id === "senior_secondary" ||
        value.id === "graduation" ||
        value.id === "postgraduate" ||
        value.id === "diploma" ||
        value.id === "iti" ||
        value.id === "other"
      ) {
        EducationSchema.qualification.required = false;
        EducationSchema.qualification.validations = {};
        setFormState(formState => ({
          ...formState,
          hideYear: true
        }));
      } else {
        setFormState(formState => ({
          ...formState,
          hideYear: false
        }));
      }
      if (value.id == "undergraduate") {
        EducationSchema.qualification.required = true;
        EducationSchema.qualification.validations = {
          required: {
            value: "true",
            message: "Education year is required"
          }
        };
      }
    } else {
      EducationSchema.qualification.required = true;
      EducationSchema.qualification.validations = {
        required: {
          value: "true",
          message: "Qualification is required"
        }
      };
      // setFormState(formState => ({
      //   ...formState,
      //   hideYear: false
      // }));
    }
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

  const getCurrentAcademicYear = () => {
    return academicYears.find(ay => {
      const { start_date, end_date } = ay;

      const start = moment(start_date);
      const end = moment(end_date);
      const current = moment();

      if (moment(current).isBetween(start, end)) {
        return ay;
      }
    });
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
      <Grid spacing={3} className={classes.formgrid}>
        <Card className={classes.root} variant="outlined">
          <form autoComplete="off" noValidate>
            <CardContent>
              <Grid item xs={8}>
                <Grid container className={classes.formgridInputFile}>
                  <Grid item xs={12} md={6} xl={3}>
                    <Grid container spacing={3}>
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
                                : "Passed"
                            }
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={12} xs={12}>
                        <Autocomplete
                          id="year-of-passing"
                          // className={claselementrootses.}
                          options={academicYears}
                          getOptionLabel={option => option.name}
                          disabled={!!formState.values[pursuing]}
                          onChange={(event, value) => {
                            handleChangeAutoComplete(
                              yearOfPassing,
                              event,
                              value
                            );
                          }}
                          value={
                            academicYears[
                              academicYears.findIndex(function (item) {
                                return (
                                  item.id === formState.values[yearOfPassing]
                                );
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
                              variant="outlined"
                              name="tester"
                              helperText={
                                hasError(yearOfPassing)
                                  ? formState.errors[yearOfPassing].map(
                                      error => {
                                        return error + " ";
                                      }
                                    )
                                  : null
                              }
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={12} xs={12}>
                        <Autocomplete
                          // className={classes.elementroot}
                          id="qualification-list"
                          options={genericConstants.QUALIFICATION_LIST}
                          getOptionLabel={option => option.name}
                          onChange={(event, value) => {
                            handleChangeAutoComplete(
                              qualification,
                              event,
                              value
                            );
                          }}
                          value={
                            genericConstants.QUALIFICATION_LIST[
                              genericConstants.QUALIFICATION_LIST.findIndex(
                                function (item) {
                                  return (
                                    item.id === formState.values[qualification]
                                  );
                                }
                              )
                            ] || null
                          }
                          renderInput={params => (
                            <TextField
                              {...params}
                              error={hasError(qualification)}
                              label="Qualification"
                              variant="outlined"
                              name="tester"
                              helperText={
                                hasError(qualification)
                                  ? formState.errors[qualification].map(
                                      error => {
                                        return error + " ";
                                      }
                                    )
                                  : null
                              }
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    {formState.values[qualification] == "other" ? (
                      <Grid container spacing={3}>
                        <Grid item md={12} xs={12}>
                          <TextField
                            fullWidth
                            id="otherQualification"
                            label="Other Qualification"
                            margin="normal"
                            name="otherQualification"
                            onChange={handleChange}
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
                            // className={classes.elementroot}
                          />
                        </Grid>
                      </Grid>
                    ) : null}
                    {!formState.hideYear ? (
                      <Grid container spacing={3}>
                        <Grid item md={12} xs={12}>
                          <Autocomplete
                            id="education-list"
                            // className={classes.elementroot}
                            options={genericConstants.EDUCATIONS}
                            getOptionLabel={option => option.value}
                            onChange={(event, value) => {
                              handleChangeAutoComplete(
                                educationYear,
                                event,
                                value
                              );
                            }}
                            value={
                              genericConstants.EDUCATIONS[
                                genericConstants.EDUCATIONS.findIndex(function (
                                  item
                                ) {
                                  return (
                                    item.id === formState.values[educationYear]
                                  );
                                })
                              ] || null
                            }
                            renderInput={params => (
                              <TextField
                                {...params}
                                error={hasError(educationYear)}
                                label="Education Year"
                                // required={
                                //   !(
                                //     formState.values[qualification] ==
                                //       "secondary" ||
                                //     formState.values[qualification] ==
                                //       "senior_secondary"
                                //   )
                                // }
                                variant="outlined"
                                name="tester"
                                helperText={
                                  hasError(educationYear)
                                    ? formState.errors[educationYear].map(
                                        error => {
                                          return error + " ";
                                        }
                                      )
                                    : null
                                }
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    ) : null}
                    <Grid container spacing={3}>
                      <Grid item md={12} xs={12}>
                        <Autocomplete
                          // className={classes.elementroot}
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
                    </Grid>
                    {formState.values[board] == formState.otherId ? (
                      <Grid container spacing={3}>
                        <Grid item md={12} xs={12}>
                          <TextField
                            fullWidth
                            id="otherboard"
                            label="Other board"
                            margin="normal"
                            name="otherboard"
                            onChange={handleChange}
                            type="text"
                            value={formState.values["otherboard"] || ""}
                            error={hasError("otherboard")}
                            helperText={
                              hasError("otherboard")
                                ? formState.errors["otherboard"].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            variant="outlined"
                            // className={classes.elementroot}
                          />
                        </Grid>
                      </Grid>
                    ) : null}
                    <Grid container spacing={3}>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          id={get(EducationSchema[marksObtained], "id")}
                          label={get(EducationSchema[marksObtained], "label")}
                          name={marksObtained}
                          onChange={handleChange}
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
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          id={get(EducationSchema[totalMarks], "id")}
                          label={get(EducationSchema[totalMarks], "label")}
                          name={totalMarks}
                          onChange={handleChange}
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
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item md={12} xs={12}>
                        <TextField
                          fullWidth
                          id={get(EducationSchema[percentage], "id")}
                          label={get(EducationSchema[percentage], "label")}
                          name={percentage}
                          onChange={handleChange}
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
                          disabled
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item md={12} xs={12}>
                        <TextField
                          fullWidth
                          id={institute}
                          label="Institute"
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
                          // className={classes.elementroot}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
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
                          color="primary"
                          variant="contained"
                          style={{ marginRight: "18px" }}
                          onClick={handleSubmit}
                        >
                          {genericConstants.SAVE_BUTTON_TEXT}
                        </YellowButton>
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <YellowButton
                          color="primary"
                          type="submit"
                          mfullWidth
                          variant="contained"
                          style={{ marginRight: "18px" }}
                          onClick={saveAndNext}
                        >
                          <span>
                            {genericConstants.SAVE_AND_NEXT_BUTTON_TEXT}
                          </span>
                        </YellowButton>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <GrayButton
                          type="submit"
                          color="primary"
                          variant="contained"
                          to={routeConstants.VIEW_EDUCATION}
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
export default AddEditEducation;
