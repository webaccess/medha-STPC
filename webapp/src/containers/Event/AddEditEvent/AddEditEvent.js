import React, { useState, useEffect, useContext } from "react";
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
  Button
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import {
  YellowButton,
  CustomDateTimePicker,
  GrayButton,
  Spinner,
  Auth as auth,
  ReadOnlyTextField
} from "../../../components";
import useStyles from "../../ContainerStyles/AddEditPageStyles";
import * as serviceProvider from "../../../api/Axios";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import EventSchema from "../EventSchema";
import { get } from "lodash";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import * as formUtilities from "../../../utilities/FormUtilities";
import { useHistory } from "react-router-dom";
import * as databaseUtilities from "../../../utilities/StrapiUtilities";
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
import moment from "moment";
import LoaderContext from "../../../context/LoaderContext";

/** Event names initialization */
const eventName = "eventName";
const description = "description";
const dateFrom = "dateFrom";
const dateTo = "dateTo";
const address = "address";
const state = "state";
const zone = "zone";
const rpc = "rpc";
const questionSet = "questionSet";
const college = "college";
const stream = "stream";
const percentage = "percentage";
const educationpercentage = "educationpercentage";
const qualification = "qualification";
const education = "education";
const field = "upload_logo";
const ref = "event";
const files = "files";
const regexForPercentage = new RegExp("^[1-9][0-9]*$");

const STATES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;
const STREAM_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STREAMS;
const EVENTS_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_EVENTS;
const DOCUMENT_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_UPLOAD;
const COLLEGE_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES;
const QUESTION_SET =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_QUESTION_SET;

