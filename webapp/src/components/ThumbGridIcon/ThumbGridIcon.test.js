import React from "react";
import { shallow } from "enzyme";

import ThumbIcon from "./ThumbGridIcon";

describe("Testing ThumbIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<ThumbIcon {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders with style prop as true", () => {
    props = {
      id: "ThumbGrid-id",
      style: true,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<ThumbIcon {...props} />);
    const title = wrapper.find("#ThumbGrid-id");

    expect(title.props().style.color).toBe("green");
  });
  it(" renders with style prop as false", () => {
    props = {
      id: "ThumbGrid-id",
      style: false,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<ThumbIcon {...props} />);
    const title = wrapper.find("#ThumbGrid-id");
    expect(title.props().style.color).toBe("grey");
  });

  it("Renders with title props as true", () => {
    props = {
      id: "ThumbGrid-id",
      style: true,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<ThumbIcon {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe("Dehire");
  });
  it("Renders with title props as false", () => {
    props = {
      id: "ThumbGrid-id",
      style: false,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<ThumbIcon {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe("Hire");
  });
});
