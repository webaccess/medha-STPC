import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useStyles from "../../OTP/OTPstyles.js";
import validateInput from "../../../components/Validation/Validation.js";
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
  CardMedia,
  Paper,
  Icon,
  CardContent,
  Collapse,
  IconButton
} from "@material-ui/core";
import * as _ from "lodash";
import { Alert } from "../../../components";
import * as authPageConstants from "../../../constants/AuthPageConstants.js";
import form from "../../OTP/OTPform.json";
import * as strapiApiConstants from "../../../constants/StrapiApiConstants.js";
import axios from "axios";
import image from "../../../assets/images/login-img.png";
import CardIcon from "../../../components/Card/CardIcon";
import * as routeConstants from "../../../constants/RouteConstants";
import LoaderContext from "../../../context/LoaderContext.js";
import * as serviceProvider from "../../../api/Axios";
import CloseIcon from "@material-ui/icons/Close";
const RequestOTP = props => {
  let history = useHistory();

  const [formState, setFormState] = useState({
    values: {},
    error: {},
    counter: 0,
    flag: 0
  });

  const [error, setError] = useState("");
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);
  const [open, setOpen] = React.useState(true);
  const [ifFailure, setIfFailure] = React.useState(false);

  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    severity: ""
  });

  const classes = useStyles();
  const { layout: Layout } = props;
  const validate = () => {
    setLoaderStatus(true);

    formState.error["contactNumber"] = validateInput(
      formState.values.contactNumber,
      form["contactNumber"]["validations"]
    );

    if (formState.flag === 1) {
      formState.error["otp"] = validateInput(
        formState.values.otp,
        form["otp"]["validations"]
      );
    }

    if (
      formState.error.contactNumber &&
      formState.error.contactNumber.length === 0
    ) {
      formState.error = Object.assign(
        {},
        _.omit(formState.error, ["contactNumber"])
      );
    }
    if (
      formState.flag === 1 &&
      formState.error.otp &&
      formState.error.otp.length === 0
    ) {
      formState.error = Object.assign({}, _.omit(formState.error, ["otp"]));
    }

    if (formState.flag === 0) {
    }
    if (formState.flag === 1) {
    }
    if (Object.keys(formState.error).length === 0 && formState.flag === 1) {
      updateCall();
    }
    if (formState.flag === 0 && Object.keys(formState.error).length === 0) {
      postCall();
    }
    setFormState(formState => ({
      ...formState,
      isValid: false
    }));
  };

  const handleChange = (name, event) => {
    event.persist();
    setFormState(formState => ({
      ...formState,

      values: {
        ...formState.values,
        [name]: event.target.value
      }
    }));
  };

  const hasError = field => (formState.error[field] ? true : false);
  if (
    props.location.state &&
    props.location.state.contactNumber &&
    formState.counter === 0
  ) {
    formState.values["contactNumber"] = props.location.state.contactNumber;
    formState.counter = 1;
    // setFormState(formState => ({
    //   ...formState,

    //   values: {
    //     ...formState.values,
    //     ["contactNumber"]: props.location.state.contactNumber,
    //     ["email"]: props.location.state.email
    //   }
    // }));
  }
  const updateCall = () => {
    const url =
      strapiApiConstants.STRAPI_DB_URL +
      strapiApiConstants.STRAPI_UPDATE_CONTACT;
    serviceProvider
      .serviceProviderForPostRequest(url, {
        old_contact_number: props.location.state.contactNumber,
        new_contact_number: formState.values.contactNumber,
        otp: formState.values.otp
      })
      .then(response => {
        history.push({ pathname: routeConstants.CHANGED_CONTACT_NUMBER });
        setLoaderStatus(false);
      })
      .catch(error => {
        setAlert(() => ({
          isOpen: true,
          message: error.response.data.message,
          severity: "error"
        }));
        setLoaderStatus(false);
      });
  };
  const postCall = () => {
    axios
      .post(
        strapiApiConstants.STRAPI_DB_URL +
          strapiApiConstants.STRAPI_REQUEST_OTP,
        { contact_number: formState.values.contactNumber }
      )
      .then(res => {
        setFormState(formState => ({
          ...formState,
          flag: 1
        }));
        setLoaderStatus(false);
      })
      .catch(err => {
        console.log(err);
        setLoaderStatus(false);
      });
  };

  const AlertAPIResponseMessage = () => {
    return (
      <Collapse in={alert.isOpen}>
        <Alert
          severity={alert.severity || "warning"}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(() => ({ isOpen: false }));
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alert.message}
        </Alert>
      </Collapse>
    );
  };

  return (
    <div className={classes.masterlogin2}>
      <div className={classes.masterlogin1}>
        <div className={classes.masterlogin}>
          <Paper className={classes.rootDesktop}>
            <CardContent>
              <CssBaseline />
              <div className={classes.paper}>
                <div className={classes.signin_header}>
                  <div className={classes.loginlock}>
                    <CardIcon>
                      <Icon>lock</Icon>
                    </CardIcon>
                  </div>
                  <Typography
                    className={classes.signin}
                    component="h1"
                    variant="h5"
                    style={{ fontWeight: "700" }}
                  >
                    {"Change Contact Number "}
                  </Typography>
                </div>
                <AlertAPIResponseMessage />
                <React.Fragment>
                  <Typography
                    component="h5"
                    variant="subtitle2"
                    style={{ marginTop: ".9rem", marginBottom: ".9rem" }}
                  >
                    {
                      "Enter the new Contact Number to which the OTP will be sent. "
                    }{" "}
                  </Typography>
                  <TextField
                    label="Contact Number"
                    name="contactnumber"
                    value={formState.values.contactNumber}
                    variant="outlined"
                    fullWidth
                    disabled={formState.flag === 1 ? true : false}
                    style={{ marginTop: ".9rem", marginBottom: ".9rem" }}
                    error={hasError("contactNumber")}
                    helperText={
                      hasError("contactNumber")
                        ? formState.error["contactNumber"].map(error => {
                            return error + " ";
                          })
                        : null
                    }
                    onChange={event => {
                      handleChange("contactNumber", event);
                    }}
                  />

                  {formState.flag == 0 ? null : (
                    <TextField
                      label="OTP"
                      name="OTP"
                      value={formState.values.OTP}
                      variant="outlined"
                      fullWidth
                      style={{ marginTop: ".9rem", marginBottom: ".9rem" }}
                      error={hasError("otp")}
                      helperText={
                        hasError("otp")
                          ? formState.error["otp"].map(error => {
                              return error + " ";
                            })
                          : null
                      }
                      onChange={event => {
                        handleChange("otp", event);
                      }}
                    />
                  )}
                  {formState.flag == 0 ? (
                    <Button
                      color="primary"
                      type="submit"
                      fullWidth
                      variant="contained"
                      className={classes.submit}
                      onClick={() => {
                        validate();
                      }}
                    >
                      {authPageConstants.SEND_OTP_BUTTON}
                    </Button>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <Button
                        color="primary"
                        type="submit"
                        fullWidth
                        variant="contained"
                        className={classes.submit}
                        onClick={() => {
                          validate();
                        }}
                      >
                        {"Update"}
                      </Button>
                      <Link
                        href="javascript:void(0);"
                        variant="body2"
                        className={classes.linkColor}
                        onClick={() => {
                          setFormState(formState => ({
                            ...formState,
                            flag: 0
                          }));
                        }}
                      >
                        {authPageConstants.CHANGE_CONTACT_NUMBER}
                      </Link>
                    </div>
                  )}
                  {/* <Backdrop
                        className={classes.backdrop}
                        open={openBackdrop}
                      >
                        <CircularProgress color="inherit" />
                      </Backdrop> */}
                </React.Fragment>
              </div>
            </CardContent>

            <CardMedia
              className={classes.cover}
              image={image}
              title="Live from space album cover"
            />
          </Paper>
        </div>
      </div>
    </div>
  );
};
export default RequestOTP;
