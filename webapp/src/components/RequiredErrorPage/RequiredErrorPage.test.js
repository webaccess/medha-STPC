import React from "react";
import { shallow } from "enzyme";

import RequiredErrorPage from "./RequiredErrorPage";
import Layout from "./RequiredErrorPage";
describe("Testing RequiredErrorPage", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<RequiredErrorPage {...props} />);
    expect(wrapper).toBeDefined();
  });
  it(" renders without crashing", () => {
    props = {
      location: {
        from: "login"
      }
    };
    wrapper = shallow(<Layout {...props} />);
    expect(wrapper).toBeDefined();
  });
});
