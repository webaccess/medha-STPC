import React from "react";
import { shallow } from "enzyme";

import YearMonthPicker from "./YearMonthPicker";

describe("Testing YearMonthPicker", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<YearMonthPicker {...props} />);
    expect(wrapper).toBeDefined();
  });
});
