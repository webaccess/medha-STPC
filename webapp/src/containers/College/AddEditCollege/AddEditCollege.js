import React, { useState, useEffect, useContext } from "react";
import useStyles from "../../ContainerStyles/AddEditPageStyles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import CollegeFormSchema from "../CollegeFormSchema";
import * as databaseUtilities from "../../../utilities/StrapiUtilities";
import * as formUtilities from "../../../utilities/FormUtilities";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import * as routeConstants from "../../../constants/RouteConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import * as commonUtilities from "../../../utilities/CommonUtilities";
import * as serviceProviders from "../../../api/Axios";
import {
  YellowButton,
  GrayButton,
  ReadOnlyTextField
} from "../../../components";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory } from "react-router-dom";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import { Auth as auth } from "../../../components";

import { get } from "lodash";
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Switch,
  Backdrop,
  Chip
} from "@material-ui/core";
import PropTypes from "prop-types";
import LoaderContext from "../../../context/LoaderContext";

const collegeName = "collegeName";
const collegeCode = "collegeCode";
const address = "address";
const state = "state";
const zone = "zone";
const rpc = "rpc";
const contactNumber = "contactNumber";
const collegeEmail = "collegeEmail";
const principal = "principal";
const tpos = "tpos";
const district = "district";
const block = "block";
const regexForPercentage = new RegExp("^[0-9][0-9]*$");

/** Dynamic Bar */
const streams = "streams";
const firstYearStrength = "first_year_strength";
const secondYearStrength = "second_year_strength";
const thirdYearStrength = "third_year_strength";

const STATES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES;
const STREAMS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS;
const USERS_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;
const COLLEGES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
const DISTRICTS_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_DISTRICTS;

const ADD_COLLEGES_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ADD_COLLEGE;