const AddEditEvent = props => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
  const { setLoaderStatus } = useContext(LoaderContext);
  const classes = useStyles();
  const history = useHistory();
  /** Initializiing form state value */
  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      dateFrom: moment(),
      dateTo: moment()
    },
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
    discriptionMinLengthError: false,
    dataToShowForCollegeMultiSelect: [],
    eventCollegeIds: [],
    dataToShowForStreamMultiSelect: [],
    eventStreamsIds: [],
    isCollegeAdminDoesNotHaveEditPreviliges: false,
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
    isCollegeAdmin:
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
        ? true
        : false,
    isStateClearFilter: false,
    isContainDateValidation: true,
    isDateValidated: false
  });

  const [collegeInfo] = useState({
    college:
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN
        ? auth.getUserInfo().studentInfo.organization
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

  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [streams, setStreams] = useState([]);
  const inputLabel = React.useRef(null);
  const [questionSetData, setQuestionSetData] = useState([]);
  const [qualifications, setQualifications] = useState([
    { id: 1, value: "secondary", name: "Secondary" },
    { id: 2, value: "graduation", name: "Graduation" },
    { id: 3, value: "senior_secondary", name: "Senior Secondary" },
    // { id: 4, value: "undergraduate", name: "Undergraduate" },
    { id: 5, value: "postgraduate", name: "Postgraduate" },
    { id: 6, value: "other", name: "Other" }
  ]);
  const [qualificationsDataBackup] = useState([
    { id: 1, value: "secondary", name: "Secondary" },
    { id: 2, value: "graduation", name: "Graduation" },
    { id: 3, value: "senior_secondary", name: "Senior Secondary" },
    // { id: 4, value: "undergraduate", name: "Undergraduate" },
    { id: 5, value: "postgraduate", name: "Postgraduate" },
    { id: 6, value: "other", name: "Other" }
  ]);
  const [educations, setEducations] = useState([
    { id: 1, value: "First" },
    { id: 2, value: "Second" },
    { id: 3, value: "Third" }
  ]);
  const [educationsDataBackup] = useState([
    { id: 1, value: "First" },
    { id: 2, value: "Second" },
    { id: 3, value: "Third" }
  ]);
  if (formState.isEditEvent && !formState.counter) {
    setLoaderStatus(true);
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
        formState.values[dateFrom] = props["dataForEdit"]["start_date_time"];
        //formState.defaultDate = date;
      }
      if (props["dataForEdit"]["end_date_time"]) {
        formState.values[dateTo] = props["dataForEdit"]["end_date_time"];
      }
      if (props["dataForEdit"]["address"]) {
        formState.values[address] = props["dataForEdit"]["address"];
      }

      if (props["dataForEdit"]["rpc"] && props["dataForEdit"]["rpc"]["id"]) {
        formState.values[rpc] = props["dataForEdit"]["rpc"]["id"];
      }
      if (props["dataForEdit"]["zone"] && props["dataForEdit"]["zone"]["id"]) {
        formState.values[zone] = props["dataForEdit"]["zone"]["id"];
      }
      if (
        props["dataForEdit"]["question_set"] &&
        props["dataForEdit"]["question_set"]["id"]
      ) {
        formState.values[questionSet] =
          props["dataForEdit"]["question_set"]["id"];
      }
      if (
        props["dataForEdit"]["state"] &&
        props["dataForEdit"]["state"]["id"]
      ) {
        formState.values[state] = props["dataForEdit"]["state"]["id"];
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

  /** Use effect to populate Question Set */
  useEffect(() => {
    serviceProvider
      .serviceProviderForGetRequest(QUESTION_SET)
      .then(res => {
        setQuestionSetData(res.data);
      })
      .catch(error => {});
  }, []);

  /** Streams data for Prepopulating */
  const prePopulateStreamsData = streamsData => {
    if (props["editEvent"]) {
      if (
        props["dataForEdit"]["streams"] &&
        props["dataForEdit"]["streams"].length
      ) {
        let array = [];
        streamsData.map(stream => {
          for (let i in props["dataForEdit"]["streams"]) {
            if (props["dataForEdit"]["streams"][i]["id"] === stream["id"]) {
              array.push(stream);
            }
          }
        });
        setFormState(formState => ({
          ...formState,
          dataToShowForStreamMultiSelect: array
        }));
        let finalDataStream = [];
        for (let i in props["dataForEdit"]["streams"]) {
          finalDataStream.push(props["dataForEdit"]["streams"][i]["id"]);
        }
        formState.values[stream] = finalDataStream;
      }
    }
  };

  const prePopulateCollegeData = collegeData => {
    if (props["editEvent"]) {
      if (
        props["dataForEdit"]["contacts"] &&
        props["dataForEdit"]["contacts"].length
      ) {
        let array = [];
        collegeData.map(college => {
          for (let i in props["dataForEdit"]["contacts"]) {
            if (props["dataForEdit"]["contacts"][i]["id"] === college["id"]) {
              array.push(college);
            }
          }
        });
        setFormState(formState => ({
          ...formState,
          dataToShowForCollegeMultiSelect: array
        }));
        let finalData = [];
        for (let i in props["dataForEdit"]["contacts"]) {
          finalData.push(props["dataForEdit"]["contacts"][i]["contact"]["id"]);
        }
        formState.values[college] = finalData;
      }
    }
  };

  /** Setting educations and qualifications */
  useEffect(() => {
    setLoaderStatus(true);
    let paramsForPageSize = {
      pageSize: -1
    };

    if (formState.isCollegeAdmin) {
      setStates([collegeInfo.state]);
    } else {
      serviceProvider
        .serviceProviderForGetRequest(STATES_URL, paramsForPageSize)
        .then(res => {
          setStates(res.data.result);
        })
        .catch(error => {
          console.log("error", error);
        });
    }

    let educationDataForEdit = [
      { id: 1, value: "First" },
      { id: 2, value: "Second" },
      { id: 3, value: "Third" }
    ];
    if (formState.isEditEvent) {
      let tempEducationData = educationDataForEdit;
      let educationPercentageArray = props["dataForEdit"]["educations"];
      for (let i in educationPercentageArray) {
        let id = educationPercentageArray[i]["education_year"];
        for (let j in tempEducationData) {
          if (tempEducationData[j]["value"] === id)
            tempEducationData.splice(j, 1);
        }
      }
      setEducations(tempEducationData);
    }

    let dataForEditing = [
      { id: 1, value: "secondary", name: "Secondary" },
      { id: 2, value: "graduation", name: "Graduation" },
      { id: 3, value: "senior_secondary", name: "Senior Secondary" },
      { id: 4, value: "undergraduate", name: "Undergraduate" },
      { id: 5, value: "postgraduate", name: "Postgraduate" },
      { id: 6, value: "other", name: "Other" }
    ];
    if (formState.isEditEvent) {
      let tempQualificationData = dataForEditing;
      let qualificationPercentageArray = props["dataForEdit"]["qualifications"];
      for (let i in qualificationPercentageArray) {
        let id = qualificationPercentageArray[i]["qualification"];
        for (let j in tempQualificationData) {
          if (tempQualificationData[j]["value"] === id)
            tempQualificationData.splice(j, 1);
        }
      }
      setQualifications(tempQualificationData);
    }

    if (!formState.isCollegeAdmin) {
      serviceProvider
        .serviceProviderForGetRequest(STREAM_URL, paramsForPageSize)
        .then(res => {
          setStreams(res.data.result);
          prePopulateStreamsData(res.data.result);
        })

        .catch(error => {
          console.log("errorstream", error);
        });
    } else if (formState.isCollegeAdmin) {
      let streamData = [];
      auth.getUserInfo().studentInfo.organization.stream_strength.map(data => {
        streamData.push(data["stream"]);
      });
      setStreams(streamData);
      prePopulateStreamsData(streamData);
    }
    setLoaderStatus(false);
  }, []);

  /** Setting rpc, zone on state change */
  useEffect(() => {
    if (
      formState.values.hasOwnProperty(state) &&
      formState.values[state] !== null &&
      formState.values[state] !== undefined
    ) {
      fetchZoneRpcData();
    }
  }, [formState.values[state]]);

  /** Common function to get zones, rpcs after changing state */
  async function fetchZoneRpcData() {
    setLoaderStatus(true);
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

      if (!formState.isCollegeAdmin) {
        await serviceProvider
          .serviceProviderForGetRequest(zones_url)
          .then(res => {
            setZones(res.data.result);
          })
          .catch(error => {
            console.log("error", error);
          });
      } else if (formState.isCollegeAdmin) {
        setZones([collegeInfo.zone]);
      }

      let rpcs_url =
        STATES_URL +
        "/" +
        formState.values[state] +
        "/" +
        strapiApiConstants.STRAPI_RPCS;

      if (!formState.isCollegeAdmin) {
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
      } else if (formState.isCollegeAdmin) {
        setRpcs([collegeInfo.rpc]);
      }
    }
    setLoaderStatus(false);
  }
  useEffect(() => {
    if (formState.values[zone] && formState.values[rpc]) {
      fetchCollegeData();
    }
  }, [formState.values[zone], formState.values[rpc]]);

  /** Function to get college data after selcting zones and rpc's */
  async function fetchCollegeData() {
    setLoaderStatus(true);
    let params = {
      "zone.id": formState.values[zone],
      "rpc.id": formState.values[rpc],
      pageSize: -1
    };
    if (!formState.isCollegeAdmin) {
      await serviceProvider
        .serviceProviderForGetRequest(COLLEGE_URL, params)
        .then(res => {
          setColleges(res.data.result);
          prePopulateCollegeData(res.data.result);
        })
        .catch(error => {
          console.log("error", error);
        });
    } else if (formState.isCollegeAdmin) {
      setColleges([collegeInfo.college]);
      prePopulateCollegeData([collegeInfo.college]);
    }
    setLoaderStatus(false);
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
    if (field === "qualification" || field === "percentage") {
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
    } else if (field === "education" || field === "educationpercentage") {
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

  /** Adding a new row in dynamic bar */
  const addNewRow = (e, extendBarName) => {
    e.persist();
    if (extendBarName === "qualification") {
      setFormState(formState => ({
        ...formState,
        dynamicBar: [...formState.dynamicBar, { index: Math.random() }]
      }));
    } else if (extendBarName === "education") {
      setFormState(formState => ({
        ...formState,
        dynamicEducationBar: [
          ...formState.dynamicEducationBar,
          { index: Math.random() }
        ]
      }));
    }
  };

  /** To delete a value from dynamic bar */
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
        if (record["qualification"] === qualificationData["value"]) {
          qualificationsTempArray.push(qualificationData);
        }
      });
      setQualifications(qualificationsTempArray);
    }
    if (record[education]) {
      let qualificationsTempArray = [];
      qualificationsTempArray = educations;
      educationsDataBackup.map(qualificationData => {
        if (record["education"] === qualificationData["value"]) {
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
    if (eventName === "qualification" || eventName === "percentage") {
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
                  if (r[eventName] === qualificationData["value"]) {
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
        if (
          event.target.value === "" ||
          regexForPercentage.test(event.target.value)
        ) {
          if (event.target.value.length <= 2) {
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
      }
      /** Clear errors if any */
      formState.dynamicBarError.map(errorValues => {
        if (errorValues["index"] === dynamicGridValue["index"]) {
          delete errorValues[eventName];
        }
      });
    } else if (
      eventName === "education" ||
      eventName === "educationpercentage"
    ) {
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
                  if (r[eventName] === educationData["value"]) {
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
        if (
          event.target.value === "" ||
          regexForPercentage.test(event.target.value)
        ) {
          if (event.target.value.length <= 2) {
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
        }
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
        setColleges([]);
        // setStreams([]);
        delete formState.values[zone];
        delete formState.values[rpc];
        formState.dataToShowForCollegeMultiSelect = [];
      } else if (eventName === rpc || eventName === zone) {
        setColleges([]);
        formState.dataToShowForCollegeMultiSelect = [];
      }
      setFormState(formState => ({
        ...formState,
        isStateClearFilter: setStateFilterValue
      }));
      /** This is used to remove clear out data form auto complete when we click cross icon of auto complete */
      delete formState.values[eventName];
    }
    if (formState.errors.hasOwnProperty(eventName)) {
      delete formState.errors[eventName];
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    setLoaderStatus(true);
    let isValid = false;
    if (formState.isCollegeAdmin && !formState.isEditEvent) {
      setDataForCollegeAdmin();
    }
    /** Validate DynamicGrid */
    let isDynamicBarValid;
    /** Check validity of dynamic bar */
    isDynamicBarValid = validateDynamicGridValues();
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      EventSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        EventSchema,
        true,
        dateFrom,
        dateTo
      );
      /** Check date validation */

      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
      /** */
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        EventSchema
      );
      formState.errors = formUtilities.setErrors(
        formState.values,
        EventSchema,
        true,
        dateFrom,
        dateTo
      );
    }
    formState.descriptionError = false;
    if (
      convertToRaw(editorState.getCurrentContent()).blocks &&
      convertToRaw(editorState.getCurrentContent()).blocks.length
    ) {
      let arrayToCheckIn = convertToRaw(editorState.getCurrentContent()).blocks;
      let validationCounter = 0;
      let validationMinCounter = 0;
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
      for (let i in arrayToCheckIn) {
        if (
          arrayToCheckIn[i]["text"] &&
          arrayToCheckIn[i]["text"].trim().length > 320
        ) {
          validationMinCounter += 1;
          break;
        }
      }

      if (validationMinCounter !== 0) {
        formState.discriptionMinLengthError = true;
      }
    }
    if (
      isValid &&
      !formState.descriptionError &&
      !formState.discriptionMinLengthError &&
      isDynamicBarValid
    ) {
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
      setLoaderStatus(false);
    }
  };

  const setDataForCollegeAdmin = () => {
    formState.values[zone] = collegeInfo.zone.id;
    formState.values[rpc] = collegeInfo.rpc.id;
    formState.values[college] = [collegeInfo.college.contact.id];
    formState.values[state] = collegeInfo.state.id;
  };

  const postEventData = () => {
    /** Setting quaalifications */
    let qualificationPercentageArray = [];
    qualificationPercentageArray = getDynamicBarData();

    /** Setting educations */
    let educationPercentageArray = [];
    educationPercentageArray = getDynamicEducationData();

    /** Data to post */
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
      formState.values[state] ? formState.values[state] : null,
      formState.values[questionSet] ? formState.values[questionSet] : null
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
              fromeditEvent: true,
              isDataEdited: true,
              editedEventData: res.data,
              addResponseMessage: "",
              editedData: {}
            });
          }
          setLoaderStatus(false);
        })
        .catch(error => {
          console.log("puterror", error);
          history.push({
            pathname: routeConstants.MANAGE_EVENT,
            fromeditEvent: true,
            isDataEdited: false,
            editResponseMessage: "",
            editedData: {}
          });
          setLoaderStatus(false);
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
              addedEventData: res.data,
              addResponseMessage: "",
              addedData: {}
            });
          }
          setLoaderStatus(false);
        })
        .catch(error => {
          console.log("posterror", error);
          history.push({
            pathname: routeConstants.MANAGE_EVENT,
            fromeditEvent: true,
            isDataEdited: false,
            editResponseMessage: "",
            editedData: {}
          });
          setLoaderStatus(false);
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

  const handleDateChange = (dateObject, event) => {
    if (formState.errors.hasOwnProperty(dateObject)) {
      delete formState.errors[dateObject];
    }
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [dateObject]: event
      },
      touched: {
        ...formState.touched,
        [dateObject]: true
      },
      isStateClearFilter: false
    }));
  };

  const handleMultiSelectChange = (eventName, event, value) => {
    let multiarray = [];

    if (eventName === college) {
      formState.dataToShowForCollegeMultiSelect = value;
      for (var i = 0; i < value.length; i++) {
        multiarray.push(value[i]["contact"].id);
      }
    }
    if (eventName === stream) {
      formState.dataToShowForStreamMultiSelect = value;
      for (var i = 0; i < value.length; i++) {
        multiarray.push(value[i].id);
      }
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
          {props["editEvent"] ? "Edit Event" : genericConstants.ADD_EVENT_TEXT}
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
                        <div className={classes.DefaultNoImage}></div>
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
                        ADD NEW EVENT LOGO
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
                        formState.descriptionError ||
                        formState.discriptionMinLengthError
                          ? classes.descriptionBoxError
                          : classes.descriptionBox
                      }
                    >
                      <Card className={classes.streamoffer}>
                        <InputLabel
                          htmlFor="outlined-stream-card"
                          fullwidth={true.toString()}
                          error={
                            formState.descriptionError ||
                            formState.discriptionMinLengthError
                          }
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
                              formState.discriptionMinLengthError = false;
                              setEditorState(data);
                            }}
                          />
                        </div>
                        {formState.descriptionError ? (
                          <FormHelperText error={true}>
                            Description is required
                          </FormHelperText>
                        ) : null}
                        {formState.discriptionMinLengthError ? (
                          <FormHelperText error={true}>
                            Description length should be less than 320
                            characters
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
                      value={formState.values[dateFrom] || null}
                      name={dateFrom}
                      label={get(EventSchema[dateFrom], "label")}
                      placeholder={get(EventSchema[dateFrom], "placeholder")}
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
                      value={formState.values[dateTo] || null}
                      name={dateTo}
                      label={get(EventSchema[dateTo], "label")}
                      placeholder={get(EventSchema[dateTo], "placeholder")}
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
                    {formState.isCollegeAdmin && !formState.isEditEvent ? (
                      <ReadOnlyTextField
                        id="StateName"
                        label={get(EventSchema[state], "label")}
                        defaultValue={collegeInfo.state.name}
                      />
                    ) : (
                      <Autocomplete
                        id="StateName"
                        className={classes.root}
                        options={states}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(state, event, value);
                        }}
                        disabled={
                          formState.isCollegeAdmin && formState.isEditEvent
                            ? true
                            : false
                        }
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
                    )}
                  </Grid>
                  <Grid item md={6} xs={12}>
                    {formState.isCollegeAdmin && !formState.isEditEvent ? (
                      <ReadOnlyTextField
                        id="ZoneName"
                        label={get(EventSchema[zone], "label")}
                        defaultValue={collegeInfo.zone.name}
                      />
                    ) : (
                      <Autocomplete
                        id="ZoneName"
                        className={classes.root}
                        options={zones}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(zone, event, value);
                        }}
                        disabled={
                          formState.isCollegeAdmin && formState.isEditEvent
                            ? true
                            : false
                        }
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
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.MarginBottom}>
                  <Grid item md={6} xs={12}>
                    {formState.isCollegeAdmin && !formState.isEditEvent ? (
                      <ReadOnlyTextField
                        id={get(EventSchema[rpcs], "id")}
                        label={get(EventSchema[rpc], "label")}
                        defaultValue={collegeInfo.rpc.name}
                      />
                    ) : (
                      <Autocomplete
                        id={get(EventSchema[rpcs], "id")}
                        className={classes.root}
                        options={rpcs}
                        placeholder={get(EventSchema[rpcs], "placeholder")}
                        getOptionLabel={option => option.name}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(rpc, event, value);
                        }}
                        disabled={
                          formState.isCollegeAdmin && formState.isEditEvent
                            ? true
                            : false
                        }
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
                    )}
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      id={get(EventSchema[questionSet], "id")}
                      className={classes.root}
                      options={questionSetData}
                      placeholder={get(EventSchema[questionSet], "placeholder")}
                      getOptionLabel={option => option.name}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(questionSet, event, value);
                      }}
                      value={
                        questionSetData[
                          questionSetData.findIndex(function (item, i) {
                            return item.id === formState.values[questionSet];
                          })
                        ] || null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          label={get(EventSchema[questionSet], "label")}
                          variant="outlined"
                          placeholder={get(
                            EventSchema[questionSet],
                            "placeholder"
                          )}
                          error={hasError(questionSet)}
                          helperText={
                            hasError(questionSet)
                              ? formState.errors[questionSet].map(error => {
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
                  <Grid item md={12} xs={12}>
                    {formState.isCollegeAdmin && !formState.isEditEvent ? (
                      <ReadOnlyTextField
                        id={get(EventSchema[college], "id")}
                        label={get(EventSchema[college], "label")}
                        defaultValue={collegeInfo.college.name}
                      />
                    ) : (
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
                        disabled={
                          formState.isCollegeAdmin && formState.isEditEvent
                            ? true
                            : false
                        }
                        value={
                          formState.dataToShowForCollegeMultiSelect || null
                        }
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
                            placeholder={get(
                              EventSchema[college],
                              "placeholder"
                            )}
                            value={option => option.id}
                            name={college}
                            key={option => option.id}
                            label={get(EventSchema[college], "label")}
                            variant="outlined"
                          />
                        )}
                      />
                    )}
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
                      disabled={
                        formState.isCollegeAdmin &&
                        formState.isEditEvent &&
                        formState.isCollegeAdminDoesNotHaveEditPreviliges
                          ? true
                          : false
                      }
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
                            key={idx}
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
                                      disabled={
                                        formState.isCollegeAdmin &&
                                        formState.isEditEvent &&
                                        formState.isCollegeAdminDoesNotHaveEditPreviliges
                                          ? true
                                          : false
                                      }
                                      getOptionLabel={option => option.name}
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
                                    disabled={
                                      formState.isCollegeAdmin &&
                                      formState.isEditEvent &&
                                      formState.isCollegeAdminDoesNotHaveEditPreviliges
                                        ? true
                                        : false
                                    }
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
                                      onClick={e =>
                                        formState.isCollegeAdmin &&
                                        formState.isEditEvent &&
                                        formState.isCollegeAdminDoesNotHaveEditPreviliges
                                          ? null
                                          : clickOnDelete(val, idx)
                                      }
                                      style={
                                        formState.isCollegeAdmin &&
                                        formState.isEditEvent &&
                                        formState.isCollegeAdminDoesNotHaveEditPreviliges
                                          ? { color: "gray", fontSize: "24px" }
                                          : { color: "red", fontSize: "24px" }
                                      }
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
                        <Grid item xs={12}>
                          <Grid item xs={12} md={6} xl={3}>
                            <Grid container spacing={3}>
                              <Grid item md={5} xs={12}>
                                <YellowButton
                                  type="button"
                                  color="primary"
                                  variant="contained"
                                  disabled={
                                    formState.isCollegeAdmin &&
                                    formState.isEditEvent &&
                                    formState.isCollegeAdminDoesNotHaveEditPreviliges
                                      ? true
                                      : qualifications.length
                                      ? false
                                      : true
                                  }
                                  className={classes.add_more_btn}
                                  onClick={e => {
                                    addNewRow(e, qualification);
                                  }}
                                >
                                  {genericConstants.ADD_MORE_TEXT}
                                </YellowButton>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
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
                            key={idx}
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
                                      disabled={
                                        formState.isCollegeAdmin &&
                                        formState.isEditEvent &&
                                        formState.isCollegeAdminDoesNotHaveEditPreviliges
                                          ? true
                                          : false
                                      }
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
                                    disabled={
                                      formState.isCollegeAdmin &&
                                      formState.isEditEvent &&
                                      formState.isCollegeAdminDoesNotHaveEditPreviliges
                                        ? true
                                        : false
                                    }
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
                                      onClick={e =>
                                        formState.isCollegeAdmin &&
                                        formState.isEditEvent &&
                                        formState.isCollegeAdminDoesNotHaveEditPreviliges
                                          ? null
                                          : clickOnDelete(val, idx)
                                      }
                                      style={
                                        formState.isCollegeAdmin &&
                                        formState.isEditEvent &&
                                        formState.isCollegeAdminDoesNotHaveEditPreviliges
                                          ? { color: "gray", fontSize: "24px" }
                                          : { color: "red", fontSize: "24px" }
                                      }
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
                        <Grid item xs={12}>
                          <Grid item xs={12} md={6} xl={3}>
                            <Grid container spacing={3}>
                              <Grid item md={5} xs={12}>
                                <YellowButton
                                  type="button"
                                  color="primary"
                                  disabled={
                                    formState.isCollegeAdmin &&
                                    formState.isEditEvent &&
                                    formState.isCollegeAdminDoesNotHaveEditPreviliges
                                      ? true
                                      : educations.length
                                      ? false
                                      : true
                                  }
                                  variant="contained"
                                  className={classes.add_more_btn}
                                  onClick={e => {
                                    addNewRow(e, education);
                                  }}
                                >
                                  {genericConstants.ADD_MORE_TEXT}
                                </YellowButton>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                    </Card>
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
                          disabled={
                            formState.isCollegeAdmin &&
                            formState.isEditEvent &&
                            formState.isCollegeAdminDoesNotHaveEditPreviliges
                              ? true
                              : false
                          }
                        >
                          {genericConstants.SAVE_BUTTON_TEXT}
                        </YellowButton>
                      </Grid>
                      <Grid item md={2} xs={12}>
                        <GrayButton
                          type="button"
                          color="primary"
                          variant="contained"
                          to={routeConstants.MANAGE_EVENT}
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
export default AddEditEvent;
