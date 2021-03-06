import React, { useState, useEffect, useContext } from "react";
import {
  Auth as auth,
  Typography,
  YellowButton,
  GrayButton,
  ReadOnlyTextField,
  Spinner
} from "../../components";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Collapse,
  IconButton,
  InputLabel,
  Avatar
} from "@material-ui/core";
import * as routeConstants from "../../constants/RouteConstants";
import * as roleConstants from "../../constants/RoleConstants";
import Img from "react-image";
import * as genericConstants from "../../constants/GenericConstants.js";

import * as serviceProvider from "../../api/Axios.js";
import CloseIcon from "@material-ui/icons/Close";

import * as strapiApiConstants from "../../constants/StrapiApiConstants.js";
import { useHistory } from "react-router-dom";
import Alert from "../../components/Alert/Alert.js";
import useStyles from "../ContainerStyles/ViewPageStyles.js";
import LoaderContext from "../../context/LoaderContext";
import SetIndexContext from "../../context/SetIndexContext";

const StudentProfile = props => {
  let history = useHistory();
  const [user, setUser] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    fatherFullName: "",
    motherFullName: "",
    email: "",
    contact: "",
    username: "",
    dataofbirth: "",
    gender: "",
    physicallyHandicapped: null,
    college: null,
    stream: null,
    rollnumber: null,
    futureAspirations: null,
    addresses: []
  });
  const { setLoaderStatus } = useContext(LoaderContext);

  const [formState, setFormState] = useState({
    isValid: false,
    values: {
      addresses: []
    },
    touched: {},
    details: {},
    isSuccess: false,
    editable: false,
    showPassword: false,
    counter: 0,
    studentId: props["location"]["dataForStudent"]
      ? props["location"]["dataForStudent"]
      : null,
    fromAddStudentToRecruitmentDrive:
      props["location"]["fromAddStudentToRecruitmentDrive"],
    fromEventStudentList: props["location"]["fromEventStudentList"],
    fromManageStudentList: props["location"]["fromManageStudentList"],
    eventId: props["location"]["eventId"],
    eventTitle: props["location"]["eventTitle"],
    showEditPreview: false,
    showNoImage: true,
    addressSameAsLocal: false,
    addresses: genericConstants.ADDRESSES
  });

  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const classes = useStyles();
  const { setIndex } = useContext(SetIndexContext);
  setIndex(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setLoaderStatus(true);
    handleSetDetails();
    if (props.location.success && !formState.counter) {
      setSuccess(true);
      formState.counter += 1;
    }
    setLoaderStatus(false);
    // setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  useEffect(() => {
    setFormState(formState => ({
      ...formState,

      values: user
    }));
  }, [user]);

  async function getstatesdistrict(addresses, data) {
    if (addresses.length > 0) {
      const STATES_URL =
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_STATES;

      const DISTRICTS_URL =
        strapiApiConstants.STRAPI_DB_URL + strapiApiConstants.STRAPI_DISTRICTS;
      let params = {
        pageSize: -1
      };

      await serviceProvider
        .serviceProviderForGetRequest(STATES_URL, params, {})
        .then(res => {
          const state = res.data.result;
          addresses = addresses.map((addr, idx) => {
            if (addr.state != null) {
              state.map(state => {
                if (addr.state === state.id) {
                  addr.state = state;
                }
                return state;
              });
            }
            return addr;
          });

          setStates(res.data.result);
        })
        .catch(error => {
          console.log("error", error);
        });

      await serviceProvider
        .serviceProviderForGetRequest(DISTRICTS_URL, params, {})
        .then(res => {
          const district = res.data.result;
          addresses = addresses.map((addr, idx) => {
            if (addr.district != null) {
              district.map(district => {
                if (addr.district === district.id) {
                  addr.district = district;
                }
                return district;
              });
            }
            return addr;
          });
          setDistricts(res.data.result);
        })
        .catch(error => {
          console.log("error", error);
        });
      console.log(addresses);
    }
    setFormState({
      ...formState,
      details: data,
      showEditPreview: data.profile_photo ? true : false,
      showNoImage: data.profile_photo ? false : true,
      addresses: addresses.length > 0 ? addresses : genericConstants.ADDRESSES
    });
  }

  async function handleSetDetails() {
    let paramsForEvent = null;
    if (auth.getUserInfo() && auth.getUserInfo().role) {
      if (auth.getUserInfo().role.name === roleConstants.MEDHAADMIN) {
        paramsForEvent = props["location"]["dataForStudent"];
      } else if (auth.getUserInfo().role.name === roleConstants.STUDENT) {
        paramsForEvent = props.data
          ? props.data.id
          : auth.getUserInfo().studentInfo.id;
      } else if (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) {
        paramsForEvent = props["location"]["dataForStudent"]
          ? formState.studentId
          : auth.getStudentInfoForEditingFromCollegeAdmin();
      }

      let VIEW_STUDENT_URL =
        strapiApiConstants.STRAPI_DB_URL +
        strapiApiConstants.STRAPI_VIEW_USERS +
        "/" +
        paramsForEvent;
      if (paramsForEvent !== null && paramsForEvent !== undefined) {
        await serviceProvider
          .serviceProviderForGetRequest(VIEW_STUDENT_URL)
          .then(res => {
            const data = res.data.result;
            let date = new Date(data.date_of_birth);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let dt = date.getDate();
            if (dt < 10) {
              dt = "0" + dt;
            }
            if (month < 10) {
              month = "0" + month;
            }
            let futureaspiration = "";
            if (data.future_aspirations && data.future_aspirations.length) {
              data.future_aspirations.map(value => {
                futureaspiration = value.name + ", " + futureaspiration;
                return value;
              });
            }
            getstatesdistrict(data.contact.addresses, data);

            setUser({
              ...user,
              firstname: data.first_name,
              middlename: data.middle_name,
              lastname: data.last_name,
              username: data.contact.user.username,
              email: data.contact.user
                ? data.contact.user.email
                  ? data.contact.user.email
                  : ""
                : "",
              college: data.organization.name,
              contact: data.contact.phone ? data.contact.phone : "",
              fatherFullName: data.father_full_name,
              motherFullName: data.mother_full_name,
              rollnumber: data.roll_number ? data.roll_number.toString() : "",
              dataofbirth: dt + "/" + month + "/" + year,
              gender: data.gender,
              stream: data.stream ? data.stream.name : "",
              physicallyHandicapped: data.is_physically_challenged,
              futureAspirations: data.future_aspirations
                ? futureaspiration
                : "",
              addresses: (data.contact && data.contact.addresses) || []
            });
            setLoaderStatus(false);
          })
          .catch(err => {
            console.log(err);
            setLoaderStatus(false);
          });
      } else {
        history.push({
          pathname: routeConstants.DASHBOARD_URL
        });
        setLoaderStatus(false);
      }
    }
    setLoaderStatus(false);
  }

  const editData = () => {
    if (auth.getUserInfo().role.name === roleConstants.STUDENT) {
      history.push({
        pathname: routeConstants.EDIT_PROFILE,
        editStudent: true,
        dataForEdit: formState.details
      });
    } else if (auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN) {
      console.log("in college admin role");
      console.log(formState);
      history.push({
        pathname: routeConstants.EDIT_PROFILE,
        dataForEdit: formState.details,
        editStudent: true,
        collegeAdminRoute: true
      });
    }
  };

  const handleClickCancel = event => {
    event.preventDefault();
    if (formState.fromAddStudentToRecruitmentDrive) {
      history.push({
        pathname: routeConstants.ADD_STUDENT_DRIVE,
        eventId: formState.eventId,
        eventTitle: formState.eventTitle
      });
    } else if (formState.fromEventStudentList) {
      history.push({
        pathname: routeConstants.EVENT_STUDENT_LIST,
        eventId: formState.eventId,
        eventTitle: formState.eventTitle
      });
    } else if (formState.fromManageStudentList) {
      history.push({
        pathname: routeConstants.MANAGE_STUDENT,
        eventId: formState.eventId,
        eventTitle: formState.eventTitle
      });
    } else {
      history.push({
        pathname: routeConstants.MANAGE_STUDENT
      });
    }
  };

  return (
    <Grid>
      {success ? (
        <Collapse in={success}>
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setSuccess(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {genericConstants.ALERT_SUCCESS_DATA_EDITED_MESSAGE}
          </Alert>
        </Collapse>
      ) : null}
      <Grid item xs={12} className={classes.title}>
        {auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN ? (
          <Typography variant="h4" gutterBottom>
            {/* View Student */}
          </Typography>
        ) : null}
      </Grid>
      <Grid spacing={3}>
        <Card>
          <CardContent>
            <Grid
              item
              xs={12}
              md={6}
              xl={3}
              className={classes.MakeElementCenter}
            >
              <Grid className={classes.formgridInputFile}>
                <Grid item md={10} xs={12}>
                  {/* <div className={classes.imageDiv}> */}
                  {/* {formState.showEditPreview&&formState.dataForEdit.upload_logo===null? <div class={classes.DefaultNoImage}></div>:null} */}
                  {formState.showEditPreview &&
                  formState.details["profile_photo"] !== null &&
                  formState.details["profile_photo"] !== undefined &&
                  formState.details["profile_photo"] !== {} ? (
                    // <Img
                    //   src={
                    //     strapiApiConstants.STRAPI_DB_URL_WITHOUT_HASH +
                    //     formState.details["profile_photo"]["url"]
                    //   }
                    //   loader={<Spinner />}
                    //   className={classes.UploadImage}
                    // />

                    <Avatar
                      src={
                        strapiApiConstants.STRAPI_DB_URL_WITHOUT_HASH +
                        formState.details["profile_photo"]["url"]
                      }
                      className={classes.AvatarImage}
                    />
                  ) : null}
                  {formState.showNoImage ? (
                    <Avatar src="" className={classes.AvatarImage} />
                  ) : null}
                  {/* </div> */}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={12} xs={12}>
                  <ReadOnlyTextField
                    id="firstname"
                    label="First Name"
                    defaultValue={formState.values.firstname}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="middlename"
                    label="Middle Name"
                    defaultValue={formState.values.middlename}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="lastname"
                    label="Last Name"
                    defaultValue={formState.values.lastname}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="fathersFullName"
                    label="Father's Full Name"
                    defaultValue={formState.values.fatherFullName}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="mothersFullName"
                    label="Mother's Full Name"
                    defaultValue={formState.values.motherFullName}
                  />
                </Grid>
              </Grid>
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
                            style={{ marginTop: "8px" }}
                          >
                            <Grid item md={12} xs={12}>
                              <ReadOnlyTextField
                                id={"address" + idx}
                                label="Address"
                                defaultValue={addr.address_line_1}
                              />
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            spacing={3}
                            className={classes.MarginBottom}
                          >
                            <Grid item md={6} xs={12}>
                              <ReadOnlyTextField
                                id={"state" + idx}
                                label="State"
                                defaultValue={
                                  (addr.state && addr.state.name) || ""
                                }
                              />
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <ReadOnlyTextField
                                id={"district" + idx}
                                label="District"
                                defaultValue={
                                  (addr.district && addr.district.name) || ""
                                }
                              />
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <ReadOnlyTextField
                                id={"city" + idx}
                                label="City"
                                defaultValue={addr.city}
                              />
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <ReadOnlyTextField
                                id={"pincode" + idx}
                                label="Pincode"
                                defaultValue={addr.pincode}
                              />
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="dateOfBirth"
                    label="Date Of Birth"
                    defaultValue={formState.values.dataofbirth}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="gender"
                    label="Gender"
                    defaultValue={formState.values.gender}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="contact"
                    label="Contact"
                    defaultValue={formState.values.contact}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="physicallyHandicapped"
                    label="Physically Handicapped"
                    defaultValue={
                      formState.values.physicallyHandicapped !== undefined &&
                      formState.values.physicallyHandicapped !== null
                        ? formState.values.physicallyHandicapped
                          ? "Yes"
                          : "No"
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={12} xs={12}>
                  <ReadOnlyTextField
                    id="email"
                    label="Email"
                    defaultValue={formState.values.email}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={12} xs={12}>
                  <ReadOnlyTextField
                    id="college"
                    label="College"
                    defaultValue={formState.values.college}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="stream"
                    label="Stream"
                    defaultValue={formState.values.stream}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="rollNumber"
                    label="Enrollment Number"
                    defaultValue={formState.values.rollnumber}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={12} xs={12}>
                  <ReadOnlyTextField
                    id="futureAspirations"
                    label="Future Aspirations"
                    defaultValue={
                      formState.values.futureAspirations
                        ? formState.values.futureAspirations
                        : null
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="username"
                    label="Username"
                    defaultValue={formState.values.username}
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <Grid item xs={12} className={classes.CardActionGrid}>
            <CardActions className={classes.btnspace}>
              <Grid item xs={12}>
                <Grid item xs={12} md={6} xl={3}>
                  <Grid container spacing={3}>
                    {auth.getUserInfo().role.name === roleConstants.STUDENT ||
                    auth.getUserInfo().role.name ===
                      roleConstants.COLLEGEADMIN ? (
                      formState.fromEventStudentList ||
                      formState.fromAddStudentToRecruitmentDrive ? null : (
                        <Grid item md={2} xs={12}>
                          <YellowButton
                            type="submit"
                            color="primary"
                            variant="contained"
                            onClick={editData}
                            className={classes.submitbtn}
                          >
                            {genericConstants.EDIT_TEXT}
                          </YellowButton>
                        </Grid>
                      )
                    ) : null}
                    {auth.getUserInfo().role.name ===
                      roleConstants.MEDHAADMIN ||
                    auth.getUserInfo().role.name ===
                      roleConstants.COLLEGEADMIN ? (
                      <Grid item md={2} xs={12}>
                        <GrayButton
                          color="primary"
                          variant="contained"
                          onClick={handleClickCancel}
                          className={classes.resetbtn}
                        >
                          {genericConstants.CANCEL_BUTTON_TEXT}
                        </GrayButton>
                      </Grid>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            </CardActions>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StudentProfile;
