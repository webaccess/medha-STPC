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
  Divider,
  FormControlLabel,
  Checkbox,
  Backdrop,
  CircularProgress
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
import Axios from "axios";

const STATES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;
const DISTRICTS_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_DISTRICTS;

const AddEditStudentForCollegeAdmin = props => {
  const [selectedDate, setSelectedDate] = useState(
    props.forTestingDate ? new Date("1999-03-25") : null
  );
  const [backDrop, setBackDrop] = useState(false);

  const defaultParams = {
    pageSize: -1
  };

  const genderlist = [
    { name: "Male", id: "male" },
    { name: "Female", id: "female" },
    { name: "Other", id: "other" }
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
    dataToShowForMultiSelect: [],
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
    flag: 0,
    files: null,
    previewFile: {},
    showPreview: false,
    showEditPreview: props.location.editStudent
      ? props.location.dataForEdit.profile_photo
        ? true
        : false
      : false,
    showNoImage: props.location.editStudent
      ? false
      : props.location.editStudent,
    addressSameAsLocal: false,
    addresses: genericConstants.ADDRESSES
  });

  const { layout: Layout } = props;
  const classes = useStyles();

  const [statelist, setstatelist] = useState(
    props.mockStateList ? props.mockStateList : []
  );
  const [districtlist, setdistrictlist] = useState(
    props.mockdistrictList ? props.mockdistrictList : []
  );
  const [streamlist, setStreamlist] = useState(
    props.mockstreamList ? props.mockstreamList : []
  );
  const [futureAspirant, setFutureAspirant] = useState(
    props.mockFutureAspiration ? props.mockFutureAspiration : []
  );
  const [collegelist] = useState([auth.getUserInfo().studentInfo.organization]);
  const [validateAddress, setValidateAddress] = useState([]);

  useEffect(() => {
    if (!formState.editStudent) {
      if (formState.addressSameAsLocal) {
        const address = formState.addresses.find(
          addr => addr.address_type == "Temporary"
        );
        const copyAddresses = formState.addresses.map(addr => {
          if (addr.address_type == "Permanent") {
            return { ...address, address_type: "Permanent" };
          } else {
            return addr;
          }
        });

        setFormState(formState => ({
          ...formState,
          addresses: copyAddresses
        }));
      } else {
        const address = genericConstants.ADDRESSES.find(
          addr => addr.address_type == "Permanent"
        );

        const resetPermanentAddress = formState.addresses.map(addr => {
          if (addr.address_type == "Permanent") {
            return address;
          } else {
            return addr;
          }
        });
        setFormState(formState => ({
          ...formState,
          addresses: resetPermanentAddress
        }));
      }
    }
  }, [formState.addressSameAsLocal]);

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
    getFutureAspirant();
    getStates();
    getStreams();
    getDistrict();
  }, []);

  const getFutureAspirant = () => {
    let futureAspirationsUrl =
      strapiApiConstants.STRAPI_DB_URL +
      strapiApiConstants.STRAPI_FUTURE_ASPIRATIONS;
    serviceProvider
      .serviceProviderForGetRequest(futureAspirationsUrl)
      .then(res => {
        setFutureAspirant(res.data.result);
        prePopulateFutureAspirant(res.data.result);
      })
      .catch(error => {
        console.log("errorfuture", error);
      });
  };

  const prePopulateFutureAspirant = data => {
    if (formState.editStudent) {
      if (
        formState["dataForEdit"]["future_aspirations"] &&
        formState["dataForEdit"]["future_aspirations"].length !== 0
      ) {
        let array = [];
        data.map(aspirantData => {
          for (let i in formState["dataForEdit"]["future_aspirations"]) {
            if (
              formState["dataForEdit"]["future_aspirations"][i]["id"] ===
              aspirantData["id"]
            ) {
              array.push(aspirantData);
            }
          }
        });
        setFormState(formState => ({
          ...formState,
          dataToShowForMultiSelect: array
        }));
        let finalData = [];
        for (let i in formState["dataForEdit"]["future_aspirations"]) {
          finalData.push(
            formState["dataForEdit"]["future_aspirations"][i]["id"]
          );
        }
        formState.values["futureAspirations"] = finalData;
      }
    }
  };

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
      .serviceProviderForGetRequest(
        STATES_URL,
        {
          pageSize: -1
        },
        {}
      )
      .then(res => {
        setstatelist(res.data.result.map(({ id, name }) => ({ id, name })));
      });
  };

  const getDistrict = () => {
    Axios.get(
      strapiApiConstants.STRAPI_DB_URL +
        strapiApiConstants.STRAPI_DISTRICTS +
        "?pageSize=-1"
    ).then(res => {
      setdistrictlist(
        res.data.result.map(({ id, name, state }) => ({
          id,
          name,
          state: state.id
        }))
      );
    });
  };

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
      // if (
      //   props.location["dataForEdit"]["contact"] &&
      //   props.location["dataForEdit"]["contact"]["state"]
      // ) {
      //   formState.values["state"] =
      //     props.location["dataForEdit"]["contact"]["state"]["id"];
      // }
      if (props.location["dataForEdit"]["stream"]) {
        formState.values["stream"] =
          props.location["dataForEdit"]["stream"]["id"];
      }

      // if (
      //   props.location["dataForEdit"]["contact"] &&
      //   props.location["dataForEdit"]["contact"]["district"]
      // ) {
      //   formState.values["district"] =
      //     props.location["dataForEdit"]["contact"]["district"]["id"];
      // }
      if (props.location["dataForEdit"]["father_full_name"]) {
        formState.values["fatherFullName"] =
          props.location["dataForEdit"]["father_full_name"];
      }
      if (props.location["dataForEdit"]["mother_full_name"]) {
        formState.values["motherFullName"] =
          props.location["dataForEdit"]["mother_full_name"];
      }
      // if (props.location["dataForEdit"]["contact"]["address_1"]) {
      //   formState.values["address"] =
      //     props.location["dataForEdit"]["contact"]["address_1"];
      // }
      if (props.location["dataForEdit"]["gender"]) {
        formState.values["gender"] = props.location["dataForEdit"]["gender"];
      }

      if (props.location["dataForEdit"]["roll_number"]) {
        formState.values["rollnumber"] =
          props.location["dataForEdit"]["roll_number"];
      }
      if (props.location["dataForEdit"]["is_physically_challenged"] !== null) {
        formState.values["physicallyHandicapped"] =
          props.location["dataForEdit"]["is_physically_challenged"];
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

      if (
        props.location["dataForEdit"]["contact"] &&
        props.location["dataForEdit"]["contact"]["addresses"] &&
        props.location["dataForEdit"]["contact"]["addresses"].length > 0
      ) {
        formState.addresses =
          props.location["dataForEdit"]["contact"]["addresses"];
      } else {
        formState.addresses = genericConstants.ADDRESSES;
      }
    }
    formState.counter += 1;
  }

  const saveAndNext = event => {
    event.preventDefault();
    formState["flag"] = 1;
    handleSubmit(event);
  };

  const handleSubmit = event => {
    setBackDrop(true);
    let schema;
    if (formState.editStudent) {
      schema = Object.assign({}, _.omit(registrationSchema, ["otp"]));
    } else {
      schema = Object.assign(
        {},
        _.omit(registrationSchema, ["futureAspirations"])
      );
    }
    formState.values = Object.assign(
      {},
      _.omit(formState.values, ["username"])
    );
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
      formState.isDateOfBirthPresent = true;
      if (props.forTestingDate) {
        formState.isdateOfBirthValid = true;
      } else {
        formState.isdateOfBirthValid = formUtilities.validateDateOfBirth(
          selectedDate
        );
      }
    }

    const isValidAddress = validateAddresses();
    if (
      isValid &&
      formState.isDateOfBirthPresent &&
      formState.isdateOfBirthValid &&
      !isValidAddress
    ) {
      /** CALL POST FUNCTION */
      postStudentData();

      /** Call axios from here */
      setFormState(formState => ({
        ...formState,
        isValid: true
      }));
    } else {
      setBackDrop(false);
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
  };

  const postStudentData = () => {
    let postData;
    const addresses = formState.addresses;

    if (formState.editStudent) {
      postData = databaseUtilities.editStudent(
        formState.values["firstname"],
        formState.values["middlename"],
        formState.values["lastname"],
        formState.values["fatherFullName"],
        formState.values["motherFullName"],
        formState.values["email"],
        formState.values["contact"],
        formState.values["contact"],
        formState.values["gender"],
        selectedDate.getFullYear() +
          "-" +
          (selectedDate.getMonth() + 1) +
          "-" +
          selectedDate.getDate(),
        formState.values["physicallyHandicapped"] ? true : false,
        formState.values["college"],
        formState.values["stream"],
        formState.values["rollnumber"],
        formState.dataForEdit.id,
        formState.values["futureAspirations"],
        formState.files,
        formState.values["password"] ? formState.values["password"] : undefined,
        addresses
      );

      let studentName =
        props.location["dataForEdit"]["first_name"] +
        " " +
        props.location["dataForEdit"]["middlename"] +
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
          setBackDrop(false);
          if (formState.flag === 1) {
            history.push({
              pathname: routeConstants.VIEW_EDUCATION
            });
          } else {
            history.push({
              pathname: routeConstants.MANAGE_STUDENT,
              fromEditStudent: true,
              isStudentEdited: true,
              messageForEditStudent:
                "Student " + studentName + " has been edited successfully."
            });
          }
        })
        .catch(err => {
          setBackDrop(false);
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
        formState.values["email"],
        formState.values["contact"],
        formState.values["contact"],
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
        formState.values["rollnumber"],
        formState.files,
        formState.values["futureAspirations"]
          ? formState["futureAspirations"]
          : null,
        addresses
      );
      let url =
        strapiApiConstants.STRAPI_DB_URL +
        strapiApiConstants.STRAPI_CREATE_USERS;
      serviceProvider
        .serviceProviderForPostRequest(url, postData)
        .then(response => {
          setBackDrop(false);
          history.push({
            pathname: routeConstants.MANAGE_STUDENT,
            fromAddStudent: true,
            isStudentAdded: true,
            messageForAddStudent:
              "Student " +
              formState.values["firstname"] +
              " " +
              formState.values["middlename"] +
              " " +
              formState.values["lastname"] +
              " has been added successfully"
          });
        })
        .catch(error => {
          setBackDrop(false);
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
          console.log("err", error, error.response);
          history.push({
            pathname: routeConstants.MANAGE_STUDENT,
            fromAddStudent: true,
            isStudentAdded: false,
            messageForAddStudent: errorMessage
              ? errorMessage
              : "An error has occured while adding student " +
                formState.values["firstname"] +
                " " +
                formState.values["middlename"] +
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
    if (eventName === "futureAspirations") {
      formState.dataToShowForMultiSelect = value;
    }
    if (get(registrationSchema[eventName], "type") === "multi-select") {
      let finalValues = [];
      for (let i in value) {
        finalValues.push(value[i]["id"]);
      }
      value = {
        id: finalValues
      };
    }
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

  const handleStateAndDistrictChange = (type, value, idx) => {
    formState.addresses[idx][type] = value && value.id;
    if (type == "state") {
      formState.addresses[idx]["district"] = null;
    }
    validateAddresses();
    setFormState(formState => ({
      ...formState
    }));
  };

  const handleAddressChange = (idx, e, type) => {
    e.persist();
    console.log(e.target.value);

    const addresses = formState.addresses.map((addr, index) => {
      if (index == idx) {
        return { ...addr, [type]: e.target.value };
      } else {
        return addr;
      }
    });
    validateAddresses();
    setFormState(formState => ({
      ...formState,
      addresses
    }));
  };

  const validateAddresses = () => {
    const addresses = formState.addresses;
    let errors = [];
    let isError = false;
    addresses.forEach(addr => {
      let errorObject = {};
      if (!(addr.address_line_1 && addr.address_line_1.length > 0)) {
        isError = true;
        errorObject["address_line_1"] = {
          error: true,
          message: "Address is required"
        };
      } else {
        errorObject["address_line_1"] = {
          error: false,
          message: null
        };
      }

      if (!addr.state) {
        isError = true;
        errorObject["state"] = {
          error: true,
          message: "State is required"
        };
      } else {
        errorObject["state"] = {
          error: false,
          message: null
        };
      }

      if (!addr.district) {
        isError = true;
        errorObject["district"] = {
          error: true,
          message: "District is required"
        };
      } else {
        errorObject["district"] = {
          error: false,
          message: null
        };
      }

      if (!addr.city) {
        isError = true;
        errorObject["city"] = {
          error: true,
          message: "City is required"
        };
      } else {
        errorObject["city"] = {
          error: false,
          message: null
        };
      }

      if (!addr.pincode) {
        isError = true;
        errorObject["pincode"] = {
          error: true,
          message: "Pincode is required"
        };
      } else {
        errorObject["pincode"] = {
          error: false,
          message: null
        };
      }

      errors.push(errorObject);
    });

    setValidateAddress(errors);
    return isError;
  };

  console.log(formState.addresses);
  return (
    <Grid>
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
                      id="firstName"
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
                      id="middlename"
                      value={formState.values["middlename"]}
                      variant="outlined"
                      error={hasError("middlename")}
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
                      id="lastname"
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
                      id="fatherFullName"
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
                      id="motherFullName"
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
                <Divider className={classes.divider} />
                <Grid container spacing={3} className={classes.MarginBottom}>
                  {formState.addresses.map((addr, idx) => {
                    return (
                      <Grid item md={12} xs={12}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          className={classes.streamcard}
                        >
                          <Card className={classes.streamoffer}>
                            <InputLabel
                              htmlFor="outlined-address-card"
                              fullwidth={true.toString()}
                            >
                              {addr.address_type == "Temporary"
                                ? "Local Address"
                                : "Permanent Address"}
                            </InputLabel>
                            <Grid
                              container
                              spacing={3}
                              className={classes.MarginBottom}
                            >
                              <Grid
                                item
                                md={12}
                                xs={12}
                                style={{ marginTop: "8px" }}
                              >
                                <TextField
                                  label="Address"
                                  name="address"
                                  value={
                                    formState.addresses[idx].address_line_1 ||
                                    ""
                                  }
                                  variant="outlined"
                                  required
                                  fullWidth
                                  onChange={event =>
                                    handleAddressChange(
                                      idx,
                                      event,
                                      "address_line_1"
                                    )
                                  }
                                  error={
                                    (validateAddress[idx] &&
                                      validateAddress[idx]["address_line_1"][
                                        "error"
                                      ]) ||
                                    false
                                  }
                                  helperText={
                                    (validateAddress[idx] &&
                                      validateAddress[idx]["address_line_1"][
                                        "message"
                                      ]) ||
                                    null
                                  }
                                />
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              spacing={3}
                              className={classes.MarginBottom}
                            >
                              <Grid item md={6} xs={12}>
                                <Autocomplete
                                  id="combo-box-demo"
                                  className={classes.root}
                                  options={statelist}
                                  getOptionLabel={option => option.name}
                                  onChange={(event, value) => {
                                    handleStateAndDistrictChange(
                                      "state",
                                      value,
                                      idx
                                    );
                                  }}
                                  value={
                                    statelist[
                                      statelist.findIndex(function (item, i) {
                                        return (
                                          item.id ===
                                          formState.addresses[idx].state
                                        );
                                      })
                                    ] || null
                                  }
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label="State"
                                      variant="outlined"
                                      name="tester"
                                      error={
                                        (validateAddress[idx] &&
                                          validateAddress[idx]["state"][
                                            "error"
                                          ]) ||
                                        false
                                      }
                                      helperText={
                                        (validateAddress[idx] &&
                                          validateAddress[idx]["state"][
                                            "message"
                                          ]) ||
                                        null
                                      }
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item md={6} xs={12}>
                                <Autocomplete
                                  id="combo-box-demo"
                                  className={classes.root}
                                  options={districtlist.filter(
                                    district =>
                                      district.state ===
                                      formState.addresses[idx].state
                                  )}
                                  getOptionLabel={option => option.name}
                                  onChange={(event, value) => {
                                    handleStateAndDistrictChange(
                                      "district",
                                      value,
                                      idx
                                    );
                                  }}
                                  value={
                                    districtlist[
                                      districtlist.findIndex(function (
                                        item,
                                        i
                                      ) {
                                        return (
                                          item.id ===
                                          formState.addresses[idx].district
                                        );
                                      })
                                    ] || null
                                  }
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label="District"
                                      variant="outlined"
                                      name="tester"
                                      error={
                                        (validateAddress[idx] &&
                                          validateAddress[idx]["district"][
                                            "error"
                                          ]) ||
                                        false
                                      }
                                      helperText={
                                        (validateAddress[idx] &&
                                          validateAddress[idx]["district"][
                                            "message"
                                          ]) ||
                                        null
                                      }
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item md={6} xs={12}>
                                <TextField
                                  label="City"
                                  name="city"
                                  value={formState.addresses[idx].city || ""}
                                  variant="outlined"
                                  required
                                  fullWidth
                                  onChange={event =>
                                    handleAddressChange(idx, event, "city")
                                  }
                                  error={
                                    (validateAddress[idx] &&
                                      validateAddress[idx]["city"]["error"]) ||
                                    false
                                  }
                                  helperText={
                                    (validateAddress[idx] &&
                                      validateAddress[idx]["city"][
                                        "message"
                                      ]) ||
                                    null
                                  }
                                />
                              </Grid>
                              <Grid item md={6} xs={12}>
                                <TextField
                                  label="Pincode"
                                  name="pincode"
                                  value={formState.addresses[idx].pincode || ""}
                                  variant="outlined"
                                  required
                                  fullWidth
                                  onChange={event =>
                                    handleAddressChange(idx, event, "pincode")
                                  }
                                  error={
                                    (validateAddress[idx] &&
                                      validateAddress[idx]["pincode"][
                                        "error"
                                      ]) ||
                                    false
                                  }
                                  helperText={
                                    (validateAddress[idx] &&
                                      validateAddress[idx]["pincode"][
                                        "message"
                                      ]) ||
                                    null
                                  }
                                  inputProps={{ maxLength: 6, minLength: 6 }}
                                />
                              </Grid>
                            </Grid>
                            <Grid item md={12} xs={12}>
                              {!formState.editStudent &&
                              addr.address_type == "Temporary" ? (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={formState.addressSameAsLocal}
                                      onChange={event => {
                                        setFormState(formState => ({
                                          ...formState,
                                          addressSameAsLocal:
                                            event.target.checked
                                        }));
                                      }}
                                      name="addressSameAsLocal"
                                      color="primary"
                                    />
                                  }
                                  label="Permanent Address same as local Address?"
                                />
                              ) : null}
                            </Grid>
                          </Card>
                        </Grid>
                      </Grid>
                    );
                  })}
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
                      id="contact"
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
                      id="email"
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
                      id="rollnumber"
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
                        id="password"
                        name="password"
                        type={formState.showPassword ? "text" : "password"}
                        value={formState.values["password"]}
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
                        id="futureAspirations"
                        multiple
                        options={futureAspirant}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(
                            "futureAspirations",
                            event,
                            value
                          );
                        }}
                        name={"futureAspirations"}
                        filterSelectedOptions
                        value={formState.dataToShowForMultiSelect || null}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError("futureAspirations")}
                            helperText={
                              hasError("futureAspirations")
                                ? formState.errors["futureAspirations"].map(
                                    error => {
                                      return error + " ";
                                    }
                                  )
                                : null
                            }
                            placeholder={get(
                              registrationSchema["futureAspirations"],
                              "placeholder"
                            )}
                            label={get(
                              registrationSchema["futureAspirations"],
                              "label"
                            )}
                            variant="outlined"
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
                <Grid item xs={12}>
                  <Grid item xs={12} md={6} xl={3}>
                    <Grid container spacing={3}>
                      <Grid item md={2} xs={12}>
                        <YellowButton
                          color="primary"
                          type="submit"
                          id="submit"
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
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <YellowButton
                          color="primary"
                          type="submit"
                          id="submitandnext"
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
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardActions>
            </Grid>
          </form>
        </Card>
      </Grid>
      <Backdrop className={classes.backDrop} open={backDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
    // </Layout>
  );
};
export default AddEditStudentForCollegeAdmin;
