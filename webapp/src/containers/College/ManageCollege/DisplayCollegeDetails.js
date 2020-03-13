import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Auth as auth, Typography } from "../../../components";
import { Card, CardContent, CardActions, Grid } from "@material-ui/core";
import useStyles from "./DisplayCollegeDetailsStyle";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import { YellowButton, GrayButton } from "../../../components";

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
          if (
            viewData.hasOwnProperty("rpc") &&
            viewData["rpc"].hasOwnProperty("zone") &&
            viewData["rpc"]["zone"] !== null
          ) {
            let paramsForZones = {
              id: viewData["rpc"]["zone"]
            };
            serviceProviders
              .serviceProviderForGetRequest(ZONE_URL, paramsForZones)
              .then(res => {
                viewData["zone"] = res.data.result[0];
                viewData["state"] = res.data.result[0].state;
                setFormState(formState => ({
                  ...formState,
                  collegeDetails: viewData
                }));
                for (var i in viewData.stream_strength) {
                  formState.streams.push(viewData.stream_strength[i]);
                }
              })
              .catch(error => {
                console.log("zoneerror", error);
              });
          }
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
                          <Grid md={6}>
                            <Typography>
                              College name:{formState.collegeDetails.name}
                            </Typography>
                          </Grid>
                          <Grid md={6}>
                            <Typography className={classes.right}>
                              College code:
                              {formState.collegeDetails.college_code}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardContent>
                        <Grid md={12}>
                          <Typography>
                            College address:{formState.collegeDetails.address}
                          </Typography>
                        </Grid>
                      </CardContent>
                      <CardContent>
                        <Typography>
                          District:
                          {formState.collegeDetails.district &&
                            formState.collegeDetails.district.name}
                        </Typography>
                        <Typography>
                          State:
                          {formState.collegeDetails.state &&
                            formState.collegeDetails.state.name}
                        </Typography>
                      </CardContent>
                      <CardContent>
                        <Typography>
                          RPC Name:
                          {formState.collegeDetails.rpc &&
                            formState.collegeDetails.rpc.name}
                        </Typography>
                        <Typography>
                          Zone Name:
                          {formState.collegeDetails.zone &&
                            formState.collegeDetails.zone.name}
                        </Typography>
                      </CardContent>

                      <CardContent>
                        <Typography>
                          Contact number:
                          {formState.collegeDetails.contact_number}
                        </Typography>
                        <Typography>
                          Email-Id:{formState.collegeDetails.college_email}
                        </Typography>
                      </CardContent>
                      <CardContent>
                        <Typography>
                          Principal:
                          {formState.collegeDetails.principal &&
                            formState.collegeDetails.principal.username}
                        </Typography>
                      </CardContent>
                      {formState.collegeDetails.stream_strength ? (
                        <CardContent>
                          {formState.collegeDetails.stream_strength.map(
                            value => (
                              <CardContent>
                                <Typography key={value.id}>
                                  Stream : {value.stream.name}
                                  Strength {value.strength}
                                </Typography>
                              </CardContent>
                            )
                          )}
                        </CardContent>
                      ) : (
                        <p>Stream and data not present</p>
                      )}
                      <CardActions className={classes.btnspace}>
                        <YellowButton
                          type="submit"
                          color="primary"
                          variant="contained"
                          onClick={editData}
                          className={classes.submitbtn}
                        >
                          Edit
                        </YellowButton>
                        <GrayButton
                          color="primary"
                          variant="contained"
                          to={routeConstants.VIEW_COLLEGE}
                          className={classes.resetbtn}
                        >
                          Cancel
                        </GrayButton>
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
