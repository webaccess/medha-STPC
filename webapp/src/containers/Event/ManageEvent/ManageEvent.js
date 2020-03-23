import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import {
  TextField,
  Card,
  CardContent,
  Tooltip,
  Grid,
  Collapse,
  IconButton,
  Typography
} from "@material-ui/core";

import * as strapiConstants from "../../../constants/StrapiApiConstants";
import useStyles from "./ManageEventStyles";
import { GrayButton, YellowButton, GreenButton } from "../../../components";
import * as formUtilities from "../../../Utilities/FormUtilities";
import * as serviceProviders from "../../../api/Axios";

const EVENT_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_EVENTS;
// http://104.236.28.24:1338/events
// page: 1, pageSize: 10, _sort: "title:asc"

const SORT_FIELD_KEY = "_sort";

const ViewEvents = props => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const [formState, setFormState] = useState({
    dataToShow: [],
    tempData: [],
    events: [],
    greenButtonChecker: true,
    /** Pagination and sortinig data */
    isDataLoading: false,
    pageSize: "",
    totalRows: "",
    page: "",
    pageCount: "",
    sortAscending: true
  });

  console.log("datatoshow--", formState.events);

  useEffect(() => {
    getEventData(10, 1);
  }, []);

  const getEventData = async (pageSize, page, paramsForevents = null) => {
    if (
      paramsForevents !== null &&
      !formUtilities.checkEmpty(paramsForevents)
    ) {
      let defaultParams = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "title:asc"
      };
      Object.keys(paramsForevents).map(key => {
        defaultParams[key] = paramsForevents[key];
      });
      paramsForevents = defaultParams;
    } else {
      paramsForevents = {
        page: page,
        pageSize: pageSize,
        [SORT_FIELD_KEY]: "title:asc"
      };
    }
    setFormState(formState => ({
      ...formState,
      isDataLoading: true
    }));
    console.log("paramsForevents", paramsForevents);
    await serviceProviders
      .serviceProviderForGetRequest(EVENT_URL, paramsForevents)
      .then(res => {
        formState.dataToShow = [];
        formState.tempData = [];
        let eventData = [];
        eventData = convertUserData(res.data.result);
        setFormState(formState => ({
          ...formState,
          events: res.data.result,
          pageSize: res.data.pageSize,
          totalRows: res.data.rowCount,
          page: res.data.page,
          pageCount: res.data.pageCount,
          dataToShow: eventData,
          tempData: eventData,
          isDataLoading: false
        }));
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  const convertUserData = data => {
    let x = [];
    if (data.length > 0) {
      for (let i in data) {
        var eventIndividualData = {};
        console.log("tempdata", data[i]);
        eventIndividualData["title"] = data[i]["title"];
        eventIndividualData["start_date_time"] = data[i]["start_date_time"];
        eventIndividualData["streams"] = data[i]["streams"];
        eventIndividualData["rpc"] = data[i]["rpc"];
        // eventIndividualData["zone"] = data[i]["zone"] ? data[i]["zone"]["name"] : "";
        // eventIndividualData["rpc"] = data[i]["rpc"] ? data[i]["rpc"]["name"] : "";
        // eventIndividualData["college"] = data[i]["college"] ? data[i]["college"]["name"] : "";

        x.push(eventIndividualData);
      }
      console.log("xxxxx", x);
      return x;
    }
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          Manage Event
        </Typography>

        <GreenButton
          variant="contained"
          color="primary"
          //onClick={clearFilter}
          disableElevation
          //to={routeConstants.ADD_USER}
          startIcon={<AddCircleOutlineOutlinedIcon />}
          greenButtonChecker={formState.greenButtonChecker}
        >
          Add Event
        </GreenButton>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Card>
          <CardContent className={classes.Cardtheming}>
            <Grid className={classes.filterOptions} container spacing={1}>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  //name={USER_FILTER}
                  //options={formState.users}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.username}
                  //   onChange={(event, value) =>
                  //     handleChangeAutoComplete(USER_FILTER, event, value)
                  //   }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Event"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  //name={USER_FILTER}
                  //options={formState.users}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.username}
                  //   onChange={(event, value) =>
                  //     handleChangeAutoComplete(USER_FILTER, event, value)
                  //   }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Stream"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  id="combo-box-demo"
                  //name={USER_FILTER}
                  //options={formState.users}
                  className={classes.autoCompleteField}
                  getOptionLabel={option => option.username}
                  //   onChange={(event, value) =>
                  //     handleChangeAutoComplete(USER_FILTER, event, value)
                  //   }
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Location"
                      className={classes.autoCompleteField}
                      variant="outlined"
                    />
                  )}
                />{" "}
              </Grid>
              <Grid item>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-around">
                    <KeyboardDatePicker
                      disableToolbar
                      variant="outline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Date From"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date"
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-around">
                    <KeyboardDatePicker
                      disableToolbar
                      variant="outline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Date To"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date"
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <YellowButton
                  variant="contained"
                  color="primary"
                  disableElevation
                  // onClick={event => {
                  //   event.persist();
                  //   searchFilter();
                  // }}
                >
                  Search
                </YellowButton>
              </Grid>
              <Grid item className={classes.filterButtonsMargin}>
                <GrayButton
                  variant="contained"
                  color="primary"
                  //onClick={refreshPage}
                  disableElevation
                >
                  Reset
                </GrayButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card className={classes.tabledata} variant="outlined">
          <p>Test2</p>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ViewEvents;
