import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Auth as auth, Typography } from "../../../components";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  InputLabel,
  Backdrop,
  CircularProgress
} from "@material-ui/core";
import useStyles from "./DisplayCollegeDetailsStyle";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import {
  YellowButton,
  GrayButton,
  ReadOnlyTextField
} from "../../../components";
import * as genericConstants from "../../../constants/GenericConstants";

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
const Streams = "Stream";
const Strength = "Strength";
const StreamNotPresent = "Stream and data not present";

const DisplayCollegeDetails = props => {
  const history = useHistory();
  const classes = useStyles();
  const COLLEGE_URL =
    strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_COLLEGES;
  const ZONE_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_ZONES;
  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = useState({
    collegeDetails: [],
    streams: []
  });
  useEffect(() => {
    getCollegeData();
  }, []);

  async function getCollegeData() {
    let paramsForCollege;
    if (auth.getUserInfo().role.name === "College Admin") {
      paramsForCollege = {
        id: auth.getUserInfo().college.id
      };
    } else if (auth.getUserInfo().role.name === "Medha Admin") {
      paramsForCollege = {
        id: props["location"]["dataForEdit"]
      };
    }
    if (paramsForCollege.id !== undefined) {
      setOpen(true);
      await serviceProviders
        .serviceProviderForGetRequest(COLLEGE_URL, paramsForCollege)
        .then(res => {
          let viewData = res.data.result[0];
          setFormState(formState => ({
            ...formState,
            collegeDetails: viewData
          }));
          setOpen(false);
        })
        .catch(error => {
          console.log("error", error);
          setOpen(false);
        });
    } else {
      history.push({
        pathname: routeConstants.VIEW_COLLEGE
      });
    }
  }

  const editData = () => {
    history.push({
      pathname: routeConstants.EDIT_COLLEGE,
      editCollege: true,
      dataForEdit: formState.collegeDetails
    });
  };

  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.VIEW_COLLEGE_TEXT}
        </Typography>
      </Grid>
      <Grid spacing={3}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
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
                    defaultValue={formState.collegeDetails.college_email}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="State"
                    label={State}
                    defaultValue={
                      formState.collegeDetails.state &&
                      formState.collegeDetails.state.name
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
                      formState.collegeDetails.district &&
                      formState.collegeDetails.district.name
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={12} xs={12}>
                  <ReadOnlyTextField
                    id="CollegeAddress"
                    label={CollegeAddress}
                    defaultValue={formState.collegeDetails.address}
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
                    defaultValue={formState.collegeDetails.contact_number}
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
                <Grid item md={6} xs={12}></Grid>
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
                          <div>
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
            <Backdrop className={classes.backdrop} open={open}>
              <CircularProgress color="inherit" />
            </Backdrop>
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
              {auth.getUserInfo().role.name !== "College Admin" ? (
                <GrayButton
                  color="primary"
                  variant="contained"
                  to={routeConstants.VIEW_COLLEGE}
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
export default DisplayCollegeDetails;