const AddEditCollege = props => {
  const history = useHistory();
  const classes = useStyles();
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    adminValues: {},
    touched: {},
    errors: {},
    states: [],
    isSuccess: false,
    dynamicBar: [{ index: Math.random() }],
    dynamicBarError: [],
    isEditCollege: props["editCollege"] ? props["editCollege"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0,
    isStateClearFilter: false,
    showing: false,
    dataToShowForMultiSelect: [],
    isCollegeAdmin:
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN ? true : false
  });
  const { className, ...rest } = props;
  const [user, setUser] = useState([]);
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [streamsData, setStreamsData] = useState([]);
  const [streamsDataBackup, setStreamsDataBackup] = useState([]);
  const [isGetAdminData, setIsGetAdminData] = useState(false);
  const [tpoData, setTpoData] = useState([]);
  const [principalData, setPrincipalData] = useState([]);
  const inputLabel = React.useRef(null);
  const [collegeInfo, setCollegeInfo] = useState({
    college:
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
        ? auth.getUserInfo().studentInfo &&
          auth.getUserInfo().studentInfo.organization
          ? auth.getUserInfo().studentInfo.organization
          : {}
        : {},
    state:
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
        ? auth.getUserInfo().state
        : {},
    rpc:
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
        ? auth.getUserInfo().rpc
        : {},
    zone:
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
        ? auth.getUserInfo().zone
        : {}
  });

  React.useEffect(() => {
    if (auth.getUserInfo().role.name === roleConstants.MEDHAADMIN) {
      setFormState(formState => ({
        ...formState,
        showing: true
      }));
    } else if (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) {
      setFormState(formState => ({
        ...formState,
        showing: false
      }));
    }
  }, []);

  /** Part for editing college */
  if (formState.isEditCollege && !formState.counter) {
    setLoaderStatus(true);
    if (props["dataForEdit"]) {
      if (props["dataForEdit"]["name"]) {
        formState.values[collegeName] = props["dataForEdit"]["name"];
      }
      if (props["dataForEdit"]["college_code"]) {
        formState.values[collegeCode] = props["dataForEdit"]["college_code"];
      }
      if (props["dataForEdit"]["contact"]) {
        formState.values[address] =
          props["dataForEdit"]["contact"]["address_1"];
      }
      if (props["dataForEdit"]["contact"]) {
        formState.values[contactNumber] =
          props["dataForEdit"]["contact"]["phone"];
      }
      if (props["dataForEdit"]["contact"]) {
        formState.values[collegeEmail] =
          props["dataForEdit"]["contact"]["email"];
      }
      if (
        props["dataForEdit"]["contact"] &&
        props["dataForEdit"]["contact"]["state"]
      ) {
        formState.values[state] =
          props["dataForEdit"]["contact"]["state"]["id"];
      }
      if (
        props["dataForEdit"]["contact"] &&
        props["dataForEdit"]["contact"]["district"]
      ) {
        formState.values[district] =
          props["dataForEdit"]["contact"]["district"]["id"];
      }
      if (props["dataForEdit"]["blocked"]) {
        formState.values[block] = props["dataForEdit"]["blocked"];
      }
      if (props["dataForEdit"]["zone"]) {
        formState.values[zone] = props["dataForEdit"]["zone"]["id"];
      }
      if (props["dataForEdit"]["rpc"]) {
        formState.values[rpc] = props["dataForEdit"]["rpc"]["id"];
      }
      if (
        props["dataForEdit"]["principal"] &&
        props["dataForEdit"]["principal"]["contact"] &&
        props["dataForEdit"]["principal"]["contact"]["user"]
      ) {
        formState.values[principal] =
          props["dataForEdit"]["principal"]["contact"]["user"];
        formState.adminValues[principal] =
          props["dataForEdit"]["principal"]["contact"]["individual"];
      }
      if (
        props["dataForEdit"]["stream_strength"] &&
        props["dataForEdit"]["stream_strength"].length
      ) {
        let dynamicBar = [];
        for (let i in props["dataForEdit"]["stream_strength"]) {
          let tempDynamicBarrValue = {};
          tempDynamicBarrValue["index"] = Math.random();
          tempDynamicBarrValue[streams] =
            props["dataForEdit"]["stream_strength"][i]["stream"]["id"];
          tempDynamicBarrValue[firstYearStrength] = props["dataForEdit"][
            "stream_strength"
          ][i]["first_year_strength"].toString();
          tempDynamicBarrValue[secondYearStrength] = props["dataForEdit"][
            "stream_strength"
          ][i]["second_year_strength"].toString();
          tempDynamicBarrValue[thirdYearStrength] = props["dataForEdit"][
            "stream_strength"
          ][i]["third_year_strength"].toString();
          dynamicBar.push(tempDynamicBarrValue);
        }
        formState.dynamicBar = dynamicBar;
      }

      formState.counter += 1;
    }
  }

  /** Here we initialize our data and bring users, states and streams*/
  useEffect(() => {
    setLoaderStatus(true);
    let paramsForPageSize = {
      name_contains: "Uttar Pradesh"
    };

    serviceProviders
      .serviceProviderForGetRequest(STATES_URL, paramsForPageSize)
      .then(res => {
        formState.states = res.data.result;
        setStates(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(STREAMS_URL, {
        pageSize: -1
      })
      .then(res => {
        setStreamsDataBackup(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
    serviceProviders
      .serviceProviderForGetRequest(STREAMS_URL, {
        pageSize: -1
      })
      .then(res => {
        let dataForEditing = res.data.result;
        if (formState.isEditCollege) {
          let tempStreamData = dataForEditing;
          let streamStrengthArray = props["dataForEdit"]["stream_strength"];
          for (let i in streamStrengthArray) {
            let id = streamStrengthArray[i]["stream"]["id"];
            for (let j in tempStreamData) {
              if (tempStreamData[j]["id"] === id) tempStreamData.splice(j, 1);
            }
          }
          setStreamsData(tempStreamData);
        } else {
          setStreamsData(dataForEditing);
        }
      })
      .catch(error => {
        console.log("error", error);
      });
    setLoaderStatus(false);
  }, []);

  /** Gets data for Principals and tpos */
  useEffect(() => {
    fetchCollegeAdminData();
    return () => {};
  }, []);

  async function fetchCollegeAdminData() {
    if (auth.getUserInfo().role.name === roleConstants.MEDHAADMIN) {
      if (formState.isEditCollege) {
        let user_url =
          COLLEGES_URL +
          "/" +
          formState.dataForEdit["id"] +
          "/" +
          strapiConstants.STRAPI_ADMIN;
        serviceProviders
          .serviceProviderForGetRequest(user_url)
          .then(res => {
            setUser(res.data.result);
            prePopulateDataForTpo(res.data.result);
          })
          .catch(error => {
            console.log("error", error);
          });
      } else {
        setUser([]);
      }
    } else if (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) {
      const studentId =
        auth.getUserInfo() !== null &&
        auth.getUserInfo().studentInfo &&
        auth.getUserInfo().studentInfo.organization &&
        auth.getUserInfo().studentInfo.organization.id
          ? auth.getUserInfo().studentInfo.organization.id
          : null;
      let user_url =
        COLLEGES_URL + "/" + studentId + "/" + strapiConstants.STRAPI_ADMIN;
      serviceProviders
        .serviceProviderForGetRequest(user_url)
        .then(res => {
          setUser(res.data.result);
          prePopulateDataForTpo(res.data.result);
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }

  const prePopulateDataForTpo = tpoData => {
    if (formState.isEditCollege) {
      if (
        props["dataForEdit"]["tpos"] &&
        props["dataForEdit"]["tpos"].length !== 0
      ) {
        let array = [];
        tpoData.map(tpo => {
          for (let i in props["dataForEdit"]["tpos"]) {
            if (
              props["dataForEdit"]["tpos"][i]["contact"]["individual"] ===
              tpo["id"]
            ) {
              array.push(tpo);
            }
          }
        });
        setFormState(formState => ({
          ...formState,
          dataToShowForMultiSelect: array
        }));
        let finalData = [];
        for (let i in props["dataForEdit"]["tpos"]) {
          finalData.push(
            props["dataForEdit"]["tpos"][i]["contact"]["individual"]
          );
        }
        let finalDataId = [];
        for (let i in props["dataForEdit"]["tpos"]) {
          finalDataId.push(props["dataForEdit"]["tpos"][i]["id"]);
        }
        formState.values[tpos] = finalDataId;
        formState.adminValues[tpos] = finalData;
      }
    }
  };

  /** This gets data into zones, rpcs and districts when we change the state */
  useEffect(() => {
    if (formState.values[state]) {
      fetchZoneRpcDistrictData();
    }
    return () => {};
  }, [formState.values[state]]);

  /** Common function to get zones, rpcs, districts after changing state */
  async function fetchZoneRpcDistrictData() {
    let zones_url =
      STATES_URL +
      "/" +
      formState.values[state] +
      "/" +
      strapiConstants.STRAPI_ZONES;

    await serviceProviders
      .serviceProviderForGetRequest(zones_url)
      .then(res => {
        setZones(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });

    let rpcs_url =
      STATES_URL +
      "/" +
      formState.values[state] +
      "/" +
      strapiConstants.STRAPI_RPCS;

    await serviceProviders
      .serviceProviderForGetRequest(rpcs_url)
      .then(res => {
        if (Array.isArray(res.data)) {
          setRpcs(res.data[0].result);
        } else {
          setRpcs(res.data.result);
        }
      })
      .catch(error => {
        console.log("error", error);
      });

    let params = {
      pageSize: -1,
      "state.id": formState.values[state]
    };

    if (formState.values[state] !== undefined) {
      await serviceProviders
        .serviceProviderForGetRequest(DISTRICTS_URL, params)
        .then(res => {
          setDistricts(res.data.result);
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }

  /** This gets Principal Email and contact number*/
  useEffect(() => {
    if (formState.adminValues[principal]) {
      getPrincipalName(formState.adminValues[principal]);
    } else {
      setIsGetAdminData(false);
      setPrincipalData([]);
    }
    return () => {};
  }, [formState.adminValues[principal]]);

  const getPrincipalName = ID => {
    let principalURL;
    principalURL =
      strapiConstants.STRAPI_DB_URL +
      strapiConstants.STRAPI_VIEW_USERS +
      "/" +
      ID;
    serviceProviders
      .serviceProviderForGetRequest(principalURL)
      .then(res => {
        setIsGetAdminData(true);
        setPrincipalData(res.data.result);
      })
      .catch(error => {
        setIsGetAdminData(false);
        console.log("error", error, error.response);
      });
  };

  /** This gets TPOs Email and contact number */
  useEffect(() => {
    if (formState.adminValues[tpos]) {
      setTpoData([]);
      getTpoName(formState.adminValues[tpos]);
    } else {
      setIsGetAdminData(false);
      setTpoData([]);
    }
    return () => {};
  }, [formState.adminValues[tpos]]);

  const getTpoName = ID => {
    let tpoURL = [];
    for (let i = 0; i < ID.length; i++) {
      tpoURL[i] =
        strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_VIEW_USERS +
        "/" +
        ID[i];
    }
    serviceProviders
      .serviceProviderForAllGetRequest(tpoURL)
      .then(res => {
        let tpoarray = [];
        for (let j = 0; j < res.length; j++) {
          tpoarray.push(res[j].data.result);
        }
        setTpoData(tpoarray);
      })
      .catch(error => {
        setIsGetAdminData(false);
        console.log("error", error);
      });
  };

  /** Handle change for text fields */
  const handleChange = e => {
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

  /** Handle change for autocomplete fields */
  const handleChangeAutoComplete = (eventName, event, value) => {
    /**TO SET VALUES OF AUTOCOMPLETE */
    if (eventName === tpos) {
      formState.dataToShowForMultiSelect = value;
    }
    if (get(CollegeFormSchema[eventName], "type") === "multi-select") {
      let finalValues = [];
      let finalIds = [];
      for (let i in value) {
        finalValues.push(value[i]["contact"]["user"]["id"]);
        finalIds.push(value[i]["id"]);
      }
      value = {
        id: finalValues,
        tpoId: finalIds
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
      if (eventName === tpos) {
        setFormState(formState => ({
          ...formState,
          values: {
            ...formState.values,
            [eventName]: value.id
          },
          adminValues: {
            ...formState.adminValues,
            [eventName]: value.tpoId
          },
          touched: {
            ...formState.touched,
            [eventName]: true
          },
          isStateClearFilter: false
        }));
      }
      if (eventName === principal) {
        setFormState(formState => ({
          ...formState,
          values: {
            ...formState.values,
            [eventName]: value.contact.user.id
          },
          adminValues: {
            ...formState.adminValues,
            [eventName]: value.id
          },
          touched: {
            ...formState.touched,
            [eventName]: true
          },
          isStateClearFilter: false
        }));
      }
      if (eventName === state) {
        fetchZoneRpcDistrictData();
      }
      /** This is used to remove any existing errors if present in auto complete */
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
    } else {
      let setStateFilterValue = false;
      /** If we click cross for state the zone and rpc should clear off! */
      if (eventName === state) {
        /** 
        This flag is used to determine that state is cleared which clears 
        off zone and rpc by setting their value to null 
        */
        setStateFilterValue = true;
        /** 
        When state is cleared then clear rpc and zone 
        */
        setRpcs([]);
        setZones([]);
        setDistricts([]);
        delete formState.values[zone];
        delete formState.values[rpc];
        delete formState.values[district];
      }
      setFormState(formState => ({
        ...formState,
        isStateClearFilter: setStateFilterValue
      }));
      /** This is used to remove clear out data form auto complete when we click cross icon of auto complete */
      delete formState.values[eventName];
      delete formState.adminValues[eventName];
    }
  };

  /** Dynamic bar */
  const addNewRow = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      dynamicBar: [...formState.dynamicBar, { index: Math.random() }]
    }));
  };
  const clickOnDelete = (record, index) => {
    setFormState(formState => ({
      ...formState,
      dynamicBar: formState.dynamicBar.filter(r => r !== record)
    }));
    if (record[streams]) {
      let streamsTempArray = [];
      streamsTempArray = streamsData;
      streamsDataBackup.map(streams => {
        if (record["streams"] === streams["id"]) {
          streamsTempArray.push(streams);
        }
      });
      setStreamsData(streamsTempArray);
    }
  };

  /** Handling multi select values for dynamic bar */
  const handleChangeForDynamicGrid = (
    eventName,
    event,
    selectedValueForAutoComplete,
    dynamicGridValue,
    isAutoComplete,
    isTextBox
  ) => {
    event.persist();
    /**TO SET VALUES OF AUTOCOMPLETE */
    if (isAutoComplete) {
      if (selectedValueForAutoComplete !== null) {
        setFormState(formState => ({
          ...formState,
          dynamicBar: formState.dynamicBar.map(r => {
            if (r["index"] === dynamicGridValue["index"]) {
              let streamsTempArray = [];
              streamsData.map(streams => {
                if (streams["id"] !== selectedValueForAutoComplete["id"]) {
                  streamsTempArray.push(streams);
                }
              });
              setStreamsData(streamsTempArray);
              r[eventName] = selectedValueForAutoComplete["id"];
              return r;
            } else {
              return r;
            }
          })
        }));
      } else {
        /** This is used to remove clear out data form auto complete when we click cross icon of auto complete */
        setFormState(formState => ({
          ...formState,
          dynamicBar: formState.dynamicBar.map(r => {
            if (r["index"] === dynamicGridValue["index"]) {
              let streamsTempArray = [];
              streamsTempArray = streamsData;
              streamsDataBackup.map(streams => {
                if (r[eventName] === streams["id"]) {
                  streamsTempArray.push(streams);
                }
              });
              setStreamsData(streamsTempArray);
              delete r[eventName];
              return r;
            } else {
              return r;
            }
          })
        }));
      }
    }
    if (isTextBox) {
      if (
        event.target.value === "" ||
        regexForPercentage.test(event.target.value)
      ) {
        setFormState(formState => ({
          ...formState,
          dynamicBar: formState.dynamicBar.map(r => {
            if (r["index"] === dynamicGridValue["index"]) {
              r[eventName] = event.target.value;
              if (r[eventName] === "") {
                delete r[eventName];
              }
              return r;
            } else {
              return r;
            }
          })
        }));
      }
    }
    /** Clear errors if any */
    formState.dynamicBarError.map(errorValues => {
      if (errorValues["index"] === dynamicGridValue["index"]) {
        delete errorValues[eventName];
      }
    });
  };

  /** Validate DynamicGrid */
  const validateDynamicGridValues = () => {
    let validationCounter = 0;
    /** Empty the error array of dynamic bar */
    formState.dynamicBarError = [];
    formState.dynamicBar.map(value => {
      let valueToPutInDynmicBarError = {};
      valueToPutInDynmicBarError["index"] = value["index"];
      /** Validate dyanmic bar */
      if (
        value.hasOwnProperty(streams) &&
        (!value.hasOwnProperty(firstYearStrength) ||
          !value.hasOwnProperty(secondYearStrength) ||
          !value.hasOwnProperty(thirdYearStrength))
      ) {
        if (!value.hasOwnProperty(firstYearStrength))
          valueToPutInDynmicBarError[firstYearStrength] = "Required";

        if (!value.hasOwnProperty(secondYearStrength))
          valueToPutInDynmicBarError[secondYearStrength] = "Required";

        if (!value.hasOwnProperty(thirdYearStrength))
          valueToPutInDynmicBarError[thirdYearStrength] = "Required";

        validationCounter += 1;
      } else if (
        value.hasOwnProperty(firstYearStrength) &&
        value.hasOwnProperty(secondYearStrength) &&
        value.hasOwnProperty(thirdYearStrength) &&
        !value.hasOwnProperty(streams)
      ) {
        valueToPutInDynmicBarError[streams] =
          "Stream is required as Strength is present";
        validationCounter += 1;
      }
      formState.dynamicBarError.push(valueToPutInDynmicBarError);
    });
    if (validationCounter > 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = event => {
    /** Validate DynamicGrid */
    let isDynamicBarValid;
    isDynamicBarValid = validateDynamicGridValues();
    /** Validate rest other valuesv */
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      CollegeFormSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        CollegeFormSchema
      );
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        CollegeFormSchema
      );
      formState.errors = formUtilities.setErrors(
        formState.values,
        CollegeFormSchema
      );
    }
    /** Check if both form and dynamicBar id valid */
    if (isValid && isDynamicBarValid) {
      postCollegeData();
      /** Set state to reload form */
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
    event.preventDefault();
  };

  const hasError = field => (formState.errors[field] ? true : false);

  const checkErrorInDynamicBar = (field, currentDynamicBarValue) => {
    let errorData = { error: false, value: "" };
    if (formState.dynamicBarError.length) {
      formState.dynamicBarError.map(barErrorValue => {
        if (barErrorValue["index"] === currentDynamicBarValue["index"]) {
          if (barErrorValue.hasOwnProperty(field)) {
            errorData.error = true;
            errorData.value = barErrorValue[field];
          }
        }
      });
    }
    return errorData;
  };

  const getDynamicBarData = () => {
    let streamStrengthArrayValues = [];
    formState.dynamicBar.map(field => {
      let streamStrengthValue = {};
      if (
        field.hasOwnProperty(streams) &&
        field.hasOwnProperty(firstYearStrength)
      ) {
        streamStrengthValue["stream"] = field[streams];
        streamStrengthValue["first_year_strength"] = parseInt(
          field[firstYearStrength]
        );
        streamStrengthValue["second_year_strength"] = parseInt(
          field[secondYearStrength]
        );
        streamStrengthValue["third_year_strength"] = parseInt(
          field[thirdYearStrength]
        );
        streamStrengthArrayValues.push(streamStrengthValue);
      }
    });
    return streamStrengthArrayValues;
  };

  const postCollegeData = async () => {
    let streamStrengthArray = [];
    streamStrengthArray = getDynamicBarData();
    let postData = databaseUtilities.addCollege(
      formState.values[collegeName],
      formState.values[collegeCode],
      formState.values[address],
      formState.values[contactNumber],
      formState.values[collegeEmail].toLowerCase(),
      formState.values[block] ? formState.values[block] : false,
      formState.values[principal] ? formState.values[principal] : null,
      formState.values[state] ? formState.values[state] : null,
      formState.values[rpc] ? formState.values[rpc] : null,
      formState.values[zone] ? formState.values[zone] : null,
      formState.values[district] ? formState.values[district] : null,
      streamStrengthArray,
      formState.values[tpos] ? formState.values[tpos] : []
    );
    console.log(postData);
    setLoaderStatus(true);
    if (formState.isEditCollege) {
      let EDIT_COLLEGE_URL =
        strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_CONTACT_URL;
      let EDIT_URL = strapiConstants.STRAPI_EDIT_COLLEGE;
      serviceProviders
        .serviceProviderForPutRequest(
          EDIT_COLLEGE_URL,
          formState.dataForEdit.contact["id"],
          postData,
          EDIT_URL
        )
        .then(res => {
          if (auth.getUserInfo().role.name === roleConstants.MEDHAADMIN) {
            history.push({
              pathname: routeConstants.MANAGE_COLLEGE,
              fromeditCollege: true,
              isDataEdited: true,
              editedCollegeData: res.data,
              editResponseMessage: "",
              editedData: {}
            });
          } else if (
            auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
          ) {
            commonUtilities.updateUser();
            history.push({
              pathname: routeConstants.VIEW_COLLEGE,
              fromeditCollege: true,
              isDataEdited: true,
              editedCollegeData: res.data,
              editResponseMessage: "",
              editedData: {}
            });
          }

          setLoaderStatus(false);
        })
        .catch(error => {
          console.log(error.response);
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
          history.push({
            pathname: routeConstants.MANAGE_COLLEGE,
            fromeditCollege: true,
            isDataEdited: false,
            editResponseMessage: errorMessage ? errorMessage : "",
            editedData: {}
          });
          setLoaderStatus(false);
        });
    } else {
      serviceProviders
        .serviceProviderForPostRequest(ADD_COLLEGES_URL, postData)
        .then(res => {
          history.push({
            pathname: routeConstants.MANAGE_COLLEGE,
            fromAddCollege: true,
            isDataAdded: true,
            addedCollegeData: res.data,
            addResponseMessage: "",
            addedData: {}
          });
          setLoaderStatus(false);
        })
        .catch(error => {
          console.log("errorCollege", error, error.response);
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
          history.push({
            pathname: routeConstants.MANAGE_COLLEGE,
            fromAddCollege: true,
            isDataAdded: false,
            addResponseMessage: errorMessage ? errorMessage : "",
            addedData: {}
          });
          setLoaderStatus(false);
        });
    }
  };

  const clickedCancelButton = () => {
    if (auth.getUserInfo().role.name === roleConstants.MEDHAADMIN) {
      history.push({
        pathname: routeConstants.MANAGE_COLLEGE
      });
    } else if (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) {
      history.push({
        pathname: routeConstants.VIEW_COLLEGE
      });
    }
  };
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {formState.isEditCollege
            ? genericConstants.EDIT_COLLEGE_TEXT
            : genericConstants.ADD_COLLEGE_TEXT}
        </Typography>
      </Grid>
      <Grid spacing={3}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    // helperText="Please specify the college name"
                    id={get(CollegeFormSchema[collegeName], "id")}
                    label={get(CollegeFormSchema[collegeName], "label")}
                    name={collegeName}
                    onChange={handleChange}
                    placeholder={get(
                      CollegeFormSchema[collegeName],
                      "placeholder"
                    )}
                    required
                    type={get(CollegeFormSchema[collegeName], "type")}
                    value={formState.values[collegeName] || ""}
                    error={hasError(collegeName)}
                    helperText={
                      hasError(collegeName)
                        ? formState.errors[collegeName].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    id={get(CollegeFormSchema[collegeCode], "id")}
                    label={get(CollegeFormSchema[collegeCode], "label")}
                    name={collegeCode}
                    onChange={handleChange}
                    placeholder={get(
                      CollegeFormSchema[collegeCode],
                      "placeholder"
                    )}
                    required
                    value={formState.values[collegeCode] || ""}
                    error={hasError(collegeCode)}
                    helperText={
                      hasError(collegeCode)
                        ? formState.errors[collegeCode].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  {formState.isCollegeAdmin ? (
                    <ReadOnlyTextField
                      id="StateName"
                      label={get(CollegeFormSchema[state], "label")}
                      defaultValue={collegeInfo.state.name}
                    />
                  ) : (
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel ref={inputLabel} id="state-label">
                        {/* State */}
                      </InputLabel>
                      <Autocomplete
                        id={get(CollegeFormSchema[state], "id")}
                        options={states}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(state, event, value);
                        }}
                        /** This is used to set the default value to the auto complete */
                        value={
                          states[
                            states.findIndex(function (item, i) {
                              return item.id === formState.values[state];
                            })
                          ] || null
                        }
                        name={state}
                        renderInput={params => (
                          <TextField
                            {...params}
                            error={hasError(state)}
                            required
                            helperText={
                              hasError(state)
                                ? formState.errors[state].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            placeholder={get(
                              CollegeFormSchema[state],
                              "placeholder"
                            )}
                            value={option => option.id}
                            name={state}
                            key={option => option.id}
                            label={get(CollegeFormSchema[state], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  )}
                </Grid>
                <Grid item md={6} xs={12}>
                  {formState.isCollegeAdmin ? (
                    <ReadOnlyTextField
                      id="ZoneName"
                      label={get(CollegeFormSchema[zone], "label")}
                      defaultValue={collegeInfo.zone.name}
                    />
                  ) : (
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel ref={inputLabel} id="zone-label">
                        {/* Zone */}
                      </InputLabel>

                      <Autocomplete
                        id={get(CollegeFormSchema[zone], "id")}
                        options={zones ? zones : <CircularProgress />}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(zone, event, value);
                        }}
                        /** This is used to set the default value to the auto complete */
                        value={
                          formState.isStateClearFilter
                            ? null
                            : zones[
                                zones.findIndex(function (item, i) {
                                  return item.id === formState.values[zone];
                                })
                              ] ||
                              null /** Please give a default " " blank value */
                        }
                        name={zone}
                        renderInput={params => (
                          <TextField
                            {...params}
                            required
                            error={hasError(zone)}
                            helperText={
                              hasError(zone)
                                ? formState.errors[zone].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            placeholder={get(
                              CollegeFormSchema[zone],
                              "placeholder"
                            )}
                            value={option => option.id}
                            name={rpc}
                            key={option => option.id}
                            label={get(CollegeFormSchema[zone], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  {formState.isCollegeAdmin ? (
                    <ReadOnlyTextField
                      id={get(CollegeFormSchema[rpcs], "id")}
                      label={get(CollegeFormSchema[rpc], "label")}
                      defaultValue={collegeInfo.rpc.name}
                    />
                  ) : (
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <InputLabel ref={inputLabel} id="rpcs-label">
                        {/* RPCs */}
                      </InputLabel>

                      <Autocomplete
                        id={get(CollegeFormSchema[rpc], "id")}
                        options={rpcs}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(rpc, event, value);
                        }}
                        name={rpc}
                        /** This is used to set the default value to the auto complete */
                        value={
                          formState.isStateClearFilter
                            ? null
                            : rpcs[
                                rpcs.findIndex(function (item, i) {
                                  return item.id === formState.values[rpc];
                                })
                              ] ||
                              null /** Please give a default " " blank value */
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            required
                            error={hasError(rpc)}
                            helperText={
                              hasError(rpc)
                                ? formState.errors[rpc].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                            placeholder={get(
                              CollegeFormSchema[rpc],
                              "placeholder"
                            )}
                            value={option => option.id}
                            name={rpc}
                            key={option => option.id}
                            label={get(CollegeFormSchema[rpc], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  )}
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className={classes.formControl}
                  >
                    <InputLabel ref={inputLabel} id="districts-label">
                      {/* Districts */}
                    </InputLabel>

                    <Autocomplete
                      id={get(CollegeFormSchema[district], "id")}
                      options={districts}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(district, event, value);
                      }}
                      name={district}
                      /** This is used to set the default value to the auto complete */
                      value={
                        formState.isStateClearFilter
                          ? null
                          : districts[
                              districts.findIndex(function (item, i) {
                                return item.id === formState.values[district];
                              })
                            ] ||
                            null /** Please give a default " " blank value */
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError(district)}
                          helperText={
                            hasError(district)
                              ? formState.errors[district].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                          placeholder={get(
                            CollegeFormSchema[district],
                            "placeholder"
                          )}
                          value={option => option.id}
                          name={district}
                          key={option => option.id}
                          label={get(CollegeFormSchema[district], "label")}
                          variant="outlined"
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    id={get(CollegeFormSchema[address], "id")}
                    label={get(CollegeFormSchema[address], "label")}
                    name={address}
                    onChange={handleChange}
                    required
                    placeholder={get(CollegeFormSchema[address], "placeholder")}
                    value={formState.values[address] || ""}
                    error={hasError(address)}
                    helperText={
                      hasError(address)
                        ? formState.errors[address].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    label={get(CollegeFormSchema[collegeEmail], "label")}
                    id={get(CollegeFormSchema[collegeEmail], "id")}
                    name={collegeEmail}
                    onChange={handleChange}
                    placeholder={get(
                      CollegeFormSchema[collegeEmail],
                      "placeholder"
                    )}
                    required
                    value={formState.values[collegeEmail] || ""}
                    error={hasError(collegeEmail)}
                    helperText={
                      hasError(collegeEmail)
                        ? formState.errors[collegeEmail].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label={get(CollegeFormSchema[contactNumber], "label")}
                    name={contactNumber}
                    onChange={handleChange}
                    required
                    placeholder={get(
                      CollegeFormSchema[contactNumber],
                      "placeholder"
                    )}
                    value={formState.values[contactNumber] || ""}
                    error={hasError(contactNumber)}
                    helperText={
                      hasError(contactNumber)
                        ? formState.errors[contactNumber].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <div
                    style={{ display: formState.showing ? "block" : "none" }}
                  >
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Switch
                            name={block}
                            checked={formState.values[block] || false}
                            onChange={handleChange}
                            value={formState.values[block] || false}
                            error={hasError(block).toString()}
                            helpertext={
                              hasError(block)
                                ? formState.errors[block].map(error => {
                                    return error + " ";
                                  })
                                : null
                            }
                          />
                        }
                        label={
                          formState.values[block] === true ? "Unblock" : "Block"
                        }
                      />
                    </FormGroup>
                  </div>
                </Grid>
              </Grid>
              {(auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
                auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) &&
              formState.isEditCollege ? (
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={12} xs={12}>
                    <Autocomplete
                      id={get(CollegeFormSchema[tpos], "id")}
                      multiple
                      options={user}
                      getOptionLabel={option => option.contact.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(tpos, event, value);
                      }}
                      name={tpos}
                      filterSelectedOptions
                      value={formState.dataToShowForMultiSelect || null}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError(tpos)}
                          helperText={
                            hasError(tpos)
                              ? formState.errors[tpos].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                          placeholder={get(
                            CollegeFormSchema[tpos],
                            "placeholder"
                          )}
                          label={get(CollegeFormSchema[tpos], "label")}
                          variant="outlined"
                        />
                      )}
                    />
                    {/* </FormControl> */}
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
            {tpoData ? (
              <Grid item xs={12} md={6} xl={3}>
                {tpoData.map(tpo => (
                  <Grid container spacing={3} className={classes.MarginBottom}>
                    <Grid item md={6} xs={12}>
                      <ReadOnlyTextField
                        id="TPO Email"
                        label={"Tpo Email"}
                        defaultValue={tpo.contact.email}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <ReadOnlyTextField
                        id="TPO Contact Number"
                        label={"TPO Contact Number"}
                        defaultValue={tpo.contact.phone}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            ) : null}
            {(auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
              auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) &&
            formState.isEditCollege ? (
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    id={get(CollegeFormSchema[principal], "id")}
                    options={user}
                    getOptionLabel={option => option.contact.name}
                    onChange={(event, value) => {
                      handleChangeAutoComplete(principal, event, value);
                    }}
                    /** This is used to set the default value to the auto complete */
                    value={
                      user[
                        user.findIndex(function (item, i) {
                          return (
                            item.contact.user.id === formState.values[principal]
                          );
                        })
                      ] || null /** Please give a default " " blank value */
                    }
                    name={principal}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={hasError(principal)}
                        helperText={
                          hasError(principal)
                            ? formState.errors[principal].map(error => {
                                return error + " ";
                              })
                            : null
                        }
                        placeholder={get(
                          CollegeFormSchema[principal],
                          "placeholder"
                        )}
                        value={option => option.id}
                        name={principal}
                        key={option => option.id}
                        label={get(CollegeFormSchema[principal], "label")}
                        variant="outlined"
                      />
                    )}
                  />
                  {/* </FormControl> */}
                </Grid>
              </Grid>
            ) : null}
            {principalData && isGetAdminData ? (
              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <ReadOnlyTextField
                      id="Principal Email"
                      label={"Principal Email"}
                      defaultValue={
                        principalData.contact
                          ? principalData.contact.email
                            ? principalData.contact.email
                            : ""
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <ReadOnlyTextField
                      id="Principal Contact Number"
                      label={"Principal Contact Number"}
                      defaultValue={
                        principalData.contact
                          ? principalData.contact.phone
                            ? principalData.contact.phone
                            : ""
                          : ""
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            ) : null}

            <Divider className={classes.divider} />
            <Grid item xs={12} md={10} xl={8}>
              <Grid container spacing={1} className={classes.formgrid}>
                <Grid item md={12} xs={12} className={classes.streamcard}>
                  <Card className={classes.streamoffer}>
                    <InputLabel
                      htmlFor="outlined-stream-card"
                      fullwidth={true.toString()}
                    >
                      {genericConstants.STREAMS_OFFERED_TEXT}
                    </InputLabel>

                    {formState.dynamicBar.map((val, idx) => {
                      let streamId = `stream-${idx}`,
                        firstYearStrengthId = `first-year-strength-${idx}`,
                        secondYearStrengthId = `second-year-strength-${idx}`,
                        thirdYearStrengthId = `third-year-strength-${idx}`;
                      return (
                        <Card
                          id="outlined-stream-card"
                          fullwidth={true.toString()}
                          className={classes.streamcardcontent}
                          key={idx}
                        >
                          <CardContent>
                            <Grid container spacing={1}>
                              <Grid item xs={4}>
                                <FormControl
                                  variant="outlined"
                                  fullWidth
                                  className={classes.formControl}
                                >
                                  <InputLabel
                                    ref={inputLabel}
                                    id="demo-simple-select-outlined-label"
                                  >
                                    {/* Streams */}
                                  </InputLabel>
                                  <Autocomplete
                                    id={streamId}
                                    options={streamsData}
                                    getOptionLabel={option => option.name}
                                    onChange={(event, value) => {
                                      handleChangeForDynamicGrid(
                                        streams,
                                        event,
                                        value,
                                        val,
                                        true,
                                        false
                                      );
                                    }}
                                    data-id={idx}
                                    name={streamId}
                                    value={
                                      streamsDataBackup[
                                        streamsDataBackup.findIndex(function (
                                          item,
                                          i
                                        ) {
                                          return (
                                            item.id ===
                                            formState.dynamicBar[idx][streams]
                                          );
                                        })
                                      ] || null
                                    }
                                    renderInput={params => (
                                      <TextField
                                        {...params}
                                        value={option => option.id}
                                        name={streamId}
                                        error={
                                          checkErrorInDynamicBar(streams, val)[
                                            "error"
                                          ]
                                        }
                                        helperText={
                                          checkErrorInDynamicBar(streams, val)[
                                            "error"
                                          ]
                                            ? checkErrorInDynamicBar(
                                                streams,
                                                val
                                              )["value"]
                                            : null
                                        }
                                        placeholder={get(
                                          CollegeFormSchema[streams],
                                          "placeholder"
                                        )}
                                        key={option => option.id}
                                        label={get(
                                          CollegeFormSchema[streams],
                                          "label"
                                        )}
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </FormControl>
                              </Grid>
                              {/** Need to map streams with strength */}
                              <Grid item xs={2}>
                                <TextField
                                  label="First Year Strength"
                                  name={firstYearStrengthId}
                                  variant="outlined"
                                  fullWidth
                                  data-id={idx}
                                  id={firstYearStrengthId}
                                  value={
                                    formState.dynamicBar[idx][
                                      firstYearStrength
                                    ] || ""
                                  }
                                  error={
                                    checkErrorInDynamicBar(
                                      firstYearStrength,
                                      val
                                    )["error"]
                                  }
                                  helperText={
                                    checkErrorInDynamicBar(
                                      firstYearStrength,
                                      val
                                    )["error"]
                                      ? checkErrorInDynamicBar(
                                          firstYearStrength,
                                          val
                                        )["value"]
                                      : null
                                  }
                                  placeholder={get(
                                    CollegeFormSchema[firstYearStrength],
                                    "placeholder"
                                  )}
                                  onChange={event => {
                                    handleChangeForDynamicGrid(
                                      firstYearStrength,
                                      event,
                                      null,
                                      val,
                                      false,
                                      true
                                    );
                                  }}
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <TextField
                                  label="Second Year Strength"
                                  name={secondYearStrengthId}
                                  variant="outlined"
                                  fullWidth
                                  data-id={idx}
                                  id={secondYearStrengthId}
                                  value={
                                    formState.dynamicBar[idx][
                                      secondYearStrength
                                    ] || ""
                                  }
                                  error={
                                    checkErrorInDynamicBar(
                                      secondYearStrength,
                                      val
                                    )["error"]
                                  }
                                  helperText={
                                    checkErrorInDynamicBar(
                                      secondYearStrength,
                                      val
                                    )["error"]
                                      ? checkErrorInDynamicBar(
                                          secondYearStrength,
                                          val
                                        )["value"]
                                      : null
                                  }
                                  placeholder={get(
                                    CollegeFormSchema[secondYearStrength],
                                    "placeholder"
                                  )}
                                  onChange={event => {
                                    handleChangeForDynamicGrid(
                                      secondYearStrength,
                                      event,
                                      null,
                                      val,
                                      false,
                                      true
                                    );
                                  }}
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <TextField
                                  label="Third Year Strength"
                                  name={thirdYearStrengthId}
                                  variant="outlined"
                                  fullWidth
                                  data-id={idx}
                                  id={thirdYearStrengthId}
                                  value={
                                    formState.dynamicBar[idx][
                                      thirdYearStrength
                                    ] || ""
                                  }
                                  error={
                                    checkErrorInDynamicBar(
                                      thirdYearStrength,
                                      val
                                    )["error"]
                                  }
                                  helperText={
                                    checkErrorInDynamicBar(
                                      thirdYearStrength,
                                      val
                                    )["error"]
                                      ? checkErrorInDynamicBar(
                                          thirdYearStrength,
                                          val
                                        )["value"]
                                      : null
                                  }
                                  placeholder={get(
                                    CollegeFormSchema[thirdYearStrength],
                                    "placeholder"
                                  )}
                                  onChange={event => {
                                    handleChangeForDynamicGrid(
                                      thirdYearStrength,
                                      event,
                                      null,
                                      val,
                                      false,
                                      true
                                    );
                                  }}
                                />
                              </Grid>
                              <Grid item xs={2}>
                                {idx > 0 ? (
                                  <DeleteForeverOutlinedIcon
                                    onClick={e => clickOnDelete(val, idx)}
                                    style={{ color: "red", fontSize: "24px" }}
                                  />
                                ) : (
                                  ""
                                )}
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      );
                    })}
                    <div className={classes.btnspaceadd}>
                      <YellowButton
                        disabled={streamsData.length ? false : true}
                        color="primary"
                        variant="contained"
                        className={classes.add_more_btn}
                        onClick={addNewRow}
                      >
                        {genericConstants.ADD_MORE_TEXT}
                      </YellowButton>
                    </div>
                  </Card>
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
                onClick={handleSubmit}
                className={classes.submitbtn}
              >
                {genericConstants.SAVE_BUTTON_TEXT}
              </YellowButton>
              <GrayButton
                color="primary"
                variant="contained"
                onClick={clickedCancelButton}
                className={classes.resetbtn}
              >
                {genericConstants.CANCEL_BUTTON_TEXT}
              </GrayButton>
            </CardActions>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};
AddEditCollege.propTypes = {
  className: PropTypes.string
};
export default AddEditCollege;
