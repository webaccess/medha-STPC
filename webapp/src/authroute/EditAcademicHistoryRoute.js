import React from "react";
import auth from "../components/Auth";
import LogIn from "../containers/AuthPage/Login/Login";
import Layout from "../hoc/Layout/Layout";
import { Redirect } from "react-router-dom";
import * as routeConstants from "../constants/RouteConstants";
import AddEditAcademicHistory from "../containers/Student/AcademicHistory/AddEditAcademicHistory";

const EditAcademicHistoryRoute = props => {
  console.log(props);
  if (auth.getToken() !== null) {
    if (props["location"] && props["location"]["dataForEdit"]) {
      return (
        <AddEditAcademicHistory
          dataForEdit={props["location"]["dataForEdit"]}
          editAcademicHistory={props["location"]["editAcademicHistory"]}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: routeConstants.VIEW_ACADEMIC_HISTORY,
            academicHistory: { from: props.location }
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

export default EditAcademicHistoryRoute;
