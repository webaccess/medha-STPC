import React from "react";
import { shallow, mount } from "enzyme";
import ManageStudents from "../../containers/Student/ManageStudentCollegeAdmin/ManageStudent/ManageStudents";
import * as routeConstants from "../../constants/RouteConstants";
import CollegeAdminRoute from "../CollegeAdminRoute";
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

describe("Testing CollegeAdminRoute", () => {
  let props;
  let wrapper;

  it(" renders without crashing when auth is set", () => {
    localStorage.clear();
    auth.setToken(collegeUser.jwt, true);
    auth.setUserInfo(collegeUser.user, true);
    props = {
      component: ManageStudents,
      exact: true,
      layout: Layout,
      path: routeConstants.MANAGE_STUDENT
    };
    wrapper = shallow(<CollegeAdminRoute {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing when auth is null", () => {
    localStorage.clear();
    auth.setToken(null, true);
    auth.setUserInfo(null, true);
    props = {
      component: ManageStudents,
      exact: true,
      layout: Layout,
      path: routeConstants.MANAGE_STUDENT
    };
    wrapper = shallow(<CollegeAdminRoute {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing when auth is medha admin it should render not found page", () => {
    localStorage.clear();
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);
    props = {
      component: ManageStudents,
      exact: true,
      layout: Layout,
      path: routeConstants.MANAGE_STUDENT
    };
    wrapper = shallow(<CollegeAdminRoute {...props} />);
    expect(wrapper).toBeDefined();
  });
});
