import React from "react";
import { shallow } from "enzyme";

import CustomerRouterLink from "./CustomRouterLink";

describe("Testing CustomerRouterLink", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    props = {
      to: "/test"
    };
    wrapper = shallow(<CustomerRouterLink {...props} />);
    expect(wrapper).toBeDefined();
  });
});
