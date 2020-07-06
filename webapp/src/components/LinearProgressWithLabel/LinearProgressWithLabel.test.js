import React from "react";
import { shallow } from "enzyme";

import LinearProgressWithLabel from "./LinearProgressWithLabel";

describe("Testing PastEventStatus", () => {
  let props;
  let wrapper;

  beforeEach(() => {});
  it(" renders without crashing", () => {
    props = {
      value: 66
    };
    wrapper = shallow(<LinearProgressWithLabel {...props} />);
    expect(wrapper).toBeDefined();
  });
});
