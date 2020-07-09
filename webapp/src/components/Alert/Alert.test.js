import React from "react";
import { shallow } from "enzyme";

import Alert from "./Alert";
import MuiAlert from "./Alert";

describe("Testing Alert", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<Alert {...props} />);
    expect(wrapper).toBeDefined();
  });
  it(" renders without crashing", () => {
    wrapper = shallow(<MuiAlert {...props} />);
    expect(wrapper).toBeDefined();
  });
});
