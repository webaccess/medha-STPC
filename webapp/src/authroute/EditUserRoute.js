import React, { useState, useEffect } from "react";
import auth from "../components/Auth";
import LogIn from "../containers/AuthPage/Login/Login";
import Layout from "../hoc/Layout/Layout";
import { Redirect } from "react-router-dom";
import * as routeConstants from "../constants/RouteConstants";
import AddUser from "../containers/User/AddEditUser/AddEditUser";

const EditUserRoute = props => {
  if (auth.getToken() !== null) {
    if (props["location"] && props["location"]["dataForEdit"]) {
      return (
        <AddUser
          dataForEdit={props["location"]["dataForEdit"]}
          editUser={props["location"]["editUser"]}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: routeConstants.MANAGE_USER,
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

export default EditUserRoute;
