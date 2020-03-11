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
import AddEditRpc from "./containers/RPC/AddEditRpc/AddEditRpc";
import ViewRpc from "./containers/RPC/ViewRpc/ViewRpc";
import AddEditState from "./containers/State/AddEditState/AddEditState";
import ViewStates from "./containers/State/ViewState/ViewState";
import AddZone from "./containers/Zone/AddEditZone/AddEditZone";
import ViewZone from "./containers/Zone/ViewZone/ViewZone";
import Layout from "./hoc/Layout/Layout";

import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import EditCollegeRoute from "./authroute/EditCollegeRoute";
import EditStateRoute from "./authroute/EditStateRoute";
import EditZoneRoute from "./authroute/EditZoneRoute";
import EditRpcRoute from "./authroute/EditRpcRoute";

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
                component={ViewUsers}
                exact
                layout={Layout}
                path={routeConstants.VIEW_USER}
              />
              {/** State */}
              {/** Add Edit State */}
              <RouteWithLayout
                component={AddEditState}
                exact
                layout={Layout}
                path={routeConstants.ADD_STATES}
              />
              {/** Edit State Route */}
              <RouteWithLayout
                component={EditStateRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_STATE}
              />
              <RouteWithLayout
                component={ViewStates}
                exact
                layout={Layout}
                path={routeConstants.VIEW_STATES}
              />
              {/** Rpc */}
              <RouteWithLayout
                component={AddEditRpc}
                exact
                layout={Layout}
                path={routeConstants.ADD_RPC}
              />
              <RouteWithLayout
                component={ViewRpc}
                exact
                layout={Layout}
                path={routeConstants.VIEW_RPC}
              />
              <RouteWithLayout
                component={EditRpcRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_RPC}
              />

              {/** Zone */}
              <RouteWithLayout
                component={AddZone}
                exact
                layout={Layout}
                path={routeConstants.ADD_ZONES}
              />
              <RouteWithLayout
                component={ViewZone}
                exact
                layout={Layout}
                path={routeConstants.VIEW_ZONES}
              />
              <RouteWithLayout
                component={EditZoneRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_ZONES}
              />

              {/** College */}
              {/** Add College */}
              <RouteWithLayout
                component={AddEditCollege}
                exact
                layout={Layout}
                path={routeConstants.ADD_COLLEGE}
              />
              {/** Edit College Route */}
              <RouteWithLayout
                component={EditCollegeRoute}
                exact
                layout={Layout}
                path={routeConstants.EDIT_COLLEGE}
              />
              {/** View College */}
              <RouteWithLayout
                component={ViewCollege}
                exact
                layout={Layout}
                path={routeConstants.VIEW_COLLEGE}
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
