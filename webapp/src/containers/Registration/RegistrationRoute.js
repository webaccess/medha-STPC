/**
 * LoginRoute component basically routes every /Login
 * requests to this component to verify the identity
 *
 */
import React from "react";
//import { Redirect } from "../../../node_modules/react-router-dom";
import { Redirect } from "../../../node_modules/react-router-dom";
import * as routeConstants from "../../constants/RouteConstants";
import Registration from "./Registration.js";
/** For login */
export default function RegistrationRoute(props) {
  if (!props.location.state) {
    console.log("In Registration route");
    return (
      <Redirect
        to={{
          pathname: routeConstants.DASHBOARD_URL
        }}
      />
    );
  } else {
    console.log(props);
    return <Registration prop={props} />;
  }
}
