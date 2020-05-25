import React from "../../node_modules/react";
import { Route, Redirect } from "../../node_modules/react-router-dom";
import PropTypes from "../../node_modules/prop-types";
import auth from "../components/Auth/Auth";
import * as routeConstants from "../constants/RouteConstants";

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;
  if (
    (auth.getToken() !== null &&
      auth.getUserInfo() !== null &&
      auth.getUserInfo().role !== null &&
      auth.getUserInfo().role.name === "Medha Admin") ||
    auth.getUserInfo().role.name === "College Admin"
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
          pathname: routeConstants.SIGN_IN_URL,
          state: { from: props.location }
        }}
      />
    );
  }
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
