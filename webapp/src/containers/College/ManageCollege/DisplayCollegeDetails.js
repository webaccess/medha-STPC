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
                          <Grid md={1} className={classes.labelside}>
                            <Typography>{CollegeName}</Typography>
                          </Grid>
                          <Grid md={3}>
                            <Typography>
                              {formState.collegeDetails.name}
                            </Typography>
                          </Grid>
                          <Grid md={1} className={classes.labelside}>
                            <Typography >
                              {CollegeCode}:
                            </Typography>
                          </Grid>
                          <Grid md={3}>
                          <Typography >
                              {CollegeCode}:
                              {formState.collegeDetails.college_code}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardContent>
                        <Grid md={12}>
                          <Typography>
                            {CollegeAddress}:{formState.collegeDetails.address}
                          </Typography>
                        </Grid>
                      </CardContent>
                      <CardContent>
                        <Typography>
                          {District}:
                          {formState.collegeDetails.district &&
                            formState.collegeDetails.district.name}
                        </Typography>
                        <Typography>
                          {State}:
                          {formState.collegeDetails.state &&
                            formState.collegeDetails.state.name}
                        </Typography>
                      </CardContent>
                      <CardContent>
                        <Typography>
                          {RPCName}:
                          {formState.collegeDetails.rpc &&
                            formState.collegeDetails.rpc.name}
                        </Typography>
                        <Typography>
                          {Zone}:
                          {formState.collegeDetails.zone &&
                            formState.collegeDetails.zone.name}
                        </Typography>
                      </CardContent>

                      <CardContent>
                        <Typography>
                          {ContactNumber}:
                          {formState.collegeDetails.contact_number}
                        </Typography>
                        <Typography>
                          {Email}:{formState.collegeDetails.college_email}
                        </Typography>
                      </CardContent>
                      <CardContent>
                        <Typography>
                          {Principal}:
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
                                  {Streams} : {value.stream.name}
                                  {Strength} {value.strength}
                                </Typography>
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
                        <GrayButton
                          color="primary"
                          variant="contained"
                          to={routeConstants.VIEW_COLLEGE}
                          className={classes.resetbtn}
                        >
                          {genericConstants.CANCEL_BUTTON_TEXT}
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
