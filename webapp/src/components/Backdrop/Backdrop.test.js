import React from "react";
import { shallow } from "enzyme";

import Backdrop from "./Backdrop";

describe("Testing EditGridIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<Backdrop {...props} />);
    expect(wrapper).toBeDefined();
  });
  it(" renders with show value of true", () => {
    props = {
      show: true
    };
    wrapper = shallow(<Backdrop {...props} />);
    expect(wrapper.find(".Backdrop")).toHaveLength(1);
  });

  it(" renders with show value of false", () => {
    props = {
      show: false
    };
    wrapper = shallow(<Backdrop {...props} />);
    expect(wrapper.find(".Backdrop")).toHaveLength(0);
  });
});
