import React from "react";
import { shallow } from "enzyme";

import AlertMessage from "./AlertMessage";

describe("Testing AlertMessage", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<AlertMessage {...props} />);
    expect(wrapper).toBeDefined();
  });
});
