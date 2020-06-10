import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
  CardActions,
  Button,
  Divider
} from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { Auth as auth, InlineDatePicker } from "../../../../components";
import useStyles from "../../../ContainerStyles/AddEditPageStyles";
import * as routeConstants from "../../../../constants/RouteConstants";
import * as _ from "lodash";
import * as genericConstants from "../../../../constants/GenericConstants.js";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Autocomplete from "@material-ui/lab/Autocomplete";
import GrayButton from "../../../../components/GrayButton/GrayButton.js";
import YellowButton from "../../../../components/YellowButton/YellowButton.js";
import * as strapiApiConstants from "../../../../constants/StrapiApiConstants.js";
import * as formUtilities from "../../../../utilities/FormUtilities.js";
import * as databaseUtilities from "../../../../utilities/StrapiUtilities.js";
import registrationSchema from "../AddEditStudentSchema";
import { useHistory } from "react-router-dom";
import * as serviceProvider from "../../../../api/Axios.js";
import LoaderContext from "../../../../context/LoaderContext";
import { get } from "lodash";
import Img from "react-image";
import Spinner from "../../../../components/Spinner/Spinner.js";

const STATES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;
const DISTRICTS_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_DISTRICTS;

const AddEditStudentForCollegeAdmin = props => {
  const { setLoaderStatus } = useContext(LoaderContext);
  const [selectedDate, setSelectedDate] = React.useState(null);

  const defaultParams = {
    pageSize: -1
  };

  const genderlist = [
    { name: "Male", id: "male" },
    { name: "Female", id: "female" },
    { name: "Other", id: "other" }
  ];

  const futureAspirationsList = [
    { id: "private_job", name: "Private Job" },
    { id: "others", name: "Others" },
    { id: "higher_studies", name: "Higher Studies" },
    { id: "marriage", name: "Marriage" },
    { id: "entrepreneurship", name: "Entrepreneurship" },
    { id: "government_jobs", name: "Government Job" },
    { id: "apprenticeship", name: "Apprenticeship" }
  ];

  const physicallyHandicappedlist = [
    { name: "Yes", id: true },
    { name: "No", id: false }
  ];

  let history = useHistory();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    fatherFirstName: "",
    fatherLastName: "",
    address: "",
    district: null,
    state: null,
    email: "",
    contactNumber: "",
    userName: "",
    password: "",
    gender: "",
    physicallyHandicapped: null,
    college: null,
    stream: null,
    currentAcademicYear: null,
    collegeRollNumber: null,
    otp: "",
    futureAspirations: null
  });

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isDateOfBirthPresent: true,
    isdateOfBirthValid: true,
    isSuccess: false,
    showPassword: false,
    isStateClearFilter: false,
    addStudent: props.location.addStudent ? props.location.addStudent : false,
    editStudent: props.location.editStudent
      ? props.location.editStudent
      : false,
    dataForEdit: props.location.dataForEdit ? props.location.dataForEdit : [],
    counter: 0,
    files: null,
    previewFile: {},
    showPreview: false,
    showEditPreview: props.location.editStudent
      ? props.location.dataForEdit.profile_photo
        ? true
        : false
      : false,
    showNoImage: props.location.editStudent ? false : props.location.editStudent
  });

  const { layout: Layout } = props;
  const classes = useStyles();
  const [statelist, setstatelist] = useState([]);
  const [districtlist, setdistrictlist] = useState([]);
  const [streamlist, setStreamlist] = useState([]);
  const [collegelist] = useState([auth.getUserInfo().studentInfo.organization]);

  useEffect(() => {
    if (!formState.editStudent && !formState.addStudent) {
      history.push({
        pathname: routeConstants.MANAGE_STUDENT
      });
    } else if (formState.addStudent) {
      formState.values[
        "college"
      ] = auth.getUserInfo().studentInfo.organization.id;
    }

    if (formState.editStudent) {
      registrationSchema["password"]["required"] = false;
      registrationSchema["password"]["validations"] = {
        validatePasswordMinLength: {
          value: "true",
          message: "Password is too short"
        }
      };
    } else if (formState.addStudent) {
      registrationSchema["password"]["required"] = true;
      registrationSchema["password"]["validations"] = {
        required: {
          value: "true",
          message: "Password is required"
        },
        validatePasswordMinLength: {
          value: "true",
          message: "Password is too short"
        }
      };
    }

    getStates();
    getStreams();
  }, []);

  const getStreams = () => {
    let streamsArray = [];
    for (let i in auth.getUserInfo().studentInfo.organization.stream_strength) {
      streamsArray.push(
        auth.getUserInfo().studentInfo.organization.stream_strength[i]["stream"]
      );
    }
    setStreamlist(streamsArray);
  };

  const getStates = () => {
    serviceProvider
      .serviceProviderForGetRequest(STATES_URL, defaultParams, {})
      .then(res => {
        setstatelist(res.data.result.map(({ id, name }) => ({ id, name })));
      });
  };

  const getDistrict = () => {
    let params = {
      pageSize: -1,
      "state.id": formState.values["state"]
    };

    if (formState.values["state"] !== undefined) {
      serviceProvider
        .serviceProviderForGetRequest(DISTRICTS_URL, params)
        .then(res => {
          setdistrictlist(
            res.data.result.map(({ id, name }) => ({ id, name }))
          );
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  };

  useEffect(() => {
    if (formState.values["state"]) {
      getDistrict();
    }
    return () => {};
  }, [formState.values["state"]]);

  if (formState.dataForEdit && !formState.counter) {
    if (props.location["dataForEdit"]) {
      if (props.location["dataForEdit"]["first_name"]) {
        formState.values["firstname"] =
          props.location["dataForEdit"]["first_name"];
      }
      if (props.location["dataForEdit"]["middle_name"]) {
        formState.values["middlename"] =
          props.location["dataForEdit"]["middle_name"];
      }
      if (props.location["dataForEdit"]["last_name"]) {
        formState.values["lastname"] =
          props.location["dataForEdit"]["last_name"];
      }
      if (
        props.location["dataForEdit"]["contact"] &&
        props.location["dataForEdit"]["contact"]["user"] &&
        props.location["dataForEdit"]["contact"]["user"]["email"]
      ) {
        formState.values["email"] =
          props.location["dataForEdit"]["contact"]["user"]["email"];
      }
      if (
        props.location["dataForEdit"]["contact"] &&
        props.location["dataForEdit"]["contact"]["phone"]
      ) {
        formState.values["contact"] =
          props.location["dataForEdit"]["contact"]["phone"];
      }
      if (
        props.location["dataForEdit"]["contact"] &&
        props.location["dataForEdit"]["contact"]["user"] &&
        props.location["dataForEdit"]["contact"]["user"]["username"]
      ) {
        formState.values["username"] =
          props.location["dataForEdit"]["contact"]["user"]["username"];
      }

      if (
        props.location["dataForEdit"]["contact"] &&
        props.location["dataForEdit"]["contact"]["state"]
      ) {
        formState.values["state"] =
          props.location["dataForEdit"]["contact"]["state"];
      }
      if (props.location["dataForEdit"]["stream"]) {
        formState.values["stream"] =
          props.location["dataForEdit"]["stream"]["id"];
      }

      if (
        props.location["dataForEdit"]["contact"] &&
        props.location["dataForEdit"]["contact"]["district"]
      ) {
        formState.values["district"] =
          props.location["dataForEdit"]["contact"]["district"]["id"];
      }
      if (props.location["dataForEdit"]["father_full_name"]) {
        formState.values["fatherFullName"] =
          props.location["dataForEdit"]["father_full_name"];
      }
      if (props.location["dataForEdit"]["mother_full_name"]) {
        formState.values["motherFullName"] =
          props.location["dataForEdit"]["mother_full_name"];
      }
      if (props.location["dataForEdit"]["contact"]["address_1"]) {
        formState.values["address"] =
          props.location["dataForEdit"]["contact"]["address_1"];
      }
      if (props.location["dataForEdit"]["gender"]) {
        formState.values["gender"] = props.location["dataForEdit"]["gender"];
      }

      if (props.location["dataForEdit"]["roll_number"]) {
        formState.values["rollnumber"] =
          props.location["dataForEdit"]["roll_number"];
      }
      if (props.location["dataForEdit"]["future_aspirations"]) {
        formState.values["futureAspirations"] =
          props.location["dataForEdit"]["future_aspirations"];
        console.log(props.location["dataForEdit"]["future_aspirations"]);
        formState["futureAspirations"] = props.location["dataForEdit"][
          "future_aspirations"
        ].map(value => value.id);
      }
      if (props.location["dataForEdit"]["is_physically_challenged"] !== null) {
        formState.values["physicallyHandicapped"] =
          props.location["dataForEdit"]["is_physically_challenged"];
      }
      if (props.location["dataForEdit"]["future_aspirations"]) {
        formState.values["futureAspirations"] =
          props.location["dataForEdit"]["future_aspirations"];
      }
      if (
        props.location["dataForEdit"]["organization"] &&
        props.location["dataForEdit"]["organization"]["id"]
      ) {
        formState.values["college"] =
          props.location["dataForEdit"]["organization"]["id"];
      }
      if (props.location["dataForEdit"]["date_of_birth"]) {
        setSelectedDate(
          new Date(props.location["dataForEdit"]["date_of_birth"])
        );
      }
      if (
        props.location["dataForEdit"]["profile_photo"] &&
        props.location["dataForEdit"]["profile_photo"]["id"]
      ) {
        formState.previewFile = props.location["dataForEdit"]["profile_photo"];
        //      formState.values["files"] =
        //        props.location["dataForEdit"]["upload_logo"]["name"];
      }
    }
    formState.counter += 1;
  }

  const handleSubmit = event => {
    setLoaderStatus(true);
    let schema;
    if (formState.editStudent) {
      schema = Object.assign({}, _.omit(registrationSchema, ["otp"]));
    } else {
      schema = Object.assign(
        {},
        _.omit(registrationSchema, ["futureAspirations"])
      );
    }
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      schema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(formState.values, schema);

      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        schema
      );
      formState.errors = formUtilities.setErrors(formState.values, schema);
    }

    if (selectedDate === null) {
      formState.isDateOfBirthPresent = false;
    } else {
      formState.isdateOfBirthValid = formUtilities.validateDateOfBirth(
        selectedDate
      );
      formState.isDateOfBirthPresent = true;
    }

    if (
      isValid &&
      formState.isDateOfBirthPresent &&
      formState.isdateOfBirthValid
    ) {
      /** CALL POST FUNCTION */
      postStudentData();

      /** Call axios from here */
      setFormState(formState => ({
        ...formState,
        isValid: true
      }));
    } else {
      setLoaderStatus(false);
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
  };

  const postStudentData = () => {
    let postData;
    if (formState.editStudent) {
      postData = databaseUtilities.editStudent(
        formState.values["firstname"],
        formState.values["middlename"],
        formState.values["lastname"],
        formState.values["fatherFullName"],
        formState.values["motherFullName"],
        formState.values["address"],
        formState.values["state"] ? formState.values["state"] : null,
        formState.values["district"] ? formState.values["district"] : null,
        formState.values["email"],
        formState.values["contact"],
        formState.values["username"],
        formState.values["gender"],
        selectedDate.getFullYear() +
          "-" +
          (selectedDate.getMonth() + 1) +
          "-" +
          selectedDate.getDate(),
        formState.values["physicallyHandicapped"] ? true : false,
        formState.values["college"],
        formState.values["stream"],
        parseInt(formState.values["rollnumber"]),
        formState.dataForEdit.id,
        formState.values["futureAspirations"]
          ? formState["futureAspirations"]
          : null,
        formState.files,
        formState.values["password"] ? formState.values["password"] : undefined
      );
      let studentName =
        props.location["dataForEdit"]["first_name"] +
        " " +
        props.location["dataForEdit"]["father_first_name"] +
        " " +
        props.location["dataForEdit"]["last_name"];

      let EDIT_STUDENT_URL =
        strapiApiConstants.STRAPI_DB_URL +
        strapiApiConstants.STRAPI_CONTACT_URL;
      let EDIT_URL = strapiApiConstants.STRAPI_EDIT_STUDENT;
      serviceProvider
        .serviceProviderForPutRequest(
          EDIT_STUDENT_URL,
          formState.dataForEdit.contact.id,
          postData,
          EDIT_URL
        )
        .then(response => {
          setLoaderStatus(false);
          history.push({
            pathname: routeConstants.MANAGE_STUDENT,
            fromEditStudent: true,
            isStudentEdited: true,
            messageForEditStudent:
              "Student " + studentName + " has been edited successfully."
          });
        })
        .catch(err => {
          setLoaderStatus(false);
          console.log(JSON.stringify(err));
          history.push({
            pathname: routeConstants.MANAGE_STUDENT,
            fromEditStudent: true,
            isStudentEdited: false,
            messageForEditStudent:
              "An error has occured while updating student " +
              studentName +
              ". Kindly, try again."
          });
        });
    } else {
      postData = databaseUtilities.addStudentFromCollege(
        formState.values["firstname"],
        formState.values["middlename"],
        formState.values["lastname"],
        formState.values["fatherFullName"],
        formState.values["motherFullName"],
        formState.values["address"],
        formState.values["state"] ? formState.values["state"] : null,
        formState.values["district"] ? formState.values["district"] : null,
        formState.values["email"],
        formState.values["contact"],
        formState.values["username"],
        formState.values["password"],
        formState.values["gender"],
        selectedDate.getFullYear() +
          "-" +
          (selectedDate.getMonth() + 1) +
          "-" +
          selectedDate.getDate(),
        formState.values["physicallyHandicapped"] ? true : false,
        formState.values["college"],
        formState.values["stream"],
        parseInt(formState.values["rollnumber"]),
        formState.files,
        formState.values["futureAspirations"]
          ? formState["futureAspirations"]
          : null
      );
      console.log(postData);
      let url =
        strapiApiConstants.STRAPI_DB_URL +
        strapiApiConstants.STRAPI_CREATE_USERS;
      serviceProvider
        .serviceProviderForPostRequest(url, postData)
        .then(response => {
          setLoaderStatus(false);
          history.push({
            pathname: routeConstants.MANAGE_STUDENT,
            fromAddStudent: true,
            isStudentAdded: true,
            messageForAddStudent:
              "Student " +
              formState.values["firstname"] +
              " " +
              formState.values["fatherFirstName"] +
              " " +
              formState.values["lastname"] +
              " has been added successfully"
          });
        })
        .catch(err => {
          setLoaderStatus(false);
          console.log(err);
          history.push({
            pathname: routeConstants.MANAGE_STUDENT,
            fromAddStudent: true,
            isStudentAdded: false,
            messageForAddStudent:
              "An error has occured while adding student " +
              formState.values["firstname"] +
              " " +
              formState.values["fatherFirstName"] +
              " " +
              formState.values["lastname"] +
              ". Kindly, try again. "
          });
        });
    }
  };

  const handleChange = e => {
    /** TO SET VALUES IN FORMSTATE */
    e.persist();
    setFormState(formState => ({
      ...formState,

      values: {
        ...formState.values,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value
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
        },
        isStateClearFilter: false
      }));
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
    } else {
      let setStateFilterValue = false;
      /** If we click cross for state the district should clear off! */
      if (eventName === "state") {
        /** 
        This flag is used to determine that state is cleared which clears 
        off district by setting their value to null 
        */
        setStateFilterValue = true;
        /** 
        When state is cleared then clear district
        */
        setdistrictlist([]);
        delete formState.values["district"];
      }
      setFormState(formState => ({
        ...formState,
        isStateClearFilter: setStateFilterValue
      }));
      /** This is used to remove clear out data form auto complete when we click cross icon of auto complete */
      delete formState.values[eventName];
    }
  };

  const handleChangefile = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,

      values: {
        ...formState.values,
        [e.target.name]: e.target.files[0].name
      },
      touched: {
        ...formState.touched,
        [e.target.name]: true
      },
      files: e.target.files[0],
      previewFile: URL.createObjectURL(e.target.files[0]),
      showPreview: true,
      showEditPreview: false,
      showNoImage: false
    }));
    if (formState.errors.hasOwnProperty(e.target.name)) {
      delete formState.errors[e.target.name];
    }
  };

  const handleClickShowPassword = () => {
    setFormState({
      ...formState,
      showPassword: !formState.showPassword
    });
  };

  const hasError = field => (formState.errors[field] ? true : false);

  return (
    <Grid>
      {console.log(formState)}
      <Grid item xs={12} className={classes.title}>
        {formState.editStudent ? null : (
          <Typography variant="h4" gutterBottom>
            Add Student
          </Typography>
        )}
      </Grid>
      <Grid>
        <Card>
          <form autoComplete="off">
            <CardContent>
              <Grid item xs={12} md={6} xl={3}>
                <Grid container className={classes.formgridInputFile}>
                  <Grid item md={10} xs={12}>
                    <div className={classes.imageDiv}>
                      {formState.showPreview ? (
                        <Img
                          alt="abc"
                          loader={<Spinner />}
                          className={classes.UploadImage}
                          src={formState.previewFile}
                        />
                      ) : null}
                      {!formState.showPreview && !formState.showEditPreview ? (
                        <div className={classes.DefaultNoImage}></div>
                      ) : null}
                      {/* {formState.showEditPreview&&formState.dataForEdit.upload_logo===null? <div class={classes.DefaultNoImage}></div>:null} */}
                      {formState.showEditPreview &&
                      formState.dataForEdit["profile_photo"] !== null &&
                      formState.dataForEdit["profile_photo"] !== undefined &&
                      formState.dataForEdit["profile_photo"] !== {} ? (
                        <Img
                          src={
                            strapiApiConstants.STRAPI_DB_URL_WITHOUT_HASH +
                            formState.dataForEdit["profile_photo"]["url"]
                          }
                          loader={<Spinner />}
                          className={classes.UploadImage}
                        />
                      ) : null}
                      {formState.showNoImage ? (
                        <Img
                          src="/images/noImage.png"
                          loader={<Spinner />}
                          className={classes.UploadImage}
                        />
                      ) : null}
                    </div>
                  </Grid>
                </Grid>
                <Grid container className={classes.MarginBottom}>
                  <Grid item md={10} xs={12}>
                    <TextField
                      fullWidth
                      id="files"
                      margin="normal"
                      name="files"
                      placeholder="Upload Logo"
                      onChange={handleChangefile}
                      required
                      type="file"
                      inputProps={{ accept: "image/*" }}
                      //value={formState.values["files"] || ""}
                      error={hasError("files")}
                      helperText={
                        hasError("files")
                          ? formState.errors["files"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      variant="outlined"
                      className={classes.inputFile}
                    />
                    <label htmlFor={get(registrationSchema["files"], "id")}>
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        fullWidth
                        className={classes.InputFileButton}
                        startIcon={<AddOutlinedIcon />}
                      >
                        ADD PROFILE PHOTO
                      </Button>
                    </label>
                  </Grid>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.formgrid}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label={get(registrationSchema["firstname"], "label")}
                      name="firstname"
                      placeholder={get(
                        registrationSchema["firstname"],
                        "placeholder"
                      )}
                      value={formState.values["firstname"] || ""}
                      variant="outlined"
                      error={hasError("firstname")}
                      required
                      fullWidth
                      onChange={handleChange}
                      helperText={
                        hasError("firstname")
                          ? formState.errors["firstname"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>{" "}
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label="Middle Name"
                      name="middlename"
                      value={formState.values["middlename"]}
                      variant="outlined"
                      error={hasError("middlename")}
                      required
                      fullWidth
                      onChange={handleChange}
                      helperText={
                        hasError("middlename")
                          ? formState.errors["middlename"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label={get(registrationSchema["lastname"], "label")}
                      name="lastname"
                      placeholder={get(
                        registrationSchema["lastname"],
                        "placeholder"
                      )}
                      value={formState.values["lastname"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      error={hasError("lastname")}
                      onChange={handleChange}
                      helperText={
                        hasError("lastname")
                          ? formState.errors["lastname"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label={get(registrationSchema["fatherFullName"], "label")}
                      name="fatherFullName"
                      placeholder={get(
                        registrationSchema["fatherFullName"],
                        "placeholder"
                      )}
                      value={formState.values["fatherFullName"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      error={hasError("fatherFullName")}
                      helperText={
                        hasError("fatherFullName")
                          ? formState.errors["fatherFullName"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label={get(registrationSchema["motherFullName"], "label")}
                      name="motherFullName"
                      placeholder={get(
                        registrationSchema["motherFullName"],
                        "placeholder"
                      )}
                      value={formState.values["motherFullName"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      error={hasError("motherFullName")}
                      helperText={
                        hasError("motherFullName")
                          ? formState.errors["motherFullName"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label={get(registrationSchema["address"], "label")}
                      name="address"
                      placeholder={get(
                        registrationSchema["address"],
                        "placeholder"
                      )}
                      value={formState.values["address"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      error={hasError("address")}
                      helperText={
                        hasError("address")
                          ? formState.errors["address"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="states-filter"
                      className={classes.root}
                      options={statelist}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("state", event, value);
                      }}
                      value={
                        formState.isStateClearFilter
                          ? null
                          : statelist[
                              statelist.findIndex(function (item, i) {
                                return item.id === formState.values.state;
                              })
                            ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError("state")}
                          label={get(registrationSchema["state"], "label")}
                          placeholder={get(
                            registrationSchema["state"],
                            "placeholder"
                          )}
                          variant="outlined"
                          name="state"
                          helperText={
                            hasError("state")
                              ? formState.errors["state"].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="district-filter"
                      className={classes.root}
                      options={districtlist}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("district", event, value);
                      }}
                      value={
                        formState.isStateClearFilter
                          ? null
                          : districtlist[
                              districtlist.findIndex(function (item, i) {
                                return item.id === formState.values.district;
                              })
                            ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError("district")}
                          label={get(registrationSchema["district"], "label")}
                          placeholder={get(
                            registrationSchema["district"],
                            "placeholder"
                          )}
                          variant="outlined"
                          name="district"
                          helperText={
                            hasError("district")
                              ? formState.errors["district"].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <InlineDatePicker
                      className={classes.dateField}
                      format="dd/MM/yyyy"
                      id="date-picker-inline"
                      placeholder="DD/MM//YYYY"
                      label={get(registrationSchema["dateofbirth"], "label")}
                      value={selectedDate}
                      onChange={date => {
                        formState.isDateOfBirthPresent = true;
                        formState.isdateOfBirthValid = true;
                        setSelectedDate(date);
                      }}
                      error={
                        !formState.isDateOfBirthPresent ||
                        !formState.isdateOfBirthValid
                      }
                      helperText={
                        !formState.isDateOfBirthPresent
                          ? "Date of Birth is required"
                          : !formState.isdateOfBirthValid
                          ? "Date of birth cannot be greater than current date"
                          : null
                      }
                      KeyboardButtonProps={{
                        "aria-label": "change date"
                      }}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="gender-filter"
                      className={classes.root}
                      options={genderlist}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("gender", event, value);
                      }}
                      value={
                        genderlist[
                          genderlist.findIndex(function (item, i) {
                            return item.id === formState.values.gender;
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError("gender")}
                          label={get(registrationSchema["gender"], "label")}
                          placeholder={get(
                            registrationSchema["gender"],
                            "placeholder"
                          )}
                          required
                          variant="outlined"
                          name="tester"
                          helperText={
                            hasError("gender")
                              ? formState.errors["gender"].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label={get(registrationSchema["contact"], "label")}
                      placeholder={get(
                        registrationSchema["contact"],
                        "placeholder"
                      )}
                      name="contact"
                      value={formState.values["contact"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      error={hasError("contact")}
                      helperText={
                        hasError("contact")
                          ? formState.errors["contact"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="physically-handicapped-id"
                      className={classes.root}
                      options={physicallyHandicappedlist}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(
                          "physicallyHandicapped",
                          event,
                          value
                        );
                      }}
                      value={
                        physicallyHandicappedlist[
                          physicallyHandicappedlist.findIndex(function (
                            item,
                            i
                          ) {
                            return (
                              item.id === formState.values.physicallyHandicapped
                            );
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError("physicallyHandicapped")}
                          label={get(
                            registrationSchema["physicallyHandicapped"],
                            "label"
                          )}
                          placeholder={get(
                            registrationSchema["physicallyHandicapped"],
                            "placeholder"
                          )}
                          variant="outlined"
                          name="tester"
                          helperText={
                            hasError("physicallyHandicapped")
                              ? formState.errors["physicallyHandicapped"].map(
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
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={12} xs={12}>
                    <TextField
                      label={get(registrationSchema["email"], "label")}
                      placeholder={get(
                        registrationSchema["email"],
                        "placeholder"
                      )}
                      name="email"
                      value={formState.values["email"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      error={hasError("email")}
                      helperText={
                        hasError("email")
                          ? formState.errors["email"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={12} xs={12}>
                    <Autocomplete
                      id="college-filter"
                      className={classes.root}
                      options={collegelist}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("college", event, value);
                      }}
                      value={
                        collegelist[
                          collegelist.findIndex(function (item, i) {
                            return item.id === formState.values.college;
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError("college")}
                          label={get(registrationSchema["college"], "label")}
                          placeholder={get(
                            registrationSchema["college"],
                            "placeholder"
                          )}
                          variant="outlined"
                          required
                          name="college"
                          helperText={
                            hasError("college")
                              ? formState.errors["college"].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="stream-filter"
                      className={classes.root}
                      options={streamlist}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete("stream", event, value);
                      }}
                      value={
                        streamlist[
                          streamlist.findIndex(function (item, i) {
                            return item.id === formState.values.stream;
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError("stream")}
                          label={get(registrationSchema["stream"], "label")}
                          placeholder={get(
                            registrationSchema["stream"],
                            "placeholder"
                          )}
                          variant="outlined"
                          name="stream"
                          helperText={
                            hasError("stream")
                              ? formState.errors["stream"].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label={get(registrationSchema["rollnumber"], "label")}
                      placeholder={get(
                        registrationSchema["rollnumber"],
                        "placeholder"
                      )}
                      name="rollnumber"
                      value={formState.values["rollnumber"] || ""}
                      variant="outlined"
                      fullWidth
                      required
                      onChange={handleChange}
                      error={hasError("rollnumber")}
                      helperText={
                        hasError("rollnumber")
                          ? formState.errors["rollnumber"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label={get(registrationSchema["username"], "label")}
                      placeholder={get(
                        registrationSchema["username"],
                        "placeholder"
                      )}
                      name="username"
                      value={formState.values["username"] || ""}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      error={hasError("username")}
                      helperText={
                        hasError("username")
                          ? formState.errors["username"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel
                        htmlFor="outlined-adornment-password"
                        fullWidth
                        error={hasError("password")}
                      >
                        Password
                      </InputLabel>
                      <OutlinedInput
                        label={get(registrationSchema["password"], "label")}
                        placeholder={get(
                          registrationSchema["password"],
                          "placeholder"
                        )}
                        name="password"
                        type={formState.showPassword ? "text" : "password"}
                        value={formState.values[user.password]}
                        required
                        fullWidth
                        onChange={handleChange}
                        error={hasError("password")}
                        helperText={
                          hasError("password")
                            ? formState.errors["password"].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                        endAdornment={
                          <InputAdornment
                            position="end"
                            error={hasError("password")}
                          >
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {formState.showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        labelWidth={70}
                      />
                      <FormHelperText error={hasError("password")}>
                        {hasError("password")
                          ? formState.errors["password"].map(error => {
                              return error + " ";
                            })
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {formState.editStudent ? (
                    <Grid item md={6} xs={12}>
                      <Autocomplete
                        id="combo-box-demo"
                        className={classes.root}
                        options={futureAspirationsList}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(
                            "futureAspirations",
                            event,
                            value
                          );
                        }}
                        value={
                          futureAspirationsList[
                            futureAspirationsList.findIndex(function (item, i) {
                              return (
                                item.id === formState.values.futureAspirations
                              );
                            })
                          ] || null
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError("futureAspirations")}
                            label="Future Aspirations"
                            variant="outlined"
                            name="tester"
                            helperText={
                              hasError("futureAspirations")
                                ? formState.errors["futureAspirations"].map(
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
                  ) : null}
                </Grid>
              </Grid>
            </CardContent>
            <Grid item xs={12} className={classes.CardActionGrid}>
              <CardActions className={classes.btnspace}>
                <YellowButton
                  color="primary"
                  type="submit"
                  mfullWidth
                  variant="contained"
                  style={{ marginRight: "18px" }}
                  onClick={event => {
                    event.preventDefault();
                    handleSubmit(event);
                  }}
                >
                  <span>{genericConstants.SAVE_BUTTON_TEXT}</span>
                </YellowButton>
                <GrayButton
                  color="primary"
                  type="submit"
                  mfullWidth
                  variant="contained"
                  onClick={() => {
                    history.push(routeConstants.MANAGE_STUDENT);
                  }}
                >
                  <span>{genericConstants.CANCEL_BUTTON_TEXT}</span>
                </GrayButton>
              </CardActions>
            </Grid>
          </form>
        </Card>
      </Grid>
    </Grid>
    // </Layout>
  );
};
export default AddEditStudentForCollegeAdmin;
