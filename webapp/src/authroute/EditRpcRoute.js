import React, { useState, useEffect } from "react";
import { auth as Auth } from "../components";
import auth from "../components/Auth";
import LogIn from "../containers/AuthPage/Login/Login";
import Layout from "../hoc/Layout/Layout";
import { Redirect } from "react-router-dom";
import * as routeConstants from "../constants/RouteConstants";
import AddEditRpc from "../containers/RPC/AddEditRpc/AddEditRpc";

const EditRpcRoute = props => {
  if (auth.getToken() !== null) {
    if (props["location"] && props["location"]["dataForEdit"]) {
      return (
        <AddEditRpc
          dataForEdit={props["location"]["dataForEdit"]}
          editRpc={props["location"]["editRpc"]}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: routeConstants.VIEW_RPC,
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

export default EditRpcRoute;
