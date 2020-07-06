import React from "react";
import { shallow } from "enzyme";

import RetryIcon from "./RetryIcon";

describe("Testing RetryIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<RetryIcon {...props} />);
    expect(wrapper).toBeDefined();
  });
});
