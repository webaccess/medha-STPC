import React from "../../node_modules/react";
import { Route, Redirect } from "../../node_modules/react-router-dom";
import PropTypes from "../../node_modules/prop-types";
import auth from "../components/Auth/Auth";
import * as routeConstants from "../constants/RouteConstants";

const CollegeAdminRoute = props => {
  const { layout: Layout, component: Component, ...rest } = props;
  console.log("userInfo", auth.getToken());
  console.log("userInfo11", auth.getUserInfo());

  if (
    auth.getToken() !== null &&
    auth.getUserInfo().role !== null &&
    auth.getUserInfo().studentInfo.organization !== null
  ) {
    if (
      auth.getUserInfo().role.name === "College Admin" &&
      auth.getUserInfo().studentInfo.organization !== null &&
      auth.getUserInfo().studentInfo.organization.id !== null
    ) {
      return (
        <Route
          {...rest}
          render={matchProps => (
            <Layout>
              <Component {...matchProps} />
            </Layout>
          )}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: routeConstants.NOT_FOUND_URL,
            state: { from: props.location }
          }}
        />
      );
    }
  } else {
    return (
      <Redirect
        to={{
          pathname: routeConstants.SIGN_IN_URL,
          state: { from: props.location }
        }}
      />
    );
  }
};

CollegeAdminRoute.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default CollegeAdminRoute;
