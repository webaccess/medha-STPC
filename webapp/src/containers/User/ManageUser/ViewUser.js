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
import {
  YellowButton,
  GrayButton,
  ReadOnlyTextField
} from "../../../components";
import * as genericConstants from "../../../constants/GenericConstants";
import LoaderContext from "../../../context/LoaderContext";

const USER_URL = strapiConstants.STRAPI_DB_URL + strapiConstants.STRAPI_USERS;

const ViewUser = props => {
  const classes = useStyles();
  const history = useHistory();
  const { loaderStatus, setLoaderStatus } = useContext(LoaderContext);

  const [formState, setFormState] = useState({
    userDetails: []
  });
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    setLoaderStatus(true);
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
    let paramsForUsers = {
      id: id
    };
    await serviceProviders
      .serviceProviderForGetRequest(USER_URL, paramsForUsers)
      .then(res => {
        let editData = res.data.result[0];
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
  console.log(formState.userDetails);
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
                    defaultValue={formState.userDetails.email}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="contact"
                    label="Contact"
                    defaultValue={formState.userDetails.contact_number}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="role"
                    label="Role"
                    defaultValue={
                      formState.userDetails.role &&
                      formState.userDetails.role.name
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
                    id="username"
                    label="Username"
                    defaultValue={formState.userDetails.username}
                  />
                </Grid>
                <Grid item md={6} xs={12}></Grid>
              </Grid>
            </Grid>
            <Grid item md={4} xs={12}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formState.userDetails.blocked || false}
                      value={formState.userDetails.blocked}
                      disabled={true}
                    />
                  }
                  label={
                    formState.userDetails.blocked ? "Blocked" : "Unblocked"
                  }
                />
              </FormGroup>
            </Grid>
            <Divider className={classes.divider} />
            <Grid item xs={12} md={6} xl={3}>
              <Grid container spacing={3} className={classes.formgrid}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="state"
                    label="State"
                    defaultValue={
                      formState.userDetails.state &&
                      formState.userDetails.state.name
                    }
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="zone"
                    label="Zone"
                    defaultValue={
                      formState.userDetails.zone &&
                      formState.userDetails.zone.name
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className={classes.MarginBottom}>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="rpc"
                    label="RPC"
                    defaultValue={
                      formState.userDetails.rpc &&
                      formState.userDetails.rpc.name
                    }
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReadOnlyTextField
                    id="college"
                    label="College"
                    defaultValue={
                      formState.userDetails.college &&
                      formState.userDetails.college.name
                    }
                  />
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
                Edit
              </YellowButton>
              <GrayButton
                color="primary"
                variant="contained"
                to={routeConstants.MANAGE_USER}
                className={classes.resetbtn}
              >
                Cancel
              </GrayButton>
            </CardActions>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};
export default ViewUser;
