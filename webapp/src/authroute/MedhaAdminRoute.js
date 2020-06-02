import React from "../../node_modules/react";
import { Route, Redirect } from "../../node_modules/react-router-dom";
import PropTypes from "../../node_modules/prop-types";
import auth from "../components/Auth/Auth";
import * as routeConstants from "../constants/RouteConstants";
import * as roleConstants from "../constants/RoleConstants";

const MedhaAdminRoute = props => {
  const { layout: Layout, component: Component, ...rest } = props;
  if (auth.getToken() !== null) {
    if (auth.getUserInfo().role.name === roleConstants.MEDHAADMIN) {
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

MedhaAdminRoute.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default MedhaAdminRoute;
