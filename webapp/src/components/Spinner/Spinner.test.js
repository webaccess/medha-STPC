import React from "react";
import { shallow } from "enzyme";

import Spinner from "./Spinner";

describe("Testing Spinner", () => {
  let props;
  let wrapper;

  beforeEach(() => {});
  it(" renders without crashing", () => {
    wrapper = shallow(<Spinner {...props} />);
    expect(wrapper).toBeDefined();
  });
});
