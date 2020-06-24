import React from "react";
//import { Redirect } from "../../../node_modules/react-router-dom";
import { Redirect } from "../../../node_modules/react-router-dom";
import * as routeConstants from "../../constants/RouteConstants";
import AddEditActivity from "./AddEditActivity";

export default function ActivityRoute(props) {
  const { layout: Layout } = props;
  if (props.location.editActivity) {
    return (
      <Layout>
        <AddEditActivity {...props} />
      </Layout>
    );
  } else if (props.location.addActivity) {
    return (
      <Layout>
        <AddEditActivity {...props} />
      </Layout>
    );
  } else {
    return <Redirect to={{ pathname: routeConstants.MANAGE_ACTIVITY }} />;
  }
}
