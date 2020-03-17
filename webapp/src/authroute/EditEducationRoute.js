import React from "react";
import auth from "../components/Auth";
import LogIn from "../containers/AuthPage/Login/Login";
import Layout from "../hoc/Layout/Layout";
import { Redirect } from "react-router-dom";
import * as routeConstants from "../constants/RouteConstants";
import AddEditEducation from "../containers/Student/Education/AddEditEducation";

const EditEducationRoute = props => {
  if (auth.getToken() !== null) {
    if (props["location"] && props["location"]["dataForEdit"]) {
      return (
        <AddEditEducation
          dataForEdit={props["location"]["dataForEdit"]}
          editEducation={props["location"]["editEducation"]}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: routeConstants.VIEW_EDUCATION,
            education: { from: props.location }
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

export default EditEducationRoute;
