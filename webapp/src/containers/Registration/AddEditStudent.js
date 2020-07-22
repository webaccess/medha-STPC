import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  Divider,
  Link,
  InputLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Collapse,
  CardActions,
  FormHelperText,
  Button,
  FormControlLabel,
  Checkbox,
  Backdrop,
  CircularProgress
} from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import CloseIcon from "@material-ui/icons/Close";
import { Auth as auth, InlineDatePicker } from "../../components";
import Spinner from "../../components/Spinner/Spinner.js";
import * as routeConstants from "../../constants/RouteConstants";
import * as roleConstants from "../../constants/RoleConstants";
import * as commonUtilities from "../../utilities/CommonUtilities";
import * as _ from "lodash";
import * as genericConstants from "../../constants/GenericConstants.js";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Img from "react-image";
import { get, includes } from "lodash";
import Alert from "../../components/Alert/Alert.js";
import GrayButton from "../../components/GrayButton/GrayButton.js";
import YellowButton from "../../components/YellowButton/YellowButton.js";
import * as authPageConstants from "../../constants/AuthPageConstants.js";
import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import * as formUtilities from "../../utilities/FormUtilities.js";
import * as databaseUtilities from "../../utilities/StrapiUtilities.js";
import registrationSchema from "./RegistrationSchema.js";
import { useHistory } from "react-router-dom";
import * as serviceProvider from "../../api/Axios.js";
import useStyles from "../ContainerStyles/AddEditPageStyles.js";
import LoaderContext from "../../context/LoaderContext";
import SetIndexContext from "../../context/SetIndexContext";
import { concat } from "draft-js/lib/DefaultDraftBlockRenderMap";

