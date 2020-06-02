import React from "../../node_modules/react";
import { Route, Redirect } from "../../node_modules/react-router-dom";
import PropTypes from "../../node_modules/prop-types";
import auth from "../components/Auth/Auth";
import * as routeConstants from "../constants/RouteConstants";
import * as roleConstants from "../constants/RoleConstants";

const ZonalRPCSuperAdminRoute = props => {
  const { layout: Layout, component: Component, ...rest } = props;
  if (auth.getToken() !== null && auth.getUserInfo() !== null) {
    if (
      auth.getUserInfo().role.name === roleConstants.ZONALADMIN ||
      auth.getUserInfo().role.name === roleConstants.RPCADMIN ||
      auth.getUserInfo().role.name === roleConstants.MEDHAADMIN
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

ZonalRPCSuperAdminRoute.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default ZonalRPCSuperAdminRoute;
