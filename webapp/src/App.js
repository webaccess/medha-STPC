import React, { Component } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/AuthRoute/PrivateRoute";
import Dashboard from "./containers/Dashboard/Dashboard";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import LoginRoute from "./components/AuthRoute/LoginRoute";
import ForgotPasswordRoute from "./components/AuthRoute/ForgotPasswordRoute";
import Logout from "./components/Logout/Logout";
import * as routeConstants from "./components/Constants/RouteConstants";
import AddUser from "./containers/AddUser/AddUser";
import AddRpc from "./containers/RPC/AddRpc";
import ViewRpc from "./containers/RPC/ViewRpc";
import AddStates from "./containers/State/AddState";
import ViewStates from "./containers/State/ViewStates";
import AddZone from "./containers/Zone/AddZone";
import ViewZone from "./containers/Zone/ViewZone";
import Layout from "./hoc/Layout/Layout";
import RouteWithLayout from "./components/AuthRoute/RouteWithLayout";
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
              />
              <Route
                path={routeConstants.NOT_FOUND_URL}
                component={NotFoundPage}
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
              <Route path="*" component={NotFoundPage} />
            </Switch>
          </div>
        </Router>
      </ThemeProvider>
    );
  }
}
export default App;
