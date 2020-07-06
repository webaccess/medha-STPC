import React from "react";
import { shallow } from "enzyme";

import BlockGridIcon from "./BlockGridIcon";

describe("Testing BlockGridIcon", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<BlockGridIcon {...props} />);
    expect(wrapper).toBeDefined();
  });

  it("Renders with title props as true", () => {
    props = {
      id: "Unblock-id",
      title: true,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<BlockGridIcon {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe("Unblock");
  });

  it("Renders with title props as false", () => {
    props = {
      id: "Block-id",
      title: false,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<BlockGridIcon {...props} />);
    const title = wrapper.find("#title-id");
    expect(title.prop("title").props.children.props.children).toBe("Block");
  });
  it("Renders with style props as true", () => {
    props = {
      id: "Block-id",
      style: true,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<BlockGridIcon {...props} />);
    const title = wrapper.find("#Block-id");
    expect(title.props().style.color).toBe("#8C8C8C");
  });

  it("Renders with style props as false", () => {
    props = {
      id: "Block-id",
      style: false,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<BlockGridIcon {...props} />);
    const title = wrapper.find("#Block-id");
    expect(title.props().style.color).toBe("green");
  });
});
