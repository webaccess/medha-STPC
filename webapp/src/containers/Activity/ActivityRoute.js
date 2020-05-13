import React from "react";
//import { Redirect } from "../../../node_modules/react-router-dom";
import { Redirect } from "../../../node_modules/react-router-dom";
import * as routeConstants from "../../constants/RouteConstants";
import AddEditActivity from "./AddEditActivity";

export default function ActivityRoute(props) {
  const { layout: Layout } = props;
  console.log(props);
  if (props.location.editActivity) {
    console.log("In Edit Activity");
    return (
      <Layout>
        <AddEditActivity {...props} />
      </Layout>
    );
  } else if (props.location.addActivity) {
    console.log("In Add activity");
    return (
      <Layout>
        <AddEditActivity {...props} />
      </Layout>
    );
  } else {
    return <Redirect to={{ pathname: routeConstants.MANAGE_ACTIVITY }} />;
  }
}
