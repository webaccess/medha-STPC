/**
 * RegistrationRoute component basically routes every /register or
 * requests to this component to verify the identity
 *
 */
import React from "react";
//import { Redirect } from "../../../node_modules/react-router-dom";
import { Redirect } from "../../../node_modules/react-router-dom";
import * as routeConstants from "../../constants/RouteConstants";
import AddEditStudent from "./AddEditStudent.js";
import Layout from "../../hoc/Layout/Layout";
/** For login */
export default function RegistrationRoute(props) {
  if (props.location.state) {
    return (
      <Layout>
        <AddEditStudent {...props} />
      </Layout>
    );
  } else {
    return <Redirect to={{ pathname: routeConstants.SIGN_IN_URL }} />;
  }
}
