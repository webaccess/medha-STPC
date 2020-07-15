import React from "react";
import { auth as Auth } from "../components";
import auth from "../components/Auth";
import AddEditCollege from "../containers/College/AddEditCollege/AddEditCollege";
import LogIn from "../containers/AuthPage/Login/Login";
import Layout from "../hoc/Layout/Layout";
import { Redirect } from "react-router-dom";
import * as routeConstants from "../constants/RouteConstants";

const EditCollegeRoute = props => {
  if (auth.getToken() !== null) {
    const user = auth.getUserInfo() || null;
    const userRole = user && user.role ? user.role.name : null;

    if (props["location"] && props["location"]["dataForEdit"]) {
      return (
        <AddEditCollege
          dataForEdit={props["location"]["dataForEdit"]}
          editCollege={props["location"]["editCollege"]}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname:
              userRole == "Medha Admin"
                ? routeConstants.MANAGE_COLLEGE
                : routeConstants.VIEW_COLLEGE,
            state: { from: props.location }
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

export default EditCollegeRoute;
