/**
 * LoginRoute component basically routes every /Login
 * requests to this component to verify the identity
 *
 */
import React from "../../node_modules/react";
import { Redirect } from "../../node_modules/react-router-dom";
import auth from "../components/Auth/Auth";
import LogIn from "../containers/AuthPage/Login/Login";
import * as routeConstants from "../constants/RouteConstants";
import * as roleConstants from "../constants/RoleConstants";

/** For login */
export default function LoginRoute(props) {
  const { layout: Layout, ...rest } = props;
  if (props.type === "login") {
    if (auth.getToken() !== null && auth.getUserInfo() !== null) {
      return auth.getUserInfo().role.name === roleConstants.STUDENT ? (
        <Redirect
          to={{
            pathname: routeConstants.VIEW_PROFILE,
            state: { from: props.location }
          }}
        />
      ) : (
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
          <LogIn from={props.location} />
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
