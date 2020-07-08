import React from "react";
import { shallow } from "enzyme";

import LargeLogo from "./LargeLogo";

describe("Testing Logo", () => {
  let props;
  let wrapper;

  beforeEach(() => { });
  it(" renders without crashing", () => {
    wrapper = shallow(<LargeLogo {...props} />);

    expect(wrapper).toBeDefined();
  });
});
