/**
 * LoginRoute component basically routes every /Login
 * requests to this component to verify the identity
 *
 */
import React from "react";
//import { Redirect } from "../../../node_modules/react-router-dom";
import { Redirect } from "../../../node_modules/react-router-dom";
import * as routeConstants from "../../constants/RouteConstants";
import AddEditStudent from "./AddEditStudent.js";
import auth from "../../components/Auth";
/** For login */
export default function RegistrationRoute(props) {
  console.log(props);
  if (auth.getToken() != null && props.location.editStudent) {
    console.log("In Edit Student Profile route");
    return <AddEditStudent {...props} />;
  } else if (props.location.state) {
    console.log(props);
    return <AddEditStudent {...props} />;
  } else {
    return <Redirect to={{ pathname: routeConstants.SIGN_IN_URL }} />;
  }
}
