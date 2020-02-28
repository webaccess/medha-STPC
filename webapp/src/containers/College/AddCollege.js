import React, { useState, useEffect } from "react";
import useStyles from "./AddCollegeStyles.js";
import clsx from "clsx";
import axios from "axios";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import AddCollegeFormSchema from "./AddCollegeFormSchema.js";
import * as databaseUtilities from "../../Utilities/StrapiUtilities";
import * as formUtilities from "../../Utilities/FormUtilities";
import * as strapiConstants from "../../constants/StrapiApiConstants";

import { get } from "lodash";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from "@material-ui/core";
import PropTypes from "prop-types";

const collegeName = "collegeName";
const collegeCode = "collegeCode";
const address = "address";
const state = "state";
const zone = "zone";
const rpc = "rpc";
const contactNumber = "contactNumber";
const collegeEmail = "collegeEmail";
const principal = "principal";
const admins = "admins";
const streams = "streams";

const AddCollege = props => {
  const classes = useStyles();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
    isSuccess: false
  });
  const { className, ...rest } = props;
  const [user, setUser] = useState([]);
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [rpcs, setRpcs] = useState([]);
  const [streamsData, setStreamsData] = useState([]);
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  useEffect(() => {
    axios
      .get(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS)
      .then(res => {
        setUser(res.data);
      });
    axios
      .get(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STATES)
      .then(res => {
        setStates(res.data);
      });
    axios
      .get(strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_STREAMS)
      .then(res => {
        setStreamsData(res.data);
      });
  }, []);

  useEffect(() => {
    axios({
      method: "get",
      url: strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES,
      params: { "state.id": formState.values[state] }
    }).then(res => {
      setZones(res.data);
    });
  }, [formState.values[state]]);

  useEffect(() => {
    axios({
      method: "get",
      url: strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_RPCS,
      params: { "zone.id": formState.values[zone] }
    }).then(res => {
      setRpcs(res.data);
    });
  }, [formState.values[zone]]);

  const handleChange = e => {
    e.persist();
    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [e.target.name]: e.target.value
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

  const handleSubmit = event => {
    let isValid = false;
    let checkAllFieldsValid = formUtilities.checkAllKeysPresent(
      formState.values,
      AddCollegeFormSchema
    );
    if (checkAllFieldsValid) {
      /** Evaluated only if all keys are valid inside formstate */
      formState.errors = formUtilities.setErrors(
        formState.values,
        AddCollegeFormSchema
      );
      if (formUtilities.checkEmpty(formState.errors)) {
        isValid = true;
      }
    } else {
      /** This is used to find out which all required fields are not filled */
      formState.values = formUtilities.getListOfKeysNotPresent(
        formState.values,
        AddCollegeFormSchema
      );
      formState.errors = formUtilities.setErrors(
        formState.values,
        AddCollegeFormSchema
      );
    }
    if (isValid) {
      console.log("formValid");
      postCollegeData();

      /** Set state to reload form */
      setFormState(formState => ({
        ...formState,
        isValid: true
      }));
    } else {
      console.log("formInValid");
      setFormState(formState => ({
        ...formState,
        isValid: false
      }));
    }
    event.preventDefault();
  };

  const hasError = field => (formState.errors[field] ? true : false);

  const postCollegeData = async () => {
    console.log(databaseUtilities.setUser(formState.values[principal]));
    console.log(formState.values);
    let postData = databaseUtilities.addCollege(
      formState.values[collegeName],
      formState.values[collegeCode],
      formState.values[address],
      formState.values[contactNumber],
      formState.values[collegeEmail],
      formState.values[principal]
        ? databaseUtilities.setUser(formState.values[principal])
        : null,
      formState.values[rpc]
        ? databaseUtilities.setRpc(formState.values[rpc])
        : null,
      formState.values[streams]
        ? databaseUtilities.setStreams(formState.values[streams])
        : null
    );

    axios({
      method: "post",
      async: false,
      url: strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES,
      data: postData
    })
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error.response);
      });
    console.log("post successful");
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <CardHeader title="Add College" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                // helperText="Please specify the college name"
                id={get(AddCollegeFormSchema[collegeName], "id")}
                label={get(AddCollegeFormSchema[collegeName], "label")}
                margin="dense"
                name={collegeName}
                onChange={handleChange}
                required
                type={get(AddCollegeFormSchema[collegeName], "type")}
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
                id={get(AddCollegeFormSchema[collegeCode], "id")}
                label={get(AddCollegeFormSchema[collegeCode], "label")}
                margin="dense"
                name={collegeCode}
                onChange={handleChange}
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
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                id={get(AddCollegeFormSchema[address], "id")}
                label={get(AddCollegeFormSchema[address], "label")}
                margin="dense"
                name={address}
                onChange={handleChange}
                required
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
            <Grid item md={6} xs={12}>
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.formControl}
              >
                <InputLabel
                  ref={inputLabel}
                  id="demo-simple-select-outlined-label"
                >
                  State
                </InputLabel>
                {states.length ? (
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    name={state}
                    value={formState.values[state] || ""}
                    error={hasError(state)}
                    helperText={
                      hasError(state)
                        ? formState.errors[state].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    onChange={handleChange}
                    labelWidth={labelWidth}
                  >
                    {states.map(state => (
                      <MenuItem value={state.id} key={state.id}>
                        {state.name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.formControl}
              >
                <InputLabel
                  ref={inputLabel}
                  id="demo-simple-select-outlined-label"
                >
                  RPCs
                </InputLabel>
                {rpcs.length ? (
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={formState.values[rpc] || ""}
                    error={hasError(rpc)}
                    helperText={
                      hasError(rpc)
                        ? formState.errors[rpc].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    name={rpc}
                    onChange={handleChange}
                    labelWidth={labelWidth}
                  >
                    {rpcs.map(rpc => (
                      <MenuItem value={rpc.id} key={rpc.id}>
                        {rpc.name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.formControl}
              >
                <InputLabel
                  ref={inputLabel}
                  id="demo-simple-select-outlined-label"
                >
                  Zone
                </InputLabel>
                {zones.length ? (
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={formState.values[zone] || ""}
                    error={hasError(zone)}
                    helperText={
                      hasError(zone)
                        ? formState.errors[zone].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    name={zone}
                    onChange={handleChange}
                    labelWidth={labelWidth}
                  >
                    {zones.map(zone => (
                      <MenuItem value={zone.id} key={zone.id}>
                        {zone.name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                margin="dense"
                name={contactNumber}
                onChange={handleChange}
                required
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
              <TextField
                fullWidth
                label={get(AddCollegeFormSchema[collegeEmail], "label")}
                id={get(AddCollegeFormSchema[collegeEmail], "id")}
                margin="dense"
                name={collegeEmail}
                onChange={handleChange}
                required
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
            <Divider />
            <Grid item md={6} xs={12}>
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.formControl}
              >
                <InputLabel
                  ref={inputLabel}
                  id="demo-simple-select-outlined-label"
                >
                  principal
                </InputLabel>
                {user.length ? (
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    error={hasError(principal)}
                    helperText={
                      hasError(principal)
                        ? formState.errors[principal].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    name={principal}
                    onChange={handleChange}
                    labelWidth={labelWidth}
                  >
                    {user.map(users => (
                      <MenuItem value={users.id} key={users.id}>
                        {users.username}
                      </MenuItem>
                    ))}
                  </Select>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.formControl}
              >
                <InputLabel
                  ref={inputLabel}
                  id="demo-simple-select-outlined-label"
                >
                  TPO
                </InputLabel>
                {user.length ? (
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    error={hasError(admins)}
                    helperText={
                      hasError(admins)
                        ? formState.errors[admins].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    name={admins}
                    onChange={handleChange}
                    labelWidth={labelWidth}
                  >
                    {user.map(users => (
                      <MenuItem value={users.id} key={users.id}>
                        {users.username}
                      </MenuItem>
                    ))}
                  </Select>
                ) : null}
              </FormControl>
            </Grid>
            <Divider />
            <Grid item md={6} xs={12}>
              <FormControl
                variant="outlined"
                fullWidth
                className={classes.formControl}
              >
                <InputLabel
                  ref={inputLabel}
                  id="demo-simple-select-outlined-label"
                >
                  Streams
                </InputLabel>
                {streams.length ? (
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    error={hasError(streams)}
                    helperText={
                      hasError(streams)
                        ? formState.errors[streams].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    name={streams}
                    onChange={handleChange}
                    labelWidth={labelWidth}
                  >
                    {streamsData.map(stream => (
                      <MenuItem value={stream.id} key={stream.id}>
                        {stream.name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : null}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            // disabled={!formState.isValid}
          >
            Save details
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};
AddCollege.propTypes = {
  className: PropTypes.string
};
export default AddCollege;
