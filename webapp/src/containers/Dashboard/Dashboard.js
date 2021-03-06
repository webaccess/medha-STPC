import React, { useEffect, useState } from "react";
import useStyles from "./DashboardStyles";
import clsx from "clsx";
import * as _ from "lodash";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DashboardSchema from "./DashboardSchema";
import * as formUtilities from "../../utilities/FormUtilities";
import GetAppIcon from "@material-ui/icons/GetApp";
import * as FileSaver from "file-saver";
import ReactExport from "react-export-excel";

import * as XLSX from "xlsx";

import {
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  TextField,
  CardHeader,
  Chip,
  CircularProgress
} from "@material-ui/core";
import * as strapiApiConstants from "../../constants/StrapiApiConstants";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as genericConstants from "../../constants/GenericConstants";
import * as routeConstants from "../../constants/RouteConstants";
import * as roleConstants from "../../constants/RoleConstants";
import * as serviceProvider from "../../api/Axios";
import { GrayButton, YellowButton, GreenButton } from "../../components";
import SetIndexContext from "../../context/SetIndexContext";
import { useContext } from "react";
import auth from "../../components/Auth";
import LoaderContext from "../../context/LoaderContext";
import { useHistory } from "react-router-dom";
let multiDataSet = [];

/** Initialize months array */
let tempMonthArray = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" }
];

let finalData = {
  Workshops: 0,
  TPOFeedback: 0,
  StudentFeedback: 0,
  IndustrialVisits: 0,
  Interships: 0,
  Placement: 0,
  FirstYear: 0,
  FinalYear: 0,
  Entrepreneurship: 0,
  FirstYearAttendance: 0,
  SecondYearAttendance: 0,
  FinalYearAttendance: 0,
  UniqueStudents: 0,
  Institutionstouched: 0,
  IndustrialVisitAttendance: 0,
  IndustrialVisitStudentFeedback: 0,
  IndustrialVisitTPOFeedback: 0,
  PlacementAttended: 0,
  PlacementSelected: 0,
  PlacementStudentFeedback: 0,
  PlacementTPOFeedback: 0,
  PlacementCollegeFeedback: 0,
  SecondYear: 0,
  AchievedIndustrialVisit: 0,
  AchievedWorkshops: 0,
  PlannedIndustrialVisit: 0,
  PlannedWorkshops: 0
};
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

/*** Initialize the filters */
const state = "state";
const zone = "zone";
const rpc = "rpc";
const college = "contact";
const month = "Month";
const year = "Year";

const STATES_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;

const DASHBOARD_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_DASHBOARDS;

const COLLEGE_URL =
  strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_COLLEGES;

const RPCS = strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_RPCS;

