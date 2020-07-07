import React from "react";
import { shallow } from "enzyme";

import Logout from "./Logout";

describe("Testing Logout", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<Logout {...props} />);
    expect(wrapper).toBeDefined();
  });
});