const AddEditStudent = props => {
  let history = useHistory();
  const [user, setUser] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    fatherFulltName: "",
    motherFullName: "",
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
    editStudent: props.location.editStudent
      ? props.location.editStudent
      : false,
    dataForEdit: props.location.dataForEdit
      ? props.location.dataForEdit
      : false,
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

  const [selectedDate, setSelectedDate] = useState(
    props.forTesting ? new Date("1999-03-25") : null
  );

  const genderlist = [
    { name: "Male", id: "male" },
    { name: "Female", id: "female" },
    { name: "Other", id: "other" }
  ];
  const [futureAspirationsList, setFutureAspirationsList] = useState(
    props.mockFutureAspiration ? props.mockFutureAspiration : []
  );
  const physicallyHandicappedlist = [
    { name: "Yes", id: true },
    { name: "No", id: false }
  ];
  const [isFailed, setIsFailed] = useState(false);
  const [backDrop, setBackDrop] = useState(false);

  const classes = useStyles();
  const [statelist, setstatelist] = useState(
    props.mockStateList ? props.mockStateList : []
  );
  const [districtlist, setdistrictlist] = useState(
    props.mockdistrictList ? props.mockdistrictList : []
  );
  const [collegelist, setcollegelist] = useState(
    props.mockCollegeData ? props.mockCollegeData : []
  );
  const [streamlist, setstreamlist] = useState(
    props.streamsList ? props.streamsList : []
  );
  const [collegeStreamList, setCollegeStreamList] = useState(
    props.mockCollegeStreamList ? props.mockCollegeStreamList : []
  );
  const [stream, setStream] = useState(null);

  const [validateAddress, setValidateAddress] = useState([]);

  useEffect(() => {
    if (
      props.location.pathname !== "/registration" &&
      props.location &&
      !props.location.dataForEdit
    ) {
      history.push({
        pathname: routeConstants.VIEW_PROFILE
      });
    }
    getStates();
    getFutureAspirations();
    getDistrict();
    getColleges();
    getStreams();
    // setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  useEffect(() => {
    if (
      formState.values.hasOwnProperty("college") &&
      formState.values["college"] &&
      collegelist.length > 0
    ) {
      const college = collegelist.find(
        college => college.id == formState.values["college"]
      );

      const collegeStreamIds = college.stream_strength.map(s => s.stream.id);
      const list = streamlist.filter(stream => {
        if (_.includes(collegeStreamIds, stream.id)) {
          return stream;
        }
      });

      setCollegeStreamList(list);
    }
  }, [formState.values["college"]]);

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
        props.location["dataForEdit"]["organization"] &&
        props.location["dataForEdit"]["organization"]["id"]
      ) {
        formState.values["college"] =
          props.location["dataForEdit"]["organization"]["id"];
      }
      // if (
      //   props.location["dataForEdit"]["contact"] &&
      //   props.location["dataForEdit"]["contact"]["state"]
      // ) {
      //   formState.values["state"] =
      //     props.location["dataForEdit"]["contact"]["state"]["id"];
      // }
      if (
        props.location["dataForEdit"]["stream"] &&
        props.location["dataForEdit"]["stream"]["id"]
      ) {
        formState.values["stream"] = props.location["dataForEdit"]["stream"];
      }

      // if (
      //   props.location["dataForEdit"]["contact"]["district"] &&
      //   props.location["dataForEdit"]["contact"]["district"]["id"]
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
      if (props.location["dataForEdit"]["future_aspirations"]) {
        formState.values["futureAspirations"] =
          props.location["dataForEdit"]["future_aspirations"];
        formState["futureAspirations"] = props.location["dataForEdit"][
          "future_aspirations"
        ].map(value => value.id);
      }

      if (props.location["dataForEdit"]) {
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

  if (props.location.state && !formState.counter) {
    if (props.location.state.contactNumber && props.location.state.otp) {
      formState.values["contact"] = props.location.state.contactNumber;
      formState.values["otp"] = props.location.state.otp;
      formState.values["username"] = props.location.state.contactNumber;
    }
    formState.counter += 1;
  }

  const handleSubmit = event => {
    event.preventDefault();
    const isValidAddress = validateAddresses();
    setBackDrop(true);
    let schema;
    if (formState.editStudent) {
      schema = Object.assign(
        {},
        _.omit(registrationSchema, ["password", "otp"])
      );
    } else {
      schema = registrationSchema;
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
      formState.isDateOfBirthPresent = true;
      if (props.forTesting) {
        formState.isdateOfBirthValid = true;
      } else {
        formState.isdateOfBirthValid = formUtilities.validateDateOfBirth(
          selectedDate
        );
      }
    }

    console.log(formState);
    if (
      isValid &&
      formState.isDateOfBirthPresent &&
      formState.isdateOfBirthValid &&
      isValidAddress
    ) {
      /** CALL POST FUNCTION */
      postStudentData();

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
      setBackDrop(false);
    }
  };

  const saveAndNext = event => {
    event.preventDefault();
    formState["flag"] = 1;
    handleSubmit(event);
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
        formState.values["physicallyHandicapped"] !== undefined
          ? formState.values["physicallyHandicapped"]
          : null,
        formState.values["college"],
        formState.values["stream"].id,
        formState.values["rollnumber"],
        formState.dataForEdit.id,
        formState.values["futureAspirations"]
          ? formState["futureAspirations"]
          : null,
        formState.files,
        null,
        addresses
      );
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
          if (auth.getUserInfo().role.name === roleConstants.STUDENT) {
            commonUtilities.updateUser();
          }
          let studentName =
            props.location["dataForEdit"]["first_name"] +
            " " +
            props.location["dataForEdit"]["middlename"] +
            " " +
            props.location["dataForEdit"]["last_name"];
          if (
            auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
            auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
          ) {
            history.push({
              pathname: routeConstants.MANAGE_STUDENT,
              fromeditStudent: true,
              isDataEdited: true,
              editedStudentName: studentName
            });
          } else {
            if (formState.flag === 1) {
              history.push({
                pathname: routeConstants.VIEW_EDUCATION
              });
            } else {
              history.push({
                pathname: routeConstants.VIEW_PROFILE,
                success: true
              });
            }
          }

          setBackDrop(false);
        })
        .catch(err => {
          setIsFailed(true);
          let studentName =
            props.location["dataForEdit"]["first_name"] +
            " " +
            props.location["dataForEdit"]["middlename"] +
            " " +
            props.location["dataForEdit"]["last_name"];
          if (
            auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
            auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
          ) {
            history.push({
              pathname: routeConstants.MANAGE_STUDENT,
              fromeditStudent: true,
              isDataEdited: true,
              editedStudentName: studentName
            });
          } else {
            history.push({
              pathname: routeConstants.VIEW_PROFILE,
              success: false
            });
          }
          setBackDrop(false);
        });
    } else {
      postData = databaseUtilities.addStudent(
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
        formState.values["physicallyHandicapped"],
        formState.values["college"],
        formState.values["stream"].id,
        formState.values["rollnumber"],
        formState.values.otp,
        formState.files,
        formState.values["futureAspirations"]
          ? formState["futureAspirations"]
          : null,
        true,
        addresses
      );

      axios
        .post(
          strapiApiConstants.STRAPI_DB_URL +
            strapiApiConstants.STRAPI_CREATE_USERS,
          postData
        )
        .then(response => {
          if (auth.getToken() === null || auth.getUserInfo() === null) {
            history.push(routeConstants.REGISTERED);
          } else {
            if (
              auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
              auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
            ) {
              history.push(routeConstants.MANAGE_STUDENT);
            }
          }
          setBackDrop(false);
        })
        .catch(err => {
          console.log(err);
          setBackDrop(false);
        });
    }
  };

  const getFutureAspirations = () => {
    axios
      .get(
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_FUTURE_ASPIRATIONS +
          "?pageSize=-1"
      )
      .then(res => {
        const list = res.data.result.map(({ id, name }) => ({ id, name }));
        setFutureAspirationsList(list);
        if (formState.dataForEdit) {
          const id = props.location["dataForEdit"]["future_aspirations"].map(
            value => value.id
          );
          const ids = list.filter(value => {
            if (includes(id, value.id)) {
              return value;
            }
          });
          formState.values["futureAspirations"] = ids;
        }
      });
  };
  const getColleges = () => {
    axios
      .get(
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_COLLEGES +
          "?pageSize=-1"
      )
      .then(res => {
        setcollegelist(
          res.data.result.map(({ id, name, stream_strength }) => ({
            id,
            name,
            stream_strength
          }))
        );
      });
  };

  const getStreams = () => {
    axios
      .get(
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_STREAMS +
          "?pageSize=-1"
      )
      .then(res => {
        const list = res.data.map(({ id, name }) => ({
          id,
          name
        }));
        setstreamlist(list);

        if (formState.dataForEdit && props.location["dataForEdit"]["stream"]) {
          const selectedStream = list.find(
            stream => stream.id == props.location["dataForEdit"]["stream"]["id"]
          );

          setStream(selectedStream);
        }
      });
  };

  const getStates = () => {
    axios
      .get(
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_STATES +
          "?pageSize=-1"
      )
      .then(res => {
        setstatelist(res.data.result.map(({ id, name }) => ({ id, name })));
      });
  };

  const getDistrict = () => {
    axios
      .get(
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_DISTRICTS +
          "?pageSize=-1"
      )
      .then(res => {
        setdistrictlist(
          res.data.result.map(({ id, name, state }) => ({
            id,
            name,
            state: state.id
          }))
        );
      });
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
        }
      }));
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
    } else {
      if (eventName === "state") {
        delete formState.values["district"];
      }
      delete formState.values[eventName];
      setFormState(formState => ({
        ...formState
      }));
    }
  };

  const handleStreamChange = (eventName, event, value) => {
    /**TO SET VALUES OF AUTOCOMPLETE */
    if (value !== null) {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [eventName]: value
        },
        touched: {
          ...formState.touched,
          [eventName]: true
        }
      }));
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
      setStream(value);
    } else {
      if (eventName === "state") {
        delete formState.values["district"];
      }
      delete formState.values[eventName];
      setFormState(formState => ({
        ...formState
      }));
    }
  };

  const handleClickShowPassword = () => {
    setFormState({
      ...formState,
      showPassword: !formState.showPassword
    });
  };

  const handleFutureAspirationChange = (eventName, event, value) => {
    /**TO SET VALUES OF AUTOCOMPLETE */
    if (value !== null) {
      const id = value.map(value => value.id).filter(c => c);
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [eventName]: value
        },
        touched: {
          ...formState.touched,
          [eventName]: true
        },
        futureAspirations: id
      }));
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
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

  const hasError = field => (formState.errors[field] ? true : false);

  const changeContactNumber = () => {
    history.push(routeConstants.CHANGE_CONTACT_NUMBER, {
      contactNumber: formState.values["contact"]
    });
  };

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
    return !isError;
  };

  console.log(formState.addresses);
  console.log(validateAddress);
  return (
    // <Layout>
    <Grid>
      <Grid item xs={12} className={classes.title}>
        {formState.editStudent ? null : (
          <Typography variant="h4" gutterBottom>
            {genericConstants.STUDENT_REGISTRATION}
          </Typography>
        )}

        {isFailed && formState.editStudent ? (
          <Collapse in={isFailed}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setIsFailed(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {genericConstants.ALERT_ERROR_DATA_EDITED_MESSAGE}
            </Alert>
          </Collapse>
        ) : null}
        {isFailed && !formState.editStudent ? (
          <Collapse in={isFailed}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setIsFailed(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {genericConstants.ALERT_ERROR_DATA_ADDED_MESSAGE}
            </Alert>
          </Collapse>
        ) : null}
      </Grid>
      <Card>
        <form autoComplete="off" noValidate>
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
                    id="firstName"
                    label="First Name"
                    name="firstname"
                    value={formState.values["firstname"] || ""}
                    variant="outlined"
                    required
                    fullWidth
                    onChange={handleChange}
                    error={hasError("firstname")}
                    helperText={
                      hasError("firstname")
                        ? formState.errors["firstname"].map(error => {
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
                    id="middlename"
                    label="Middle Name"
                    name="middlename"
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
                    id="lastname"
                    label="Last Name"
                    name="lastname"
                    value={formState.values["lastname"]}
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
                    id="fatherFullName"
                    label="Father's Full Name"
                    name="fatherFullName"
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
                    id="motherFullName"
                    label="Mother's Full Name"
                    name="motherFullName"
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
                      <Grid item md={12} xs={12} className={classes.streamcard}>
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
                                  formState.addresses[idx].address_line_1 || ""
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
                                    districtlist.findIndex(function (item, i) {
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
                                    validateAddress[idx]["city"]["message"]) ||
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
                                    validateAddress[idx]["pincode"]["error"]) ||
                                  false
                                }
                                helperText={
                                  (validateAddress[idx] &&
                                    validateAddress[idx]["pincode"][
                                      "message"
                                    ]) ||
                                  null
                                }
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
                                        addressSameAsLocal: event.target.checked
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
            </Grid>
            <Divider className={classes.divider} />
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <TextField
                    id="contact"
                    label="Contact Number"
                    name="contact"
                    value={formState.values["contact"] || ""}
                    variant="outlined"
                    required
                    fullWidth
                    readOnly
                    disabled
                    error={hasError("contact")}
                    helperText={
                      hasError("contact")
                        ? formState.errors["contact"].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                  />
                  {formState.editStudent ? (
                    <Link
                      href="javascript:void(0);"
                      variant="body2"
                      className={classes.linkColor}
                      onClick={changeContactNumber}
                    >
                      {authPageConstants.CHANGE_CONTACT_NUMBER}
                    </Link>
                  ) : null}
                </Grid>

                <Grid
                  item
                  md={6}
                  xs={12}
                  style={formState.editStudent ? { marginTop: "-22px" } : null}
                >
                  <InlineDatePicker
                    // variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date of Birth"
                    value={selectedDate}
                    className={classes.date}
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
              </Grid>
              <Grid container spacing={3} className={classes.formgrid}>
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
                        label="Gender"
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
                <Grid item md={6} xs={12}>
                  <TextField
                    id="email"
                    label="Email-Id"
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
            </Grid>
            <Divider className={classes.divider} />
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    id="college-filter"
                    className={classes.root}
                    options={collegelist}
                    disabled={formState.editStudent ? true : false}
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
                        label="College"
                        variant="outlined"
                        required
                        name="tester"
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
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    id="stream-filter"
                    className={classes.root}
                    options={collegeStreamList || []}
                    disabled={formState.editStudent ? true : false}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleStreamChange("stream", event, value);
                    }}
                    value={stream || null}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError("stream")}
                        label="Stream"
                        variant="outlined"
                        name="tester"
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
              </Grid>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <TextField
                    id="rollnumber"
                    label="Enrollment Number "
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
                        physicallyHandicappedlist.findIndex(function (item, i) {
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
                        label="Physically Handicapped"
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
            </Grid>
            <Divider className={classes.divider} />
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={12} xs={12}>
                  <Autocomplete
                    multiple={true}
                    id="futureAspirations"
                    className={classes.root}
                    options={futureAspirationsList}
                    getOptionLabel={option => option.name}
                    onChange={(event, value) => {
                      handleFutureAspirationChange(
                        "futureAspirations",
                        event,
                        value
                      );
                    }}
                    value={formState.values.futureAspirations}
                    filterSelectedOptions={true}
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
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <TextField
                    id="username"
                    label="Username"
                    name="username"
                    value={formState.values["username"] || ""}
                    variant="outlined"
                    required
                    fullWidth
                    disabled
                    readOnly
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

                {formState.editStudent ? null : (
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
                        id="password"
                        label="Password"
                        name="password"
                        type={formState.showPassword ? "text" : "password"}
                        value={formState.values["password"]}
                        required
                        fullWidth
                        onChange={handleChange}
                        error={hasError("password")}
                        helpertext={
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
                )}
              </Grid>
            </Grid>
            {formState.editStudent ? (
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
                            onClick={handleSubmit}
                          >
                            <span>{genericConstants.SAVE_BUTTON_TEXT}</span>
                          </YellowButton>
                        </Grid>
                        <Grid item md={3} xs={12}>
                          <YellowButton
                            id="submitandnext"
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
                            id="cancel"
                            color="primary"
                            type="submit"
                            mfullWidth
                            variant="contained"
                            onClick={() => {
                              auth.getUserInfo().role.name ===
                              roleConstants.COLLEGEADMIN
                                ? history.push(routeConstants.MANAGE_STUDENT)
                                : history.push(routeConstants.VIEW_PROFILE);
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
            ) : (
              <Grid item md={12} xs={12} className={classes.CardActionGrid}>
                <CardActions className={classes.btnspace}>
                  <Grid item xs={12}>
                    <Grid item xs={12} md={6} xl={3}>
                      <Grid container spacing={3}>
                        <Grid item md={2} xs={12}>
                          <YellowButton
                            id="submit"
                            color="primary"
                            type="submit"
                            mfullWidth
                            variant="contained"
                            onClick={handleSubmit}
                          >
                            <span>{authPageConstants.REGISTER}</span>
                          </YellowButton>
                        </Grid>

                        <Grid item md={2} xs={12}>
                          <GrayButton
                            id="cancel"
                            color="primary"
                            type="submit"
                            mfullWidth
                            variant="contained"
                            onClick={() => {
                              history.push(routeConstants.SIGN_IN_URL);
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
            )}
          </CardContent>
        </form>
      </Card>
      <Backdrop className={classes.backDrop} open={backDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
    // </Layout>
  );
};
export default AddEditStudent;
