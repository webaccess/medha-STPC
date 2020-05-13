/**
 * LoginRoute component basically routes every /Login
 * requests to this component to verify the identity
 *
 */
import React from "react";
import { Redirect } from "react-router-dom";
import auth from "../Auth/Auth";
import * as routeConstants from "../../constants/RouteConstants";

/** For Logout */
export default function Logout(props) {
  auth.clearAppStorage();
  return <Redirect to={{ pathname: routeConstants.SIGN_IN_URL }} />;
}
