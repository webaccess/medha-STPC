import React from "react";
import { shallow } from "enzyme";

import ReadOnlyTextField from "./ReadOnlyTextField";
import TextField from "./ReadOnlyTextField";

describe("Testing ReadOnlyTextField", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<ReadOnlyTextField {...props} />);
    expect(wrapper).toBeDefined();
  });
  it(" renders without crashing", () => {
    wrapper = shallow(<TextField {...props} />);
    expect(wrapper).toBeDefined();
  });
});
