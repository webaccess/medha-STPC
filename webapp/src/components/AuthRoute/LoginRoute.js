/**
 * LoginRoute component basically routes every /Login
 * requests to this component to verify the identity
 *
 */
import React from "react";
import { Redirect } from "react-router-dom";
import auth from "../Auth/Auth";
import LogIn from "../../containers/AuthPage/Login/Login";
import * as routeConstants from "../Constants/RouteConstants";

/** For login */
export default function LoginRoute(props) {
  if (props.type === "login") {
    if (auth.getToken() !== null) {
      return (
        <Redirect
          to={{
            pathname: routeConstants.DASHBOARD_URL,
            state: { from: props.location }
          }}
        />
      );
    } else {
      return <LogIn from={props.location} />;
    }
  } else {
    return (
      <Redirect
        to={{
          pathname: routeConstants.NOT_FOUND_URL,
          state: { from: props.location }
        }}
      />
    );
  }
}
