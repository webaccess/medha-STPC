import React from "react";
import { shallow } from "enzyme";

import CrossGridIcon from "./CrossGridIcon";

describe("Testing CrossGridIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<CrossGridIcon {...props} />);
    expect(wrapper).toBeDefined();
  });
});
