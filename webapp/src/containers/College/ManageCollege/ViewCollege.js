import React, { useState, useEffect, useContext } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import { Auth as auth, Typography, Alert } from "../../../components";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from "@material-ui/core/FormControl";
import CloseIcon from "@material-ui/icons/Close";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  InputLabel,
  Collapse,
  IconButton
} from "@material-ui/core";
import useStyles from "../../ContainerStyles/ViewPageStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import {
  YellowButton,
  GrayButton,
  ReadOnlyTextField
} from "../../../components";
import * as genericConstants from "../../../constants/GenericConstants";
import LoaderContext from "../../../context/LoaderContext";

const CollegeName = "College name";
const CollegeCode = "College code";
const CollegeAddress = "College address";
const District = "District";
const State = "State";
const RPCName = "RPC";
const Zone = "Zone";
const ContactNumber = "Contact";
const Email = "Email-Id";
const Principal = "Principal";
const Block = "Blocked";
const StreamNotPresent = "Stream and data not present";

const ViewCollege = props => {
  const [open, setOpen] = useState(true);
  const history = useHistory();
  const classes = useStyles();
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);

  const [formState, setFormState] = useState({
    collegeDetails: [],
    streams: [],
    tpoData: [],
    /** This is when we return from edit page */
    isDataEdited: props["location"]["fromeditCollege"]
      ? props["location"]["isDataEdited"]
      : false,

    fromeditCollege: props["location"]["fromeditCollege"]
      ? props["location"]["fromeditCollege"]
      : false,
    editedCollegeName: props["location"]["editedCollegeData"]
      ? props["location"]["editedCollegeData"]["name"]
      : ""
  });

  useEffect(() => {
    getCollegeData();
  }, []);

  async function getCollegeData() {
    setLoaderStatus(true);
    const studentInfo =
      auth.getUserInfo() !== null &&
      auth.getUserInfo().role.name === roleConstants.COLLEGEADMIN &&
      auth.getUserInfo().studentInfo &&
      auth.getUserInfo().studentInfo.organization &&
      auth.getUserInfo().studentInfo.organization.id
        ? auth.getUserInfo().studentInfo.organization.id
        : auth.getUserInfo() !== null &&
          auth.getUserInfo().role.name === roleConstants.MEDHAADMIN
        ? props["location"]["dataForEdit"]
        : null;

    if (studentInfo !== undefined) {
      let COLLEGE_URL =
        strapiConstants.STRAPI_DB_URL +
        strapiConstants.STRAPI_COLLEGES +
        "/" +
        studentInfo;
      await serviceProviders
        .serviceProviderForGetRequest(COLLEGE_URL)
        .then(res => {
          let viewData = res.data.result;
          let dataConverter = [];
          dataConverter = convertStudentData(viewData.tpos);
          setFormState(formState => ({
            ...formState,
            collegeDetails: viewData,
            tpoData: dataConverter
          }));
        })
        .catch(error => {
          console.log("error", error);
        });
    } else {
      history.push({
        pathname: routeConstants.MANAGE_COLLEGE
      });
    }
    setLoaderStatus(false);
  }

  const convertStudentData = data => {
    let collegeDataArray = [];
    for (let i in data) {
      var tempIndividualStudentData = {};
      tempIndividualStudentData["TPO"] = data[i] ? data[i]["username"] : "";
      collegeDataArray.push(tempIndividualStudentData);
    }
    return collegeDataArray;
  };

  const editData = () => {
    setLoaderStatus(true);
    history.push({
      pathname: routeConstants.EDIT_COLLEGE,
      editCollege: true,
      dataForEdit: formState.collegeDetails
    });
    setLoaderStatus(false);
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.VIEW_COLLEGE_TEXT}
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        {/** Error/Success messages to be shown for edit */}
        {formState.fromeditCollege && formState.isDataEdited ? (
          <Collapse in={open}>
            <Alert
              severity="success"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              College {formState.editedCollegeName} has been updated
              successfully.
            </Alert>
          </Collapse>
        ) : null}
        {formState.fromeditCollege && !formState.isDataEdited ? (
          <Collapse in={open}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              An error has occured while updating college. Kindly, try again.
            </Alert>
          </Collapse>
        ) : null}
      </Grid>
      <Grid spacing={3}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={12} xs={12}>
                  <ReadOnlyTextField
                    id="CollegeName"
                    label={CollegeName}
                    defaultValue={formState.collegeDetails.name}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="CollegeCode"
                    label={CollegeCode}
                    defaultValue={formState.collegeDetails.college_code}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={12} xs={12}>
                  <ReadOnlyTextField
                    id="Email"
                    label={Email}
                    defaultValue={
                      formState.collegeDetails.length !== 0
                        ? formState.collegeDetails.contact.email
                        : ""
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="State"
                    label={State}
                    defaultValue={
                      formState.collegeDetails.length !== 0
                        ? formState.collegeDetails.contact.state &&
                          formState.collegeDetails.contact.state.name
                        : ""
                    }
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="Zone"
                    label={Zone}
                    defaultValue={
                      formState.collegeDetails.zone &&
                      formState.collegeDetails.zone.name
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="RPCName"
                    label={RPCName}
                    defaultValue={
                      formState.collegeDetails.rpc &&
                      formState.collegeDetails.rpc.name
                    }
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="District"
                    label={District}
                    defaultValue={
                      formState.collegeDetails.length !== 0
                        ? formState.collegeDetails.contact.district &&
                          formState.collegeDetails.contact.district.name
                        : ""
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={12} xs={12}>
                  <ReadOnlyTextField
                    id="CollegeAddress"
                    label={CollegeAddress}
                    defaultValue={
                      formState.collegeDetails.length !== 0
                        ? formState.collegeDetails.contact.address_1
                        : ""
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="ContactNumber"
                    label={ContactNumber}
                    defaultValue={
                      formState.collegeDetails.length !== 0
                        ? formState.collegeDetails.contact.phone
                        : ""
                    }
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="Principal"
                    label={Principal}
                    defaultValue={
                      formState.collegeDetails.principal &&
                      formState.collegeDetails.principal.username
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={12} xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    id="fixed-tags-demo"
                    options={[]}
                    getOptionLabel={option => option.TPO}
                    value={formState.tpoData}
                    disableClearable
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option.TPO}
                          {...getTagProps({ index })}
                          disabled
                        />
                      ))
                    }
                    renderInput={params => (
                      <TextField {...params} label="TPOs" variant="outlined" />
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}></Grid>
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
                      className={classes.CssLabelStyling}
                    >
                      {genericConstants.STREAMS_OFFERED_TEXT}
                    </InputLabel>
                    {formState.collegeDetails.stream_strength ? (
                      <Card
                        id="outlined-stream-card"
                        fullwidth={true.toString()}
                        className={classes.streamcardcontent}
                      >
                        {formState.collegeDetails.stream_strength.map(value => (
                          <div key={value.id}>
                            <CardContent>
                              <Grid container spacing={1}>
                                <Grid item xs={6}>
                                  <ReadOnlyTextField
                                    id={"stream-" + value.stream.name}
                                    label="Stream"
                                    defaultValue={value.stream.name}
                                  />
                                </Grid>

                                <Grid item xs={6}>
                                  <ReadOnlyTextField
                                    id={"trength" + value.strength}
                                    label="Strength"
                                    defaultValue={value.strength}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                            <Divider className={classes.divider} />
                          </div>
                        ))}
                      </Card>
                    ) : (
                      <p>{StreamNotPresent}</p>
                    )}
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
                onClick={editData}
                className={classes.submitbtn}
              >
                {genericConstants.EDIT_TEXT}
              </YellowButton>
              {auth.getUserInfo().role.name !== roleConstants.COLLEGEADMIN ? (
                <GrayButton
                  color="primary"
                  variant="contained"
                  to={routeConstants.MANAGE_COLLEGE}
                  className={classes.resetbtn}
                >
                  {genericConstants.CANCEL_BUTTON_TEXT}
                </GrayButton>
              ) : null}
            </CardActions>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};
export default ViewCollege;
