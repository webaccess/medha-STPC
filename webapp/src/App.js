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
import AddCollege from "./containers/College/AddCollege";
import ViewCollege from "./containers/College/ManageCollege";
import AddUser from "./containers/User/AddUser/AddUser";
import AddRpc from "./containers/RPC/AddRpc/AddRpc";
import ViewRpc from "./containers/RPC/ViewRpc/ViewRpc";
import AddStates from "./containers/State/AddState/AddState";
import ViewStates from "./containers/State/ViewStates/ViewStates";
import AddZone from "./containers/Zone/AddZone/AddZone";
import ViewZone from "./containers/Zone/ViewZone/ViewZone";
import Layout from "./hoc/Layout/Layout";

import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";

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
              <RouteWithLayout
                component={AddCollege}
                exact
                layout={Layout}
                path={routeConstants.ADD_COLLEGE}
              />
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
