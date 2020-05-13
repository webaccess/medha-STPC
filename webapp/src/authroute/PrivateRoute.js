import { Redirect, Route } from "../../node_modules/react-router-dom";
import * as routeConstants from "../constants/RouteConstants";
import PropTypes from "../../node_modules/prop-types";
import auth from "../components/Auth/Auth";
import React from "react";

const privateRoute = props => {
  const { layout: Layout, component: Component, ...rest } = props;
  if (auth.getToken() !== null) {
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

privateRoute.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default privateRoute;
