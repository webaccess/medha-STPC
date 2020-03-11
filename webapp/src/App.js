import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { NotFoundPage, Logout } from "./components";

import * as routeConstants from "./constants/RouteConstants";
import {
  LoginRoute,
  ForgotPasswordRoute,
  RouteWithLayout,
  PrivateRoute
} from "./authroute";

import Dashboard from "./containers/Dashboard/Dashboard";
import AddEditCollege from "./containers/College/AddEditCollege/AddEditCollege";
import ViewCollege from "./containers/College/ManageCollege/ManageCollege";
import AddUser from "./containers/User/AddUser/AddUser";
import ViewUsers from "./containers/User/ViewUser/ViewUser";
import AddRpc from "./containers/RPC/AddRpc/AddRpc";
import ViewRpc from "./containers/RPC/ViewRpc/ViewRpc";
import AddStates from "./containers/State/AddState/AddState";
import ViewStates from "./containers/State/ViewState/ViewState";
import AddZone from "./containers/Zone/AddZone/AddZone";
import ViewZone from "./containers/Zone/ViewZone/ViewZone";
import Layout from "./hoc/Layout/Layout";

import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import Registration from "./containers/Registration/Registration";
import RequestOtp from "./containers/OTP/Requestotp";
import VerifyOtp from "./containers/OTP/Verifyotp";
import EditCollegeRoute from "./authroute/EditCollegeRoute";
import Registered from "../src/containers/Registration/Registered.js";

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router>
          <div>
            <Switch>
              <PrivateRoute
                path={routeConstants.DASHBOARD_URL}
                component={Dashboard}
                exact
              />
              <LoginRoute
                path={routeConstants.SIGN_IN_URL}
                exact
                type={"login"}
                layout={Layout}
              />
              <Route
                path={routeConstants.LOGOUT_URL}
                component={Logout}
                exact
              />
              <Registered
                path={routeConstants.REGISTERED}
                layout={Layout}
                exact
              />
              <Registration
                path={routeConstants.NEW_REGISTRATION_URL}
                layout={Layout}
                exact
              />

              <RequestOtp
                path={routeConstants.REQUEST_OTP}
                layout={Layout}
                exact
              />

              <VerifyOtp
                path={routeConstants.VERIFY_OTP}
                layout={Layout}
                exact
              />

              <ForgotPasswordRoute
                path={routeConstants.FORGOT_PASSWORD_URL}
                exact
                type={"forgot-password"}
                layout={Layout}
              />
              <Route
                path={routeConstants.NOT_FOUND_URL}
                component={NotFoundPage}
                exact
              />
              <RouteWithLayout
                component={AddUser}
                exact
                layout={Layout}
                path={routeConstants.ADD_USER}
              />
              <RouteWithLayout
                component={ViewStates}
                exact
                layout={Layout}
                path={routeConstants.VIEW_STATES}
              />
              <RouteWithLayout
                component={ViewZone}
                exact
                layout={Layout}
                path={routeConstants.VIEW_ZONES}
              />
              <RouteWithLayout
                component={ViewRpc}
                exact
                layout={Layout}
                path={routeConstants.VIEW_RPC}
              />
              <RouteWithLayout
                component={AddStates}
                exact
                layout={Layout}
                path={routeConstants.ADD_STATES}
              />
              <RouteWithLayout
                component={AddRpc}
                exact
                layout={Layout}
                path={routeConstants.ADD_RPC}
              />
              <RouteWithLayout
                component={AddZone}
                exact
                layout={Layout}
                path={routeConstants.ADD_ZONES}
              />
              {/** College */}
              {/** Add College */}
              <RouteWithLayout
                component={AddEditCollege}
                exact
                layout={Layout}
                path={routeConstants.ADD_COLLEGE}
              />
              {/** Edit College */}
              <RouteWithLayout
                component={EditCollegeRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_COLLEGE}
              />
              <RouteWithLayout
                component={ViewCollege}
                exact
                layout={Layout}
                path={routeConstants.VIEW_COLLEGE}
              />
              <RouteWithLayout
                component={ViewUsers}
                exact
                layout={Layout}
                path={routeConstants.VIEW_USER}
              />
              <Route path="*" component={NotFoundPage} />
            </Switch>
          </div>
        </Router>
      </ThemeProvider>
    );
  }
}
export default App;
