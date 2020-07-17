import React, { useState, useEffect, useContext } from "react";
import * as serviceProviders from "../../../api/Axios";
import * as strapiConstants from "../../../constants/StrapiApiConstants";
import { Auth as auth, Typography } from "../../../components";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Backdrop,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import useStyles from "../../ContainerStyles/ViewPageStyles";
import { useHistory } from "react-router-dom";
import * as routeConstants from "../../../constants/RouteConstants";
import * as roleConstants from "../../../constants/RoleConstants";
import {
  YellowButton,
  GrayButton,
  ReadOnlyTextField
} from "../../../components";
import * as genericConstants from "../../../constants/GenericConstants";
import LoaderContext from "../../../context/LoaderContext";

const USER_URL =
  strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_VIEW_USERS;

const ViewUser = props => {
  const classes = useStyles();
  const history = useHistory();
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);
  const [isDisable, setIsDisable] = useState(false);

  const [formState, setFormState] = useState({
    userDetails: []
  });
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    setLoaderStatus(true);
    let paramsForUser;

    if (auth.getUserInfo().role.name === roleConstants.MEDHAADMIN) {
      paramsForUser = props["location"]["dataForEdit"];
    }
    let VIEW_USER_URL = USER_URL + "/" + paramsForUser;
    if (paramsForUser !== undefined) {
      await serviceProviders
        .serviceProviderForGetRequest(VIEW_USER_URL)
        .then(res => {
          if (
            res.data.result.contact.user.role.name === roleConstants.STUDENT
          ) {
            setIsDisable(true);
          } else {
            setIsDisable(false);
          }
          setFormState(formState => ({
            ...formState,
            userDetails: res.data.result
          }));
        })
        .catch(error => {
          console.log("error", error);
        });
    } else {
      history.push({
        pathname: routeConstants.MANAGE_USER
      });
    }
    setLoaderStatus(false);
  };

  const editData = () => {
    getDataForEdit(props["location"]["dataForEdit"]);
  };

  const getDataForEdit = async id => {
    setLoaderStatus(true);
    let EDIT_USER_URL = USER_URL + "/" + id;
    await serviceProviders
      .serviceProviderForGetRequest(EDIT_USER_URL)
      .then(res => {
        let editData = res.data.result;
        /** move to edit page */
        history.push({
          pathname: routeConstants.EDIT_USER,
          editUser: true,
          dataForEdit: editData
        });
      })
      .catch(error => {
        console.log("error");
      });
    setLoaderStatus(false);
  };
  return (
    <Grid>
      <Grid item xs={12} className={classes.title}>
        <Typography variant="h4" gutterBottom>
          {genericConstants.VIEW_USER_TITLE}
        </Typography>
      </Grid>
      <Grid spacing={3}>
        <Card>
          <CardContent>
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="firstname"
                    label="First Name"
                    defaultValue={formState.userDetails.first_name}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="lastname"
                    label="Last Name"
                    defaultValue={formState.userDetails.last_name}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={12} xs={12}>
                  <ReadOnlyTextField
                    id="email"
                    label="Email"
                    defaultValue={
                      formState.userDetails.contact
                        ? formState.userDetails.contact.user
                          ? formState.userDetails.contact.user.email
                            ? formState.userDetails.contact.user.email
                            : ""
                          : ""
                        : ""
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="contact"
                    label="Contact"
                    defaultValue={
                      formState.userDetails.contact
                        ? formState.userDetails.contact.phone
                          ? formState.userDetails.contact.phone
                          : ""
                        : ""
                    }
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="role"
                    label="Role"
                    defaultValue={
                      formState.userDetails.contact
                        ? formState.userDetails.contact.user
                          ? formState.userDetails.contact.user.role
                            ? formState.userDetails.contact.user.role.name
                            : ""
                          : ""
                        : ""
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid item md={4} xs={12}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        formState.userDetails.contact
                          ? formState.userDetails.contact.user
                            ? formState.userDetails.contact.user.blocked ||
                              false
                            : ""
                          : ""
                      }
                      value={
                        formState.userDetails.contact
                          ? formState.userDetails.contact.user
                            ? formState.userDetails.contact.user.blocked
                            : ""
                          : ""
                      }
                      disabled={true}
                    />
                  }
                  label={
                    formState.userDetails.contact
                      ? formState.userDetails.contact.user
                        ? formState.userDetails.contact.user.blocked
                          ? "Blocked"
                          : "Unblocked"
                        : ""
                      : ""
                  }
                />
              </FormGroup>
            </Grid>
            <Divider className={classes.divider} />
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                {/* <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="state"
                    label="State"
                    disabled={isDisable}
                    defaultValue={
                      isDisable
                        ? null
                        : formState.userDetails.contact
                        ? formState.userDetails.contact.user
                          ? formState.userDetails.contact.user.state
                            ? formState.userDetails.contact.user.state.name
                            : ""
                          : ""
                        : ""
                    }
                  />
                </Grid> */}
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="zone"
                    label="Zone"
                    disabled={isDisable}
                    defaultValue={
                      isDisable
                        ? null
                        : formState.userDetails.contact
                        ? formState.userDetails.contact.user
                          ? formState.userDetails.contact.user.zone
                            ? formState.userDetails.contact.user.zone.name
                            : ""
                          : ""
                        : ""
                    }
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="rpc"
                    label="RPC"
                    disabled={isDisable}
                    defaultValue={
                      isDisable
                        ? null
                        : formState.userDetails.contact
                        ? formState.userDetails.contact.user
                          ? formState.userDetails.contact.user.rpc
                            ? formState.userDetails.contact.user.rpc.name
                            : ""
                          : ""
                        : ""
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="college"
                    label="College"
                    disabled={isDisable}
                    defaultValue={
                      isDisable
                        ? null
                        : formState.userDetails.organization
                        ? formState.userDetails.organization.name
                          ? formState.userDetails.organization.name
                          : ""
                        : ""
                    }
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
                    <Grid item md={2} xs={12}>
                      <YellowButton
                        type="submit"
                        color="primary"
                        variant="contained"
                        onClick={editData}
                        className={classes.submitbtn}
                      >
                        Edit
                      </YellowButton>
                    </Grid>

                    <Grid item md={2} xs={12}>
                      <GrayButton
                        color="primary"
                        variant="contained"
                        to={routeConstants.MANAGE_USER}
                        className={classes.resetbtn}
                      >
                        Cancel
                      </GrayButton>
                    </Grid>
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
export default ViewUser;
