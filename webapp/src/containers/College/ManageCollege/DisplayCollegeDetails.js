import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Auth as auth, Typography } from "../../../components";
import { Card, CardContent, CardActions, Grid } from "@material-ui/core";
import useStyles from "./DisplayCollegeDetailsStyle";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import { YellowButton, GrayButton } from "../../../components";
import * as genericConstants from "../../../constants/GenericConstants";

const CollegeName = "College name";
const CollegeCode = "College code";
const CollegeAddress = "College address";
const District = "District";
const State = "State";
const RPCName = "RPC Name";
const Zone = "Zone Name";
const ContactNumber = "Contact Number";
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
      await serviceProviders
        .serviceProviderForGetRequest(COLLEGE_URL, paramsForCollege)
        .then(res => {
          let viewData = res.data.result[0];
          setFormState(formState => ({
            ...formState,
            collegeDetails: viewData
          }));
        })
        .catch(error => {
          console.log("error", error);
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
          View College
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Grid className={classes.root} variant="outlined">
          <CardContent>
            <Grid container spacing={3} className={classes.formgrid}>
              <Grid item md={12} xs={12}>
                {formState.collegeDetails ? (
                  <form>
                    <Card>
                      <CardContent className={classes.Cardtheming}>
                        <Grid
                          className={classes.filterOptions}
                          container
                          spacing={1}
                        >
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelside}>
                            <Typography>{CollegeName}</Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelcontent}>
                            <Typography>
                              {formState.collegeDetails.name}
                            </Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelside}>
                            <Typography>{CollegeCode}:</Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelcontent}>
                            <Typography>
        
                              {formState.collegeDetails.college_code}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>

                      <CardContent className={classes.Cardtheming}>
                        <Grid
                          className={classes.filterOptions}
                          container
                          spacing={1}
                        >
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelside}>
                            <Typography> {CollegeAddress}:</Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelcontent}>
                            <Typography>
                              {formState.collegeDetails.address}
                            </Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelside}>
                            <Typography>{District}:</Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelcontent}>
                            <Typography>
                              {formState.collegeDetails.district &&
                                formState.collegeDetails.district.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>

                      <CardContent className={classes.Cardtheming}>
                        <Grid
                          className={classes.filterOptions}
                          container
                          spacing={1}
                        >
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelside}>
                            <Typography>{State}:</Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelcontent}>
                            <Typography>
                              {formState.collegeDetails.state &&
                                formState.collegeDetails.state.name}
                            </Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelside}>
                            <Typography> {RPCName}:</Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelcontent}>
                            <Typography>
                              {formState.collegeDetails.rpc &&
                                formState.collegeDetails.rpc.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>

                      <CardContent className={classes.Cardtheming}>
                        <Grid
                          className={classes.filterOptions}
                          container
                          spacing={1}
                        >
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelside}>
                            <Typography> {Zone}:</Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelcontent}>
                            <Typography>
                              {formState.collegeDetails.zone &&
                                formState.collegeDetails.zone.name}
                            </Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelside}>
                            <Typography> {ContactNumber}:</Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelcontent}>
                            <Typography>
                              {formState.collegeDetails.contact_number}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>

                      <CardContent className={classes.Cardtheming}>
                        <Grid
                          className={classes.filterOptions}
                          container
                          spacing={1}
                        >
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelside}>
                            <Typography> {Email}:</Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelcontent}>
                            <Typography>
                              {formState.collegeDetails.college_email}
                            </Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelside}>
                            <Typography> {Principal}:</Typography>
                          </Grid>
                          <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelcontent}>
                            <Typography>
                              {formState.collegeDetails.principal &&
                                formState.collegeDetails.principal.username}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>

                      {formState.collegeDetails.stream_strength ? (
                        <CardContent className={classes.Cardtheming}>
                          <Grid
                            className={classes.filterOptions}
                            container
                            spacing={1}
                          >
                            <Grid md={9} className={classes.labelside}>
                              <Typography> Stream And Strength : </Typography>
                            </Grid>
                          </Grid>
                          {formState.collegeDetails.stream_strength.map(
                            value => (
                              <CardContent className={classes.Cardthemingstream}>
                                <Grid
                                  className={classes.filterOptions}
                                  container
                                >
                                  <Grid md={1} className={classes.labelside}>
                                    <Typography> {Streams}:</Typography>
                                  </Grid>
                                  <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelcontent}>
                                    <Typography>{value.stream.name}</Typography>
                                  </Grid>
                                  <Grid md={1} className={classes.labelside}>
                                    <Typography> {Strength}:</Typography>
                                  </Grid>
                                  <Grid md={2} sm={6} xl={12} xs={12} className={classes.labelcontent}>
                                    <Typography>{value.strength}</Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            )
                          )}
                        </CardContent>
                      ) : (
                        <p>{StreamNotPresent}</p>
                      )}
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
                    </Card>
                  </form>
                ) : null}
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default DisplayCollegeDetails;
