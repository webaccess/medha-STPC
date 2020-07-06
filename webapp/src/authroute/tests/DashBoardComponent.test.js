import React from "react";
import { shallow, mount } from "enzyme";
import Dashboard from "../../containers/Dashboard/Dashboard";
import * as routeConstants from "../../constants/RouteConstants";
import DashBoardComponent from "../DashBoardComponent";
import Layout from "../../hoc/Layout/Layout";
import auth from "../../components/Auth/Auth";
import * as collegeUser from "../../mockuser/CollegeAdmin.json";
import * as studentUser from "../../mockuser/StudentUser.json";

React.useLayoutEffect = React.useEffect;

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Testing DashBoardComponent", () => {
  let props;
  let wrapper;

  it(" renders without crashing when auth is set", () => {
    localStorage.clear();
    auth.setToken(collegeUser.jwt, true);
    auth.setUserInfo(collegeUser.user, true);
    props = {
      component: Dashboard,
      exact: true,
      layout: Layout,
      path: routeConstants.DEFAULT_URL
    };
    wrapper = shallow(<DashBoardComponent {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing when auth is null", () => {
    localStorage.clear();
    auth.setToken(null, true);
    auth.setUserInfo(null, true);
    props = {
      component: Dashboard,
      exact: true,
      layout: Layout,
      path: routeConstants.DEFAULT_URL
    };
    wrapper = shallow(<DashBoardComponent {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing when auth is student it should render view profile page", () => {
    localStorage.clear();
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);
    props = {
      component: Dashboard,
      exact: true,
      layout: Layout,
      path: routeConstants.DEFAULT_URL
    };
    wrapper = shallow(<DashBoardComponent {...props} />);
    expect(wrapper).toBeDefined();
  });
});
