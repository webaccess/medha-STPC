import React from "react";
import { shallow } from "enzyme";

import EditGridIcon from "./EditGridIcon";

describe("ContentPlaceholder Component Test Suite", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    props = {
      id: "editIcon-id",
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<EditGridIcon {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders when title is present in props", () => {
    props = {
      id: "editIcon-id",
      onClick: jest.fn(() => "onClick"),
      title: "test title"
    };
    wrapper = shallow(<EditGridIcon {...props} />);
    expect(wrapper.find("#editGridIconToolTip")).toHaveLength(1);
    const titleName = wrapper.find("#editGridIconToolTip").prop("title").props
      .children.props.children;
    expect(titleName).toBe("test title");
  });

  it(" renders Edit button when title is not present in props", () => {
    props = {
      id: "editIcon-id",
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<EditGridIcon {...props} />);
    expect(wrapper.find("#editGridIconToolTip")).toHaveLength(1);
    const titleName = wrapper.find("#editGridIconToolTip").prop("title").props
      .children.props.children;
    expect(titleName).toBe("Edit");
  });

  it(" should check the edit grid icon when the disabled property is set", () => {
    props = {
      id: "editIcon-id",
      onClick: jest.fn(() => "onClick"),
      disabled: true
    };
    wrapper = shallow(<EditGridIcon {...props} />);
    expect(wrapper.find("#editIcon-id")).toHaveLength(1);
  });
});
