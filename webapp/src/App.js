import React, { Component } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/AuthRoute/PrivateRoute";
import Dashboard from "./containers/Dashboard/Dashboard";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import LoginRoute from "./components/AuthRoute/LoginRoute";
import ForgotPasswordRoute from "./components/AuthRoute/ForgotPasswordRoute";
import Logout from "./components/Logout/Logout";
import * as routeConstants from "./components/Constants/RouteConstants";

class App extends Component {
  render() {
    return (
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
            <Route path={routeConstants.LOGOUT_URL} component={Logout} exact />
            <ForgotPasswordRoute
              path={routeConstants.FORGOT_PASSWORD_URL}
              exact
              type={"forgot-password"}
            />
            <Route
              path={routeConstants.NOT_FOUND_URL}
              component={NotFoundPage}
            />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;
