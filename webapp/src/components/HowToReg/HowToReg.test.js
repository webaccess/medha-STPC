import React from "react";
import { shallow } from "enzyme";

import HowToReg from "./HowToRej";

describe("Testing HoeToReg", () => {
  let props;
  let wrapper;

  beforeEach(() => {});

  it(" renders without crashing", () => {
    wrapper = shallow(<HowToReg {...props} />);
    expect(wrapper).toBeDefined();
  });

  it(" renders with style prop as true", () => {
    props = {
      id: "HowToReg-id",
      style: true,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<HowToReg {...props} />);
    const title = wrapper.find("#HowToReg-id");

    expect(title.props().style.color).toBe("green");
  });
  it(" renders with style prop as false", () => {
    props = {
      id: "HowToReg-id",
      style: false,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<HowToReg {...props} />);
    const title = wrapper.find("#HowToReg-id");
    expect(title.props().style.color).toBe("grey");
  });

  it("Renders with title props as true", () => {
    props = {
      id: "Block-id",
      style: true,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<HowToReg {...props} />);
    const title = wrapper.find("#howToReg-id");
    expect(title.prop("title").props.children.props.children).toBe(
      "Mark Absent"
    );
  });
  it("Renders with title props as false", () => {
    props = {
      id: "Block-id",
      style: false,
      onClick: jest.fn(() => "onClick")
    };
    wrapper = shallow(<HowToReg {...props} />);
    const title = wrapper.find("#howToReg-id");
    expect(title.prop("title").props.children.props.children).toBe(
      "Mark Present"
    );
  });
});
