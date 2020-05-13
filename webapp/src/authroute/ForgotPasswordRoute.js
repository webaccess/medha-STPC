/**
 * ForgotPasswordRoute component basically routes every /ForgotPassword
 * requests to this component to verify the identity
 *
 */
import React from "../../node_modules/react";
import { Redirect } from "../../node_modules/react-router-dom";
import auth from "../components/Auth/Auth";
import ForgotPassword from "../containers/AuthPage/ForgotPassword/ForgotPassword";
import * as routeConstants from "../constants/RouteConstants";

/** For ForgotPassword */
export default function ForgotPasswordRoute(props) {
  const { layout: Layout, ...rest } = props;
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
      return (
        <Layout>
          <ForgotPassword from={props.location} />
        </Layout>
      );
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
