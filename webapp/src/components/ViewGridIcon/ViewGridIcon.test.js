import React from "react";
import { shallow } from "enzyme";

import ViewGridIcon from "./ViewGridIcon";

describe("Testing ViewGridIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<ViewGridIcon {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders without crashing", () => {
    props = {
      fromEvent: true
    };
    wrapper = shallow(<ViewGridIcon {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe(
      "View Event"
    );
  });
  it(" renders without crashing", () => {
    props = {
      fromEvent: false
    };
    wrapper = shallow(<ViewGridIcon {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe("View");
  });
});
