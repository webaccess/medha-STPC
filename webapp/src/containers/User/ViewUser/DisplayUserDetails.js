import React, { useState, useEffect } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Auth as auth, Typography } from "../../../components";
import { Card, CardContent, CardActions, Grid } from "@material-ui/core";
import useStyles from "../DisplayUserDetailsStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import { YellowButton, GrayButton } from "../../../components";

const USER_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;

const DisplayUserDetails = props => {
  const classes = useStyles();
  const history = useHistory();

  const [formState, setFormState] = useState({
    userDetails: []
  });
  console.log("userdetails", formState.userDetails);
  useEffect(() => {
    getUserData();
  }, []);

  console.log("fetched", props["location"]["dataForEdit"]);
  const getUserData = async () => {
    let paramsForUser;

    if (auth.getUserInfo().role.name === "Medha Admin") {
      paramsForUser = {
        id: props["location"]["dataForEdit"]
      };
    }
    if (paramsForUser.id !== undefined) {
      await serviceProviders
        .serviceProviderForGetRequest(USER_URL, paramsForUser)
        .then(res => {
          setFormState(formState => ({
            ...formState,
            userDetails: res.data.result[0]
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
  };

  const editData = () => {
    history.push({
      pathname: routeConstants.EDIT_USER,
      editCollege: true,
      dataForEdit: formState.userDetails
    });
  };

  return (
    <Grid>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          View User
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.formgrid}>
        <Grid className={classes.root} variant="outlined">
          <CardContent>
            <Grid container spacing={3} className={classes.formgrid}>
              <Grid item md={12} xs={12}>
                {formState.userDetails ? (
                  <form>
                    <Card>
                      <CardContent className={classes.Cardtheming}>
                        <Grid
                          className={classes.filterOptions}
                          container
                          spacing={1}
                        >
                          <Grid md={1} className={classes.labelside}>
                            <Typography>First Name:</Typography>
                          </Grid>
                          <Grid md={3}>
                            <Typography>
                              {formState.userDetails.first_name}
                            </Typography>
                          </Grid>
                          <Grid md={1} className={classes.labelside}>
                            <Typography>Last Name:</Typography>
                          </Grid>
                          <Grid md={3}>
                            <Typography>
                              {formState.userDetails.last_name}
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
                          <Grid md={1} className={classes.labelside}>
                            <Typography>User Name:</Typography>
                          </Grid>
                          <Grid md={3}>
                            <Typography>
                              {formState.userDetails.username}
                            </Typography>
                          </Grid>
                          <Grid md={1} className={classes.labelside}>
                            <Typography>Email:</Typography>
                          </Grid>
                          <Grid md={3}>
                            <Typography>
                              {formState.userDetails.email}
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
                          <Grid md={1} className={classes.labelside}>
                            <Typography className={classes.right}>
                              Contact
                            </Typography>
                          </Grid>
                          <Grid md={3}>
                            <Typography>
                              {formState.userDetails.contact_number}
                            </Typography>
                          </Grid>

                          <Grid md={1} className={classes.labelside}>
                            <Typography className={classes.right}>
                              Role:
                            </Typography>
                          </Grid>
                          <Grid md={3}>
                            <Typography className={classes.right}>
                              {formState.userDetails.role &&
                                formState.userDetails.role.name}
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
                          <Grid md={1} className={classes.labelside}>
                            <Typography>State:</Typography>
                          </Grid>
                          <Grid md={3}>
                            <Typography>
                              {formState.userDetails.state &&
                                formState.userDetails.state.name}
                            </Typography>
                          </Grid>
                          <Grid md={1} className={classes.labelside}>
                            <Typography>Zone:</Typography>
                          </Grid>
                          <Grid md={3}>
                            <Typography className={classes.right}>
                              {formState.userDetails.zone &&
                                formState.userDetails.zone.name}
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
                          <Grid md={1} className={classes.labelside}>
                            <Typography>RPC:</Typography>
                          </Grid>
                          <Grid md={3}>
                            <Typography>
                              {formState.userDetails.rpc &&
                                formState.userDetails.rpc.name}
                            </Typography>
                          </Grid>
                          <Grid md={1} className={classes.labelside}>
                            <Typography>College:</Typography>
                          </Grid>
                          <Grid md={3}>
                            <Typography className={classes.right}>
                              {formState.userDetails.college &&
                                formState.userDetails.college.name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions className={classes.btnspace}>
                        {/* <YellowButton
                          type="submit"
                          color="primary"
                          variant="contained"
                          onClick={editData}
                          className={classes.submitbtn}
                        >
                          Edit
                        </YellowButton> */}
                        <GrayButton
                          color="primary"
                          variant="contained"
                          to={routeConstants.VIEW_USER}
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
export default DisplayUserDetails;
