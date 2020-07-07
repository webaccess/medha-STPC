import React from "react";
import { shallow } from "enzyme";

import StickyFooter from "./StickyFooter";
describe("Testing StickyFooter", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<StickyFooter {...props} />);
    expect(wrapper).toBeDefined();
  });
});
