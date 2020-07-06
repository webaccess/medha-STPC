import React from "react";
import { shallow } from "enzyme";
import * as routeConstants from "../../constants/RouteConstants";
import ManageUser from "../../containers/User/ManageUser/ManageUser";
import PrivateRoute from "../PrivateRoute";
import Layout from "../../hoc/Layout/Layout";
import auth from "../../components/Auth/Auth";
import * as medhaUser from "../../mockuser/MedhaAdmin.json";
import * as studentUser from "../../mockuser/StudentUser.json";

React.useLayoutEffect = React.useEffect;

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Testing PrivateRoute", () => {
  let props;
  let wrapper;

  it(" renders without crashing when auth is not null and user is medha admin", () => {
    auth.setToken(medhaUser.jwt, true);
    auth.setUserInfo(medhaUser.user, true);
    props = {
      component: ManageUser,
      exact: true,
      layout: Layout,
      path: routeConstants.MANAGE_USER
    };
    wrapper = shallow(<PrivateRoute {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing when auth is null", () => {
    auth.clearAppStorage();
    auth.setToken(null, true);
    auth.setUserInfo(null, true);
    props = {
      component: ManageUser,
      exact: true,
      layout: Layout,
      path: routeConstants.MANAGE_USER
    };
    wrapper = shallow(<PrivateRoute {...props} />);
    expect(wrapper).toBeDefined();
  });
});
