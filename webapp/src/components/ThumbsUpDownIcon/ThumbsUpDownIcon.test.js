import React from "react";
import { shallow } from "enzyme";

import ThumbsUpDownIcon from "./ThumbsUpDownIcon";

describe("Testing ThumbsUpDownIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<ThumbsUpDownIcon {...props} />);
    expect(wrapper).toBeDefined();
  });

  it("Renders with title props as true", () => {
    props = {
      id: "ThumbDown-id",
      style: true,
      onClick: jest.fn(() => "onClick"),
      title: "test-title"
    };
    wrapper = shallow(<ThumbsUpDownIcon {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe(
      "test-title"
    );
  });
  it("Renders with title props as false", () => {
    props = {
      id: "ThumbDown-id",
      style: false,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<ThumbsUpDownIcon {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe(
      "Add Feedback"
    );
  });
});
