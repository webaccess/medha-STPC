/**
 *
 * PrivateRoute
 * Higher Order Component that blocks navigation when the user is not logged in
 * and redirect the user to login page
 *
 * Wrap your protected routes to secure your container
 */

import React from "react";
import { Redirect, Route } from "react-router-dom";
import * as routeConstants from "../Constants/RouteConstants";

import auth from "../Auth/Auth";

const privateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.getToken() !== null ? (
        <Component {...props} />
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

export default privateRoute;
