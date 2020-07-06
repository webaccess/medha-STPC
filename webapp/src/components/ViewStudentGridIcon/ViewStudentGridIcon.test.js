import React from "react";
import { shallow } from "enzyme";

import ViewGridIcon from "./ViewStudentGridIcon";

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
      title: "studentGrid"
    };
    wrapper = shallow(<ViewGridIcon {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe(
      "studentGrid"
    );
  });
  it(" renders without crashing", () => {
    props = {};
    wrapper = shallow(<ViewGridIcon {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe(
      "View Student List"
    );
  });
});
