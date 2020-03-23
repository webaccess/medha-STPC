import React, { useState } from "react";
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

import useStyles from "./ManageEventStyles";
import { GrayButton, YellowButton, GreenButton } from "../../../components";

const ViewEvents = props => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const [formState, setFormState] = useState({
    greenButtonChecker: true
  });

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
                      label="Date picker inline"
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
                      label="Date picker inline"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date"
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
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
