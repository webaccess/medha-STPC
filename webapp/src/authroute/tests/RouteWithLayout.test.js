import React from "react";
import { shallow, mount } from "enzyme";
import ChangePassword from "../../containers/AuthPage/ChangePassword/ChangePassword";
import * as routeConstants from "../../constants/RouteConstants";
import RouteWithLayout from "../RouteWithLayout";
import Layout from "../../hoc/Layout/Layout";
import auth from "../../components/Auth/Auth";
import * as medhaUser from "../../mockuser/MedhaAdmin.json";

React.useLayoutEffect = React.useEffect;

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useHistory: () => ({ push: jest.fn() })
}));

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  auth.setToken(medhaUser.jwt, true);
  auth.setUserInfo(medhaUser.user, true);
  // you could also reset all mocks, but this could impact your other mocks
  jest.resetAllMocks();
});

describe("Testing RouteWithLayout", () => {
  let props;
  let wrapper;

  it(" renders without crashing", () => {
    props = {
      component: ChangePassword,
      exact: true,
      layout: Layout,
      path: routeConstants.CHANGE_PASSWORD
    };
    wrapper = shallow(<RouteWithLayout {...props} />);
    expect(wrapper).toBeDefined();
  });
});
