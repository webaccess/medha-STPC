import React from "react";
import { shallow } from "enzyme";

import InlineDatePicker from "./InlineDatePicker";

describe("Testing InlineDatePicker", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<InlineDatePicker {...props} />);
    expect(wrapper).toBeDefined();
  });
});
