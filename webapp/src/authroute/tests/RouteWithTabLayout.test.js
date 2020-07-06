import React from "react";
import { shallow, mount, render } from "enzyme";
import StudentProfile from "../../containers/Student/StudentProfile";
import * as routeConstants from "../../constants/RouteConstants";
import RouteWithTabLayout from "../RouteWithTabLayout";
import Layout from "../../hoc/Layout/Layout";
import auth from "../../components/Auth/Auth";
import * as studentUser from "../../mockuser/StudentUser.json";
import * as collegeUser from "../../mockuser/CollegeAdmin.json";
import AddEditStudent from "../../containers/Registration/AddEditStudent";
import TestRenderer from "react-test-renderer"; // ES6
import { Router } from "@material-ui/icons";
import { MemoryRouter, Route } from "react-router-dom";

React.useLayoutEffect = React.useEffect;

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Testing RouteWithTabLayout", () => {
  let props;
  let wrapper;

  it(" renders without crashing", () => {
    localStorage.clear();
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);
    props = {
      component: StudentProfile,
      exact: true,
      layout: Layout,
      path: routeConstants.VIEW_PROFILE,
      title: "Profile",
      location: {
        collegeAdminRoute: false
      }
    };
    wrapper = shallow(<RouteWithTabLayout {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing when called from college admin", () => {
    localStorage.clear();
    auth.setToken(collegeUser.jwt, true);
    auth.setUserInfo(collegeUser.user, true);
    props = {
      component: StudentProfile,
      exact: true,
      layout: Layout,
      path: routeConstants.VIEW_PROFILE,
      title: "Profile",
      location: {
        collegeAdminRoute: true
      }
    };
    wrapper = shallow(<RouteWithTabLayout {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders when auth is null", () => {
    localStorage.clear();
    auth.setToken(null, true);
    auth.setUserInfo(null, true);

    props = {
      component: StudentProfile,
      exact: true,
      layout: Layout,
      path: routeConstants.VIEW_PROFILE,
      title: "Profile",
      location: {
        collegeAdminRoute: false
      }
    };
    wrapper = shallow(<RouteWithTabLayout {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders for edit student profile from college admin", () => {
    localStorage.clear();
    auth.setToken(collegeUser.jwt, true);
    auth.setUserInfo(collegeUser.user, true);

    props = {
      component: AddEditStudent,
      exact: true,
      layout: Layout,
      path: routeConstants.EDIT_PROFILE,
      title: "Edit Profile",
      location: {
        collegeAdminRoute: true
      }
    };
    wrapper = shallow(
      <MemoryRouter initialEntries={[routeConstants.EDIT_PROFILE]}>
        <RouteWithTabLayout {...props} />
      </MemoryRouter>
    ).dive();
    expect(wrapper.find(RouteWithTabLayout).dive().prop("render")).toHaveLength(
      1
    );
  });
});
