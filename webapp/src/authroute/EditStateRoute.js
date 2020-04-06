import React, { useState, useEffect } from "react";
import { auth as Auth } from "../components";
import auth from "../components/Auth";
import LogIn from "../containers/AuthPage/Login/Login";
import Layout from "../hoc/Layout/Layout";
import { Redirect } from "react-router-dom";
import * as routeConstants from "../constants/RouteConstants";
import AddEditState from "../containers/State/AddEditState/AddEditState";

const EditCollegeRoute = props => {
  if (auth.getToken() !== null) {
    if (props["location"] && props["location"]["dataForEdit"]) {
      return (
        <AddEditState
          dataForEdit={props["location"]["dataForEdit"]}
          editState={props["location"]["editState"]}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: routeConstants.MANAGE_STATES,
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
