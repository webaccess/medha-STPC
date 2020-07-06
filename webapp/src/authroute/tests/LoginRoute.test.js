import React from "react";
import { shallow, mount } from "enzyme";
import LoginRoute from "../LoginRoute";
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

describe("Testing LoginRoute", () => {
  let props;
  let wrapper;

  it("  renders without crashing when props.type is login and login is not student", () => {
    localStorage.clear();
    auth.setToken(collegeUser.jwt, true);
    auth.setUserInfo(collegeUser.user, true);
    props = {
      type: "login"
    };
    wrapper = shallow(<LoginRoute {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing when props.type is login and login is student", () => {
    localStorage.clear();
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);
    props = {
      type: "login"
    };
    wrapper = shallow(<LoginRoute {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing when auth is null", () => {
    localStorage.clear();
    auth.setToken(null, true);
    auth.setUserInfo(null, true);
    props = {
      type: "login"
    };
    wrapper = shallow(<LoginRoute {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing when props.type is not equal to login", () => {
    localStorage.clear();
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);
    props = {
      type: "forgot-password"
    };
    wrapper = shallow(<LoginRoute {...props} />);
    expect(wrapper).toBeDefined();
  });
});