const Dashboard = props => {
  const { container, className, ...rest } = props;
  const history = useHistory();
  const classes = useStyles();
  const inputLabel = React.useRef(null);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [status, setStatus] = useState({
    time: "",
    status: ""
  });
  const { setIndex } = useContext(SetIndexContext);
  const { setLoaderStatus } = useContext(LoaderContext);

  const [formState, setFormState] = useState({
    state: 1,
    values: {},
    zonerows: [],
    indrows: [],
    placementrows: [],
    flag: true,
    errors: {},
    greenButtonChecker: true
  });
  const setData = () => {
    setLoaderStatus(true);
    setFormState(formState => ({
      ...formState,
      zonerows: [
        createDataWorkshop("Overall Workshops", finalData.Workshops),
        createDataWorkshop("1st Year", finalData.FirstYear),
        createDataWorkshop("2nd Year", finalData.SecondYear),
        createDataWorkshop("Final Year", finalData.FinalYear),
        createDataWorkshop("Entrepreneurship", finalData.Entrepreneurship),
        createDataWorkshop(
          "1st Year Attendance",
          finalData.FirstYearAttendance
        ),
        createDataWorkshop(
          "2nd Year Attendance",
          finalData.SecondYearAttendance
        ),
        createDataWorkshop(
          "Final Year Attendance",
          finalData.FinalYearAttendance
        ),
        createDataWorkshop("Planned", finalData.PlannedWorkshops),
        createDataWorkshop("Achieved", finalData.AchievedWorkshops),
        createDataWorkshop("Unique Students", finalData.UniqueStudents),
        createDataWorkshop(
          "Instittions touched",
          finalData.Institutionstouched
        ),
        createDataWorkshop("Student Feedback", finalData.StudentFeedback),
        createDataWorkshop("TPO Feedback", finalData.TPOFeedback)
      ],
      indrows: [
        createDataind("Industrial Visit", finalData.IndustrialVisits),
        createDataind("Attendance", finalData.IndustrialVisitAttendance),
        createDataind("Planned", finalData.PlannedIndustrialVisit),
        createDataind("Achieved", finalData.AchievedIndustrialVisit),
        createDataind(
          "Student Feedback",
          finalData.IndustrialVisitStudentFeedback
        ),
        createDataind("TPO Feedback", finalData.IndustrialVisitTPOFeedback)
      ],
      placementrows: [
        createDataplacement("Placement", finalData.Placement),
        createDataplacement("Attended", finalData.PlacementAttended),
        createDataplacement("Hired", finalData.PlacementSelected),
        createDataplacement(
          "Student Feedback",
          finalData.PlacementStudentFeedback
        ),
        createDataplacement("TPO Feedback", finalData.PlacementTPOFeedback),
        createDataplacement(
          "College Feedback",
          finalData.PlacementCollegeFeedback
        )
      ]
    }));

    setLoaderStatus(false);
  };

  /** Initial data bringing for all the filters role wise */
  useEffect(() => {
    if (auth.getUserInfo().role.name === roleConstants.STUDENT) {
      history.push({
        pathname: routeConstants.NOT_FOUND_URL
      });
    } else {
      setLoaderStatus(true);
      getStatusOfDashboard();
      prefillInitialDataRoleWise();
      setData();
      getInitialData();
    }
  }, []);

  const getStatusOfDashboard = async () => {
    let STATUS_URL = strapiApiConstants.STRAPI_DB_URL + "dashboard-histories";

    await serviceProvider
      .serviceProviderForGetRequest(STATUS_URL)
      .then(res => {
        if (res.data.length) {
          let today = new Date();
          let updatedDate = new Date(res.data[0].created_at);
          let days = parseInt((today - updatedDate) / (1000 * 60 * 60 * 24));
          let hours = parseInt(
            (Math.abs(today - updatedDate) / (1000 * 60 * 60)) % 24
          );
          let minutes = parseInt(
            (Math.abs(today.getTime() - updatedDate.getTime()) / (1000 * 60)) %
              60
          );
          let seconds = parseInt(
            (Math.abs(today.getTime() - updatedDate.getTime()) / 1000) % 60
          );

          let updatedTime = "";
          if (days !== 0) {
            updatedTime =
              days +
              " days, " +
              hours +
              " hours, " +
              minutes +
              " minutes, " +
              seconds +
              " seconds ago";
          } else if (hours !== 0) {
            updatedTime =
              hours +
              " hours, " +
              minutes +
              " minutes, " +
              seconds +
              " seconds ago";
          } else if (minutes !== 0) {
            updatedTime = minutes + " minutes, " + seconds + " seconds ago";
          } else {
            updatedTime = seconds + " seconds ago";
          }

          setStatus(status => ({
            ...status,
            time: updatedTime,
            status: res.data[0].status
          }));
        } else {
          setStatus(status => ({
            ...status,
            time: null,
            status: null
          }));
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  const prefillInitialDataRoleWise = () => {
    if (
      auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
      auth.getUserInfo().role.name === roleConstants.DEPARTMENTADMIN
    ) {
      formState.values = {};
    } else if (auth.getUserInfo().role.name === roleConstants.ZONALADMIN) {
      formState.values = {
        zone: auth.getUserInfo().zone.id
      };
    } else if (
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
      auth.getUserInfo().studentInfo.organization.contact.id ===
        auth.getUserInfo().rpc.main_college
    ) {
      formState.values = {
        rpc: auth.getUserInfo().rpc.id
      };
    } else if (
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
      auth.getUserInfo().rpc.main_college !== null &&
      auth.getUserInfo().studentInfo.organization.contact.id !==
        auth.getUserInfo().rpc.main_college
    ) {
      formState.values = {
        zone: auth.getUserInfo().zone.id,
        rpc: auth.getUserInfo().rpc.id,
        contact: auth.getUserInfo().studentInfo.organization.contact.id
      };
    }
  };

  const getInitialData = () => {
    setLoaderStatus(true);
    setYears(true);
    if (
      auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
      auth.getUserInfo().role.name === roleConstants.DEPARTMENTADMIN
    ) {
      fetchZoneRpcDistrictData();
    } else if (auth.getUserInfo().role.name === roleConstants.ZONALADMIN) {
      fetchAllRpc();
    } else if (
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
      auth.getUserInfo().studentInfo.organization.contact.id ===
        auth.getUserInfo().rpc.main_college
    ) {
      fetchCollegesToRPC();
    }
    setLoaderStatus(false);
  };

  const fetchCollegesToRPC = async () => {
    let COLLEGE_URL =
      strapiApiConstants.STRAPI_DB_URL +
      strapiApiConstants.STRAPI_RPCS +
      "/" +
      auth.getUserInfo().rpc.id +
      "/colleges";

    await serviceProvider
      .serviceProviderForGetRequest(COLLEGE_URL)
      .then(res => {
        setColleges(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  /** Get Data */
  function createDataWorkshop(workshop, zoneresult) {
    return { workshop, zoneresult };
  }

  function createDataind(industry, industryresult) {
    return { industry, industryresult };
  }

  function createDataplacement(placement, placementresult) {
    return { placement, placementresult };
  }

  const generateEntityDataForDownload = (name, result) => {
    return [
      { value: name, style: { font: { sz: "12" } } },
      {
        value: "" + result + "",
        style: { font: { sz: "12" } }
      }
    ];
  };

  const generateHeaders = name => {
    return [{ value: name, style: { font: { sz: "12", bold: true } } }];
  };

  /** Fetch all rpc */
  const fetchAllRpc = async () => {
    await serviceProvider
      .serviceProviderForGetRequest(RPCS, { pageSize: -1 })
      .then(res => {
        setRpcs(res.data.result);
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  /** Sets Years */
  const setYears = isInitialized => {
    let startingYear = 1990;
    let currentYear = new Date().getFullYear();
    let diff = currentYear - startingYear;
    let yearArray = [startingYear];
    for (let i = 1; i <= diff; i++) {
      yearArray.push(startingYear + i);
    }
    if (isInitialized) {
      formState.values[year] = currentYear;
      formState.values[month] = new Date().getMonth() + 1;
      generateData();
    }
    setYearData(yearArray);
  };

  /** Set month on year */
  useEffect(() => {
    if (formState.values[year]) {
      getMonthsOnYears();
    }
  }, [formState.values[year]]);

  const getMonthsOnYears = () => {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;
    let monthArray = [];
    if (formState.values[year] == currentYear) {
      tempMonthArray.forEach(data => {
        if (data["id"] <= currentMonth) {
          monthArray.push(data);
        }
      });
      setMonthData(monthArray);
    } else {
      setMonthData(tempMonthArray);
    }
  };

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

  const generateData = async () => {
    if (Object.keys(formState.values) !== 0) {
      if (
        auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
        auth.getUserInfo().studentInfo.organization.contact.id ===
          auth.getUserInfo().rpc.main_college
      ) {
        _.assign(formState.values, { isRpc: true });
      }
      setLoaderStatus(true);
      await serviceProvider
        .serviceProviderForGetRequest(DASHBOARD_URL, formState.values)
        .then(res => {
          Object.keys(finalData).map(data => {
            finalData[data] = res.data[data];
          });
          setDataForDownload();
          setData();
        })
        .catch(error => {
          setLoaderStatus(false);
          console.log("error", error);
        });
    }
  };

  const setDataForDownload = async () => {
    let month = "-";
    let zone = "-";
    let rpc = "-";
    let college = "-";
    if (formState.values.hasOwnProperty("zone")) {
      for (let i in zones) {
        if (zones[i]["id"] === formState.values.zone) {
          zone = zones[i]["name"];
          break;
        }
      }
    }
    if (formState.values.hasOwnProperty("rpc")) {
      for (let i in rpcs) {
        if (rpcs[i]["id"] === formState.values.rpc) {
          rpc = rpcs[i]["name"];
          break;
        }
      }
    }
    if (formState.values.hasOwnProperty("contact")) {
      for (let i in colleges) {
        if (colleges[i]["id"] === formState.values.contact) {
          college = colleges[i]["name"];
          break;
        }
      }
    }
    for (let i in tempMonthArray) {
      if (tempMonthArray[i]["id"] === formState.values.Month) {
        month = tempMonthArray[i]["name"];
        break;
      }
    }
    let roleName = auth.getUserInfo().role.name;
    multiDataSet = [
      {
        columns: ["", ""],
        data: [
          [
            { value: "Login Name", style: { font: { sz: "12", bold: true } } },
            {
              value: roleName,
              style: { font: { sz: "12" } }
            }
          ],
          [
            { value: "Year", style: { font: { sz: "12", bold: true } } },
            {
              value: "" + formState.values.Year + "",
              style: { font: { sz: "12" } }
            }
          ],
          [
            { value: "Month", style: { font: { sz: "12", bold: true } } },
            { value: month, style: { font: { sz: "12" } } }
          ],
          [
            { value: "Zone", style: { font: { sz: "12", bold: true } } },
            { value: zone, style: { font: { sz: "12" } } }
          ],
          [
            { value: "RPC", style: { font: { sz: "12", bold: true } } },
            { value: rpc, style: { font: { sz: "12" } } }
          ],
          [
            { value: "College", style: { font: { sz: "12", bold: true } } },
            { value: college, style: { font: { sz: "12" } } }
          ],

          [{ value: "" }, { value: "" }],
          generateHeaders("Headers"),
          [{ value: "" }, { value: "" }],
          generateEntityDataForDownload("Workshops", finalData.Workshops),
          generateEntityDataForDownload(
            "TPO Feedback",
            finalData.TPOFeedback +
              finalData.IndustrialVisitTPOFeedback +
              finalData.PlacementTPOFeedback
          ),
          generateEntityDataForDownload(
            "Student Feedback",
            finalData.StudentFeedback +
              finalData.IndustrialVisitStudentFeedback +
              finalData.PlacementStudentFeedback
          ),
          generateEntityDataForDownload(
            "Industrial Visits",
            finalData.IndustrialVisits
          ),
          generateEntityDataForDownload("Hired", finalData.PlacementSelected),
          [{ value: "" }, { value: "" }],
          generateHeaders("Workshop"),
          [{ value: "" }, { value: "" }],
          generateEntityDataForDownload(
            "Overall Workshops",
            finalData.Workshops
          ),
          generateEntityDataForDownload("1st Year", finalData.FirstYear),
          generateEntityDataForDownload("2nd Year", finalData.SecondYear),
          generateEntityDataForDownload("Final Year", finalData.FinalYear),
          generateEntityDataForDownload(
            "Entrepreneurship",
            finalData.Entrepreneurship
          ),
          generateEntityDataForDownload(
            "1st Year Attendance",
            finalData.FirstYearAttendance
          ),
          generateEntityDataForDownload(
            "2nd Year Attendance",
            finalData.SecondYearAttendance
          ),
          generateEntityDataForDownload(
            "Final Year Attendance",
            finalData.FinalYearAttendance
          ),
          generateEntityDataForDownload("Planned", finalData.PlannedWorkshops),
          generateEntityDataForDownload(
            "Achieved",
            finalData.AchievedWorkshops
          ),
          generateEntityDataForDownload(
            "Unique Students",
            finalData.UniqueStudents
          ),
          generateEntityDataForDownload(
            "Instittions touched",
            finalData.Institutionstouched
          ),
          generateEntityDataForDownload(
            "Student Feedback",
            finalData.StudentFeedback
          ),
          generateEntityDataForDownload("TPO Feedback", finalData.TPOFeedback),
          [{ value: "" }, { value: "" }],
          generateHeaders("Industrial Visit"),
          [{ value: "" }, { value: "" }],
          generateEntityDataForDownload(
            "Industrial Visit",
            finalData.IndustrialVisits
          ),
          generateEntityDataForDownload(
            "Attendance",
            finalData.IndustrialVisitAttendance
          ),
          generateEntityDataForDownload(
            "Planned",
            finalData.PlannedIndustrialVisit
          ),
          generateEntityDataForDownload(
            "Achieved",
            finalData.AchievedIndustrialVisit
          ),
          generateEntityDataForDownload(
            "Student Feedback",
            finalData.IndustrialVisitStudentFeedback
          ),
          generateEntityDataForDownload(
            "TPO Feedback",
            finalData.IndustrialVisitTPOFeedback
          ),
          [{ value: "" }, { value: "" }],
          generateHeaders("Placement"),
          [{ value: "" }, { value: "" }],
          generateEntityDataForDownload("Placement", finalData.Placement),
          generateEntityDataForDownload(
            "Attended",
            finalData.PlacementAttended
          ),
          generateEntityDataForDownload("Hired", finalData.PlacementSelected),
          generateEntityDataForDownload(
            "Student Feedback",
            finalData.PlacementStudentFeedback
          ),
          generateEntityDataForDownload(
            "TPO Feedback",
            finalData.PlacementTPOFeedback
          ),
          generateEntityDataForDownload(
            "College Feedback",
            finalData.PlacementCollegeFeedback
          )
        ]
      }
    ];
  };

  async function fetchZoneRpcDistrictData() {
    if (
      formState.state &&
      formState.state !== null &&
      formState.state !== undefined &&
      formState.state !== ""
    ) {
      let zones_url =
        STATES_URL +
        "/" +
        formState.state +
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
        formState.state +
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

  /** Handle change for autocomplete fields */
  const handleChangeAutoComplete = (eventName, event, value) => {
    /**TO SET VALUES OF AUTOCOMPLETE */
    if (value !== null) {
      if (eventName !== year && eventName !== college) {
        setFormState(formState => ({
          ...formState,
          values: {
            ...formState.values,
            [eventName]: value.id
          }
        }));
      } else if (eventName === college) {
        setFormState(formState => ({
          ...formState,
          values: {
            ...formState.values,
            [eventName]: value.contact.id
          }
        }));
      } else {
        setFormState(formState => ({
          ...formState,
          values: {
            ...formState.values,
            [eventName]: value
          }
        }));
      }

      if (eventName === state) {
        fetchZoneRpcDistrictData();
      }
      if (formState.errors.hasOwnProperty(eventName)) {
        delete formState.errors[eventName];
      }
    } else {
      if (eventName === zone || eventName === rpc) {
        setColleges([]);
        delete formState.values[college];
      } else if (eventName === year) {
        setMonthData([]);
        delete formState.values[month];
      }
      /** This is used to remove clear out data form auto complete when we click cross icon of auto complete */
      setFormState(formState => ({
        ...formState,
        flag: !formState.flag
      }));
      delete formState.values[eventName];
    }
  };

  const handleSubmit = event => {
    setLoaderStatus(true);
    let isValid = false;
    formState.values = _.omit(formState.values, ["isRpc"]);
    /** Checkif all fields are present in the submitted form */
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      DashboardSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        DashboardSchema
      );
      /** Checks if the form is empty */
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        DashboardSchema
      );
      /** This sets errors by comparing it with the json schema provided */
      formState.errors = formUtilities.setErrors(
        formState.values,
        DashboardSchema
      );
    }
    if (isValid) {
      /** CALL POST FUNCTION */
      generateData();
    } else {
      setFormState(formState => ({
        ...formState,
        flag: !formState.flag
      }));
      setLoaderStatus(false);
    }
    event.preventDefault();
  };

  const StyledTableCell = withStyles(theme =>
    createStyles({
      head: {
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "10px",
        fontSize: "14px",
        fontWeight: 700
      },
      body: {
        fontSize: "14px",
        padding: "8px"
      }
    })
  )(TableCell);

  const StyledTableRow = withStyles(theme =>
    createStyles({
      root: {
        "&:nth-of-type(odd)": {
          backgroundColor: theme.palette.background.default
        }
      }
    })
  )(TableRow);

  const clearFilter = () => {
    prefillInitialDataRoleWise();
    setYears(true);
    if (
      auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
      auth.getUserInfo().role.name === roleConstants.ZONALADMIN ||
      auth.getUserInfo().role.name === roleConstants.DEPARTMENTADMIN
    ) {
      setColleges([]);
    }
    setFormState(formState => ({
      ...formState,
      errors: {}
    }));
  };

  const hasError = field => (formState.errors[field] ? true : false);
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item lg sm={6} xl={3} xs={12}>
          <Card {...rest} className={clsx(classes.root, className)}>
            <CardHeader
              classes={{
                title: classes.title,
                root: classes.titleRoot
              }}
              title="Workshops"
              color="textSecondary"
              align="center"
            />
            <CardContent>
              <Typography variant="h1" align="center">
                {finalData.Workshops}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg sm={6} xl={3} xs={12}>
          <Card {...rest} className={clsx(classes.root, className)}>
            <CardHeader
              classes={{
                title: classes.title,
                root: classes.titleRoot
              }}
              title="TPO Feedback"
              color="textSecondary"
              align="center"
            />
            <CardContent>
              <Typography variant="h1" align="center">
                {finalData.TPOFeedback +
                  finalData.IndustrialVisitTPOFeedback +
                  finalData.PlacementTPOFeedback}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg sm={6} xl={3} xs={12}>
          <Card {...rest} className={clsx(classes.root, className)}>
            <CardHeader
              classes={{
                title: classes.title,
                root: classes.titleRoot
              }}
              title="Student Feedback"
              color="textSecondary"
              align="center"
            />
            <CardContent>
              <Typography variant="h1" align="center">
                {finalData.StudentFeedback +
                  finalData.IndustrialVisitStudentFeedback +
                  finalData.PlacementStudentFeedback}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg sm={6} xl={3} xs={12}>
          <Card {...rest} className={clsx(classes.root, className)}>
            <CardHeader
              classes={{
                title: classes.title,
                root: classes.titleRoot
              }}
              title="Industrial Visits"
              color="textSecondary"
              align="center"
            />
            <CardContent>
              <Typography variant="h1" align="center">
                {finalData.IndustrialVisits}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg md={6} xl={3} xs={12}>
          <Card {...rest} className={clsx(classes.root, className)}>
            <CardHeader
              classes={{
                title: classes.title,
                root: classes.titleRoot
              }}
              title="Hired"
              color="textSecondary"
              align="center"
            />
            <CardContent>
              <Typography variant="h1" align="center">
                {finalData.PlacementSelected}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={12} md={6} xl={9} xs={12}>
          <Card className={classes.root} variant="outlined">
            <CardContent>
              <Grid container spacing={3} className={classes.formgrid}>
                {auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
                auth.getUserInfo().role.name ===
                  roleConstants.DEPARTMENTADMIN ? (
                  <Grid item md={2} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <Autocomplete
                        id={"zoneDemo"}
                        options={zones}
                        getOptionLabel={option => option.name}
                        /* This is used to set the default value to the auto complete */
                        name={"demo-id"}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(zone, event, value);
                        }}
                        value={
                          zones[
                            zones.findIndex(function (item, i) {
                              return item.id === formState.values[zone];
                            })
                          ] || null /** Please give a default " " blank value */
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            label={"Select Zone"}
                            placeholder={"Select Zone"}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                ) : null}

                {auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
                auth.getUserInfo().role.name === roleConstants.ZONALADMIN ||
                auth.getUserInfo().role.name ===
                  roleConstants.DEPARTMENTADMIN ? (
                  <Grid item md={2} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <Autocomplete
                        id={"regionDemo"}
                        options={rpcs}
                        getOptionLabel={option => option.name}
                        /* This is used to set the default value to the auto complete */
                        name={"demo-id"}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(rpc, event, value);
                        }}
                        value={
                          rpcs[
                            rpcs.findIndex(function (item, i) {
                              return item.id === formState.values[rpc];
                            })
                          ] || null /** Please give a default " " blank value */
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            placeholder={"Select Region"}
                            label={"Select Region"}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                ) : null}

                {auth.getUserInfo().role.name === roleConstants.MEDHAADMIN ||
                auth.getUserInfo().role.name ===
                  roleConstants.DEPARTMENTADMIN ||
                auth.getUserInfo().role.name === roleConstants.ZONALADMIN ||
                (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
                  auth.getUserInfo().studentInfo.organization.contact.id ===
                    auth.getUserInfo().rpc.main_college) ? (
                  <Grid item md={2} xs={12}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.formControl}
                    >
                      <Autocomplete
                        id={"collegeDemo"}
                        options={colleges}
                        getOptionLabel={option => option.name}
                        /* This is used to set the default value to the auto complete */
                        name={"demo-id"}
                        onChange={(event, value) => {
                          handleChangeAutoComplete(college, event, value);
                        }}
                        value={
                          colleges[
                            colleges.findIndex(function (item, i) {
                              return (
                                item.contact.id === formState.values[college]
                              );
                            })
                          ] || null /** Please give a default " " blank value */
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            placeholder={"Select College"}
                            label={"Select College"}
                            variant="outlined"
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                ) : null}

                <Grid item md={2} xs={12}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className={classes.formControl}
                  >
                    <Autocomplete
                      id={DashboardSchema[year]["id"]}
                      options={yearData}
                      getOptionLabel={option => "" + option + ""}
                      /* This is used to set the default value to the auto complete */
                      name={DashboardSchema[year]["name"]}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(year, event, value);
                      }}
                      value={
                        yearData[
                          yearData.findIndex(function (item, i) {
                            return item === formState.values[year];
                          })
                        ] || null /** Please give a default " " blank value */
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder={DashboardSchema[year]["placeholder"]}
                          label={DashboardSchema[year]["label"]}
                          variant="outlined"
                          error={hasError(year)}
                          helperText={
                            hasError(year)
                              ? formState.errors[year].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className={classes.formControl}
                  >
                    <Autocomplete
                      id={DashboardSchema[month]["id"]}
                      options={monthData}
                      getOptionLabel={option => option.name}
                      /* This is used to set the default value to the auto complete */
                      name={DashboardSchema[month]["name"]}
                      onChange={(event, value) => {
                        handleChangeAutoComplete(month, event, value);
                      }}
                      value={
                        monthData[
                          monthData.findIndex(function (item, i) {
                            return item.id === formState.values[month];
                          })
                        ] || null /** Please give a default " " blank value */
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder={DashboardSchema[month]["placeholder"]}
                          label={DashboardSchema[month]["label"]}
                          variant="outlined"
                          error={hasError(month)}
                          helperText={
                            hasError(month)
                              ? formState.errors[month].map(error => {
                                  return error + " ";
                                })
                              : null
                          }
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                {/** <Grid item md={2} xs={12}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className={classes.formControl}
                  >
                    <InputLabel ref={inputLabel} id="select-trainer">
                      Select Trainer
                    </InputLabel>
                    <Autocomplete
                      id={"trainerDemo"}
                      options={[]}
                      getOptionLabel={option => option.name}
                      name={"demo-id"}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder={"Select Trainer"}
                          value={option => option.id}
                          name={"demo"}
                          key={option => option.id}
                          variant="outlined"
                        />
                      )}
                    />
                  </FormControl>
                </Grid>*/}
                <Grid item md={2} xs={12} className={classes.dash_search_btn}>
                  <Grid item className={classes.filterButtonsMargin}>
                    <YellowButton
                      id="handle_submit"
                      variant="contained"
                      color="primary"
                      disableElevation
                      onClick={handleSubmit}
                    >
                      {genericConstants.SEARCH_BUTTON_TEXT}
                    </YellowButton>
                  </Grid>
                  <Grid item className={classes.filterButtonsMargin}>
                    <GrayButton
                      variant="contained"
                      color="primary"
                      disableElevation
                      onClick={clearFilter}
                    >
                      {genericConstants.RESET_BUTTON_TEXT}
                    </GrayButton>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card className={classes.marginCard} variant="outlined">
            <CardContent>
              <Grid item md={4} xs={12}>
                <TableContainer component={Paper}>
                  <Table
                    className={classes.table}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Workshop</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {formState.zonerows.map(zonerow => (
                        <StyledTableRow key={zonerow.workshop}>
                          <StyledTableCell component="th" scope="zonerow">
                            {zonerow.workshop}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {zonerow.zoneresult}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer
                  component={Paper}
                  className={classes.marginCard}
                >
                  <Table
                    className={classes.table}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Industrial Visit</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {formState.indrows.map(industry => (
                        <StyledTableRow key={industry.industry}>
                          <StyledTableCell component="th" scope="zonerow">
                            {industry.industry}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {industry.industryresult}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer
                  component={Paper}
                  className={classes.marginCard}
                >
                  <Table
                    className={classes.table}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Placement</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {formState.placementrows.map(placement => (
                        <StyledTableRow key={placement.placement}>
                          <StyledTableCell component="th" scope="zonerow">
                            {placement.placement}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {placement.placementresult}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item className={classes.move_right}>
                <ExcelFile
                  element={
                    <GreenButton
                      variant="contained"
                      color="secondary"
                      className={classes.greenButton}
                      startIcon={<GetAppIcon />}
                      onClick={() => {}}
                      greenButtonChecker={formState.greenButtonChecker}
                    >
                      Download
                    </GreenButton>
                  }
                >
                  <ExcelSheet dataSet={multiDataSet} name="Dashboard" />
                </ExcelFile>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid container spacing={2}>
          <Grid item lg={12} sm={12} xl={12} xs={12}>
            <div className={classes.move_right}>
              {status.status === "pending" ? (
                <>
                  <Chip
                    label={"Updating dashboard data"}
                    disabled
                    variant="outlined"
                    size="medium"
                  />
                  <CircularProgress size={18} />
                </>
              ) : status.status === "error" ? (
                <Chip
                  label={
                    "Updating dashboard data failed last updated " + status.time
                  }
                  disabled
                  variant="outlined"
                  size="medium"
                />
              ) : status.status === "completed" ? (
                <Chip
                  label={"Updated " + status.time}
                  disabled
                  variant="outlined"
                  size="medium"
                />
              ) : null}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
export default Dashboard;
