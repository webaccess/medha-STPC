/**
 *
 * PrivateRoute
 * Higher Order Component that blocks navigation when the user is not logged in
 * and redirect the user to login page
 *
 * Wrap your protected routes to secure your container
 */

import React from "../../node_modules/react";
import { Redirect, Route } from "../../node_modules/react-router-dom";
import * as routeConstants from "../constants/RouteConstants";

import auth from "../components/Auth/Auth";

const defaultRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.getToken() !== null ? (
        <Redirect
          to={{
            pathname: routeConstants.DASHBOARD_URL,
            state: { from: props.location }
          }}
        />
      ) : (
        <Redirect
          to={{
            pathname: routeConstants.SIGN_IN_URL,
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default defaultRoute;
