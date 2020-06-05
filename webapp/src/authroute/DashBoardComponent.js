import React from "../../node_modules/react";
import { Redirect } from "../../node_modules/react-router-dom";
import * as routeConstants from "../constants/RouteConstants";
import PropTypes from "../../node_modules/prop-types";
import auth from "../components/Auth/Auth";
import * as roleConstants from "../constants/RoleConstants";

const DashBoardComponent = props => {
  const { layout: Layout, component: Component, ...rest } = props;
  if (auth.getToken() !== null) {
    if (auth.getUserInfo().role.name === roleConstants.STUDENT) {
      return (
        <Redirect
          to={{
            pathname: routeConstants.VIEW_PROFILE,
            state: { from: props.location }
          }}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: routeConstants.DASHBOARD_URL,
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

DashBoardComponent.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default DashBoardComponent;
