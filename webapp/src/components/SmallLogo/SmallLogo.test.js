import React from "react";
import { shallow } from "enzyme";

import SmallLogo from "./SmallLogo";

describe("Testing SmallLogo", () => {
  let props;
  let wrapper;

  beforeEach(() => {});
  it(" renders without crashing", () => {
    wrapper = shallow(<SmallLogo {...props} />);

    expect(wrapper).toBeDefined();
  });
});
