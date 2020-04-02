import React from "react";
import auth from "../components/Auth";
import LogIn from "../containers/AuthPage/Login/Login";
import Layout from "../hoc/Layout/Layout";
import { Redirect } from "react-router-dom";
import AddEditActivityBatch from "../containers/Activity/ActivityBatch/AddEditActivityBatch";

const EditActivityBatchRoute = props => {
  const { activity } = props.match.params;
  if (auth.getToken() !== null) {
    if (props["location"] && props["location"]["dataForEdit"]) {
      return (
        <AddEditActivityBatch
          dataForEdit={props["location"]["dataForEdit"]}
          editActivityBatch={props["location"]["editActivityBatch"]}
          activity={activity}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: `/manage-activity-batch/${activity}`,
            activityBatch: { from: props.location }
          }}
        />
      );
    }
  } else {
    return (
      <Layout>
        <LogIn from={props.location} />
      </Layout>
    );
  }
};

export default EditActivityBatchRoute;
