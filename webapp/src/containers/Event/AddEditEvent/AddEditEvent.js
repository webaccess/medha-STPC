import React, { useState, useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Grid,
  TextField,
  Typography,
  FormHelperText,
  Button,
  Box
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import {
  YellowButton,
  CustomDateTimePicker,
  GrayButton,
  Spinner,
  Auth as auth
} from "../../../components";
import useStyles from "../../ContainerStyles/AddEditPageStyles";
import * as serviceProvider from "../../../api/Axios";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import EventSchema from "../EventSchema";
import { get } from "lodash";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import * as formUtilities from "../../../Utilities/FormUtilities";
import { useHistory } from "react-router-dom";
import * as databaseUtilities from "../../../Utilities/StrapiUtilities";
import * as routeConstants from "../../../constants/RouteConstants";
import * as genericConstants from "../../../constants/GenericConstants";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./RichTextFieldStyles.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Img from "react-image";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

const eventName = "eventName";
const description = "description";
const dateFrom = "dateFrom";
const dateTo = "dateTo";
const address = "address";
const state = "state";
const zone = "zone";
const rpc = "rpc";
const college = "college";
const stream = "stream";
const percentage = "percentage";
const educationpercentage = "educationpercentage";
const qualification = "qualification";
const education = "education";
const field = "upload_logo";
const ref = "event";
const files = "files";

const STATES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;
const QUALIFICATIONS_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_QUALIFICATIONS;
const STREAM_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STREAMS;
const EVENTS_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_EVENTS;
const DOCUMENT_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_UPLOAD;
const COLLEGE_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES;

const AddEditEvent = props => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
  const classes = useStyles();
  const history = useHistory();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false,
    showPassword: false,
    isEditEvent: props["editEvent"] ? props["editEvent"] : false,
    dataForEdit: props["dataForEdit"] ? props["dataForEdit"] : {},
    counter: 0,
    files: {},
    filess: {},
    descriptionError: false,
    dataToShowForMultiSelect: [],
    dataToShowForStreamMultiSelect: [],
    deleteImage: false,
    previewFile: {},
    showPreviewImage: false,
    showPreviewEditImage: false,
    showPreviewNoImage: false,
    showAddPreviewNoImage: true,
    dynamicBar: [{ index: Math.random() }],
    dynamicBarError: [],
    dynamicEducationBar: [{ index: Math.random() }],
    dynamicEducationBarError: [],
    isCollegeAdmin: false
  });

  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [streams, setStreams] = useState([]);
  const inputLabel = React.useRef(null);
  const [qualifications, setQualifications] = useState([]);
  const [qualificationsDataBackup, setQualificationsDataBackup] = useState([]);
  const [educations, setEducations] = useState([]);
  const [educationsDataBackup, setEducationsDataBackup] = useState([]);
  const [collegeInfo, setCollegeInfo] = useState({
    college: {},
    state: {},
    rpc: {},
    zone: {}
  });

  // if (auth.getUserInfo().role.name === "College Admin") {
  //   formState.isCollegeAdmin = auth.getUserInfo().college.id;
  //   setCollegeInfo(collegeInfo => ({
  //     ...collegeInfo,
  //     college: auth.getUserInfo().college,
  //     state: auth.getUserInfo().state,
  //     rpc: auth.getUserInfo().rpc,
  //     zone: auth.getUserInfo().zone
  //   }));
  // }
  if (formState.dataForEdit && !formState.counter) {
    /** Part for editing state */
    if (props["dataForEdit"]) {
      if (props["dataForEdit"]["title"]) {
        formState.values[eventName] = props["dataForEdit"]["title"];
      }
      if (props["dataForEdit"]["description"]) {
        formState.values[description] = props["dataForEdit"]["description"];
        const blocksFromHtml = htmlToDraft(props["dataForEdit"]["description"]);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
      if (props["dataForEdit"]["start_date_time"]) {
        let today = new Date(props["dataForEdit"]["start_date_time"]);
        let date =
          today.getDate() +
          "-" +
          parseInt(today.getMonth() + 1) +
          "-" +
          today.getFullYear();

        formState.values[dateFrom] = props["dataForEdit"]["start_date_time"];
        //formState.defaultDate = date;
      }
      if (props["dataForEdit"]["end_date_time"]) {
        formState.values[dateTo] = props["dataForEdit"]["end_date_time"];
      }
      if (props["dataForEdit"]["address"]) {
        formState.values[address] = props["dataForEdit"]["address"];
      }
      if (
        props["dataForEdit"] &&
        props["dataForEdit"]["rpc"] &&
        props["dataForEdit"]["rpc"]["state"]
      ) {
        formState.values[state] = props["dataForEdit"]["rpc"]["state"];
      }

      if (props["dataForEdit"]["rpc"] && props["dataForEdit"]["rpc"]["id"]) {
        formState.values[rpc] = props["dataForEdit"]["rpc"]["id"];
      }
      if (
        props["dataForEdit"] &&
        props["dataForEdit"]["colleges"] &&
        props["dataForEdit"]["colleges"][0] &&
        props["dataForEdit"]["colleges"][0]["zone"]
      ) {
        formState.values[zone] = props["dataForEdit"]["colleges"][0]["zone"];
      }
      if (
        props["dataForEdit"]["colleges"] &&
        props["dataForEdit"]["colleges"].length
      ) {
        // formState.values[college] = props["dataForEdit"]["colleges"][0]["id"];
        formState.dataToShowForMultiSelect = props["dataForEdit"]["colleges"];
        let finalData = [];
        for (let i in props["dataForEdit"]["colleges"]) {
          finalData.push(props["dataForEdit"]["colleges"][i]["id"]);
        }
        formState.values[college] = finalData;
      }
      if (
        props["dataForEdit"]["streams"] &&
        props["dataForEdit"]["streams"].length
      ) {
        formState.dataToShowForStreamMultiSelect =
          props["dataForEdit"]["streams"];
        let finalDataStream = [];
        for (let i in props["dataForEdit"]["streams"]) {
          finalDataStream.push(props["dataForEdit"]["streams"][i]["id"]);
        }
        formState.values[stream] = finalDataStream;
      }
      if (
        props["dataForEdit"] &&
        props["dataForEdit"]["educations"] &&
        props["dataForEdit"]["educations"].length
      ) {
        let dynamicEducationBar = [];
        for (let i in props["dataForEdit"]["educations"]) {
          let tempEducationDynamicBarValue = {};
          tempEducationDynamicBarValue["index"] = Math.random();
          tempEducationDynamicBarValue["id"] =
            props["dataForEdit"]["educations"][i]["id"];
          tempEducationDynamicBarValue[education] =
            props["dataForEdit"]["educations"][i]["education_year"];
          tempEducationDynamicBarValue[educationpercentage] =
            props["dataForEdit"]["educations"][i]["percentage"];
          dynamicEducationBar.push(tempEducationDynamicBarValue);
        }
        formState.dynamicEducationBar = dynamicEducationBar;
      }

      if (
        props["dataForEdit"] &&
        props["dataForEdit"]["qualifications"] &&
        props["dataForEdit"]["qualifications"].length
      ) {
        let dynamicBar = [];
        for (let i in props["dataForEdit"]["qualifications"]) {
          let tempDynamicBarValue = {};
          tempDynamicBarValue["index"] = Math.random();
          tempDynamicBarValue["id"] =
            props["dataForEdit"]["qualifications"][i]["id"];
          tempDynamicBarValue[qualification] =
            props["dataForEdit"]["qualifications"][i]["qualification"];
          tempDynamicBarValue[percentage] =
            props["dataForEdit"]["qualifications"][i]["percentage"];
          dynamicBar.push(tempDynamicBarValue);
        }
        formState.dynamicBar = dynamicBar;
      }
      if (props["dataForEdit"] && props["dataForEdit"]["upload_logo"]) {
        formState.showPreviewEditImage = true;
        formState.showAddPreviewNoImage = false;
      }
      if (
        props["dataForEdit"] &&
        props["dataForEdit"]["upload_logo"] === null
      ) {
        formState.showPreviewNoImage = true;
        formState.showAddPreviewNoImage = true;
      }
    }
    formState.counter += 1;
  }

  useEffect(() => {
    let paramsForPageSize = {
      pageSize: -1
    };

    serviceProvider
      .serviceProviderForGetRequest(STATES_URL, paramsForPageSize)
      .then(res => {
        setStates(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });

    setEducationsDataBackup(genericConstants.EDUCATIONS);
    let educationDataForEdit = genericConstants.EDUCATIONS;

    if (formState.isEditEvent) {
      let tempQualificationData = educationDataForEdit;
      let qualificationPercentageArray =
        props["dataForEdit"]["qualification_percentage"];

      for (let i in qualificationPercentageArray) {
        let id = qualificationPercentageArray[i]["qualification"]["id"];
        for (let j in tempQualificationData) {
          if (tempQualificationData[j]["id"] === id)
            tempQualificationData.splice(j, 1);
        }
      }
      setEducations(tempQualificationData);
    } else {
      setEducations(educationDataForEdit);
    }

    setQualificationsDataBackup(genericConstants.QUALIFICATIONS);
    let dataForEditing = genericConstants.QUALIFICATIONS;
    if (formState.isEditEvent) {
      let tempQualificationData = dataForEditing;
      let qualificationPercentageArray =
        props["dataForEdit"]["qualification_percentage"];
      for (let i in qualificationPercentageArray) {
        let id = qualificationPercentageArray[i]["qualification"]["id"];
        for (let j in tempQualificationData) {
          if (tempQualificationData[j]["id"] === id)
            tempQualificationData.splice(j, 1);
        }
      }
      setQualifications(tempQualificationData);
    } else {
      setQualifications(dataForEditing);
    }

    serviceProvider
      .serviceProviderForGetRequest(STREAM_URL, paramsForPageSize)
      .then(res => {
        setStreams(res.data.result);
      })

      .catch(error => {
        console.log("errorstream", error);
      });
  }, []);

  useEffect(() => {
    if (
      formState.values.hasOwnProperty(state) &&
      formState.values[state] !== null &&
      formState.values[state] !== undefined
    ) {
      fetchZoneRpcDistrictData();
    }
  }, [formState.values[state]]);

  /** Common function to get zones, rpcs after changing state */
  async function fetchZoneRpcDistrictData() {
    if (
      formState.values.hasOwnProperty(state) &&
      formState.values[state] !== null &&
      formState.values[state] !== undefined &&
      formState.values[state] !== ""
    ) {
      let zones_url =
        STATES_URL +
        "/" +
        formState.values[state] +
        "/" +
        strapiApiConstants.STRAPI_ZONES;

      await serviceProvider
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
        strapiApiConstants.STRAPI_RPCS;

      await serviceProvider
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
    }
  }

  useEffect(() => {
    if (formState.values[zone] && formState.values[rpc]) {
      fetchCollegeData();
    }
  }, [formState.values[zone], formState.values[rpc]]);

  /** Function to get college data after selcting zones and rpc's */
  async function fetchCollegeData() {
    let params = {
      "zone.id": formState.values[zone],
      "rpc.id": formState.values[rpc],
      pageSize: -1
    };

    await serviceProvider
      .serviceProviderForGetRequest(COLLEGE_URL, params)
      .then(res => {
        setColleges(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  const hasError = field => (formState.errors[field] ? true : false);
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

  const checkErrorInDynamicBar = (field, currentDynamicBarValue) => {
    if (field == "qualification" || field == "percentage") {
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
    } else if (field == "education" || field == "educationpercentage") {
      let errorEducationData = { error: false, value: "" };

      if (formState.dynamicEducationBarError.length) {
        formState.dynamicEducationBarError.map(barErrorValue => {
          if (barErrorValue["index"] === currentDynamicBarValue["index"]) {
            if (barErrorValue.hasOwnProperty(field)) {
              errorEducationData.error = true;
              errorEducationData.value = barErrorValue[field];
            }
          }
        });
      }
      return errorEducationData;
    }
  };
  const addNewRow = (e, extendBarName) => {
    e.persist();
    if (extendBarName == "qualification") {
      setFormState(formState => ({
        ...formState,
        dynamicBar: [...formState.dynamicBar, { index: Math.random() }]
      }));
    } else if (extendBarName == "education") {
      setFormState(formState => ({
        ...formState,
        dynamicEducationBar: [
          ...formState.dynamicEducationBar,
          { index: Math.random() }
        ]
      }));
    }
  };
  const clickOnDelete = (record, index) => {
    setFormState(formState => ({
      ...formState,
      dynamicBar: formState.dynamicBar.filter(r => r !== record)
    }));
    setFormState(formState => ({
      ...formState,
      dynamicEducationBar: formState.dynamicEducationBar.filter(
        r => r !== record
      )
    }));

    if (record[qualification]) {
      let qualificationsTempArray = [];
      qualificationsTempArray = qualifications;
      qualificationsDataBackup.map(qualificationData => {
        if (record["qualification"] === qualificationData["id"]) {
          qualificationsTempArray.push(qualificationData);
        }
      });
      setQualifications(qualificationsTempArray);
    }
    if (record[education]) {
      let qualificationsTempArray = [];
      qualificationsTempArray = educations;
      educationsDataBackup.map(qualificationData => {
        if (record["education"] === qualificationData["id"]) {
          qualificationsTempArray.push(qualificationData);
        }
      });
      setEducations(qualificationsTempArray);
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
    if (eventName == "qualification" || eventName == "percentage") {
      /**TO SET VALUES OF AUTOCOMPLETE */
      if (isAutoComplete) {
        if (selectedValueForAutoComplete !== null) {
          setFormState(formState => ({
            ...formState,
            dynamicBar: formState.dynamicBar.map(r => {
              if (r["index"] === dynamicGridValue["index"]) {
                let qualificationsTempArray = [];
                qualifications.map(qualificationData => {
                  if (
                    qualificationData["id"] !==
                    selectedValueForAutoComplete["id"]
                  ) {
                    qualificationsTempArray.push(qualificationData);
                  }
                });
                setQualifications(qualificationsTempArray);
                r["id"] = selectedValueForAutoComplete["id"];
                r[eventName] = selectedValueForAutoComplete["value"];
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
                let qualificationsTempArray = [];
                qualificationsTempArray = qualifications;
                qualificationsDataBackup.map(qualificationData => {
                  if (r[eventName] === qualificationData["id"]) {
                    qualificationsTempArray.push(qualificationData);
                  }
                });
                setQualifications(qualificationsTempArray);
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
      /** Clear errors if any */
      formState.dynamicBarError.map(errorValues => {
        if (errorValues["index"] === dynamicGridValue["index"]) {
          delete errorValues[eventName];
        }
      });
    } else if (eventName == "education" || eventName == "educationpercentage") {
      if (isAutoComplete) {
        if (selectedValueForAutoComplete !== null) {
          setFormState(formState => ({
            ...formState,
            dynamicEducationBar: formState.dynamicEducationBar.map(r => {
              if (r["index"] === dynamicGridValue["index"]) {
                let educationsTempArray = [];
                educations.map(educationData => {
                  if (
                    educationData["id"] !== selectedValueForAutoComplete["id"]
                  ) {
                    educationsTempArray.push(educationData);
                  }
                });
                setEducations(educationsTempArray);
                r["id"] = selectedValueForAutoComplete["id"];
                r[eventName] = selectedValueForAutoComplete["value"];
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
            dynamicEducationBar: formState.dynamicEducationBar.map(r => {
              if (r["index"] === dynamicGridValue["index"]) {
                let educationsTempArray = [];
                educationsTempArray = educations;
                educationsDataBackup.map(educationData => {
                  if (r[eventName] === educationData["id"]) {
                    educationsTempArray.push(educationData);
                  }
                });
                setQualifications(educationsTempArray);
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
        setFormState(formState => ({
          ...formState,
          dynamicEducationBar: formState.dynamicEducationBar.map(r => {
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
      /** Clear errors if any */
      formState.dynamicBarError.map(errorValues => {
        if (errorValues["index"] === dynamicGridValue["index"]) {
          delete errorValues[eventName];
        }
      });
    }
  };

  /** Validate DynamicGrid */
  const validateDynamicGridValues = () => {
    let validationCounter = 0;
    /** Empty the error array of dynamic bar */
    formState.dynamicBarError = [];

    formState.dynamicBar.map(value => {
      let valueToPutInDynmicBarError = {};
      valueToPutInDynmicBarError["index"] = value["index"];
      /** Validate dynamikc bar */
      if (
        value.hasOwnProperty(qualification) &&
        !value.hasOwnProperty(percentage)
      ) {
        valueToPutInDynmicBarError[percentage] =
          "Percentage is required as Qualification is present";
        validationCounter += 1;
      } else if (
        value.hasOwnProperty(percentage) &&
        !value.hasOwnProperty(qualification)
      ) {
        valueToPutInDynmicBarError[qualification] =
          "Qualification is required as percentage is present";
        validationCounter += 1;
      }
      formState.dynamicBarError.push(valueToPutInDynmicBarError);
    });
    formState.dynamicEducationBarError = [];
    formState.dynamicEducationBar.map(value => {
      let valueToPutInDynmicBarError = {};
      valueToPutInDynmicBarError["index"] = value["index"];
      /** Validate dynamikc bar */
      if (
        value.hasOwnProperty(education) &&
        !value.hasOwnProperty(educationpercentage)
      ) {
        valueToPutInDynmicBarError[educationpercentage] =
          "Percentage is required as Education is present";
        validationCounter += 1;
      } else if (
        value.hasOwnProperty(educationpercentage) &&
        !value.hasOwnProperty(education)
      ) {
        valueToPutInDynmicBarError[education] =
          "Education is required as percentage is present";
        validationCounter += 1;
      }
      formState.dynamicEducationBarError.push(valueToPutInDynmicBarError);
    });
    if (validationCounter > 0) {
      return false;
    } else {
      return true;
    }
  };

  const getDynamicBarData = () => {
    let qualificationsPercentageArrayValues = [];
    formState.dynamicBar.map(field => {
      let qualificationPercentageValue = {};
      if (
        field.hasOwnProperty(qualification) &&
        field.hasOwnProperty(percentage)
      ) {
        qualificationPercentageValue["qualification"] = field[qualification];
        qualificationPercentageValue["percentage"] = parseInt(
          field[percentage]
        );
        qualificationsPercentageArrayValues.push(qualificationPercentageValue);
      }
    });

    return qualificationsPercentageArrayValues;
  };

  const getDynamicEducationData = () => {
    let educationsPercentageArrayValues = [];
    formState.dynamicEducationBar.map(field => {
      let educationPercentageValue = {};
      if (
        field.hasOwnProperty(education) &&
        field.hasOwnProperty(educationpercentage)
      ) {
        educationPercentageValue["education_year"] = field[education];
        educationPercentageValue["percentage"] = parseInt(
          field[educationpercentage]
        );
        educationsPercentageArrayValues.push(educationPercentageValue);
      }
    });

    return educationsPercentageArrayValues;
  };

  /** Handle change for autocomplete fields */
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
    } else {
      delete formState.values[eventName];
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    /** Validate DynamicGrid */
    let isDynamicBarValid;
    isDynamicBarValid = validateDynamicGridValues();
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      EventSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(formState.values, EventSchema);

      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        EventSchema
      );
      formState.errors = formUtilities.setErrors(formState.values, EventSchema);
    }
    formState.descriptionError = false;
    if (
      convertToRaw(editorState.getCurrentContent()).blocks &&
      convertToRaw(editorState.getCurrentContent()).blocks.length
    ) {
      let arrayToCheckIn = convertToRaw(editorState.getCurrentContent()).blocks;
      let validationCounter = 0;
      for (let i in arrayToCheckIn) {
        if (
          arrayToCheckIn[i]["text"] &&
          arrayToCheckIn[i]["text"].trim().length !== 0
        ) {
          validationCounter += 1;
          break;
        }
      }
      if (validationCounter === 0) {
        formState.descriptionError = true;
      }
    }
    if (isValid && !formState.descriptionError && isDynamicBarValid) {
      /** CALL POST FUNCTION */
      postEventData();
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

  const postEventData = () => {
    let qualificationPercentageArray = [];
    qualificationPercentageArray = getDynamicBarData();
    let educationPercentageArray = [];
    educationPercentageArray = getDynamicEducationData();

    let postData = databaseUtilities.addEvent(
      formState.values[eventName],
      draftToHtml(convertToRaw(editorState.getCurrentContent())),
      formState.values[dateFrom],
      formState.values[dateTo],
      formState.values[address],
      formState.values[zone] ? formState.values[zone] : null,
      formState.values[rpc] ? formState.values[rpc] : null,
      qualificationPercentageArray,
      educationPercentageArray,
      formState.values[college] ? formState.values[college] : null,
      formState.values[stream] ? formState.values[stream] : null,
      formState.values[state] ? formState.values[state] : null
    );
    if (formState.isEditEvent) {
      serviceProvider
        .serviceProviderForPutRequest(
          EVENTS_URL,
          formState.dataForEdit["id"],
          postData
        )
        .then(res => {
          if (formState.files.name) {
            postImage(res.data.id);
          } else {
            history.push({
              pathname: routeConstants.MANAGE_EVENT,
              fromAddEvent: true,
              isDataAdded: true,
              addResponseMessage: "",
              addedData: {}
            });
          }
        })
        .catch(error => {
          console.log("puterror", error);
        });
    } else {
      serviceProvider
        .serviceProviderForPostRequest(EVENTS_URL, postData)
        .then(res => {
          if (formState.files.name) {
            postImage(res.data.id);
          } else {
            history.push({
              pathname: routeConstants.MANAGE_EVENT,
              fromAddEvent: true,
              isDataAdded: true,
              addResponseMessage: "",
              addedData: {}
            });
          }
        })
        .catch(error => {
          console.log("posterror", error);
        });
    }
  };

  const postImage = id => {
    let postImageData = databaseUtilities.uploadDocument(
      formState.files,
      ref,
      id,
      field
    );
    serviceProvider
      .serviceProviderForPostRequest(DOCUMENT_URL, postImageData)
      .then(res => {
        history.push({
          pathname: routeConstants.MANAGE_EVENT,
          fromAddEvent: true,
          isDataAdded: true,
          addResponseMessage: "",
          addedData: {}
        });
      })
      .catch(err => {
        console.log("error", err);
      });
  };

  const handleFileChange = event => {
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
      },
      files: event.target.files[0],
      previewFile: URL.createObjectURL(event.target.files[0]),
      showPreviewEditImage: false,
      showPreviewNoImage: false,
      showPreviewImage: true,
      showAddPreviewNoImage: false
    }));

    /** This is used to remove any existing errors if present in text field */
    if (formState.errors.hasOwnProperty(event.target.name)) {
      delete formState.errors[event.target.name];
    }
  };

  const handleDateChange = (datefrom, event) => {
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [datefrom]: event
      },
      touched: {
        ...formState.touched,
        [datefrom]: true
      },
      isStateClearFilter: false
    }));
  };

  const handleMultiSelectChange = (eventName, event, value) => {
    if (eventName === college) {
      formState.dataToShowForMultiSelect = value;
    }
    if (eventName === stream) {
      formState.dataToShowForStreamMultiSelect = value;
    }
    let multiarray = [];
    for (var i = 0; i < value.length; i++) {
      multiarray.push(value[i].id);
    }
    if (value !== null) {
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          [eventName]: multiarray
        },
        touched: {
          ...formState.touched,
          [eventName]: true
        },
        isStateClearFilter: false
      }));
    } else {
      delete formState.values[eventName];
    }
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.ADD_EVENT_TEXT}
        </Typography>
      </Grid>
      <Grid spacing={3}>
        <Card>
          <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <CardContent>
              <Grid item xs={12} md={6} xl={3}>
                <Grid container className={classes.formgridInputFile}>
                  <Grid item md={10} xs={12}>
                    <div className={classes.imageDiv}>
                      {
                        formState.showPreviewImage ? (
                          <Img
                            src={formState.previewFile}
                            alt="abc"
                            loader={<Spinner />}
                            className={classes.UploadImage}
                          />
                        ) : null
                        // <div class={classes.DefaultNoImage}></div>
                      }

                      {formState.showPreviewEditImage &&
                      formState.dataForEdit["upload_logo"] !== null &&
                      formState.dataForEdit["upload_logo"] !== undefined &&
                      formState.dataForEdit["upload_logo"] !== {} ? (
                        <Img
                          src={
                            strapiApiConstants.STRAPI_DB_URL_WITHOUT_HASH +
                            formState.dataForEdit["upload_logo"]["url"]
                          }
                          loader={<Spinner />}
                          className={classes.UploadImage}
                        />
                      ) : null}
                      {formState.showPreviewNoImage ? (
                        <Img
                          src={"../"}
                          loader={<Spinner />}
                          className={classes.UploadImage}
                        />
                      ) : null}
                      {formState.showAddPreviewNoImage ? (
                        <div class={classes.DefaultNoImage}></div>
                      ) : null}
                    </div>
                  </Grid>
                </Grid>
                <Grid container className={classes.MarginBottom}>
                  <Grid item md={10} xs={12}>
                    <TextField
                      fullWidth
                      id={get(EventSchema[files], "id")}
                      name={files}
                      onChange={handleFileChange}
                      required
                      type={get(EventSchema[files], "type")}
                      value={formState.values[files] || ""}
                      error={hasError(files)}
                      inputProps={{ accept: "image/*" }}
                      helperText={
                        hasError(files)
                          ? formState.errors[files].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      variant="outlined"
                      className={classes.inputFile}
                    />
                    <label htmlFor={get(EventSchema[files], "id")}>
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        fullWidth
                        className={classes.InputFileButton}
                        startIcon={<AddOutlinedIcon />}
                      >
                        ADD NEW FILE
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
                      label={get(EventSchema[eventName], "label")}
                      id={get(EventSchema[eventName], "id")}
                      name={eventName}
                      placeholder={get(EventSchema[eventName], "placeholder")}
                      value={formState.values[eventName] || ""}
                      error={hasError(eventName)}
                      variant="outlined"
                      required
                      fullWidth
                      onChange={handleChange}
                      helperText={
                        hasError(eventName)
                          ? formState.errors[eventName].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={12} xs={12} className={"descriptionBox"}>
                    <Grid
                      className={
                        formState.descriptionError
                          ? classes.descriptionBoxError
                          : classes.descriptionBox
                      }
                    >
                      <Card className={classes.streamoffer}>
                        <InputLabel
                          htmlFor="outlined-stream-card"
                          fullwidth={true.toString()}
                          error={formState.descriptionError}
                        >
                          {genericConstants.DESCRIPTION}
                        </InputLabel>
                        <div className="rdw-root">
                          <Editor
                            editorState={editorState}
                            toolbarClassName="rdw-toolbar"
                            wrapperClassName="rdw-wrapper"
                            editorClassName="rdw-editor"
                            onEditorStateChange={data => {
                              formState.descriptionError = false;
                              setEditorState(data);
                            }}
                          />
                        </div>
                        {formState.descriptionError ? (
                          <FormHelperText error={true}>
                            Description is required
                          </FormHelperText>
                        ) : null}
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    <CustomDateTimePicker
                      onChange={event => {
                        handleDateChange(dateFrom, event);
                      }}
                      value={formState.values[dateFrom]}
                      name={dateFrom}
                      label={get(EventSchema[dateFrom], "label")}
                      fullWidth
                      error={hasError(dateFrom)}
                      helperText={
                        hasError(dateFrom)
                          ? formState.errors[dateFrom].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <CustomDateTimePicker
                      onChange={event => {
                        handleDateChange(dateTo, event);
                      }}
                      value={formState.values[dateTo]}
                      name={dateTo}
                      label={get(EventSchema[dateTo], "label")}
                      fullWidth
                      error={hasError(dateTo)}
                      helperText={
                        hasError(dateTo)
                          ? formState.errors[dateTo].map(error => {
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
                      label={get(EventSchema[address], "label")}
                      id={get(EventSchema[address], "id")}
                      name={address}
                      placeholder={get(EventSchema[address], "placeholder")}
                      value={formState.values[address] || ""}
                      error={hasError(address)}
                      variant="outlined"
                      required
                      multiline
                      fullWidth
                      onChange={handleChange}
                      helperText={
                        hasError(address)
                          ? formState.errors[address].map(error => {
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
                      id="combo-box-demo"
                      className={classes.root}
                      options={states}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(state, event, value);
                      }}
                      value={
                        states[
                          states.findIndex(function (item, i) {
                            return item.id === formState.values[state];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={get(EventSchema[state], "label")}
                          variant="outlined"
                          placeholder={get(EventSchema[state], "placeholder")}
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
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id="combo-box-demo"
                      className={classes.root}
                      options={zones}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(zone, event, value);
                      }}
                      value={
                        zones[
                          zones.findIndex(function (item, i) {
                            return item.id === formState.values[zone];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={get(EventSchema[zone], "label")}
                          variant="outlined"
                          placeholder={get(EventSchema[zone], "placeholder")}
                          error={hasError(zone)}
                          helperText={
                            hasError(zone)
                              ? formState.errors[zone].map(error => {
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
                      id="combo-box-demo"
                      className={classes.root}
                      options={rpcs}
                      placeholder={get(EventSchema[rpcs], "placeholder")}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(rpc, event, value);
                      }}
                      value={
                        rpcs[
                          rpcs.findIndex(function (item, i) {
                            return item.id === formState.values[rpc];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={get(EventSchema[rpc], "label")}
                          variant="outlined"
                          placeholder={get(EventSchema[rpc], "placeholder")}
                          error={hasError(rpc)}
                          helperText={
                            hasError(rpc)
                              ? formState.errors[rpc].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}></Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={12} xs={12}>
                    <Autocomplete
                      id={get(EventSchema[college], "id")}
                      multiple
                      options={colleges}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleMultiSelectChange(college, event, value);
                      }}
                      filterSelectedOptions
                      name={college}
                      value={formState.dataToShowForMultiSelect || null}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError(college)}
                          helperText={
                            hasError(college)
                              ? formState.errors[college].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                          placeholder={get(EventSchema[college], "placeholder")}
                          value={option => option.id}
                          name={college}
                          key={option => option.id}
                          label={get(EventSchema[college], "label")}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={12} xs={12}>
                    <Autocomplete
                      id={get(EventSchema[stream], "id")}
                      multiple
                      options={streams}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleMultiSelectChange(stream, event, value);
                      }}
                      filterSelectedOptions
                      name={stream}
                      value={formState.dataToShowForStreamMultiSelect || null}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={hasError(stream)}
                          helperText={
                            hasError(stream)
                              ? formState.errors[stream].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                          placeholder={get(EventSchema[stream], "placeholder")}
                          value={option => option.id}
                          name={stream}
                          key={option => option.id}
                          label={get(EventSchema[stream], "label")}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />

              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={1} className={classes.formgrid}>
                  <Grid item md={12} xs={12} className={classes.streamcard}>
                    <Card className={classes.streamoffer}>
                      <InputLabel
                        htmlFor="outlined-stream-card"
                        fullwidth={true.toString()}
                      >
                        {genericConstants.QUALIFICATIONANDPERCENTAGE}
                      </InputLabel>

                      {formState.dynamicBar.map((val, idx) => {
                        let qualificationId = `qualification-${idx}`,
                          percentageId = `percentage-${idx}`;

                        return (
                          <Card
                            id="outlined-stream-card"
                            fullwidth={true.toString()}
                            className={classes.streamcardcontent}
                            key={Math.random()}
                          >
                            <CardContent>
                              <Grid container spacing={1}>
                                <Grid item xs={5}>
                                  <FormControl
                                    variant="outlined"
                                    fullWidth
                                    className={classes.formControl}
                                  >
                                    <InputLabel
                                      ref={inputLabel}
                                      id="demo-simple-select-outlined-label"
                                    ></InputLabel>
                                    <Autocomplete
                                      id={qualificationId}
                                      options={qualifications}
                                      getOptionLabel={option => option.value}
                                      onChange={(event, value) => {
                                        handleChangeForDynamicGrid(
                                          qualification,
                                          event,
                                          value,
                                          val,
                                          true,
                                          false
                                        );
                                      }}
                                      data-id={idx}
                                      name={qualificationId}
                                      value={
                                        qualificationsDataBackup[
                                          qualificationsDataBackup.findIndex(
                                            function (item, i) {
                                              return (
                                                item.value ===
                                                formState.dynamicBar[idx][
                                                  qualification
                                                ]
                                              );
                                            }
                                          )
                                        ] || null
                                      }
                                      renderInput={params => (
                                        <TextField
                                          {...params}
                                          value={option => option.id}
                                          name={qualificationId}
                                          error={
                                            checkErrorInDynamicBar(
                                              qualification,
                                              val
                                            )["error"]
                                          }
                                          helperText={
                                            checkErrorInDynamicBar(
                                              qualification,
                                              val
                                            )["error"]
                                              ? checkErrorInDynamicBar(
                                                  qualification,
                                                  val
                                                )["value"]
                                              : null
                                          }
                                          placeholder={get(
                                            EventSchema[qualification],
                                            "placeholder"
                                          )}
                                          key={option => option.id}
                                          label={get(
                                            EventSchema[qualification],
                                            "label"
                                          )}
                                          variant="outlined"
                                        />
                                      )}
                                    />
                                  </FormControl>
                                </Grid>

                                <Grid item xs={5}>
                                  <TextField
                                    label="Percentage"
                                    name={percentageId}
                                    variant="outlined"
                                    fullWidth
                                    data-id={idx}
                                    id={percentageId}
                                    value={
                                      formState.dynamicBar[idx][percentage] ||
                                      ""
                                    }
                                    error={
                                      checkErrorInDynamicBar(percentage, val)[
                                        "error"
                                      ]
                                    }
                                    helperText={
                                      checkErrorInDynamicBar(percentage, val)[
                                        "error"
                                      ]
                                        ? checkErrorInDynamicBar(
                                            percentage,
                                            val
                                          )["value"]
                                        : null
                                    }
                                    placeholder={get(
                                      EventSchema[percentage],
                                      "placeholder"
                                    )}
                                    onChange={event => {
                                      handleChangeForDynamicGrid(
                                        percentage,
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
                          type="button"
                          disabled={qualifications.length ? false : true}
                          color="primary"
                          variant="contained"
                          className={classes.add_more_btn}
                          onClick={e => {
                            addNewRow(e, qualification);
                          }}
                        >
                          {genericConstants.ADD_MORE_TEXT}
                        </YellowButton>
                      </div>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              <Divider className={classes.divider} />

              <Grid item xs={12} md={6} xl={3}>
                <Grid container spacing={1} className={classes.formgrid}>
                  <Grid item md={12} xs={12} className={classes.streamcard}>
                    <Card className={classes.streamoffer}>
                      <InputLabel
                        htmlFor="outlined-stream-card"
                        fullwidth={true.toString()}
                      >
                        {genericConstants.EDUCATIONANDPERCENTAGE}
                      </InputLabel>

                      {formState.dynamicEducationBar.map((val, idx) => {
                        let qualificationId = `education-${idx}`,
                          percentageId = `percentage-${idx}`;

                        return (
                          <Card
                            id="outlined-stream-card"
                            fullwidth={true.toString()}
                            className={classes.streamcardcontent}
                            key={Math.random()}
                          >
                            <CardContent>
                              <Grid container spacing={1}>
                                <Grid item xs={5}>
                                  <FormControl
                                    variant="outlined"
                                    fullWidth
                                    className={classes.formControl}
                                  >
                                    <InputLabel
                                      ref={inputLabel}
                                      id="demo-simple-select-outlined-label"
                                    ></InputLabel>
                                    <Autocomplete
                                      id={qualificationId}
                                      options={educations}
                                      getOptionLabel={option => option.value}
                                      onChange={(event, value) => {
                                        handleChangeForDynamicGrid(
                                          education,
                                          event,
                                          value,
                                          val,
                                          true,
                                          false
                                        );
                                      }}
                                      data-id={idx}
                                      name={qualificationId}
                                      value={
                                        educationsDataBackup[
                                          educationsDataBackup.findIndex(
                                            function (item, i) {
                                              return (
                                                item.value ===
                                                formState.dynamicEducationBar[
                                                  idx
                                                ][education]
                                              );
                                            }
                                          )
                                        ] || null
                                      }
                                      renderInput={params => (
                                        <TextField
                                          {...params}
                                          value={option => option.id}
                                          name={qualificationId}
                                          error={
                                            checkErrorInDynamicBar(
                                              education,
                                              val
                                            )["error"]
                                          }
                                          helperText={
                                            checkErrorInDynamicBar(
                                              education,
                                              val
                                            )["error"]
                                              ? checkErrorInDynamicBar(
                                                  education,
                                                  val
                                                )["value"]
                                              : null
                                          }
                                          placeholder={get(
                                            EventSchema[education],
                                            "placeholder"
                                          )}
                                          key={option => option.id}
                                          label={get(
                                            EventSchema[education],
                                            "label"
                                          )}
                                          variant="outlined"
                                        />
                                      )}
                                    />
                                  </FormControl>
                                </Grid>

                                <Grid item xs={5}>
                                  <TextField
                                    label="Percentage"
                                    name={percentageId}
                                    variant="outlined"
                                    fullWidth
                                    data-id={idx}
                                    id={percentageId}
                                    value={
                                      formState.dynamicEducationBar[idx][
                                        educationpercentage
                                      ] || ""
                                    }
                                    error={
                                      checkErrorInDynamicBar(
                                        educationpercentage,
                                        val
                                      )["error"]
                                    }
                                    helperText={
                                      checkErrorInDynamicBar(
                                        educationpercentage,
                                        val
                                      )["error"]
                                        ? checkErrorInDynamicBar(
                                            educationpercentage,
                                            val
                                          )["value"]
                                        : null
                                    }
                                    placeholder={get(
                                      EventSchema[educationpercentage],
                                      "placeholder"
                                    )}
                                    onChange={event => {
                                      handleChangeForDynamicGrid(
                                        educationpercentage,
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
                          type="button"
                          disabled={educations.length ? false : true}
                          color="primary"
                          variant="contained"
                          className={classes.add_more_btn}
                          onClick={e => {
                            addNewRow(e, education);
                          }}
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
                <YellowButton type="submit" color="primary" variant="contained">
                  {genericConstants.SAVE_BUTTON_TEXT}
                </YellowButton>
                <GrayButton
                  type="button"
                  color="primary"
                  variant="contained"
                  to={routeConstants.MANAGE_EVENT}
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
export default AddEditEvent;
