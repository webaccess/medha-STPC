/**
 * ForgotPasswordRoute component basically routes every /ForgotPassword
 * requests to this component to verify the identity
 *
 */
import React from "react";
import { Redirect } from "react-router-dom";
import auth from "../Auth/Auth";
import ForgotPassword from "../../containers/AuthPage/ForgotPassword/ForgotPassword";
import * as routeConstants from "../Constants/RouteConstants";

/** For ForgotPassword */
export default function ForgotPasswordRoute(props) {
  if (props.type === "forgot-password") {
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
      return <ForgotPassword from={props.location} />;
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
