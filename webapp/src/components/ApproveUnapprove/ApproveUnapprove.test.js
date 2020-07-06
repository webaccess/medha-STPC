import React from "react";
import { shallow } from "enzyme";

import ApproveUnapprove from "./ApproveUnapprove";

describe("Testing AddStudentIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it("Renders without crashing", () => {
    wrapper = shallow(<ApproveUnapprove {...props} />);
    expect(wrapper).toBeDefined();
  });

  it("Renders with isapproved props as true", () => {
    props = {
      id: "unaprove-id",
      isApproved: true,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<ApproveUnapprove {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe("Unapprove");
  });

  it("Renders with isapproved props as false", () => {
    props = {
      id: "approve-id",
      isApproved: false,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<ApproveUnapprove {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe("Approve");
  });
});
