import React from "react";
import { shallow } from "enzyme";

import Logo from "./Logo";

describe("Testing Logo", () => {
  let props;
  let wrapper;

  beforeEach(() => {});
  it(" renders without crashing", () => {
    wrapper = shallow(<Logo {...props} />);

    expect(wrapper).toBeDefined();
  });
});
