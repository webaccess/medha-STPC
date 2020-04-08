import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import auth from "../components/Auth/Auth";
import * as routeConstants from "../constants/RouteConstants";

const MedhaCollegeAdminRoute = props => {
  const { layout: Layout, component: Component, ...rest } = props;
  if (auth.getToken() !== null) {
    if (auth.getUserInfo().role.name === "Medha Admin" || auth.getUserInfo().role.name === "College Admin") {
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
      <React.Fragment>
        {auth.clearAppStorage()}
        <Redirect
          to={{
            pathname: routeConstants.SIGN_IN_URL,
            state: { from: props.location }
          }}
        />
      </React.Fragment>
    );
  }
};

MedhaCollegeAdminRoute.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default MedhaCollegeAdminRoute;
