import React from "react";
import { shallow } from "enzyme";

import TickGridIcon from "./TickGridIcon";

describe("Testing TickGridIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    props = {
      style: {
        color: "green"
      }
    };
    wrapper = shallow(<TickGridIcon {...props} />);
    expect(wrapper).toBeDefined();
  });
});
