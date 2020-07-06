import React from "react";
import { shallow, mount } from "enzyme";
import EditStateRoute from "../EditStateRoute";
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

describe("Testing EditStateRoute", () => {
  let props;
  let wrapper;

  it(" renders without crashing when auth is set", () => {
    localStorage.clear();
    auth.setToken(collegeUser.jwt, true);
    auth.setUserInfo(collegeUser.user, true);
    props = {
      location: {
        dataForEdit: [],
        editState: []
      }
    };
    wrapper = shallow(<EditStateRoute {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing when auth is null", () => {
    localStorage.clear();
    auth.setToken(null, true);
    auth.setUserInfo(null, true);
    props = {
      location: {
        dataForEdit: [],
        editState: []
      }
    };
    wrapper = shallow(<EditStateRoute {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing to Manage State when dataForEdit is null", () => {
    localStorage.clear();
    auth.setToken(studentUser.jwt, true);
    auth.setUserInfo(studentUser.user, true);
    props = {
      location: {
        dataForEdit: null,
        editState: []
      }
    };
    wrapper = shallow(<EditStateRoute {...props} />);
    expect(wrapper).toBeDefined();
  });
});
