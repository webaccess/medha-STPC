import React from "react";
import { shallow } from "enzyme";

import ToolTipComponent from "./ToolTipComponent";

describe("Testing ToolTipComponent", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<ToolTipComponent {...props} />);
    expect(wrapper).toBeDefined();
  });
});
