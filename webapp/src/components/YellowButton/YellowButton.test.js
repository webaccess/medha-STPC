import React from "react";
import { shallow } from "enzyme";

import YellowButton from "./YellowButton";
import Button from "./YellowButton";

describe("Testing YellowButton", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<YellowButton {...props} />);
    expect(wrapper).toBeDefined();
  });
  it(" renders without crashing", () => {
    wrapper = shallow(<Button {...props} />);
    expect(wrapper).toBeDefined();
  });
  it(" renders with props", () => {
    props = {
      type: "link",
      color: "secondary",
      variant: "inherit"
    };
    wrapper = shallow(<YellowButton {...props} />);
    expect(wrapper.props().type).toBe("link");
    expect(wrapper.props().color).toBe("secondary");
    expect(wrapper.props().variant).toBe("inherit");
  });
  it(" renders with props", () => {
    props = {};
    wrapper = shallow(<YellowButton {...props} />);
    expect(wrapper.props().type).toBe("submit");
    expect(wrapper.props().color).toBe("primary");
    expect(wrapper.props().variant).toBe("contained");
  });
});
